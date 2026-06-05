-- 04_acopio_schema.sql
-- Fase 3: Módulos de Acopio, Trazabilidad y Lotes

-- 1. Nuevos Roles (basado en la especificación de negocio)
insert into public.roles (nombre, descripcion) values 
  ('acopio', 'Encargado de recepción y pesaje de cacao'),
  ('procesamiento', 'Encargado de transformación e inventario')
on conflict (nombre) do nothing;

-- 2. Grupos Base (Organización territorial)
create table public.grupos_base (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  presidente_id uuid references public.socios(id),
  estado text check (estado in ('activo', 'inactivo')) default 'activo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Asignar los socios a grupos base (Opcional, pero necesario para la estructura)
alter table public.socios add column grupo_id uuid references public.grupos_base(id);

-- 3. Lotes (Trazabilidad)
create table public.lotes (
  id uuid default gen_random_uuid() primary key,
  codigo_lote text not null unique,
  fecha_creacion date not null default current_date,
  peso_total numeric not null default 0,
  estado text check (estado in ('abierto', 'cerrado', 'exportado', 'procesado')) default 'abierto',
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Jornadas de Acopio (Collection Events)
create table public.acopios (
  id uuid default gen_random_uuid() primary key,
  fecha date not null,
  grupo_id uuid references public.grupos_base(id),
  responsable_id uuid references public.perfiles(id) not null,
  precio_dia_kg numeric not null, -- El precio se define antes del acopio
  ubicacion text,
  estado text check (estado in ('programado', 'en_curso', 'finalizado', 'cancelado')) default 'programado',
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Entregas de Cacao (Cocoa Deliveries)
create table public.entregas_cacao (
  id uuid default gen_random_uuid() primary key,
  acopio_id uuid references public.acopios(id) on delete cascade not null,
  socio_id uuid references public.socios(id) not null,
  finca_id uuid references public.fincas(id) not null,
  lote_id uuid references public.lotes(id), -- Puede estar null hasta que se asigne a un lote
  peso_kg numeric not null check (peso_kg > 0),
  precio_por_kg numeric not null, -- Heredado del acopio_id, pero se guarda por si hay bonus por calidad
  monto_total numeric not null, -- peso_kg * precio_por_kg
  calidad text check (calidad in ('estandar', 'premium', 'rechazado')) default 'estandar',
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Actualización automática del peso del lote cuando se le asignan entregas
create or replace function public.actualizar_peso_lote()
returns trigger as $$
begin
  if TG_OP = 'INSERT' and new.lote_id is not null then
    update public.lotes set peso_total = peso_total + new.peso_kg where id = new.lote_id;
  elsif TG_OP = 'UPDATE' then
    if old.lote_id is not null then
      update public.lotes set peso_total = peso_total - old.peso_kg where id = old.lote_id;
    end if;
    if new.lote_id is not null then
      update public.lotes set peso_total = peso_total + new.peso_kg where id = new.lote_id;
    end if;
  elsif TG_OP = 'DELETE' and old.lote_id is not null then
    update public.lotes set peso_total = peso_total - old.peso_kg where id = old.lote_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger tr_actualizar_peso_lote
after insert or update of lote_id, peso_kg or delete on public.entregas_cacao
for each row execute procedure public.actualizar_peso_lote();


-- 7. RLS (Row Level Security)

alter table public.grupos_base enable row level security;
alter table public.lotes enable row level security;
alter table public.acopios enable row level security;
alter table public.entregas_cacao enable row level security;

-- GRUPOS BASE: Visibles por todos los autenticados. Administradores editan.
create policy "Todos ven grupos" on public.grupos_base for select to authenticated using (true);
create policy "Admins editan grupos" on public.grupos_base for all to authenticated using (public.get_user_role() = 'admin');

-- LOTES: Visibles por todos. Admins y Acopio editan.
create policy "Todos ven lotes" on public.lotes for select to authenticated using (true);
create policy "Admins y Acopio insertan lotes" on public.lotes for insert to authenticated with check (public.get_user_role() in ('admin', 'acopio'));
create policy "Admins y Acopio actualizan lotes" on public.lotes for update to authenticated using (public.get_user_role() in ('admin', 'acopio'));

-- ACOPIOS: Visibles por todos. Admins y Acopio editan.
create policy "Todos ven acopios" on public.acopios for select to authenticated using (true);
create policy "Admins y Acopio insertan acopios" on public.acopios for insert to authenticated with check (public.get_user_role() in ('admin', 'acopio'));
create policy "Admins y Acopio actualizan acopios" on public.acopios for update to authenticated using (public.get_user_role() in ('admin', 'acopio'));

-- ENTREGAS: Admins y Acopio ven/editan todo. Socios ven solo lo suyo.
create policy "Admins y Acopio ven todas las entregas" on public.entregas_cacao for select to authenticated using (public.get_user_role() in ('admin', 'acopio', 'contadora'));
create policy "Admins y Acopio insertan entregas" on public.entregas_cacao for insert to authenticated with check (public.get_user_role() in ('admin', 'acopio'));
create policy "Admins y Acopio actualizan entregas" on public.entregas_cacao for update to authenticated using (public.get_user_role() in ('admin', 'acopio'));

create policy "Socios ven sus propias entregas" on public.entregas_cacao for select to authenticated 
using (
  exists (
    select 1 from public.socios s
    where s.id = socio_id and s.perfil_id = auth.uid()
  )
);
