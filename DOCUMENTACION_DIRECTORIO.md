# Documentación: Módulo de Directorio de Socios

Este documento sirve como "plano de construcción" (blueprint) para el futuro. Todas las funcionalidades avanzadas que construimos en la pantalla temporal del directorio (`SociosDirectorio.tsx`) han sido documentadas aquí para que puedan ser fácilmente trasladadas a la rama `feature` cuando la base de datos sea estricta.

## 1. Exportación Avanzada a Excel (`exceljs` + `file-saver`)
En lugar de un CSV básico, implementamos una exportación profesional:
- **Estilos:** Celdas de cabecera en color oscuro (Slate 700) con texto blanco y en negrita.
- **Diseño:** Filas alternadas (Gris/Blanco) para fácil lectura y bordes sutiles.
- **Numeración Dinámica:** Se inyecta una columna `#` al inicio que numera exactamente lo que el usuario está viendo en pantalla, ignorando IDs internos.
- *Uso futuro:* Esta función es 100% reciclable. Solo requiere recibir un arreglo de objetos JSON y una lista de cabeceras.

## 2. Generador de PDF con Previsualización en Vivo (`jspdf` + `jspdf-autotable`)
El sistema de PDF es el logro técnico más grande de la interfaz:
- **Generación Cliente:** No requiere servidor. El PDF se dibuja usando las coordenadas del navegador.
- **Personalización Dinámica:** Un modal permite elegir exactamente qué columnas se van a imprimir (ocultando por defecto columnas irrelevantes como la numeración vieja).
- **Doble Búfer (Double Buffering):** Para evitar el parpadeo negro de los navegadores al recargar un PDF, el código mantiene dos etiquetas `<iframe>`. Carga el nuevo PDF de forma invisible por 500ms y luego hace una transición suave de opacidad.
- *Uso futuro:* Se puede copiar íntegramente la función `generatePdfDoc` y el sistema de `previewUrls` a cualquier otra tabla (ej. Reporte de Ventas, Inventario).

## 3. Limpieza Automática de Datos (Auto-Corrector)
- **Normalización:** Las letras mayúsculas/minúsculas inconsistentes (ej. "zamora chinchipe", "ZAMORA") se auto-corrigen a mayúsculas absolutas antes de guardar.
- **Unificación de Términos:** Si un usuario escribe mal un término geográfico, un `useEffect` lo detecta y lo unifica (ej. "chinchipe" -> "ZAMORA CHINCHIPE").
- **Teléfonos:** A los números telefónicos ingresados sin el cero inicial se les inyecta un `0` automáticamente.

## 4. Datalist Inteligente (Autocompletar)
Para evitar ensuciar la base de datos futura:
- Se implementó la etiqueta HTML nativa `<datalist>`.
- Esta etiqueta extrae dinámicamente todos los valores *únicos* que ya existen en esa columna y los ofrece como sugerencias desplegables al escribir.
- Solo se activó mediante expresiones regulares para campos geográficos (`Provincia`, `Cantón`, `Parroquia`, `Comunidad`), evitando sugerir Cédulas o Nombres.

## 5. Seguridad y Permisos
- **Renderizado Condicional:** Las opciones destructivas (Importar CSV, Modificar Campos) están bloqueadas visualmente mediante código si el `user?.email` es diferente de `admin@asopromas.com`.
- Para evitar bugs de mayúsculas en correos, se aplica `.toLowerCase().trim()` al validar los permisos.

## ¿Cómo migrar esto a la rama Feature?
1. Cuando estemos en la rama `feature`, crearemos una tabla real llamada `socios` en Supabase con columnas estrictas (`cedula`, `nombres`, `provincia`, etc).
2. Importaremos el Excel perfecto que descargues desde esta herramienta.
3. Copiaremos literalmente el archivo `SociosDirectorio.tsx`. Lo único que cambiaremos será la consulta de carga (en vez de leer el JSON temporal, leerá `supabase.from('socios').select('*')`).
4. ¡Todas las funciones de PDF, Excel y Datalist seguirán funcionando idénticamente porque están programadas para ser genéricas!
