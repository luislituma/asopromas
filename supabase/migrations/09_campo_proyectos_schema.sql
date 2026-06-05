-- 09_campo_proyectos_schema.sql
-- Fases 8 y 9: Asistencia Técnica, Proyectos y Capacitaciones

-- ==========================================
-- FASE 8: ASISTENCIA TÉCNICA (CAMPO)
-- ==========================================

-- Extender la tabla 'visitas_campo' que fue creada en 03_visitas_schema.sql
alter table public.visitas_campo 
add column if not exists nivel_plagas text check (nivel_plagas in ('bajo', 'medio', 'alto')),
add column if not exists estado_cultivo text check (estado_cultivo in ('excelente', 'bueno', 'regular', 'malo')),
add column if not exists cumple_organico boolean default true,
add column if not exists recomendaciones_tecnicas text;


-- ==========================================
-- FASE 9: PROYECTOS Y CAPACITACIONES
-- ==========================================

-- 1. Tabla de Proyectos
create table public.proyectos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  presupuesto_asignado numeric default 0,
  fecha_inicio date,
  fecha_fin date,
  estado text check (estado in ('planificacion', 'activo', 'finalizado', 'cancelado')) default 'planificacion',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de Capacitaciones / Talleres
create table public.capacitaciones (
  id uuid default gen_random_uuid() primary key,
  proyecto_id uuid references public.proyectos(id) on delete set null, -- Opcional
  tema text not null,
  fecha date not null,
  lugar text,
  expositor text,
  estado text check (estado in ('programada', 'realizada', 'cancelada')) default 'programada',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabla de Asistencia a Capacitaciones
create table public.capacitacion_asistencias (
  id uuid default gen_random_uuid() primary key,
  capacitacion_id uuid references public.capacitaciones(id) on delete cascade not null,
  socio_id uuid references public.socios(id) on delete cascade not null,
  asistio boolean default true,
  observaciones text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(capacitacion_id, socio_id) -- Un socio solo puede registrarse una vez por capacitación
);

-- 4. Triggers de updated_at
create trigger handle_updated_at_proyectos before update on public.proyectos for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_capacitaciones before update on public.capacitaciones for each row execute procedure public.handle_updated_at();

-- 5. RLS Policies
alter table public.proyectos enable row level security;
alter table public.capacitaciones enable row level security;
alter table public.capacitacion_asistencias enable row level security;

-- Todos autenticados pueden ver
create policy "Todos ven proyectos" on public.proyectos for select to authenticated using (true);
create policy "Todos ven capacitaciones" on public.capacitaciones for select to authenticated using (true);
create policy "Todos ven asistencia" on public.capacitacion_asistencias for select to authenticated using (true);

-- Admins y Tecnicos pueden modificar todo esto
create policy "Admins y Tecnicos modifican proyectos" on public.proyectos for all to authenticated using (public.get_user_role() in ('admin', 'tecnico'));
create policy "Admins y Tecnicos modifican capacitaciones" on public.capacitaciones for all to authenticated using (public.get_user_role() in ('admin', 'tecnico'));
create policy "Admins y Tecnicos modifican asistencia" on public.capacitacion_asistencias for all to authenticated using (public.get_user_role() in ('admin', 'tecnico'));
