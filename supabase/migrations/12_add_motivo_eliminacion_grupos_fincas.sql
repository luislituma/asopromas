-- 12_add_motivo_eliminacion_grupos_fincas.sql

-- 1. Modificar GRUPOS BASE
ALTER TABLE public.grupos_base 
ADD COLUMN motivo_eliminacion text;

ALTER TABLE public.grupos_base 
DROP CONSTRAINT IF EXISTS grupos_base_estado_check;

ALTER TABLE public.grupos_base 
ADD CONSTRAINT grupos_base_estado_check 
CHECK (estado in ('activo', 'inactivo', 'eliminado'));

-- 2. Modificar FINCAS (Actualmente no tenía columna estado, así que la creamos)
ALTER TABLE public.fincas 
ADD COLUMN estado text check (estado in ('activo', 'inactivo', 'eliminado')) default 'activo';

ALTER TABLE public.fincas 
ADD COLUMN motivo_eliminacion text;
