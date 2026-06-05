-- 11_add_motivo_eliminacion_socios.sql

-- 1. Añadimos la columna para el motivo de eliminación (opcional en caso general, requerido por aplicación cuando se elimina)
ALTER TABLE public.socios 
ADD COLUMN motivo_eliminacion text;

-- 2. Modificamos el check constraint del estado para permitir 'eliminado'
ALTER TABLE public.socios 
DROP CONSTRAINT IF EXISTS socios_estado_check;

ALTER TABLE public.socios 
ADD CONSTRAINT socios_estado_check 
CHECK (estado in ('activo', 'inactivo', 'suspendido', 'eliminado'));
