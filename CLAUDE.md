# Contexto Completo — ASOPROMAS (Sistema de Gestión Agrícola)

## Identidad de marca
Ver `BRAND.md` — consultar antes de tocar cualquier color, clase Tailwind o componente visual.

> **Instrucciones para la IA:** Este documento es el contexto de traspaso del proyecto ASOPROMAS. Fue generado en junio 2026 a partir de: (1) revisión directa del código fuente del repo `github.com/luislituma/asopromas`, y (2) sesión de análisis de modelo de negocio con el desarrollador. Refleja el estado real del sistema, no la documentación de versiones anteriores. Léelo completo antes de proponer código o cambios.

---

## 1. Visión General

ASOPROMAS (Asociación de Producción de Cacao y Derivados Aromas del Sur) es una cooperativa de ~200 familias productoras de cacao fino de aroma en Zamora Chinchipe, Ecuador. El sistema ERP cubre: socios y fincas, acopio de cacao, procesamiento a derivados, ventas, inventario, pagos y asistencia técnica. La cooperativa exporta y está sujeta a la regulación **EUDR** (obligatoria desde julio 2026 para exportar a la UE).

El mismo repositorio mezcla el **ERP interno** con contenido institucional/público (landing, catálogo Kujeñito). No son dos proyectos separados — es un mismo repo.

---

## 2. Stack Tecnológico

- **Frontend:** React + TypeScript, Vite
- **Estilos:** Tailwind CSS con paleta corporativa personalizada (ver abajo), íconos `lucide-react`
- **Backend/DB:** Supabase (PostgreSQL), Row Level Security, migraciones SQL numeradas (28 hasta la fecha)
- **PDFs:** `pdfmake` (client-side, vista previa antes de imprimir)
- **Enrutamiento:** `react-router-dom` con `ProtectedRoute` por rol
- **Despliegue:** Vercel

**Paleta Tailwind corporativa** (`tailwind.config.js`):

