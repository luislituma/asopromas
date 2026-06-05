-- 10_add_codigo_documentos_socios.sql
-- Fase de Mejora Continua: Añadir código personalizado y enlace a documentos de drive para los socios.

alter table public.socios 
add column codigo_socio text unique,
add column enlace_documentos text;
