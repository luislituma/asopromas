# Contexto del Proyecto "Asopromas" (Sistema de Gestión Agrícola)

> **Instrucciones para la IA:** Eres un asistente experto en desarrollo web. A continuación, te presento el contexto completo, la arquitectura y el estado actual de mi proyecto llamado "Asopromas". Lee detenidamente esta información antes de comenzar a ayudarme o proponer código, para mantener la coherencia con lo que ya está construido.

---

## 1. Visión General
"Asopromas" es un sistema de gestión integral (ERP/CRM agrícola) diseñado para una Asociación de Productores (enfocada principalmente en cacao). El sistema permite controlar desde la información de los socios y sus fincas, hasta la recepción del cacao, su procesamiento (fermentación y secado), trazabilidad, manejo de inventario, pagos y asistencia técnica/capacitaciones.

## 2. Stack Tecnológico
* **Frontend:** React + TypeScript, empaquetado con Vite.
* **Estilos:** Tailwind CSS (uso de utilidades de Tailwind, colores personalizados corporativos como `emerald`, `amber`, `slate`). Íconos provistos por `lucide-react`.
* **Backend y Base de Datos:** Supabase (PostgreSQL). Se utilizan scripts de migraciones SQL para definir el esquema.
* **Generación de Reportes/PDFs:** `pdfmake` (se generan vistas previas en un iframe o se abren en pestañas nuevas).
* **Enrutamiento:** `react-router-dom`.

## 3. Arquitectura y Estructura del Código
El proyecto es un monorepo (o repositorio único) con la siguiente estructura principal:
* `frontend/src/`
  * `components/ui/`: Componentes reutilizables y modales (ej. `PDFPreviewModal`, `CloseLoteModal`, `StartFermentacionModal`).
  * `lib/`: Utilidades core (ej. `supabase.ts` para el cliente, `pdfGenerator.ts` para los reportes).
  * `pages/`: Vistas de la aplicación agrupadas por módulo (`acopio`, `socios`, `inventario`, `proyectos`, `pagos`, `campo`, `products`).
* `supabase/migrations/`: Carpeta con los scripts `.sql` ordenados numéricamente (ej. `12_acopio_fases_schema.sql`) que construyen el esquema de la base de datos.

## 4. Módulos Principales (Estado Actual)

### A. Gestión de Socios y Fincas
* Registro de socios (datos personales, contacto).
* Cada socio puede tener múltiples **Fincas**, y cada finca tiene múltiples **Lotes de Finca** (polígonos, hectáreas, variedades de cacao).

### B. Acopio (Recolección y Recepción)
* **Lotes de Acopio:** Es la agrupación del cacao recibido. Flujo de trabajo tipo *Kanban*:
  1. **Abierto (Recibiendo):** Se registran las *Entregas de Acopio*.
  2. **Fermentación:** Se pasa el cacao a cajones. Ya no recibe entregas. Se registra la `fecha_inicio_fermentacion`.
  3. **Secado:** Se pasa a las marquesinas solares o secadoras a gas. Se registra la `fecha_inicio_secado` y el `metodo_secado`.
  4. **Cerrado (Bodega):** El grano está listo. Se registran `% de humedad`, `% de fermentación`, y el `peso_neto_seco_kg` final.
* **Entregas de Acopio:** Recibos individuales de cada socio al entregar su cacao (baba o seco). Se calcula peso bruto, tara, merma, peso neto, unidad de medida (kg/lbs), precio por unidad y total a pagar.
* **Trazabilidad:** Cada entrega se vincula (mediante la tabla `entregas_lotes_origen`) a porcentajes específicos de las fincas y lotes del socio que hizo la entrega.

### C. Pagos y Liquidación
* Las entregas tienen un `estado_pago` ("Pagado" o "Pendiente").
* Existe un módulo de liquidación para procesar los pagos acumulados de los socios.

### D. Reportes (PDFs)
* Todo recibo de entrega o reporte de cierre de lote genera un PDF.
* Los PDFs se construyen dinámicamente con `pdfmake` y siempre deben tener la opción de **Vista Previa** antes de imprimirse o descargarse.

### E. Inventario, Proyectos y Campo
* **Inventario:** Gestión de insumos agrícolas y asignación/entrega de los mismos a los socios.
* **Proyectos/Campo:** Registro de visitas técnicas a las fincas y asistencia a capacitaciones.

