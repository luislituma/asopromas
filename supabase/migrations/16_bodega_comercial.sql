-- 16_bodega_comercial.sql
-- Fase 8: Bodega Comercial Unificada

-- 1. Trazabilidad en el catálogo de productos
alter table public.productos_catalogo add column if not exists lote_id uuid references public.lotes(id);

-- 2. Limpieza de detalles de venta (Todo se vende desde el catálogo)
-- Nota: Si ya hay datos en venta_detalles con lote_id, podríamos tener problemas de FK. 
-- Como estamos en etapa de desarrollo, vamos a vaciar venta_detalles para hacer la alteración limpia
truncate table public.venta_detalles cascade;

alter table public.venta_detalles drop constraint if exists venta_detalles_tipo_item_check;
alter table public.venta_detalles drop column if exists tipo_item;
alter table public.venta_detalles drop column if exists lote_id;

-- Asegurar que producto_id sea obligatorio ahora
alter table public.venta_detalles alter column producto_id set not null;


-- 3. Actualizar el trigger de inventario para ventas
create or replace function public.procesar_venta_inventario()
returns trigger as $$
declare
  detalle record;
begin
  -- Solo actuar si el estado cambia a 'completado'
  if new.estado = 'completado' and old.estado != 'completado' then
    
    -- Recorrer todos los ítems vendidos (ahora todos son productos_catalogo)
    for detalle in (select * from public.venta_detalles where venta_id = new.id) loop
      
      -- Descontar stock del catálogo de productos finales
      update public.productos_catalogo 
      set stock_actual = stock_actual - detalle.cantidad
      where id = detalle.producto_id;

    end loop;
  end if;
  
  return new;
end;
$$ language plpgsql;


-- 4. Función de Transferencia Segura desde Acopio a Bodega Comercial
create or replace function public.transferir_lote_a_bodega(
  p_lote_id uuid,
  p_cantidad numeric,
  p_responsable_id uuid
) returns json as $$
declare
  v_lote record;
  v_producto_id uuid;
  v_disponible numeric;
  v_nombre_producto text;
begin
  -- Obtener lote y validar
  select * into v_lote from public.lotes where id = p_lote_id;
  if not found then
    raise exception 'Lote no encontrado';
  end if;

  v_disponible := v_lote.peso_seco - coalesce(v_lote.peso_utilizado, 0);
  
  if p_cantidad > v_disponible then
    raise exception 'Cantidad a transferir supera el disponible del lote (%)', v_disponible;
  end if;

  -- 1. Descontar del lote
  update public.lotes 
  set peso_utilizado = coalesce(peso_utilizado, 0) + p_cantidad
  where id = p_lote_id;

  -- 2. Buscar si ya existe un producto en catálogo para este lote de Cacao Seco
  v_nombre_producto := 'Cacao en Grano - ' || v_lote.codigo_lote;
  
  select id into v_producto_id 
  from public.productos_catalogo 
  where lote_id = p_lote_id and nombre = v_nombre_producto
  limit 1;

  if v_producto_id is null then
    -- Crear el producto en el catálogo
    insert into public.productos_catalogo (
      nombre, 
      descripcion, 
      unidad_medida, 
      stock_actual, 
      lote_id
    ) values (
      v_nombre_producto,
      'Cacao seco en grano proveniente del lote ' || v_lote.codigo_lote,
      'kg',
      p_cantidad,
      p_lote_id
    ) returning id into v_producto_id;
  else
    -- Sumar al stock existente
    update public.productos_catalogo
    set stock_actual = stock_actual + p_cantidad,
        updated_at = now()
    where id = v_producto_id;
  end if;

  return json_build_object(
    'success', true,
    'producto_id', v_producto_id,
    'cantidad_transferida', p_cantidad
  );
end;
$$ language plpgsql security definer;
