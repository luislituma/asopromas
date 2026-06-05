# SISTEMA INTEGRAL DE GESTIÓN ASOPROMAS

## Documento de Levantamiento de Requerimientos Funcionales V1

### Información General

**Organización:** Asociación de Producción de Cacao y Derivados Aromas del Sur (ASOPROMAS)

**Actividad principal:**
Producción, acopio, transformación, comercialización y exportación de cacao y derivados.

**Número aproximado de socios:** 200

**Ubicación principal:** San Antonio Zumbi, Centinela del Cóndor, Zamora Chinchipe, Ecuador.

---

# 1. OBJETIVO DEL SISTEMA

Desarrollar un sistema web integral que permita administrar las operaciones de ASOPROMAS relacionadas con:

* Gestión de socios.
* Gestión de fincas.
* Acopio de cacao.
* Pagos a productores.
* Trazabilidad.
* Inventario.
* Producción.
* Ventas.
* Proyectos.
* Capacitaciones.
* Certificación orgánica.
* Gestión documental.
* Exportaciones.

El sistema debe centralizar información que actualmente se encuentra distribuida entre archivos físicos, hojas de cálculo Excel y registros manuales.

---

# 2. ESTRUCTURA ORGANIZACIONAL

La organización está compuesta por:

## Junta General

Máxima autoridad de la organización.

## Junta Directiva

* Presidente
* Secretario
* Vocales

## Junta de Vigilancia

Responsable de supervisión y control.

## Personal Operativo

* Administradora
* Contadora
* Encargado de Acopio
* Encargado de Procesamiento
* Encargado de Proyectos

## Organización Territorial

La asociación se divide en grupos base.

Actualmente existen aproximadamente 16 grupos base.

Cada grupo base posee:

* Presidente de grupo base.
* Socios asignados.

---

# 3. ROLES DEL SISTEMA

## Super Administrador

Responsable técnico del sistema.

## Administradora

Control general de la organización.

## Contadora

Control financiero y contable.

## Encargado de Acopio

Gestión de recepción de cacao.

## Encargado de Procesamiento

Gestión de producción e inventario.

## Encargado de Proyectos

Gestión de proyectos, capacitaciones e insumos.

## Presidente de Grupo Base

Consulta información de su grupo.

## Junta de Vigilancia

Acceso a información para supervisión.

## Socio

Consulta de información personal.

---

# 4. MÓDULOS DEL SISTEMA

## Módulo de Socios

Permite:

* Registrar socios.
* Actualizar información.
* Gestionar estados.
* Gestionar datos bancarios.
* Asignar grupos base.
* Consultar historial.

Información mínima:

* Código de socio.
* Cédula.
* Nombres.
* Apellidos.
* Género.
* Etnia.
* Teléfono.
* Correo.
* Dirección.
* Banco.
* Cuenta bancaria.
* Fecha de ingreso.
* Estado.
* Tipo de cacao.

---

## Módulo de Fincas

Cada socio puede tener una o varias fincas.

Información:

* Código de finca.
* Nombre.
* Hectáreas totales.
* Hectáreas de cacao.
* Tipo de cacao.
* Ubicación.
* Coordenadas.
* Estado de certificación.

---

## Módulo de Acopio

Proceso actual:

1. Coordinación con socio o grupo base.
2. Programación de fecha y transporte.
3. Recepción del cacao.
4. Pesaje.
5. Emisión de recibo.
6. Firma de responsable y socio.
7. Traslado al centro de acopio.
8. Registro en sistema.
9. Envío a contabilidad.
10. Pago.
11. Cierre.

El sistema debe permitir:

* Crear jornadas de acopio.
* Registrar entregas.
* Generar recibos.
* Asociar finca.
* Asociar lote.
* Consultar historial.

---

## Módulo de Pagos

Permite:

* Registrar pagos.
* Aplicar descuentos.
* Registrar deudas.
* Generar comprobantes.
* Consultar historial.

Debe permitir descuentos por:

* Insumos.
* Préstamos.
* Acuerdos especiales.

