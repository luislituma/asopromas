-- Parece que la tabla venta_detalles se creó originalmente sin algunas columnas clave
-- Añadiremos todas las columnas por si acaso faltan en la base de datos real

alter table public.venta_detalles add column if not exists lote_id uuid references public.lotes(id);
alter table public.venta_detalles add column if not exists producto_id uuid references public.productos_catalogo(id);
alter table public.venta_detalles add column if not exists insumo_id uuid references public.insumos(id);

-- Para forzar que Supabase refresque el caché (PostgREST schema cache)
NOTIFY pgrst, 'reload schema';
