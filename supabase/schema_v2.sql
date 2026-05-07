-- Antojitos S&A - Esquema v2
-- Agrega: clientes, direcciones, créditos, métodos de pago, estados, búsqueda
-- Ejecutar después de schema.sql (idempotente).

create extension if not exists "pgcrypto";

-- ============================================
-- CLIENTES (perfil extendido sobre auth.users)
-- ============================================
create table if not exists clientes (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  telefono text,
  fecha_nacimiento date,
  limite_credito numeric(10,2) not null default 0 check (limite_credito >= 0),
  saldo_credito numeric(10,2) not null default 0,
  verificado boolean not null default false,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_clientes_activo on clientes(activo);

-- ============================================
-- DIRECCIONES
-- ============================================
create table if not exists direcciones (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  etiqueta text not null default 'Casa',
  calle text not null,
  numero text,
  colonia text,
  ciudad text not null,
  estado text,
  cp text,
  referencias text,
  predeterminada boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_direcciones_cliente on direcciones(cliente_id);

-- ============================================
-- AJUSTAR PEDIDOS: cliente, método pago, dirección, estado
-- ============================================
alter table pedidos
  add column if not exists cliente_id uuid references clientes(id),
  add column if not exists direccion_id uuid references direcciones(id),
  add column if not exists metodo_pago text not null default 'efectivo'
    check (metodo_pago in ('efectivo','tarjeta','transferencia','credito')),
  add column if not exists notas text;

alter table pedidos
  drop constraint if exists pedidos_estado_check;
alter table pedidos
  add constraint pedidos_estado_check
  check (estado in ('pendiente','confirmado','en_preparacion','en_camino','entregado','cancelado'));

create index if not exists idx_pedidos_cliente on pedidos(cliente_id);
create index if not exists idx_pedidos_estado on pedidos(estado);

-- ============================================
-- HISTORIAL DE CRÉDITO
-- ============================================
create table if not exists creditos_movimientos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  pedido_id uuid references pedidos(id) on delete set null,
  tipo text not null check (tipo in ('cargo','abono','ajuste')),
  monto numeric(10,2) not null check (monto > 0),
  saldo_resultante numeric(10,2) not null,
  notas text,
  created_at timestamptz not null default now()
);

create index if not exists idx_credmov_cliente on creditos_movimientos(cliente_id);

-- ============================================
-- BÚSQUEDA EN PRODUCTOS
-- ============================================
create extension if not exists pg_trgm;
create index if not exists idx_productos_nombre_trgm on productos using gin (nombre gin_trgm_ops);

-- ============================================
-- RLS — clientes ven solo lo suyo
-- ============================================
alter table clientes enable row level security;
alter table direcciones enable row level security;
alter table creditos_movimientos enable row level security;

drop policy if exists "ver mi cliente" on clientes;
create policy "ver mi cliente" on clientes for select using (auth.uid() = id);

drop policy if exists "actualizar mi cliente" on clientes;
create policy "actualizar mi cliente" on clientes for update using (auth.uid() = id);

drop policy if exists "crear mi cliente" on clientes;
create policy "crear mi cliente" on clientes for insert with check (auth.uid() = id);

drop policy if exists "ver mis direcciones" on direcciones;
create policy "ver mis direcciones" on direcciones for select using (auth.uid() = cliente_id);

drop policy if exists "gestionar mis direcciones" on direcciones;
create policy "gestionar mis direcciones" on direcciones for all using (auth.uid() = cliente_id) with check (auth.uid() = cliente_id);

drop policy if exists "ver mis movimientos" on creditos_movimientos;
create policy "ver mis movimientos" on creditos_movimientos for select using (auth.uid() = cliente_id);

-- pedidos: cliente ve los suyos
drop policy if exists "ver mis pedidos" on pedidos;
create policy "ver mis pedidos" on pedidos for select using (auth.uid() = cliente_id or cliente_id is null);

drop policy if exists "ver mis pedido_items" on pedido_items;
create policy "ver mis pedido_items" on pedido_items for select using (
  exists (select 1 from pedidos p where p.id = pedido_id and (p.cliente_id = auth.uid() or p.cliente_id is null))
);

-- ============================================
-- TRIGGER: crear perfil cliente al registrarse
-- ============================================
create or replace function public.handle_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.clientes (id, nombre, telefono, verificado)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'telefono',
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_nuevo_usuario();

-- TRIGGER: marcar verificado cuando confirma email
create or replace function public.handle_email_confirmado()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null and (old.email_confirmed_at is null) then
    update public.clientes set verificado = true where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_email_confirmed on auth.users;
create trigger on_auth_email_confirmed
  after update on auth.users
  for each row execute function public.handle_email_confirmado();

-- ============================================
-- RPC: crear pedido autenticado con método de pago + crédito
-- ============================================
create or replace function crear_pedido_autenticado(
  p_direccion_id uuid,
  p_metodo_pago text,
  p_notas text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_cliente clientes%rowtype;
  v_pedido_id uuid;
  v_total numeric;
  v_disponible numeric;
  item jsonb;
  v_producto_id uuid;
  v_cantidad integer;
  v_precio numeric;
  v_stock integer;
  v_nombre text;
  v_telefono text;
begin
  if v_uid is null then
    raise exception 'Debes iniciar sesión';
  end if;

  select * into v_cliente from clientes where id = v_uid;
  if not found then
    raise exception 'Perfil de cliente no encontrado';
  end if;

  if not v_cliente.verificado then
    raise exception 'Verifica tu correo antes de comprar';
  end if;

  if p_metodo_pago not in ('efectivo','tarjeta','transferencia','credito') then
    raise exception 'Método de pago no válido';
  end if;

  -- Calcular total y descontar stock
  v_total := 0;
  for item in select * from jsonb_array_elements(p_items)
  loop
    v_producto_id := (item->>'producto_id')::uuid;
    v_cantidad := (item->>'cantidad')::integer;

    select stock, precio into v_stock, v_precio
    from productos where id = v_producto_id and activo = true
    for update;

    if v_stock is null then raise exception 'Producto no disponible'; end if;
    if v_stock < v_cantidad then raise exception 'Stock insuficiente'; end if;

    update productos set stock = stock - v_cantidad where id = v_producto_id;
    v_total := v_total + (v_precio * v_cantidad);
  end loop;

  -- Validar crédito
  if p_metodo_pago = 'credito' then
    v_disponible := v_cliente.limite_credito - v_cliente.saldo_credito;
    if v_total > v_disponible then
      raise exception 'Crédito insuficiente. Disponible: %', v_disponible;
    end if;
  end if;

  v_nombre := v_cliente.nombre;
  v_telefono := v_cliente.telefono;

  insert into pedidos (cliente_id, cliente_nombre, cliente_telefono, direccion_id, metodo_pago, notas, total, estado)
  values (v_uid, v_nombre, v_telefono, p_direccion_id, p_metodo_pago, p_notas, v_total, 'pendiente')
  returning id into v_pedido_id;

  for item in select * from jsonb_array_elements(p_items)
  loop
    v_producto_id := (item->>'producto_id')::uuid;
    v_cantidad := (item->>'cantidad')::integer;
    select precio into v_precio from productos where id = v_producto_id;
    insert into pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
    values (v_pedido_id, v_producto_id, v_cantidad, v_precio);
  end loop;

  -- Aplicar cargo a crédito
  if p_metodo_pago = 'credito' then
    update clientes set saldo_credito = saldo_credito + v_total where id = v_uid;
    insert into creditos_movimientos (cliente_id, pedido_id, tipo, monto, saldo_resultante, notas)
    values (v_uid, v_pedido_id, 'cargo', v_total, v_cliente.saldo_credito + v_total, 'Pedido a crédito');
  end if;

  return v_pedido_id;
end;
$$;

-- ============================================
-- RPC: abonar a crédito
-- ============================================
create or replace function abonar_credito(p_monto numeric, p_notas text)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_saldo numeric;
begin
  if v_uid is null then raise exception 'Debes iniciar sesión'; end if;
  if p_monto <= 0 then raise exception 'Monto inválido'; end if;

  update clientes set saldo_credito = greatest(saldo_credito - p_monto, 0)
  where id = v_uid returning saldo_credito into v_saldo;

  insert into creditos_movimientos (cliente_id, tipo, monto, saldo_resultante, notas)
  values (v_uid, 'abono', p_monto, v_saldo, p_notas);

  return v_saldo;
end;
$$;
