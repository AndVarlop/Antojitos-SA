-- Antojitos S&A - Esquema Supabase
-- Postgres / Supabase

create extension if not exists "pgcrypto";

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  precio numeric(10,2) not null check (precio >= 0),
  imagen_url text,
  categoria text not null default 'fresas',
  stock integer not null default 0 check (stock >= 0),
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_productos_categoria on productos(categoria);
create index if not exists idx_productos_activo on productos(activo);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  cliente_nombre text not null,
  cliente_email text,
  cliente_telefono text,
  total numeric(10,2) not null default 0,
  estado text not null default 'pendiente',
  created_at timestamptz not null default now()
);

create table if not exists pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id uuid not null references productos(id),
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null,
  subtotal numeric(10,2) generated always as (cantidad * precio_unitario) stored
);

create index if not exists idx_pedido_items_pedido on pedido_items(pedido_id);

-- RLS
alter table productos enable row level security;
alter table pedidos enable row level security;
alter table pedido_items enable row level security;

drop policy if exists "leer productos" on productos;
create policy "leer productos" on productos for select using (activo = true);

drop policy if exists "crear pedidos" on pedidos;
create policy "crear pedidos" on pedidos for insert with check (true);

drop policy if exists "crear pedido_items" on pedido_items;
create policy "crear pedido_items" on pedido_items for insert with check (true);

-- ============================================
-- RPC: calcular_total_pedido
-- input: jsonb array [{producto_id, cantidad}]
-- output: numeric total
-- ============================================
create or replace function calcular_total_pedido(items jsonb)
returns numeric
language plpgsql
security definer
as $$
declare
  total numeric := 0;
  item jsonb;
  precio_actual numeric;
  cantidad_actual integer;
begin
  for item in select * from jsonb_array_elements(items)
  loop
    cantidad_actual := (item->>'cantidad')::integer;
    select precio into precio_actual
    from productos
    where id = (item->>'producto_id')::uuid and activo = true;

    if precio_actual is null then
      raise exception 'Producto no disponible: %', item->>'producto_id';
    end if;

    total := total + (precio_actual * cantidad_actual);
  end loop;

  return round(total, 2);
end;
$$;

-- ============================================
-- RPC: descontar_stock_y_crear_pedido
-- input: cliente data + items jsonb
-- output: pedido_id uuid
-- ============================================
create or replace function descontar_stock_y_crear_pedido(
  p_cliente_nombre text,
  p_cliente_email text,
  p_cliente_telefono text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_pedido_id uuid;
  v_total numeric;
  item jsonb;
  v_producto_id uuid;
  v_cantidad integer;
  v_precio numeric;
  v_stock integer;
begin
  -- Validar y descontar stock
  for item in select * from jsonb_array_elements(p_items)
  loop
    v_producto_id := (item->>'producto_id')::uuid;
    v_cantidad := (item->>'cantidad')::integer;

    select stock, precio into v_stock, v_precio
    from productos
    where id = v_producto_id and activo = true
    for update;

    if v_stock is null then
      raise exception 'Producto no encontrado';
    end if;

    if v_stock < v_cantidad then
      raise exception 'Stock insuficiente para %', v_producto_id;
    end if;

    update productos set stock = stock - v_cantidad where id = v_producto_id;
  end loop;

  v_total := calcular_total_pedido(p_items);

  insert into pedidos (cliente_nombre, cliente_email, cliente_telefono, total)
  values (p_cliente_nombre, p_cliente_email, p_cliente_telefono, v_total)
  returning id into v_pedido_id;

  for item in select * from jsonb_array_elements(p_items)
  loop
    v_producto_id := (item->>'producto_id')::uuid;
    v_cantidad := (item->>'cantidad')::integer;

    select precio into v_precio from productos where id = v_producto_id;

    insert into pedido_items (pedido_id, producto_id, cantidad, precio_unitario)
    values (v_pedido_id, v_producto_id, v_cantidad, v_precio);
  end loop;

  return v_pedido_id;
end;
$$;

-- Seed demo
insert into productos (nombre, descripcion, precio, imagen_url, categoria, stock) values
('Fresas Clásicas', 'Fresas frescas con crema chantilly artesanal', 65.00, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600', 'fresas', 50),
('Fresas con Chocolate', 'Crema, chocolate derretido y chispas', 75.00, 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600', 'fresas', 40),
('Fresas Lechera', 'Crema con leche condensada y galleta', 70.00, 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600', 'fresas', 45),
('Fresas Nutella', 'Crema, nutella y almendras tostadas', 85.00, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600', 'fresas', 30),
('Fresas Oreo', 'Crema con oreo triturada y jarabe', 80.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600', 'fresas', 35),
('Fresas Premium', 'Crema, frutos rojos, miel y menta', 95.00, 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600', 'fresas', 20)
on conflict do nothing;
