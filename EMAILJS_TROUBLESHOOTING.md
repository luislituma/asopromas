# 🔍 Checklist de Verificación - EmailJS

## ✅ Configuración Actualizada

### **Credenciales en el Código:**
```typescript
SERVICE_ID: 'service_rc3f9e7'
TEMPLATE_ID: 'template_3vc5pdh'
PUBLIC_KEY: 'dOXxZUCQTP-kLZr92'
```

**Estado:** ✅ Configurado correctamente en `emailService.ts`

---

## 🧪 Archivo de Prueba Creado

**Ubicación:** `frontend/test-emailjs.html`

**Cómo usar:**
1. Abre el archivo en tu navegador (doble clic)
2. Verifica que aparezca "✅ EmailJS inicializado correctamente"
3. Ingresa un email de prueba
4. Clic en "Enviar Email de Prueba"
5. Revisa la consola del navegador (F12) para ver mensajes

---

## 🎯 Verificar en EmailJS Dashboard

### **Paso 1: Verificar Service ID**
1. Ve a https://dashboard.emailjs.com/admin
2. Haz clic en **"Email Services"** (menú izquierdo)
3. Verifica que exista un servicio con ID: **`service_rc3f9e7`**
4. ✅ Si existe → Continúa
5. ❌ Si NO existe → Copia el Service ID correcto del servicio activo

### **Paso 2: Verificar Template**
1. En el dashboard, haz clic en **"Email Templates"**
2. Busca la plantilla con ID: **`template_3vc5pdh`**
3. ✅ Si existe → Continúa al Paso 3
4. ❌ Si NO existe → Necesitas crear la plantilla

### **Paso 3: Verificar Campos de la Plantilla**

**Abre la plantilla y verifica que tenga EXACTAMENTE estos campos:**

#### **Subject (Asunto):**
```
Confirmación de Pedido {{order_number}} - ASOPROMAS
```

#### **Content (Cuerpo del Email):**

La plantilla debe incluir estas variables:

```
{{to_name}}          → Nombre del cliente
{{order_number}}     → Número de pedido
{{order_date}}       → Fecha del pedido
{{products_list}}    → Lista de productos
{{subtotal}}         → Subtotal
{{iva}}              → IVA (12%)
{{total}}            → Total
{{company_email}}    → Email de ASOPROMAS
```

#### **To Email (Destinatario):**
```
{{to_email}}
```

---

## 🚨 Errores Comunes y Soluciones

### **Error: "Template ID not found"**
**Causa:** El ID de la plantilla no coincide
**Solución:**
1. Ve a Email Templates en EmailJS
2. Haz clic en tu plantilla
3. Copia el Template ID (esquina superior derecha)
4. Actualiza `TEMPLATE_ID` en `emailService.ts`

### **Error: "Service ID not found"**
**Causa:** El ID del servicio no coincide
**Solución:**
1. Ve a Email Services en EmailJS
2. Copia el Service ID correcto
3. Actualiza `SERVICE_ID` en `emailService.ts`

### **Error: "Invalid public key"**
**Causa:** La Public Key no es correcta
**Solución:**
1. Ve a Account → General en EmailJS
2. Copia tu Public Key
3. Actualiza `PUBLIC_KEY` en `emailService.ts`

### **Email no llega:**
**Soluciones:**
1. ✅ Revisa carpeta de SPAM
2. ✅ Verifica que el email sea válido
3. ✅ Comprueba límite de 200 emails/mes (plan gratuito)
4. ✅ Verifica en EmailJS Dashboard → History si el email se envió

### **Error: "User ID not found"**
**Causa:** EmailJS no está inicializado o Public Key incorrecta
**Solución:**
1. Reinicia el servidor: `Ctrl+C` y `npm run dev`
2. Limpia caché del navegador (Ctrl+Shift+Delete)
3. Verifica la Public Key en EmailJS

---

## 📋 Template HTML Completa (Copiar en EmailJS)

Si necesitas crear la plantilla desde cero, usa este HTML:

