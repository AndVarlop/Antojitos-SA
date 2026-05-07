-- Antojitos S&A - Admin role
-- Ejecutar después de schema_v2.sql

-- ============================================
-- COLUMNA is_admin
-- ============================================
alter table clientes
  add column if not exists is_admin boolean not null default false;

create index if not exists idx_clientes_admin on clientes(is_admin) where is_admin = true;

-- Helper: verifica si el usuario actual es admin
create or replace function public.es_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from clientes where id = auth.uid()), false);
$$;

-- ============================================
-- POLICIES ADMIN (lectura total y modificación)
-- ============================================

-- Productos: admin puede CRUD
drop policy if exists "admin productos all" on productos;
create policy "admin productos all" on productos for all
  using (es_admin()) with check (es_admin());

-- Pedidos: admin ve todos y actualiza estado
drop policy if exists "admin pedidos all" on pedidos;
create policy "admin pedidos all" on pedidos for all
  using (es_admin()) with check (es_admin());

drop policy if exists "admin pedido_items all" on pedido_items;
create policy "admin pedido_items all" on pedido_items for all
  using (es_admin()) with check (es_admin());

-- Clientes: admin puede ver/actualizar todos
drop policy if exists "admin clientes all" on clientes;
create policy "admin clientes all" on clientes for all
  using (es_admin()) with check (es_admin());

-- Direcciones y créditos: solo lectura admin
drop policy if exists "admin direcciones read" on direcciones;
create policy "admin direcciones read" on direcciones for select using (es_admin());

drop policy if exists "admin creditos read" on creditos_movimientos;
create policy "admin creditos read" on creditos_movimientos for select using (es_admin());

-- ============================================
-- RPC: estadísticas dashboard
-- ============================================
create or replace function admin_estadisticas()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_resultado jsonb;
begin
  if not es_admin() then raise exception 'No autorizado'; end if;

  select jsonb_build_object(
    'pedidos_total', (select count(*) from pedidos),
    'pedidos_hoy', (select count(*) from pedidos where created_at::date = current_date),
    'pedidos_pendientes', (select count(*) from pedidos where estado in ('pendiente','confirmado','en_preparacion','en_camino')),
    'ingresos_total', (select coalesce(sum(total),0) from pedidos where estado = 'entregado'),
    'ingresos_mes', (select coalesce(sum(total),0) from pedidos where estado = 'entregado' and created_at >= date_trunc('month', current_date)),
    'clientes_total', (select count(*) from clientes where not is_admin),
    'clientes_verificados', (select count(*) from clientes where verificado and not is_admin),
    'credito_otorgado', (select coalesce(sum(limite_credito),0) from clientes),
    'credito_usado', (select coalesce(sum(saldo_credito),0) from clientes),
    'productos_activos', (select count(*) from productos where activo),
    'productos_agotados', (select count(*) from productos where activo and stock = 0)
  ) into v_resultado;

  return v_resultado;
end;
$$;

-- ============================================
-- RPC: cambiar estado pedido
-- ============================================
create or replace function admin_cambiar_estado_pedido(p_pedido_id uuid, p_estado text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not es_admin() then raise exception 'No autorizado'; end if;
  if p_estado not in ('pendiente','confirmado','en_preparacion','en_camino','entregado','cancelado') then
    raise exception 'Estado inválido';
  end if;
  update pedidos set estado = p_estado where id = p_pedido_id;
end;
$$;

-- ============================================
-- RPC: ajustar crédito de un cliente
-- ============================================
create or replace function admin_ajustar_credito(
  p_cliente_id uuid,
  p_nuevo_limite numeric,
  p_notas text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_anterior numeric;
begin
  if not es_admin() then raise exception 'No autorizado'; end if;
  if p_nuevo_limite < 0 then raise exception 'Límite inválido'; end if;

  select limite_credito into v_anterior from clientes where id = p_cliente_id;
  if v_anterior is null then raise exception 'Cliente no encontrado'; end if;

  update clientes set limite_credito = p_nuevo_limite where id = p_cliente_id;

  insert into creditos_movimientos (cliente_id, tipo, monto, saldo_resultante, notas)
  values (
    p_cliente_id,
    'ajuste',
    abs(p_nuevo_limite - v_anterior),
    (select saldo_credito from clientes where id = p_cliente_id),
    coalesce(p_notas, format('Límite ajustado de %s a %s', v_anterior, p_nuevo_limite))
  );
end;
$$;

-- ============================================
-- RPC: condonar saldo (admin abona en nombre del cliente)
-- ============================================
create or replace function admin_condonar_saldo(
  p_cliente_id uuid,
  p_monto numeric,
  p_notas text
)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_saldo numeric;
begin
  if not es_admin() then raise exception 'No autorizado'; end if;
  if p_monto <= 0 then raise exception 'Monto inválido'; end if;

  update clientes set saldo_credito = greatest(saldo_credito - p_monto, 0)
  where id = p_cliente_id returning saldo_credito into v_saldo;

  if v_saldo is null then raise exception 'Cliente no encontrado'; end if;

  insert into creditos_movimientos (cliente_id, tipo, monto, saldo_resultante, notas)
  values (p_cliente_id, 'abono', p_monto, v_saldo, coalesce(p_notas, 'Pago registrado por admin'));

  return v_saldo;
end;
$$;

-- ============================================
-- VISTAS para listados admin
-- ============================================
create or replace view admin_pedidos_detallado as
select
  p.id, p.created_at, p.estado, p.metodo_pago, p.total, p.notas,
  p.cliente_nombre, p.cliente_telefono, p.cliente_email,
  c.id as cliente_id, c.nombre as cliente_perfil_nombre,
  d.calle, d.numero, d.colonia, d.ciudad, d.cp,
  (select count(*) from pedido_items pi where pi.pedido_id = p.id) as items_count
from pedidos p
left join clientes c on c.id = p.cliente_id
left join direcciones d on d.id = p.direccion_id;

-- Para que la vista respete RLS, no la usamos como security_invoker.
-- En su lugar, las consultas admin pasarán por la policy "admin pedidos all".

-- ============================================
-- COMO HACERTE ADMIN (manual)
-- ============================================
-- 1) Regístrate normalmente en la app con tu correo.
-- 2) Ejecuta:
--    update clientes set is_admin = true where id = (select id from auth.users where email = 'tu-correo@gmail.com');
