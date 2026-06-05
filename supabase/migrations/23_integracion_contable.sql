-- 23_integracion_contable.sql
-- Fase 7.1: Integración con Sistema Contable Externo

-- 1. Añadir campos a la tabla de ventas
alter table public.ventas 
add column if not exists numero_factura_externa text,
add column if not exists sincronizado_contabilidad boolean not null default false;

-- 2. Refrescar esquema para que la API PostgREST recoja las nuevas columnas inmediatamente
NOTIFY pgrst, 'reload schema';
