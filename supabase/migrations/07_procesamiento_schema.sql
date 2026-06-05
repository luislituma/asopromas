-- 07_procesamiento_schema.sql
-- Fase 6: Módulo de Procesamiento (Elaboración de Derivados / Recetas)

-- 1. Modificar tabla Lotes para controlar el peso utilizado en procesamiento
alter table public.lotes add column if not exists peso_utilizado numeric not null default 0;

-- 2. Catálogo de Productos Finales
create table public.productos_catalogo (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  unidad_medida text not null, -- ej. 'unidades', 'kg'
  stock_actual numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Recetas (Fórmulas)
create table public.recetas (
  id uuid default gen_random_uuid() primary key,
  producto_id uuid references public.productos_catalogo(id) on delete cascade not null,
  nombre_receta text not null,
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Ingredientes de la Receta (Por 1 unidad del producto final)
create table public.receta_ingredientes (
  id uuid default gen_random_uuid() primary key,
  receta_id uuid references public.recetas(id) on delete cascade not null,
  tipo_ingrediente text check (tipo_ingrediente in ('cacao_grano', 'insumo')) not null,
  insumo_id uuid references public.insumos(id), -- Null si es cacao_grano
  cantidad_requerida numeric not null check (cantidad_requerida > 0), -- Cantidad para hacer 1 unidad de producto
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Órdenes de Procesamiento
create table public.ordenes_procesamiento (
  id uuid default gen_random_uuid() primary key,
  codigo_orden text unique not null,
  fecha date not null default current_date,
  receta_id uuid references public.recetas(id) not null,
  lote_id uuid references public.lotes(id) not null, -- Trazabilidad: De qué lote sacamos el cacao
  cantidad_a_producir numeric not null check (cantidad_a_producir > 0),
  estado text check (estado in ('borrador', 'en_proceso', 'finalizado', 'cancelado')) default 'borrador',
  responsable_id uuid references public.perfiles(id) not null,
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Trigger para actualizar inventarios al finalizar una orden
create or replace function public.procesar_orden_produccion()
returns trigger as $$
declare
  ingrediente record;
  peso_cacao_necesario numeric;
  cantidad_insumo_necesaria numeric;
begin
  -- Solo actuar si el estado cambia a 'finalizado'
  if new.estado = 'finalizado' and old.estado != 'finalizado' then
    
    -- Sumar el stock al producto final
    update public.productos_catalogo 
    set stock_actual = stock_actual + new.cantidad_a_producir
    where id = (select producto_id from public.recetas where id = new.receta_id);

    -- Descontar ingredientes
    for ingrediente in (select * from public.receta_ingredientes where receta_id = new.receta_id) loop
      
      if ingrediente.tipo_ingrediente = 'cacao_grano' then
        peso_cacao_necesario := ingrediente.cantidad_requerida * new.cantidad_a_producir;
        -- Actualizar el peso utilizado del lote
        update public.lotes 
        set peso_utilizado = peso_utilizado + peso_cacao_necesario
        where id = new.lote_id;
        
      elsif ingrediente.tipo_ingrediente = 'insumo' then
        cantidad_insumo_necesaria := ingrediente.cantidad_requerida * new.cantidad_a_producir;
        -- Insertar salida en transacciones de insumos para que el trigger de insumos lo descuente
        insert into public.transacciones_insumos (
          insumo_id, tipo_transaccion, cantidad, responsable_id, notas
        ) values (
          ingrediente.insumo_id, 'salida', cantidad_insumo_necesaria, new.responsable_id, 
          'Procesamiento Orden ' || new.codigo_orden
        );
      end if;

    end loop;
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger tr_procesar_orden
after update of estado on public.ordenes_procesamiento
for each row execute procedure public.procesar_orden_produccion();


-- 7. Triggers de updated_at generales
create trigger handle_updated_at_prod_cat before update on public.productos_catalogo for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_recetas before update on public.recetas for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_ordenes_proc before update on public.ordenes_procesamiento for each row execute procedure public.handle_updated_at();


-- 8. Seguridad RLS
alter table public.productos_catalogo enable row level security;
alter table public.recetas enable row level security;
alter table public.receta_ingredientes enable row level security;
alter table public.ordenes_procesamiento enable row level security;

-- Políticas
create policy "Todos ven productos" on public.productos_catalogo for select to authenticated using (true);
create policy "Admins y Procesamiento modifican productos" on public.productos_catalogo for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento'));

create policy "Todos ven recetas" on public.recetas for select to authenticated using (true);
create policy "Admins y Procesamiento modifican recetas" on public.recetas for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento'));

create policy "Todos ven ingredientes" on public.receta_ingredientes for select to authenticated using (true);
create policy "Admins y Procesamiento modifican ingredientes" on public.receta_ingredientes for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento'));

create policy "Todos ven ordenes de procesamiento" on public.ordenes_procesamiento for select to authenticated using (true);
create policy "Admins y Procesamiento modifican ordenes" on public.ordenes_procesamiento for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento'));
