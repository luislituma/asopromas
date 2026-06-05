-- 08_ventas_schema.sql
-- Fase 7: Módulo de Ventas y Clientes

-- 1. Directorio de Clientes
create table public.clientes (
  id uuid default gen_random_uuid() primary key,
  nombre_razon_social text not null,
  identificacion text, -- RUC, Cédula, o pasaporte
  tipo_cliente text check (tipo_cliente in ('nacional', 'exportacion', 'distribuidor', 'tienda', 'socio')) not null,
  socio_id uuid references public.socios(id), -- Opcional, si es socio de la asociación
  contacto_principal text,
  telefono text,
  email text,
  direccion text,
  estado text check (estado in ('activo', 'inactivo')) default 'activo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Ventas (Cabecera)
create table public.ventas (
  id uuid default gen_random_uuid() primary key,
  codigo_venta text unique not null,
  fecha date not null default current_date,
  cliente_id uuid references public.clientes(id) not null,
  subtotal numeric not null default 0,
  descuento numeric not null default 0,
  monto_total numeric not null default 0, -- (subtotal - descuento) (Los precios ya incluyen IVA)
  estado text check (estado in ('borrador', 'completado', 'cancelado')) default 'borrador',
  notas text,
  responsable_id uuid references public.perfiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Detalles de Venta (Items)
create table public.venta_detalles (
  id uuid default gen_random_uuid() primary key,
  venta_id uuid references public.ventas(id) on delete cascade not null,
  tipo_item text check (tipo_item in ('cacao_grano', 'producto_derivado')) not null,
  lote_id uuid references public.lotes(id), -- Null si es derivado
  producto_id uuid references public.productos_catalogo(id), -- Null si es cacao en grano
  cantidad numeric not null check (cantidad > 0),
  precio_unitario numeric not null check (precio_unitario >= 0),
  subtotal numeric not null check (subtotal >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Trigger para actualizar inventarios al completar la venta
create or replace function public.procesar_venta_inventario()
returns trigger as $$
declare
  detalle record;
begin
  -- Solo actuar si el estado cambia a 'completado'
  if new.estado = 'completado' and old.estado != 'completado' then
    
    -- Recorrer todos los ítems vendidos
    for detalle in (select * from public.venta_detalles where venta_id = new.id) loop
      
      if detalle.tipo_item = 'cacao_grano' then
        -- Descontar kilos del lote (sumarlo a peso_utilizado)
        update public.lotes 
        set peso_utilizado = peso_utilizado + detalle.cantidad
        where id = detalle.lote_id;
        
      elsif detalle.tipo_item = 'producto_derivado' then
        -- Descontar stock del catálogo de productos finales
        update public.productos_catalogo 
        set stock_actual = stock_actual - detalle.cantidad
        where id = detalle.producto_id;
      end if;

    end loop;
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger tr_procesar_venta
after update of estado on public.ventas
for each row execute procedure public.procesar_venta_inventario();

-- 5. Triggers de updated_at
create trigger handle_updated_at_clientes before update on public.clientes for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_ventas before update on public.ventas for each row execute procedure public.handle_updated_at();

-- 6. Seguridad RLS
alter table public.clientes enable row level security;
alter table public.ventas enable row level security;
alter table public.venta_detalles enable row level security;

-- Políticas Clientes
create policy "Todos ven clientes" on public.clientes for select to authenticated using (true);
create policy "Admins y Comercial modifican clientes" on public.clientes for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento'));

-- Políticas Ventas
create policy "Todos ven ventas" on public.ventas for select to authenticated using (true);
create policy "Admins y Comercial modifican ventas" on public.ventas for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento'));

-- Políticas Detalles Venta
create policy "Todos ven venta detalles" on public.venta_detalles for select to authenticated using (true);
create policy "Admins y Comercial modifican venta detalles" on public.venta_detalles for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento'));
