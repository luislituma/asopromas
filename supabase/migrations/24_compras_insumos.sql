-- 24_compras_insumos.sql
-- Fase 7.2: Módulo de Compras (Entrada de Insumos) e Integración Contable

-- 1. Tabla de Compras (Cabecera)
create table public.compras (
  id uuid default gen_random_uuid() primary key,
  codigo_compra text unique not null,
  fecha date not null default current_date,
  proveedor_nombre text not null,
  proveedor_identificacion text, -- Opcional RUC
  subtotal numeric not null default 0,
  iva numeric not null default 0,
  monto_total numeric not null default 0,
  estado text check (estado in ('borrador', 'completado', 'cancelado')) default 'borrador',
  notas text,
  numero_factura_externa text,
  sincronizado_contabilidad boolean not null default false,
  responsable_id uuid references public.perfiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Detalles de Compras
create table public.compra_detalles (
  id uuid default gen_random_uuid() primary key,
  compra_id uuid references public.compras(id) on delete cascade not null,
  insumo_id uuid references public.insumos(id) not null,
  cantidad numeric not null check (cantidad > 0),
  precio_unitario numeric not null check (precio_unitario >= 0),
  subtotal numeric not null check (subtotal >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Función y Trigger para ingresar stock al inventario
create or replace function public.procesar_compra_inventario()
returns trigger as $$
declare
  detalle record;
begin
  -- Solo actuar si el estado cambia de borrador a completado
  if new.estado = 'completado' and old.estado != 'completado' then
    
    -- Recorrer todos los ítems comprados
    for detalle in (select * from public.compra_detalles where compra_id = new.id) loop
      
      -- Insertar la transacción (Entrada). El trigger de transacciones_insumos se encargará
      -- automáticamente de sumar el `stock_disponible` en la tabla `insumos`.
      insert into public.transacciones_insumos (
        insumo_id, tipo_transaccion, cantidad, responsable_id, notas
      ) values (
        detalle.insumo_id, 'entrada', detalle.cantidad, new.responsable_id, 
        'Compra a proveedor: ' || new.proveedor_nombre || ' - Código: ' || new.codigo_compra
      );
      
    end loop;
    
  end if;
  return new;
end;
$$ language plpgsql;

create trigger tr_procesar_compra_inventario
after update on public.compras
for each row execute procedure public.procesar_compra_inventario();

-- 4. RLS Políticas
alter table public.compras enable row level security;
alter table public.compra_detalles enable row level security;

create policy "Todos los autenticados ven compras" on public.compras for select to authenticated using (true);
create policy "Admins y ventas insertan compras" on public.compras for insert to authenticated with check (public.get_user_role() in ('admin', 'procesamiento', 'ventas', 'acopio'));
create policy "Admins y ventas actualizan compras" on public.compras for update to authenticated using (public.get_user_role() in ('admin', 'procesamiento', 'ventas', 'acopio'));

create policy "Todos los autenticados ven detalles de compras" on public.compra_detalles for select to authenticated using (true);
create policy "Admins y ventas insertan detalles de compras" on public.compra_detalles for insert to authenticated with check (public.get_user_role() in ('admin', 'procesamiento', 'ventas', 'acopio'));
create policy "Admins y ventas actualizan detalles de compras" on public.compra_detalles for update to authenticated using (public.get_user_role() in ('admin', 'procesamiento', 'ventas', 'acopio'));
create policy "Admins y ventas eliminan detalles de compras" on public.compra_detalles for delete to authenticated using (public.get_user_role() in ('admin', 'procesamiento', 'ventas', 'acopio'));

NOTIFY pgrst, 'reload schema';
