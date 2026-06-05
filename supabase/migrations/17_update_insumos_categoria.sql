-- Actualizar el constraint de la columna categoria en la tabla insumos para permitir tipos industriales

alter table public.insumos drop constraint if exists insumos_categoria_check;

alter table public.insumos add constraint insumos_categoria_check 
check (categoria in ('fertilizante', 'herramienta', 'semilla', 'quimico', 'ingrediente', 'empaque', 'otro'));
