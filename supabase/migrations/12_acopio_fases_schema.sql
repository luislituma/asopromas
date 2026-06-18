-- Añadir campos para fermentación y secado al lote de acopio
ALTER TABLE lotes_acopio 
ADD COLUMN IF NOT EXISTS fecha_inicio_fermentacion DATE,
ADD COLUMN IF NOT EXISTS fecha_inicio_secado DATE,
ADD COLUMN IF NOT EXISTS metodo_secado VARCHAR,
ADD COLUMN IF NOT EXISTS peso_neto_seco_kg DECIMAL,
ADD COLUMN IF NOT EXISTS peso_neto_seco_lbs DECIMAL;

-- Actualizar comentario de estado para claridad
COMMENT ON COLUMN lotes_acopio.estado IS 'Valores: Abierto, Fermentacion, Secado, Cerrado, Enviado a Planta';
