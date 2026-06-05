-- 13_add_peso_seco_lotes.sql

-- Añadir columna de peso seco a la tabla de lotes para registrar la merma por secado
ALTER TABLE public.lotes 
ADD COLUMN IF NOT EXISTS peso_seco numeric;

-- Opcionalmente podemos añadir un campo para registrar la fecha en que se secó/entregó
ALTER TABLE public.lotes
ADD COLUMN IF NOT EXISTS fecha_procesado date;
