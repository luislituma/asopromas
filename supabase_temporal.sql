-- =========================================================================
-- TABLA TEMPORAL PARA EL DIRECTORIO DE SOCIOS (RAMA MAIN)
-- =========================================================================
-- Instrucciones:
-- 1. Ve a https://supabase.com/dashboard/project/_/sql
-- 2. Pega este código completo y presiona "Run" (el botón verde de play)
-- =========================================================================

-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS directorio_temporal (
    id integer PRIMARY KEY DEFAULT 1,
    headers jsonb NOT NULL DEFAULT '[]'::jsonb,
    socios_data jsonb NOT NULL DEFAULT '[]'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Insertar la fila base (si no existe)
INSERT INTO directorio_temporal (id, headers, socios_data) 
VALUES (1, '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 3. Habilitar Seguridad (RLS)
ALTER TABLE directorio_temporal ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas para que SOLO LOS USUARIOS LOGUEADOS puedan ver y modificar
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON directorio_temporal FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir actualizacion a usuarios autenticados" 
ON directorio_temporal FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Nota: Como no necesitamos insertar nuevas filas (solo actualizamos la fila id=1), 
-- no necesitamos políticas de INSERT o DELETE.