### **Template Name:** `order_confirmation_customer`
### **Template ID:** `template_3vc5pdh` (debe coincidir)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .order-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .products { margin: 20px 0; background: #f9fafb; padding: 15px; border-radius: 8px; }
        .total { background: #fef3c7; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍫 ASOPROMAS</h1>
        <p>Chocolate Artesanal KUJEÑITO</p>
    </div>
    
    <div class="container">
        <h2>¡Hola {{to_name}}! 👋</h2>
        <p>Gracias por tu pedido. Hemos recibido tu solicitud y te confirmaremos los detalles por WhatsApp.</p>
        
        <div class="order-info">
            <p><strong>📋 Número de Pedido:</strong> {{order_number}}</p>
            <p><strong>📅 Fecha:</strong> {{order_date}}</p>
        </div>
        
        <h3>🛍️ Detalle del Pedido:</h3>
        <div class="products">
            <pre style="white-space: pre-wrap; font-family: Arial; line-height: 1.8;">{{products_list}}</pre>
        </div>
        
        <div class="total">
            <p style="margin: 5px 0;">Subtotal: {{subtotal}}</p>
            <p style="margin: 5px 0;">IVA (12%): {{iva}}</p>
            <p style="margin: 10px 0 0 0; font-size: 22px; color: #ea580c;">TOTAL: {{total}}</p>
        </div>
        
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>📦 Próximos Pasos:</strong></p>
            <ul>
                <li>Te contactaremos por WhatsApp para confirmar disponibilidad</li>
                <li>Coordinaremos el método de pago</li>
                <li>Acordaremos fecha y método de entrega</li>
            </ul>
        </div>
        
        <div class="footer">
            <p><strong>ASOPROMAS</strong></p>
            <p>Asociación de Productores Orgánicos</p>
            <p>Playas de Cuje, Zumbi, Zamora Chinchipe, Ecuador</p>
            <p style="margin-top: 15px;">
                ¿Preguntas? Contáctanos:<br>
                📧 Email: {{company_email}}
            </p>
        </div>
    </div>
</body>
</html>
```

### **Configuración de la Plantilla:**

**To Email:**
```
{{to_email}}
```

**From Name:**
```
ASOPROMAS - Chocolate Kujeñito
```

**Subject:**
```
Confirmación de Pedido {{order_number}} - ASOPROMAS
```

**Reply To:**
```
{{company_email}}
```

---

## 🧪 Probar con el Archivo HTML

1. **Abre:** `frontend/test-emailjs.html` en tu navegador
2. **Espera** que aparezca: "✅ EmailJS inicializado correctamente"
3. **Ingresa** tu email y nombre
4. **Clic** en "Enviar Email de Prueba"
5. **Revisa** la consola (F12) para ver logs
6. **Verifica** tu bandeja de entrada (y spam)

### **Si el email llega:**
✅ ¡Configuración correcta! Ya funciona en la aplicación también.

### **Si NO llega:**
1. Abre la consola del navegador (F12)
2. Busca mensajes de error en rojo
3. Copia el error exacto
4. Compara con los errores comunes arriba

---

## 🔄 Aplicar Cambios en la App

Una vez que el test funcione:

1. **Reinicia el servidor de desarrollo:**
```bash
Ctrl + C
npm run dev
```

2. **Limpia caché del navegador:**
```
Ctrl + Shift + Delete
```

3. **Prueba el carrito:**
   - Agrega productos
   - Finalizar por WhatsApp
   - Ingresa email y nombre
   - ✅ Debe enviar el email

---

## 📊 Verificar en EmailJS History

1. Ve a https://dashboard.emailjs.com/admin/history
2. Verás todos los emails enviados
3. Estados posibles:
   - ✅ **Delivered** - Email enviado exitosamente
   - ⏳ **Pending** - En proceso de envío
   - ❌ **Failed** - Error al enviar (ver razón)

---

## 🆘 Necesitas Ayuda?

**Revisa estos puntos:**
- [ ] Service ID coincide con EmailJS Dashboard
- [ ] Template ID coincide con EmailJS Dashboard
- [ ] Public Key es correcta
- [ ] Plantilla tiene todos los campos ({{to_email}}, {{to_name}}, etc.)
- [ ] Email de destino ({{to_email}}) está configurado en la plantilla
- [ ] No has superado el límite de 200 emails/mes
- [ ] test-emailjs.html funciona correctamente

**Si todo está bien pero no funciona:**
1. Copia el error exacto de la consola
2. Verifica en EmailJS Dashboard → History
3. Revisa el apartado "Troubleshooting" en EmailJS docs

---

**¡Con estas instrucciones deberías poder identificar y resolver el problema!** 🎯
