-- 1. Crear función segura para obtener el rol sin disparar políticas (evita recursión infinita)
create or replace function public.get_user_role()
returns text as $$
declare
  rol_nombre text;
begin
  select r.nombre into rol_nombre
  from public.perfiles p
  inner join public.roles r on p.rol_id = r.id
  where p.id = auth.uid();
  
  return rol_nombre;
end;
$$ language plpgsql security definer;


-- 2. Corregir políticas de PERFILES
drop policy if exists "Admins pueden ver todos los perfiles" on public.perfiles;
drop policy if exists "Admins pueden modificar todos los perfiles" on public.perfiles;

create policy "Admins pueden ver todos los perfiles" on public.perfiles 
for select to authenticated using (public.get_user_role() = 'admin');

create policy "Admins pueden modificar todos los perfiles" on public.perfiles 
for update to authenticated using (public.get_user_role() = 'admin');


-- 3. Corregir políticas de SOCIOS
drop policy if exists "Admins y Tecnicos pueden ver socios" on public.socios;
drop policy if exists "Admins y Tecnicos pueden insertar socios" on public.socios;
drop policy if exists "Admins y Tecnicos pueden actualizar socios" on public.socios;

create policy "Admins y Tecnicos pueden ver socios" on public.socios 
for select to authenticated using (public.get_user_role() in ('admin', 'tecnico'));

create policy "Admins y Tecnicos pueden insertar socios" on public.socios 
for insert to authenticated with check (public.get_user_role() in ('admin', 'tecnico'));

create policy "Admins y Tecnicos pueden actualizar socios" on public.socios 
for update to authenticated using (public.get_user_role() in ('admin', 'tecnico'));


-- 4. Corregir políticas de FINCAS
drop policy if exists "Admins y Tecnicos pueden ver fincas" on public.fincas;
drop policy if exists "Admins y Tecnicos pueden insertar fincas" on public.fincas;
drop policy if exists "Admins y Tecnicos pueden actualizar fincas" on public.fincas;

create policy "Admins y Tecnicos pueden ver fincas" on public.fincas 
for select to authenticated using (public.get_user_role() in ('admin', 'tecnico'));

create policy "Admins y Tecnicos pueden insertar fincas" on public.fincas 
for insert to authenticated with check (public.get_user_role() in ('admin', 'tecnico'));

create policy "Admins y Tecnicos pueden actualizar fincas" on public.fincas 
for update to authenticated using (public.get_user_role() in ('admin', 'tecnico'));
