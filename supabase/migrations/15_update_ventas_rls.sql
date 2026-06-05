-- 15_update_ventas_rls.sql
-- Permitir al rol 'acopio' gestionar ventas (para poder vender cacao en grano)

drop policy if exists "Admins y Comercial modifican ventas" on public.ventas;
create policy "Admins y Comercial modifican ventas" on public.ventas for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento', 'acopio'));

drop policy if exists "Admins y Comercial modifican venta detalles" on public.venta_detalles;
create policy "Admins y Comercial modifican venta detalles" on public.venta_detalles for all to authenticated using (public.get_user_role() in ('admin', 'procesamiento', 'acopio'));
