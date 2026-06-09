-- 25_remove_producto_id_not_null.sql
-- Remover la restricción NOT NULL de producto_id en venta_detalles
-- porque ahora la tabla es polimórfica (puede recibir producto_id, lote_id o insumo_id)

alter table public.venta_detalles alter column producto_id drop not null;
