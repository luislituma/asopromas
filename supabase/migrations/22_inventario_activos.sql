-- 22_inventario_activos.sql
-- Creación del módulo de Inventario y Activos Fijos (Equipos, Maquinaria, etc.)

create table public.inventario_equipos (
  id uuid default gen_random_uuid() primary key,
  codigo text unique not null,
  nombre text not null,
  descripcion text,
  categoria text check (categoria in ('maquinaria', 'computacion', 'mobiliario', 'herramientas', 'vehiculos', 'otro')) default 'otro',
  marca text,
  modelo text,
  numero_serie text,
  fecha_adquisicion date,
  valor_adquisicion numeric check (valor_adquisicion >= 0),
  estado text check (estado in ('operativo', 'mantenimiento', 'dado_de_baja')) default 'operativo',
  ubicacion text,
  responsable_id uuid references public.perfiles(id),
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.inventario_equipos enable row level security;

create policy "Lectura de activos para autenticados" on public.inventario_equipos for select to authenticated using (true);
create policy "Admins y contabilidad gestionan activos" on public.inventario_equipos for all to authenticated using (public.get_user_role() in ('admin', 'contabilidad'));

-- Forzar recarga de cache
NOTIFY pgrst, 'reload schema';
