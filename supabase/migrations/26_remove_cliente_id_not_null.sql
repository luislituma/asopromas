-- 26_remove_cliente_id_not_null.sql
-- Remover la restricción NOT NULL de cliente_id en la tabla ventas
-- para permitir ventas a "Consumidor Final" (donde no se asocia un cliente registrado)

alter table public.ventas alter column cliente_id drop not null;