## 5. Reglas de Negocio y Convenciones
1. **Flexibilidad en el peso:** El peso húmedo (baba) nunca es igual al peso seco final debido a la merma por humedad y fermentación. El sistema exige ingresar manualmente el peso neto seco final al cerrar un lote de acopio.
2. **UI/UX Moderno:** Todas las interfaces deben ser limpias, usar *cards* con bordes redondeados (`rounded-2xl` o `rounded-3xl`), sombras sutiles (`shadow-sm`), y tener transiciones suaves (`transition-colors`, `hover:-translate-y-1`).
3. **Manejo de Errores/Cargas:** Uso de animaciones de carga (`animate-spin` con bordes del color primario `emerald`) y alertas informativas claras. Se usan Modales superpuestos con fondo desenfocado (`backdrop-blur-sm`).
4. **Base de Datos:** Se acceden a los datos usando el cliente JS de Supabase (`supabase.from('tabla').select(...)`). Las uniones de tablas (joins) se hacen en la misma consulta anidada gracias a las claves foráneas (ej. `responsable:perfiles(nombre_completo)`).

## 6. Estado de Avance por Módulo
* **Socios y Fincas:** Completo (100%). CRUD de socios, fincas, lotes de fincas y registro de polígonos/coordenadas.
* **Acopio y Trazabilidad:** Completo (100%). Flujo Kanban (Recepción -> Fermentación -> Secado -> Bodega), cálculo automático de mermas, control de peso seco y trazabilidad porcentual desde la finca.
* **Pagos:** Parcial (~70%). Se marcan entregas como "Pagado" o "Pendiente" y existe pantalla de liquidación. Falta automatizar cruces de caja o conexión con facturación electrónica si fuera necesario.
* **Inventario e Insumos:** Parcial (~80%). Existe el registro y la asignación a socios. Falta implementar alertas automáticas de bajo stock o integrarlo con costos/contabilidad.
* **Proyectos y Campo:** Parcial (~70%). Se pueden registrar capacitaciones y visitas técnicas en campo. Falta desarrollar dashboards de impacto y reportería analítica avanzada.

## 7. Problemas Conocidos y Deuda Técnica
* **Paginación:** La mayoría de las listas (ej. `AcopiosList`, `Entregas`) cargan todos los registros de golpe. A futuro, con miles de registros, esto ralentizará la UI. Se debe implementar paginación (offset) o infinite scroll.
* **Generación de PDFs:** El archivo `pdfGenerator.ts` ha crecido mucho (es un "God Object"). Deuda técnica pendiente: separar este archivo en módulos más pequeños (uno por cada tipo de reporte).
* **Sincronización DB:** Los scripts de migración SQL se están ejecutando manualmente en el panel de Supabase. Lo ideal sería automatizar esto usando el CLI de Supabase en un pipeline CI/CD.

## 8. Próximos Pasos (En el tintero)
* Implementar el **Reporte Demográfico de Edades** (agrupar socios por 18-35, 35-65, >65) que fue solicitado anteriormente pero aún no iniciado.
* Desarrollar el sistema de notificaciones o correos automáticos (ej. notificar al administrador cuando un lote pasa a estado "Cerrado").
* Refactorizar las listas para soportar paginación.

## 9. Variables de Entorno Necesarias
Para correr este proyecto en local o producción, es necesario crear un archivo `.env` o `.env.local` con las siguientes claves:
* `VITE_SUPABASE_URL`
* `VITE_SUPABASE_ANON_KEY`

## 10. Decisiones Técnicas Clave y Motivos
* **Por qué `pdfmake`:** Se eligió porque permite generar documentos complejos y tablas directamente en el navegador del usuario (Client-Side). Esto elimina la necesidad de tener un servidor Node.js/Python dedicado solo para generar y servir PDFs, ahorrando costos de servidor.
* **Por qué Migraciones SQL Numeradas:** En lugar de crear tablas a mano en la interfaz de Supabase, decidimos usar archivos SQL (ej. `01_...`, `02_...`). El motivo es tener "Infraestructura como Código", permitiendo que cualquier desarrollador pueda levantar la base de datos exacta desde cero, mantener un historial limpio y evitar discrepancias entre entornos (desarrollo vs producción).
* **Por qué un diseño tipo "Kanban" para Acopio:** Se adoptó porque refleja fielmente el mundo físico. El cacao pasa por etapas secuenciales que toman días (recibido -> fermentación -> secado). Una vista de columnas permite al encargado de planta saber exactamente dónde está el cuello de botella visualmente.

---
*(Fin del Contexto)*
**[Usuario]**: Hola, basándote en este contexto, necesito que me ayudes a implementar lo siguiente...
