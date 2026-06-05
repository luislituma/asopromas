-- 03_visitas_schema.sql
-- Creación de tabla para registrar las visitas de campo de los técnicos a las fincas

create table public.visitas_campo (
  id uuid default gen_random_uuid() primary key,
  tecnico_id uuid references public.perfiles(id) not null,
  socio_id uuid references public.socios(id) not null,
  finca_id uuid references public.fincas(id) not null,
  fecha_programada date not null,
  estado text not null check (estado in ('programada', 'completada', 'cancelada')) default 'programada',
  observaciones text,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.visitas_campo enable row level security;

-- Políticas para VISITAS DE CAMPO
-- (Usamos la función segura get_user_role() creada en el parche anterior)

-- 1. Admins ven y editan todo
create policy "Admins ven todas las visitas" on public.visitas_campo for select to authenticated using (public.get_user_role() = 'admin');
create policy "Admins insertan visitas" on public.visitas_campo for insert to authenticated with check (public.get_user_role() = 'admin');
create policy "Admins actualizan visitas" on public.visitas_campo for update to authenticated using (public.get_user_role() = 'admin');

-- 2. Técnicos ven y editan solo sus visitas asignadas
create policy "Técnicos ven sus visitas" on public.visitas_campo for select to authenticated using (public.get_user_role() = 'tecnico' and tecnico_id = auth.uid());
create policy "Técnicos insertan sus visitas" on public.visitas_campo for insert to authenticated with check (public.get_user_role() = 'tecnico' and tecnico_id = auth.uid());
create policy "Técnicos actualizan sus visitas" on public.visitas_campo for update to authenticated using (public.get_user_role() = 'tecnico' and tecnico_id = auth.uid());

-- 3. Socios solo ven las visitas de sus fincas
create policy "Socios ven visitas a sus fincas" on public.visitas_campo for select to authenticated using (
  public.get_user_role() = 'socio' and socio_id = auth.uid()
);
