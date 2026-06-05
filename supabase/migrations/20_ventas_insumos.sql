-- 1. Añadir la columna tipo_item si por alguna razón no existía en la base de datos de producción
alter table public.venta_detalles add column if not exists tipo_item text;

-- Si había ventas viejas guardadas sin tipo, les asignamos 'producto_derivado' por defecto para que no de error
update public.venta_detalles set tipo_item = 'producto_derivado' where tipo_item is null;

-- 2. Modificar el check constraint de tipo_item
alter table public.venta_detalles drop constraint if exists venta_detalles_tipo_item_check;
alter table public.venta_detalles 
add constraint venta_detalles_tipo_item_check 
check (tipo_item in ('cacao_grano', 'producto_derivado', 'insumo'));

-- 3. Añadir la columna insumo_id
alter table public.venta_detalles 
add column if not exists insumo_id uuid references public.insumos(id);

-- 4. Actualizar el trigger para que registre salidas de insumo en el Kardex
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
        
      elsif detalle.tipo_item = 'insumo' then
        -- Descontar de insumos usando la tabla de transacciones_insumos (Kardex)
        insert into public.transacciones_insumos (
          insumo_id, tipo_transaccion, cantidad, responsable_id, notas
        ) values (
          detalle.insumo_id, 'salida', detalle.cantidad, new.responsable_id, 
          'Venta de mostrador - Venta ID: ' || new.codigo_venta
        );
      end if;

    end loop;
  end if;
  
  return new;
end;
$$ language plpgsql;