| Escala | Uso |
|---|---|
| `chocolate-*` | Base oscura del sitio. Header, fondos principales. `chocolate-950` (#2d1b14) es el tono más usado. |
| `cacao-green-*` | Verde selva/cacaotal. Elementos estructurales, botón "Reservar Ruta". |
| `cacao-gold-*` | Dorado del pod maduro. Accents de activación: underlines activos, hover borders, shine effect. Escalas: 300 (#F2C55C), 400 (#E8A830), 500 (#C8850A). |

> ⚠️ Existen documentos de planificación antiguos en `BASE/` que especifican Next.js + Laravel/NestJS y roles distintos. Ese stack **nunca se implementó** — ignorarlo.

---

## 3. Estructura Real del Repositorio

```
asopromas/
├── BASE/                        # Specs de planificación antiguos — NO vigentes
├── plan_claude.md               # Plan de fases antiguo — alcance desactualizado
├── frontend/
│   └── src/
│       ├── components/ui/       # Modales y componentes reutilizables
│       ├── contexts/            # AuthContext.tsx
│       ├── lib/                 # supabase.ts, pdfGenerator.ts
│       ├── pages/
│       │   ├── socios/          # ✅ ÚNICO MÓDULO SÓLIDO EN PRODUCCIÓN
│       │   ├── acopio/          # ⚠️ Iniciado, requiere rediseño parcial
│       │   ├── procesamiento/   # 🔴 Solo estructura, sin validar
│       │   ├── ventas/          # 🔴 Solo estructura, sin proceso real aún
│       │   ├── pagos/           # ⚠️ Parcial (~70%)
│       │   ├── inventario/      # ⚠️ Parcial (~80%)
│       │   ├── proyectos/       # ⚠️ Parcial (~70%)
│       │   ├── campo/           # ⚠️ Parcial
│       │   ├── dashboards/      # AdminDashboard, SocioDashboard, TecnicoDashboard
│       │   ├── auth/            # Login, perfil, reset password
│       │   └── about/           # Contenido institucional (landing/marketing)
│       └── types/
├── src/assets/images/certifications/  # Logos de certificaciones (4 archivos)
│   ├── certificacion-usda.jpg
│   ├── certificacion-organica-ecuador.png
│   ├── bpa.jpg
│   └── certificacion-uue.png
└── supabase/migrations/         # 27 migraciones SQL (01–27). La migración 28 está pendiente
```

**Sitio público — estado de páginas `about/` relevantes (junio 2026):**
- `Landing.tsx` — tiene sección 5 "Certificaciones" entre Catálogo y CTA: 4 logos en color, códigos de certificación bajo cada logo, hover scale, link a `/about/certifications`. Dato de cada logo definido en constante `CERTS` al inicio del archivo.
- `Certifications.tsx` — reescrita completamente (rama `certificaciones`): hero oscuro con overview de 4 logos en blanco, 4 tarjetas detalladas alternadas (logo + descripción + garantías + códigos como badges), banner EUDR con 3 métricas clave.
- Datos de certificación: `CERTS` array en cada archivo. Códigos vigentes: Orgánico Ecuador → `POA: 1125-4`, `POA KIWA: 001-AC`; UE → `EC-BIO-141`, `Ecuador Agriculture`.

**Archivos sueltos de debugging en `frontend/`** (candidatos a limpiar, no son parte de la app):
`check_carlos.ts`, `fix_data.ts`, `check_dups.mjs`, `test_crash.js`, `move_files.ps1`, `supabase_temporal.sql`, `get_communities.mjs`, `get_data.js`, `preview_lotes_update.mjs`

---

## 4. Roles del Sistema (confirmados en `App.tsx`)

`admin` | `tecnico` | `acopio` | `procesamiento`

---

## 5. Estado Real de Módulos

### ✅ Socios y Fincas — EL ÚNICO MÓDULO SÓLIDO Y EN PRODUCCIÓN

Es la única parte del sistema con datos reales (~200 socios), validada y en uso activo. **No modificar su esquema.** Cualquier módulo nuevo debe leer de aquí, nunca escribir.

**Esquema real confirmado:**

| Tabla | Campos clave |
|---|---|
| `socios` | id, cedula, nombres, apellidos, telefono, email, direccion, fecha_ingreso, estado (activo/inactivo/suspendido/eliminado), perfil_id, genero, etnia, banco_nombre, banco_cuenta, tipo_cacao, grupo_id, codigo_socio, enlace_documentos, motivo_eliminacion |
| `fincas` | id, socio_id, nombre, ubicacion, hectareas_totales, hectareas_cacao, variedades_cacao[], certificaciones[], latitud, longitud, certificada, estado, motivo_eliminacion |
| `lotes_finca` | id, finca_id, nombre_lote, variedad_cacao, hectareas_lote, ano_siembra, coord_x, coord_y, coord_z, poligono (GeoJSON) |
| `grupos_base` | Agrupación territorial de socios |

> ⚠️ `lotes_finca` **no tiene archivo de migración SQL** — se creó manualmente en Supabase. La migración 28 debe incluir su `CREATE TABLE` para cerrar esta deuda. Es la tabla que da la trazabilidad EUDR a nivel de parcela.

La jerarquía **Socio → Finca → Lote** con geolocalización es exactamente el modelo que exige el estándar EUDR para exportar a la UE. Está bien diseñada y no requiere cambios.

Funcionalidades del módulo: CRUD completo de socios, fincas, lotes. Exportación de fichas (`FincaExportModal`, `SocioPrintView`, `ReporteModal`). Aún faltan funcionalidades menores por implementar aquí, pero la base es sólida.

---

### ⚠️ Acopio — Iniciado, con brechas críticas confirmadas

El módulo tiene código y tablas conectadas a Supabase, pero el análisis del flujo real de planta reveló brechas importantes que deben resolverse antes de seguir construyendo encima:

**Esquema real de `lotes` (migraciones 04 + 13 + 07):**
```
id, codigo_lote, fecha_creacion, peso_total,
estado (abierto | cerrado | exportado | procesado),
peso_seco, fecha_procesado, peso_utilizado
```

**Lo que el sistema hace hoy vs. el proceso real de planta:**

| Etapa | Proceso físico real | Sistema actual |
|---|---|---|
| Recepción | Cacao llega en baba/húmedo. Encargado de acopio registra. Mezcla depende de cantidad/día. | ✅ `entregas_cacao` registra peso bruto, tara, merma, peso neto por entrega individual |
| **Trazabilidad % por socio** | Se necesita **kg exacto** por socio para EUDR. Una entrega puede repartirse entre 2+ cajones. | ❌ **No existe ninguna tabla para esto** — hoy en papel/Excel |
| **Fermentación** | Etapa real y separada, en cajones, con días contados y registrados. Un cajón se llena y cierra el mismo día. | ❌ No existe en el esquema — el sistema trata fermentación y secado como un solo paso "procesado" |
| Secado | Marquesina solar o secadora a gas, según disponibilidad. Se registra el método. | ⚠️ `peso_seco` existe, pero no hay campo de método (marquesina vs. gas) |
| Identificación de cajón | Hoy no hay código formal — se sabe cuál es físicamente | ❌ No existe. Diseñado: código automático `F-YYYY-MM-DD-NN` |
| Tostado | Convierte cacao seco a Nibs o Cacao Tostado Entero | ✅ `registros_tostado` con trigger automático → `productos_catalogo` |

**Hallazgo arquitectónico importante:** dentro de `LoteDetalle.tsx` (que vive en `pages/acopio/`) ya existe un modal de Tostado que escribe a `registros_tostado`, y hay un trigger SQL `procesar_registro_tostado` que automáticamente crea/actualiza productos en `productos_catalogo`. Acopio y Procesamiento ya están conectados por debajo aunque las carpetas los separen.

---

### 🔴 Procesamiento y Ventas — Solo estructura, sin proceso real

- Tienen tablas en base de datos, pantallas conectadas a Supabase y rutas registradas en el router.
- **Confirmado por el desarrollador:** son ideas en desarrollo. El flujo de negocio real de ventas aún no existe en la práctica — es trabajo a futuro.
- **No invertir en completar estos módulos** hasta que haya un proceso de ventas real que definir.
- El trigger de tostado existente puede quedarse como está por ahora.

---

### ⚠️ Pagos (~70%), Inventario (~80%), Proyectos/Campo (~70%)

Parcialmente implementados, en uso limitado. No son prioridad inmediata frente a las brechas de Acopio.

---

## 6. Reglas de Negocio y Convenciones de Código

1. **Peso húmedo ≠ peso seco:** el sistema exige ingresar manualmente el peso neto seco al cerrar un lote — nunca calcular automáticamente desde el peso en baba.
2. **UI (ERP interno):** cards con `rounded-2xl`/`rounded-3xl`, `shadow-sm`, `transition-colors`, `hover:-translate-y-1`.
3. **Carga/errores:** `animate-spin`, alertas claras, modales con `backdrop-blur-sm`.
4. **UI (sitio público/Header):** fondo **invertido** `chocolate-50` (#f9f6f3, crema) con textos oscuros `chocolate-700/900/950`. El header dejó de ser oscuro — cualquier ajuste debe mantener esta inversión. Logo: `brightness-0` (negro sobre crema). Semántica de color: `cacao-gold-500` = activación/link activo (versión oscura del dorado, necesaria en fondo claro), verde = estructura/naturaleza, `chocolate-950` = texto principal. Submenú (desktop y drawer móvil) también en `chocolate-50` con misma paleta. Etiquetas de sección del submenú eliminadas (sin "Historia", "Comunidad", etc. — solo ítems directos). Botón "Reservar Ruta": gradiente `cacao-green-600→800`, borde `chocolate-800/40`, ícono `Leaf`, shine effect animado CSS (`animate-shine`, keyframe en config). Gap nav desktop: `gap-[35px]`. No usar `emerald`/`amber`/`slate` en el sitio público — todo va por la paleta corporativa custom. **Hero parallax (`Landing.tsx`):** `scale [1.05, 1.15]`, `y ["0%", "-7%"]`, sin fade de opacidad en el video (el motion.div del video NO tiene `opacity` en su `style`). El indicador de scroll (`w-px h-16`) fue eliminado permanentemente. El estado `isScrolled` y su `useEffect`/listener también fueron eliminados de `Header.tsx` — no reintroducirlos a menos que haya un uso real en el JSX.
4. **Base de datos:** cliente JS de Supabase (`supabase.from('tabla').select(...)`), joins anidados vía claves foráneas.
5. **PDFs:** siempre con vista previa (`pdfmake` en iframe). `pdfGenerator.ts` es un "God Object" — no agregar más reportes ahí, separar por tipo.
6. **Migraciones:** todo cambio de esquema va en un archivo `.sql` numerado en `supabase/migrations/`. Nunca crear tablas directamente en el panel de Supabase (deuda existente: `lotes_finca`).

---

## 7. Deuda Técnica Existente

| Deuda | Urgencia |
|---|---|
| `lotes_finca` sin migración SQL | Alta — riesgo de pérdida de esquema |
| `pdfGenerator.ts` como God Object | Media |
| Paginación en listas (carga todo de golpe) | Media |
| Migraciones manuales sin CLI/CI-CD | Baja |
| Archivos de debugging sueltos en `frontend/` | Baja |
| Documentos de planificación obsoletos en `BASE/` y `plan_claude.md` | Baja |

---

## 8. Variables de Entorno

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

## 9. Decisiones Técnicas Clave

- **`pdfmake`:** genera PDFs client-side, sin servidor dedicado — ahorro de costos de infraestructura.
- **Migraciones SQL numeradas:** infraestructura como código, historial limpio, reproducible.
- **Supabase en lugar de Laravel/NestJS:** el spec original planificó otro stack que nunca se implementó — ignorar esa documentación.

---

## 10. Prioridades de Desarrollo (orden acordado)

### Prioridad 1 — URGENTE: Trazabilidad porcentual por socio ✏️ DISEÑO CERRADO

**Qué es:** tabla muchos-a-muchos que registra cuántos kg de cada entrega van a cada cajón de fermentación. Es el requisito de datos más crítico para cumplir EUDR.

**Tabla nueva a crear (migración 28 o 29):**
```sql
create table public.entrega_lote_origen (
  id uuid primary key default gen_random_uuid(),
  entrega_id uuid not null references public.entregas_cacao(id),
  lote_id uuid not null references public.lotes(id),
  peso_kg numeric not null check (peso_kg > 0),
  created_at timestamptz not null default now(),
  created_by uuid references public.perfiles(id)
);

create index idx_entrega_lote_origen_entrega on public.entrega_lote_origen(entrega_id);
create index idx_entrega_lote_origen_lote on public.entrega_lote_origen(lote_id);
```

**Regla de validación (trigger en DB, no solo en frontend):**
```sql
create or replace function public.validar_peso_entrega_lote_origen()
returns trigger as $$
declare
  v_peso_neto numeric;
  v_suma_actual numeric;
begin
  select peso_neto into v_peso_neto
  from public.entregas_cacao
  where id = new.entrega_id;

  select coalesce(sum(peso_kg), 0) into v_suma_actual
  from public.entrega_lote_origen
  where entrega_id = new.entrega_id
    and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

  if (v_suma_actual + new.peso_kg) > v_peso_neto then
    raise exception 'La suma de los repartos (%) excede el peso neto de la entrega (%)',
      (v_suma_actual + new.peso_kg), v_peso_neto;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_validar_peso_entrega_lote_origen
before insert or update on public.entrega_lote_origen
for each row execute function public.validar_peso_entrega_lote_origen();
```

**Código automático de lote:** formato `F-YYYY-MM-DD-NN` (NN = consecutivo que reinicia cada día). Implementar en `lotes` al momento de crear un lote nuevo.

**Flujo de UI esperado:**
1. Encargado registra entrega normal (sin cambios en ese flujo)
2. Al asignar a cajón, el sistema pide cuántos kg van a cada lote
3. Muestra en vivo "Quedan X kg por asignar" hasta llegar a cero
4. El trigger bloquea si se intenta guardar más kg de los que tiene la entrega
5. En detalle del lote: desglose de socios con kg y % calculado en vivo

**Pendientes técnicos al implementar (no son decisiones de negocio):**
- Confirmar si `created_by` se llena automáticamente desde la sesión
- Decidir si agregar `unique(entrega_id, lote_id)` o permitir múltiples filas
- Decidir si el código `F-YYYY-MM-DD-NN` se genera en trigger `before insert` o como columna con `default`

---

### Prioridad 2 — Fermentación como etapa propia 📋 PENDIENTE DISEÑO

Agregar a `lotes` los campos de fermentación como etapa separada:
- `fecha_inicio_fermentacion`, `fecha_fin_fermentacion`, `dias_fermentacion` (calculado)
- Posiblemente: identificador de cajón físico (si tienen más de uno en paralelo)
- El estado actual `(abierto | procesado)` necesita revisión para incluir `en_fermentacion | en_secado`

*Requiere sesión de análisis adicional antes de implementar.*

---

### Prioridad 3 — Método de secado 📋 PENDIENTE DISEÑO

Agregar a `lotes` un campo `metodo_secado` (enum: `marquesina_solar | secadora_gas | ambos`). Es el cambio más pequeño de los tres pero igualmente importante para trazabilidad EUDR.

---

### Prioridad 4 — Migración faltante de `lotes_finca`

Generar el `CREATE TABLE lotes_finca` como migración SQL versionada, a partir del esquema vivo en Supabase. No crea nada nuevo — solo documenta lo que ya existe.

---

### En pausa (no iniciar todavía)

- **Procesamiento/Ventas:** sin proceso de ventas real definido, no tiene sentido pulir estas pantallas.
- **Reporte demográfico de socios** (18-35, 35-65, >65): solicitado previamente, no iniciado.
- **Notificaciones automáticas** (ej. al cerrar un lote): depende de que Acopio esté más maduro.
- **Paginación en listas.**

---

## 11. Cómo mantener este documento actualizado

Cuando termines una tarea importante, pídele a la IA:

```
Actualiza CLAUDE.md con el siguiente avance.
Solo modifica lo que cambió, no reescribas el resto:

LO QUE HICE: [1-3 líneas]
AFECTA A: [módulo(s)]

Actualiza según corresponda:
- Estado del módulo en sección 5
- Si se resolvió deuda técnica, quítala de sección 7
- Si se completó una prioridad, márcala como ✅ en sección 10
- Si surgió deuda nueva, agrégala a sección 7
- Si tomaste una decisión técnica nueva, agrégala a sección 9
```

---
*(Generado en sesión de análisis — junio 2026)*
