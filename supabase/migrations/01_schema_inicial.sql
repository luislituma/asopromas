-- 1. EXTENSIONES
-- Necesario para generar UUIDs seguros
create extension if not exists "uuid-ossp";

-- 2. TABLAS

-- 2.1. ROLES
-- Definimos los roles permitidos en el sistema (admin, tecnico, socio)
create table public.roles (
  id uuid default uuid_generate_v4() primary key,
  nombre text not null unique,
  descripcion text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insertar roles por defecto
insert into public.roles (nombre, descripcion) values 
  ('admin', 'Administrador del sistema con acceso total'),
  ('tecnico', 'Técnico de campo para registrar visitas y cosechas'),
  ('socio', 'Socio productor con acceso a su propia información');

-- 2.2. PERFILES (Usuarios)
-- Extensión de la tabla auth.users de Supabase
create table public.perfiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  nombre_completo text not null,
  rol_id uuid references public.roles(id) not null,
  activo boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.3. SOCIOS
create table public.socios (
  id uuid default uuid_generate_v4() primary key,
  perfil_id uuid references public.perfiles(id), -- Opcional: Puede estar enlazado a un usuario de login
  cedula text unique not null,
  nombres text not null,
  apellidos text not null,
  telefono text,
  email text,
  direccion text,
  fecha_ingreso date not null default current_date,
  estado text check (estado in ('activo', 'inactivo', 'suspendido')) default 'activo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.4. FINCAS
create table public.fincas (
  id uuid default uuid_generate_v4() primary key,
  socio_id uuid references public.socios(id) on delete cascade not null,
  nombre text not null,
  ubicacion text,
  hectareas_totales numeric,
  hectareas_cacao numeric,
  variedades_cacao text[], -- Array de variedades (ej. CCN51, Nacional)
  certificaciones text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. FUNCIONES Y TRIGGERS

-- Función para actualizar el updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger handle_updated_at_perfiles before update on public.perfiles for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_socios before update on public.socios for each row execute procedure public.handle_updated_at();
create trigger handle_updated_at_fincas before update on public.fincas for each row execute procedure public.handle_updated_at();

-- Función para manejar la creación de usuarios nuevos (Trigger en auth.users)
-- (Esta función asume que enviaremos el rol en los user_metadata al registrarse)
create or replace function public.handle_new_user() 
returns trigger as $$
declare
  default_role_id uuid;
begin
  -- Buscar el ID del rol 'socio' por defecto si no se pasa uno en el metadata
  select id into default_role_id from public.roles where nombre = 'socio' limit 1;

  insert into public.perfiles (id, email, nombre_completo, rol_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre_completo', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'rol_id')::uuid, default_role_id)
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger cuando se crea un usuario en auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. SEGURIDAD A NIVEL DE FILAS (RLS - Row Level Security)

-- Habilitar RLS en las tablas
alter table public.roles enable row level security;
alter table public.perfiles enable row level security;
alter table public.socios enable row level security;
alter table public.fincas enable row level security;

-- Políticas para ROLES (Todos pueden ver los roles)
create policy "Roles son visibles para todos los usuarios autenticados" on public.roles for select to authenticated using (true);

-- Políticas para PERFILES
-- Cada usuario puede ver su propio perfil
create policy "Usuarios pueden ver su propio perfil" on public.perfiles for select to authenticated using (auth.uid() = id);
-- Admins pueden ver y modificar todos los perfiles
create policy "Admins pueden ver todos los perfiles" on public.perfiles for select to authenticated 
using (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre = 'admin'
  )
);
create policy "Admins pueden modificar todos los perfiles" on public.perfiles for update to authenticated 
using (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre = 'admin'
  )
);

-- Políticas para SOCIOS
-- Admins y Técnicos pueden hacer todo (CRUD)
create policy "Admins y Tecnicos pueden ver socios" on public.socios for select to authenticated 
using (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre in ('admin', 'tecnico')
  )
);
create policy "Admins y Tecnicos pueden insertar socios" on public.socios for insert to authenticated 
with check (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre in ('admin', 'tecnico')
  )
);
create policy "Admins y Tecnicos pueden actualizar socios" on public.socios for update to authenticated 
using (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre in ('admin', 'tecnico')
  )
);
-- Socios solo pueden ver su propio registro
create policy "Socios ven su propio registro" on public.socios for select to authenticated using (perfil_id = auth.uid());

-- Políticas para FINCAS
-- Admins y Técnicos pueden hacer todo
create policy "Admins y Tecnicos pueden ver fincas" on public.fincas for select to authenticated 
using (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre in ('admin', 'tecnico')
  )
);
create policy "Admins y Tecnicos pueden insertar fincas" on public.fincas for insert to authenticated 
with check (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre in ('admin', 'tecnico')
  )
);
create policy "Admins y Tecnicos pueden actualizar fincas" on public.fincas for update to authenticated 
using (
  exists (
    select 1 from public.perfiles p
    inner join public.roles r on p.rol_id = r.id
    where p.id = auth.uid() and r.nombre in ('admin', 'tecnico')
  )
);
-- Socios solo pueden ver sus propias fincas
create policy "Socios ven sus propias fincas" on public.fincas for select to authenticated 
using (
  exists (
    select 1 from public.socios s
    where s.id = socio_id and s.perfil_id = auth.uid()
  )
);
