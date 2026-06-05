-- 05_add_spec_fields.sql
-- Agregar campos adicionales solicitados en la especificación de negocio (PROJECT_SPEC_ASOPROMAS)

-- 1. Nuevos campos para SOCIOS
alter table public.socios 
  add column if not exists genero text check (genero in ('Masculino', 'Femenino', 'Otro', 'Prefiero no decirlo')),
  add column if not exists etnia text,
  add column if not exists banco_nombre text,
  add column if not exists banco_cuenta text,
  add column if not exists tipo_cacao text;

-- 2. Nuevos campos para FINCAS
alter table public.fincas
  add column if not exists latitud numeric,
  add column if not exists longitud numeric,
  add column if not exists certificada boolean default false;
