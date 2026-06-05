-- 1. Tabla de transacciones de insumos (Kardex)
create table if not exists public.transacciones_insumos (
  id uuid default gen_random_uuid() primary key,
  insumo_id uuid references public.insumos(id) on delete cascade not null,
  tipo_transaccion text check (tipo_transaccion in ('entrada', 'salida', 'ajuste')) not null,
  cantidad numeric not null check (cantidad > 0),
  responsable_id uuid references public.perfiles(id) not null,
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Trigger para actualizar el stock disponible cuando hay una transacción
create or replace function public.actualizar_stock_por_transaccion()
returns trigger as $$
begin
  if new.tipo_transaccion = 'entrada' then
    update public.insumos 
    set stock_disponible = stock_disponible + new.cantidad 
    where id = new.insumo_id;
  elsif new.tipo_transaccion = 'salida' then
    update public.insumos 
    set stock_disponible = stock_disponible - new.cantidad 
    where id = new.insumo_id;
  elsif new.tipo_transaccion = 'ajuste' then
    -- Ajuste define el nuevo stock absoluto (por inventario físico)
    -- En esta tabla 'cantidad' será el stock real nuevo
    -- No lo sumamos ni restamos, lo sobreescribimos
    update public.insumos 
    set stock_disponible = new.cantidad 
    where id = new.insumo_id;
  end if;
  return new;
end;
$$ language plpgsql;

-- Evitar duplicidad del trigger si se vuelve a correr
drop trigger if exists tr_actualizar_stock_por_transaccion on public.transacciones_insumos;

create trigger tr_actualizar_stock_por_transaccion
after insert on public.transacciones_insumos
for each row execute procedure public.actualizar_stock_por_transaccion();

-- 3. Políticas de seguridad (RLS)
alter table public.transacciones_insumos enable row level security;

create policy "Todos ven las transacciones" 
on public.transacciones_insumos for select 
to authenticated 
using (true);

create policy "Admins y roles permitidos insertan transacciones" 
on public.transacciones_insumos for insert 
to authenticated 
with check (public.get_user_role() in ('admin', 'procesamiento', 'acopio', 'tecnico'));
