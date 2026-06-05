# Plan de implementación — Sistema de gestión ASOPROAMS

**Organización:** ASOPROAMS (Asociación de Producción de Cacao y Derivados Aromas del Sur)  
**Stack:** React + TypeScript · Supabase · Tailwind CSS · Vite · Vercel  
**Herramienta de desarrollo:** Claude Code (Plan Pro)  
**Total de tareas:** 24 tareas en 4 fases  
**Duración estimada:** 9 a 13 semanas  

---

## Resumen de fases

| Fase | Módulo | Duración estimada |
|------|--------|-------------------|
| 1 | Base del sistema (Supabase + auth + socios) | 2–3 semanas |
| 2 | Dashboards por rol | 2–3 semanas |
| 3 | Producción e inventario | 3–4 semanas |
| 4 | Finanzas y reportes | 2–3 semanas |

> Cada fase es desplegable de forma independiente. Al terminar la Fase 1 ya tienes un sistema funcional en producción.

---

## Fase 1 — Base del sistema
**Duración:** 2–3 semanas  
**Objetivo:** Tener login funcional, roles configurados y los 200 socios registrables en la plataforma.

### Tareas

- [ ] Configurar proyecto Supabase (BD, Storage, Auth)  
  `Supabase`

- [ ] Diseñar schema SQL: tablas de usuarios, roles, socios y fincas  
  `Supabase`

- [ ] Implementar Row Level Security (RLS) por rol  
  `Supabase` `Auth/Roles`

- [ ] Sistema de login con roles: admin, técnico de campo, socio  
  `Frontend` `Auth/Roles`

- [ ] Módulo de registro y perfil de socios (200 miembros)  
  `Frontend` `Supabase`

- [ ] Listado de socios con búsqueda y filtros  
  `Frontend`

### Entregable de fase
Sistema desplegado en Vercel con autenticación funcional y gestión básica de socios.

---

## Fase 2 — Dashboards por rol
**Duración:** 2–3 semanas  
**Objetivo:** Cada usuario ve una interfaz adaptada a su rol con la información relevante para su trabajo.

### Tareas

- [ ] Dashboard admin: resumen general y KPIs de la organización  
  `Frontend` `Lógica`

- [ ] Dashboard técnico: asignaciones y registro de visitas de campo  
  `Frontend` `Lógica`

- [ ] Dashboard socio: mi producción y mis pagos  
  `Frontend` `Auth/Roles`

- [ ] Navegación y guards de ruta por rol  
  `Frontend` `Auth/Roles`

- [ ] Componentes compartidos: tablas, cards, notificaciones  
  `Frontend`

### Entregable de fase
Tres vistas diferenciadas funcionales según el rol del usuario autenticado.

---

## Fase 3 — Producción e inventario
**Duración:** 3–4 semanas  
**Objetivo:** Registrar y trazabilizar toda la cadena productiva del cacao, desde la cosecha hasta los productos derivados.

### Tareas

- [ ] Registro de cosecha por socio (fecha, peso, calidad)  
  `Frontend` `Supabase`

- [ ] Control de lotes: trazabilidad del cacao en grano  
  `Supabase` `Lógica`

- [ ] Inventario de productos derivados y chocolate  
  `Frontend` `Supabase`

- [ ] Alertas de stock mínimo por producto  
  `Lógica`

- [ ] Historial de producción por socio y período  
  `Frontend` `Reportes`

- [ ] Integración con módulo financiero (cálculo de pago por kg entregado)  
  `Lógica` `Supabase`

### Entregable de fase
Registro completo de cosechas, lotes e inventario con cálculo automático de valor por entrega.

---

## Fase 4 — Finanzas y reportes
**Duración:** 2–3 semanas  
**Objetivo:** Gestionar los pagos a socios y generar reportes exportables para la directiva y contabilidad.

### Tareas

- [ ] Módulo de liquidaciones: pago a socios por entrega  
  `Lógica` `Supabase`

- [ ] Historial de pagos por socio con estado (pendiente / pagado)  
  `Frontend` `Supabase`

- [ ] Reportes financieros por período (ingresos, egresos)  
  `Reportes`

- [ ] Exportación a PDF y Excel (reportes y liquidaciones)  
  `Reportes`

- [ ] Reporte de producción total por temporada  
  `Reportes`

- [ ] Panel de auditoría para directiva (solo lectura)  
  `Frontend` `Auth/Roles`

### Entregable de fase
Sistema completo con liquidaciones automatizadas y reportes exportables para directiva y contabilidad.

---

## Roles del sistema

| Rol | Acceso |
|-----|--------|
| Admin | Acceso total: socios, producción, inventario, finanzas, reportes |
| Técnico de campo | Registro de cosechas, visitas, estado de socios |
| Socio | Vista de su propia producción, historial de pagos |
| Directiva (auditoría) | Solo lectura en reportes financieros y de producción |

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend / BD | Supabase (PostgreSQL + Auth + Storage + RLS) |
| Despliegue | Vercel (CI/CD automático desde GitHub) |
| Repositorio | github.com/luislituma/asoproams |
| Desarrollo asistido | Claude Code (Plan Pro $20/mes) |

---

## Notas de implementación

- **Desarrollar en orden de fases.** La Fase 2 requiere los roles de la Fase 1. La Fase 3 requiere socios registrados. La Fase 4 requiere datos de producción.
- **Desplegar al terminar cada fase.** No acumular código sin probar en producción.
- **Variables de entorno.** Nunca hardcodear credenciales de Supabase, claves de API ni datos sensibles en el repositorio.
- **RLS desde el inicio.** Configurar Row Level Security en Supabase antes de conectar el frontend, no como paso posterior.
- **Claude Code — límite de 5 horas.** Con Plan Pro las sesiones tienen una ventana rotativa de 5 horas. Planificar las sesiones por módulo para no perder contexto a mitad de una tarea compleja.

---

*Generado con Claude — Anthropic*  
*ASOPROAMS · Zamora Chinchipe, Ecuador*
