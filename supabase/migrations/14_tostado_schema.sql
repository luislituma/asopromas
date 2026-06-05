-- 14_tostado_schema.sql
  -- Submódulo de Tostado: Transición de Lote Seco a Nibs / Cacao Tostado

  -- 1. Crear la tabla de registros de tostado
  create table if not exists public.registros_tostado (
    id uuid default gen_random_uuid() primary key,
    lote_id uuid references public.lotes(id) not null,
    fecha date not null default current_date,
    peso_seco_utilizado numeric not null check (peso_seco_utilizado > 0),
    peso_tostado_obtenido numeric not null check (peso_tostado_obtenido > 0),
    tipo_resultado text check (tipo_resultado in ('nibs', 'entero_tostado')) not null,
    notas text,
    responsable_id uuid references public.perfiles(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- 2. Trigger para procesar el tostado
  create or replace function public.procesar_registro_tostado()
  returns trigger security definer as $$
  declare
    v_producto_id uuid;
    v_nombre_producto text;
  begin
    -- 1. Actualizar el peso utilizado del lote
    update public.lotes 
    set peso_utilizado = peso_utilizado + new.peso_seco_utilizado
    where id = new.lote_id;

    -- 2. Definir el nombre del producto intermedio según el tipo
    if new.tipo_resultado = 'nibs' then
      v_nombre_producto := 'Nibs de Cacao';
    else
      v_nombre_producto := 'Cacao Tostado (Entero)';
    end if;

    -- 3. Buscar si el producto ya existe en el catálogo
    select id into v_producto_id from public.productos_catalogo where nombre = v_nombre_producto limit 1;

    -- 4. Si no existe, crearlo
    if v_producto_id is null then
      insert into public.productos_catalogo (nombre, descripcion, unidad_medida, stock_actual)
      values (
        v_nombre_producto, 
        'Materia prima intermedia proveniente del tostado. Listo para formulación de chocolates.', 
        'kg', 
        new.peso_tostado_obtenido
      ) returning id into v_producto_id;
    else
      -- Si existe, sumarle el stock
      update public.productos_catalogo 
      set stock_actual = stock_actual + new.peso_tostado_obtenido
      where id = v_producto_id;
    end if;

    return new;
  end;
  $$ language plpgsql;

  drop trigger if exists tr_procesar_tostado on public.registros_tostado;
  create trigger tr_procesar_tostado
  after insert on public.registros_tostado
  for each row execute procedure public.procesar_registro_tostado();

  -- 3. Seguridad RLS
  alter table public.registros_tostado enable row level security;

  drop policy if exists "Todos ven registros de tostado" on public.registros_tostado;
  drop policy if exists "Admins y Acopio insertan tostados" on public.registros_tostado;

  create policy "Todos ven registros de tostado" on public.registros_tostado for select to authenticated using (true);
  create policy "Admins y Acopio insertan tostados" on public.registros_tostado for insert to authenticated with check (public.get_user_role() in ('admin', 'acopio'));
