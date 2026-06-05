-- 1. Tabla de Inventario de Insumos
create table public.insumos (
  id uuid default gen_random_uuid() primary key,
  codigo text unique,
  nombre text not null,
  descripcion text,
  categoria text check (categoria in ('fertilizante', 'herramienta', 'semilla', 'quimico', 'otro')) default 'otro',
  precio_unitario numeric not null check (precio_unitario >= 0),
  stock_disponible numeric not null default 0 check (stock_disponible >= 0),
  unidad_medida text not null default 'unidad',
  estado text check (estado in ('activo', 'inactivo')) default 'activo',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Entregas de Insumos (Deudas / Créditos a Socios)
create table public.entregas_insumos (
  id uuid default gen_random_uuid() primary key,
  socio_id uuid references public.socios(id) not null,
  insumo_id uuid references public.insumos(id) not null,
  responsable_id uuid references public.perfiles(id) not null, -- Quien entregó (Admin, Proyectos)
  fecha date not null default current_date,
  cantidad numeric not null check (cantidad > 0),
  precio_unitario numeric not null,
  monto_total numeric not null,
  saldo_pendiente numeric not null, -- Permite pagos parciales
  estado text check (estado in ('pendiente', 'pagado_parcial', 'pagado')) default 'pendiente',
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para descontar stock de insumos
create or replace function public.actualizar_stock_insumos()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.insumos set stock_disponible = stock_disponible - new.cantidad where id = new.insumo_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger tr_actualizar_stock_insumos
after insert on public.entregas_insumos
for each row execute procedure public.actualizar_stock_insumos();


-- 3. Pagos (Liquidaciones)
create table public.pagos (
  id uuid default gen_random_uuid() primary key,
  entrega_cacao_id uuid references public.entregas_cacao(id) not null unique,
  contadora_id uuid references public.perfiles(id) not null,
  fecha_pago timestamp with time zone default timezone('utc'::text, now()) not null,
  monto_bruto numeric not null check (monto_bruto >= 0),
  monto_descuentos numeric not null default 0 check (monto_descuentos >= 0),
  monto_neto numeric not null check (monto_neto >= 0),
  metodo_pago text check (metodo_pago in ('transferencia', 'efectivo', 'cheque')) not null,
  referencia_pago text,
  estado text check (estado in ('procesado', 'anulado')) default 'procesado',
  notas text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Detalle de Descuentos Aplicados en un Pago
create table public.descuentos_aplicados (
  id uuid default gen_random_uuid() primary key,
  pago_id uuid references public.pagos(id) not null,
  entrega_insumo_id uuid references public.entregas_insumos(id) not null,
  monto_descontado numeric not null check (monto_descontado > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para actualizar el saldo de la deuda cuando se aplica un descuento
create or replace function public.actualizar_saldo_deuda()
returns trigger as $$
declare
  nuevo_saldo numeric;
begin
  if TG_OP = 'INSERT' then
    -- Actualizar saldo
    update public.entregas_insumos 
    set saldo_pendiente = saldo_pendiente - new.monto_descontado,
        updated_at = now()
    where id = new.entrega_insumo_id
    returning saldo_pendiente into nuevo_saldo;
    
    -- Actualizar estado de la deuda basado en el saldo
    if nuevo_saldo <= 0 then
      update public.entregas_insumos set estado = 'pagado' where id = new.entrega_insumo_id;
    else
      update public.entregas_insumos set estado = 'pagado_parcial' where id = new.entrega_insumo_id;
    end if;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger tr_actualizar_saldo_deuda
after insert on public.descuentos_aplicados
for each row execute procedure public.actualizar_saldo_deuda();


-- 5. Row Level Security (RLS)
alter table public.insumos enable row level security;
alter table public.entregas_insumos enable row level security;
alter table public.pagos enable row level security;
alter table public.descuentos_aplicados enable row level security;

-- Insumos (Inventario)
create policy "Todos ven insumos" on public.insumos for select to authenticated using (true);
create policy "Admins y Proyectos gestionan insumos" on public.insumos for all to authenticated 
using (public.get_user_role() in ('admin', 'proyectos', 'procesamiento'));

-- Entregas Insumos (Deudas)
create policy "Admins, Proyectos y Contadora ven deudas" on public.entregas_insumos for select to authenticated 
using (public.get_user_role() in ('admin', 'proyectos', 'procesamiento', 'contadora'));
create policy "Socios ven sus propias deudas" on public.entregas_insumos for select to authenticated 
using (exists (select 1 from public.socios s where s.id = socio_id and s.perfil_id = auth.uid()));
create policy "Admins y Proyectos insertan deudas" on public.entregas_insumos for insert to authenticated 
with check (public.get_user_role() in ('admin', 'proyectos', 'procesamiento'));
create policy "Sistema actualiza deudas" on public.entregas_insumos for update to authenticated using (true); -- Permitido globalmente para que los triggers funcionen

-- Pagos y Descuentos
create policy "Admins y Contadora ven pagos" on public.pagos for select to authenticated 
using (public.get_user_role() in ('admin', 'contadora'));
create policy "Socios ven sus pagos" on public.pagos for select to authenticated 
using (exists (
  select 1 from public.entregas_cacao e 
  join public.socios s on e.socio_id = s.id 
  where e.id = entrega_cacao_id and s.perfil_id = auth.uid()
));
create policy "Admins y Contadora insertan pagos" on public.pagos for insert to authenticated 
with check (public.get_user_role() in ('admin', 'contadora'));

create policy "Admins y Contadora ven descuentos" on public.descuentos_aplicados for select to authenticated 
using (public.get_user_role() in ('admin', 'contadora'));
create policy "Socios ven sus descuentos" on public.descuentos_aplicados for select to authenticated 
using (exists (
  select 1 from public.pagos p 
  join public.entregas_cacao e on p.entrega_cacao_id = e.id 
  join public.socios s on e.socio_id = s.id 
  where p.id = pago_id and s.perfil_id = auth.uid()
));
create policy "Admins y Contadora insertan descuentos" on public.descuentos_aplicados for insert to authenticated 
with check (public.get_user_role() in ('admin', 'contadora'));
