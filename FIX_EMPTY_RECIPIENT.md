# 🔧 Solución: "The recipients address is empty"

## 🔴 Error Detectado

```
Error: The recipients address is empty
Status: 422
```

**Causa:** La plantilla de EmailJS NO tiene configurado correctamente el campo del destinatario.

---

## ✅ Solución Paso a Paso

### **Paso 1: Ve a tu Plantilla en EmailJS**

1. Abre https://dashboard.emailjs.com/admin/templates
2. Busca y haz clic en la plantilla: **`template_3vc5pdh`**

---

### **Paso 2: Configurar "To Email" (CRÍTICO)**

En la sección **Settings** de la plantilla, busca el campo **"To Email"**:

#### ❌ **INCORRECTO (No funciona):**
```
luislituma22@gmail.com
```

#### ✅ **CORRECTO (Debe ser):**
```
{{to_email}}
```

**Importante:** 
- Debe tener **dobles llaves** `{{` y `}}`
- El nombre debe ser exactamente `to_email` (minúsculas, con guion bajo)
- NO debe ser un email fijo

---

### **Paso 3: Configurar otros campos de la plantilla**

#### **From Name:**
```
ASOPROMAS - Chocolate Kujeñito
```

#### **From Email:**
- Selecciona el email que configuraste en tu servicio
- O usa `{{company_email}}` si quieres que sea dinámico

#### **Subject:**
```
Confirmación de Pedido {{order_number}} - ASOPROMAS
```

#### **Reply To:**
```
{{company_email}}
```
O un email fijo:
```
luislituma22@gmail.com
```

---

### **Paso 4: Verificar campos en el contenido**

En el editor HTML de la plantilla, asegúrate de tener estos campos:

```html
{{to_email}}       ← Campo CRÍTICO para el destinatario
{{to_name}}        ← Nombre del cliente
{{order_number}}   ← Número de pedido
{{order_date}}     ← Fecha
{{products_list}}  ← Lista de productos
{{subtotal}}       ← Subtotal
{{iva}}            ← IVA
{{total}}          ← Total
{{company_email}}  ← Email de ASOPROMAS
```

---

## 📸 Captura de Pantalla - Configuración Correcta

En la sección **Settings** de tu plantilla, debe verse así:

```
┌─────────────────────────────────────────┐
│ Settings                                 │
├─────────────────────────────────────────┤
│                                          │
│ Service:  [Tu servicio Gmail/Outlook]   │
│                                          │
│ To Email: {{to_email}}        ← AQUÍ!   │
│           ^^^^^^^^^^                     │
│           IMPORTANTE                     │
│                                          │
│ From Name: ASOPROMAS - Chocolate...      │
│                                          │
│ Subject: Confirmación de Pedido...       │
│                                          │
│ Reply To: {{company_email}}              │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🧪 Probar Después de los Cambios

### **Opción 1: Con test-emailjs.html**

1. Abre `frontend/test-emailjs.html` en el navegador
2. Ingresa tu email en el campo "Email del Cliente"
3. Haz clic en "Enviar Email de Prueba"
4. **Debe aparecer:** ✅ "Email enviado exitosamente"
5. Revisa tu bandeja de entrada

### **Opción 2: Con la aplicación**

1. Recarga el navegador (F5) o reinicia el servidor
2. Agrega productos al carrito
3. Finaliza el pedido
4. Ingresa tu email
5. Enviar
6. ✅ Debe llegar el email

---

## 🔍 Verificación en EmailJS History

1. Ve a https://dashboard.emailjs.com/admin/history
2. Busca el último intento
3. **Antes del fix:**
   - ❌ Status: Failed (422)
   - ❌ Error: "The recipients address is empty"

4. **Después del fix:**
   - ✅ Status: Delivered (200)
   - ✅ Recipient: tu_email@ejemplo.com

---

## 💡 Por Qué Sucedió Esto

EmailJS necesita saber **a quién enviar el email**. Hay dos formas:

### ❌ **Forma Incorrecta (email fijo):**
```
To Email: luislituma22@gmail.com
```
- Todos los emails irían a este email fijo
- No sirve para enviar a diferentes clientes

### ✅ **Forma Correcta (email dinámico):**
```
To Email: {{to_email}}
```
- EmailJS usa el valor que le pasamos en el código
- Cada cliente recibe su email personalizado
- El código envía: `to_email: data.customerEmail`

---

## 🎯 Código que Envía los Datos

En `emailService.ts` (línea ~50):

```typescript
const templateParams = {
  to_email: data.customerEmail,  ← Aquí enviamos el email del cliente
  to_name: data.customerName,
  order_number: data.orderNumber,
  // ... más campos
};
```

**EmailJS recibe esto y busca `{{to_email}}` en la plantilla.**

Si en la plantilla pusiste un email fijo en lugar de `{{to_email}}`, EmailJS no sabe dónde poner el valor y da el error "recipients address is empty".

---

## ✅ Checklist Final

Después de hacer los cambios en la plantilla de EmailJS:

- [ ] To Email configurado como: `{{to_email}}`
- [ ] Subject incluye: `{{order_number}}`
- [ ] Contenido HTML incluye todas las variables necesarias
- [ ] Guardar cambios en EmailJS (botón Save)
- [ ] Probar con test-emailjs.html
- [ ] Verificar email en bandeja de entrada
- [ ] Probar desde la aplicación
- [ ] ✅ ¡Funciona!

---

## 🆘 Si Aún No Funciona

1. **Revisa que guardaste los cambios** en EmailJS (botón Save)
2. **Limpia caché del navegador** (Ctrl + Shift + Delete)
3. **Reinicia el servidor de desarrollo:**
   ```bash
   Ctrl + C
   npm run dev
   ```
4. **Verifica que el Template ID sea correcto:** `template_3vc5pdh`
5. **Revisa la consola del navegador** (F12) para ver errores
6. **Prueba con test-emailjs.html primero** (más fácil de depurar)

---

## 📧 Ejemplo de Plantilla Completa

Si quieres empezar desde cero, copia esto en una nueva plantilla:

### **Settings:**
- **To Email:** `{{to_email}}`
- **From Name:** `ASOPROMAS`
- **Subject:** `Pedido {{order_number}}`

### **Content:**
```html
<h1>Hola {{to_name}}!</h1>
<p>Tu pedido {{order_number}} ha sido recibido.</p>
<p>Fecha: {{order_date}}</p>

<h2>Productos:</h2>
<pre>{{products_list}}</pre>

<p><strong>Subtotal:</strong> {{subtotal}}</p>
<p><strong>IVA:</strong> {{iva}}</p>
<p><strong>Total:</strong> {{total}}</p>

<p>Te contactaremos pronto!</p>
<p>- ASOPROMAS ({{company_email}})</p>
```

Guarda y prueba. **Esto debería funcionar inmediatamente.** ✅

---

**El problema está 100% en la configuración de EmailJS, no en tu código.** 🎯

Haz el cambio en la plantilla y prueba de nuevo!