---

## Módulo de Trazabilidad

Permite:

* Crear lotes.
* Asociar entregas.
* Rastrear origen.
* Vincular exportaciones.
* Cumplir requisitos de certificación orgánica.

---

## Módulo de Inventario

Control de:

* Materia prima.
* Producto terminado.
* Insumos.
* Materiales.

Funciones:

* Entradas.
* Salidas.
* Ajustes.
* Transferencias.

Múltiples bodegas.

---

## Módulo de Producción

Productos actuales:

* Barra de chocolate 65% café.
* Barra de chocolate 65% nibs y sal.
* Barra de cacao 100%.
* Bombones.
* Nibs.
* Manteca de cacao.
* Licor dulce de cacao.
* Cóctel de cacao.
* Cacao seco nacional.
* Cacao seco ancestral.

Funciones:

* Recetas.
* Órdenes de producción.
* Producción por inventario.
* Producción por pedido.
* Control de consumo de materia prima.

---

## Módulo Comercial

Tipos de clientes:

* Consumidor final.
* Socio.
* Tienda.
* Distribuidor.
* Empresa.

Funciones:

* Registro de clientes.
* Ventas.
* Facturación.
* Créditos.
* Descuentos.
* Cobros.

---

## Módulo de Proyectos

Permite:

* Registrar proyectos.
* Instituciones financiadoras.
* Presupuesto.
* Actividades.
* Beneficiarios.
* Informes.

---

## Módulo de Insumos

Permite:

* Registro de insumos.
* Entrega a socios.
* Entrega mediante proyectos.
* Financiamiento.
* Control de deudas.

---

## Módulo de Capacitaciones

Permite:

* Programar capacitaciones.
* Registrar asistencia.
* Generar historial por socio.
* Relacionar capacitaciones con proyectos.

---

## Módulo de Certificación Orgánica

Debe contemplar la posibilidad de crecimiento futuro para registrar:

* Inspecciones.
* Fertilización.
* Desmalezado.
* Control de enfermedades.
* Plantas asociadas.
* Mapas de finca.
* Visitas técnicas.
* Auditorías.
* Certificaciones.

Inicialmente se implementará principalmente consulta e historial.

---

## Módulo de Exportaciones

Permite:

* Registrar exportaciones.
* Asociar lotes.
* Asociar clientes internacionales.
* Registrar destinos.
* Consultar historial.

---

## Módulo Documental

Permite almacenar:

* Actas.
* Convenios.
* Permisos.
* Certificados.
* Contratos.
* Informes.
* Documentos institucionales.

---

# 5. PORTAL DEL SOCIO

Cada socio tendrá usuario y contraseña.

Podrá consultar:

* Información personal.
* Datos de finca.
* Entregas de cacao.
* Pagos recibidos.
* Historial de capacitaciones.
* Certificaciones.
* Deudas por insumos.
* Documentos disponibles.

Podrá modificar únicamente:

* Teléfono.
* Correo electrónico.

---

# 6. REGLAS IMPORTANTES

* No se eliminarán registros críticos.
* Los registros podrán anularse.
* Todo cambio debe quedar auditado.
* Registrar usuario, fecha y hora de cada modificación.
* Mantener historial completo de operaciones.

---

# 7. TECNOLOGÍA SUGERIDA

Arquitectura Web:

Frontend:

* React
* Next.js

Backend:

* Laravel o NestJS

Base de Datos:

* PostgreSQL

Autenticación:

* Roles y permisos

Infraestructura:

* VPS o nube

---

# 8. VISIÓN FUTURA

Fase 1:

* Socios.
* Fincas.
* Acopio.
* Pagos.
* Inventario.
* Producción.
* Ventas.

Fase 2:

* Proyectos.
* Capacitaciones.
* Insumos.
* Portal del socio.

Fase 3:

* Certificación orgánica completa.
* Aplicación móvil.
* Integración contable.
* Facturación electrónica.
* Reportes avanzados.
* Integración con exportaciones.
