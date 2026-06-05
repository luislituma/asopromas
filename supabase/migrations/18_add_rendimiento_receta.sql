-- 1. Añadir la columna de rendimiento estándar a la tabla de recetas
alter table public.recetas add column if not exists rendimiento_estandar numeric not null default 1 check (rendimiento_estandar > 0);

-- 2. Modificar el trigger procesar_orden_produccion para usar el factor de escala
create or replace function public.procesar_orden_produccion()
returns trigger as $$
declare
  ingrediente record;
  peso_cacao_necesario numeric;
  cantidad_insumo_necesaria numeric;
  rendimiento_receta numeric;
  factor_escala numeric;
begin
  -- Solo actuar si el estado cambia a 'finalizado'
  if new.estado = 'finalizado' and old.estado != 'finalizado' then
    -- Sumar el stock al producto final
    update public.productos_catalogo 
    set stock_actual = stock_actual + new.cantidad_a_producir
    where id = (select producto_id from public.recetas where id = new.receta_id);
    
    -- Obtener el rendimiento estandar de la receta
    select rendimiento_estandar into rendimiento_receta from public.recetas where id = new.receta_id;
    
    -- Factor de escala = cantidad a producir / rendimiento estandar
    factor_escala := new.cantidad_a_producir / rendimiento_receta;

    -- Descontar ingredientes escalados
    for ingrediente in (select * from public.receta_ingredientes where receta_id = new.receta_id) loop
      
      if ingrediente.tipo_ingrediente = 'cacao_grano' then
        peso_cacao_necesario := ingrediente.cantidad_requerida * factor_escala;
        -- Actualizar el peso utilizado del lote
        update public.lotes 
        set peso_utilizado = peso_utilizado + peso_cacao_necesario
        where id = new.lote_id;
        
      elsif ingrediente.tipo_ingrediente = 'insumo' then
        cantidad_insumo_necesaria := ingrediente.cantidad_requerida * factor_escala;
        -- Insertar salida en transacciones de insumos
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
