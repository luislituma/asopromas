-- 27_update_socios_rls_public.sql
-- Relajar las políticas de lectura (SELECT) para permitir que el rol 'socio' o cualquier invitado
-- pueda visualizar el directorio completo de socios, fincas y lotes_finca.

-- 1. Socios
drop policy if exists "Admins y Tecnicos pueden ver socios" on public.socios;
create policy "Todos los autenticados ven socios" on public.socios 
for select to authenticated using (true);

-- 2. Fincas
drop policy if exists "Admins y Tecnicos pueden ver fincas" on public.fincas;
create policy "Todos los autenticados ven fincas" on public.fincas 
for select to authenticated using (true);

-- 3. Lotes Finca (los creados recientemente)
drop policy if exists "Admins y Tecnicos pueden ver lotes_finca" on public.lotes_finca;
create policy "Todos los autenticados ven lotes de finca" on public.lotes_finca
for select to authenticated using (true);
