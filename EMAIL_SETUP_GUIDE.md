# 📧 Configuración de EmailJS - Guía Paso a Paso

## 🎯 ¿Qué se implementó?

Se agregó funcionalidad para enviar automáticamente un correo electrónico al cliente con el resumen del pedido cuando finaliza la compra.

---

## 🚀 Configuración de EmailJS (15 minutos)

### **Paso 1: Crear Cuenta en EmailJS**

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Haz clic en **"Sign Up"** (Registrarse)
3. Crea una cuenta (puedes usar Google, GitHub o email)
4. Confirma tu correo electrónico

**Plan:** Gratis - 200 emails/mes (suficiente para empezar)

---

### **Paso 2: Conectar tu Email**

1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email:
   - **Gmail** (recomendado para pruebas)
   - **Outlook**
   - **Yahoo**
   - O cualquier otro SMTP

4. Sigue las instrucciones para conectar tu cuenta
5. Copia el **Service ID** (lo necesitarás después)

**Ejemplo de Service ID:** `service_abc1234`

---

### **Paso 3: Crear Plantillas de Email**

#### **Plantilla 1: Email al Cliente**

1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa esta plantilla:

**Template Name:** `order_confirmation_customer`

**Subject:**
```
Confirmación de Pedido {{order_number}} - ASOPROMAS
```

**Content (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .order-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .products { margin: 20px 0; }
        .product-item { padding: 10px; border-bottom: 1px solid #e5e7eb; }
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
                📱 WhatsApp: +593 XXX XXX XXX<br>
                📧 Email: info@asopromas.com
            </p>
        </div>
    </div>
</body>
</html>
```

4. Guarda la plantilla
5. Copia el **Template ID** (ejemplo: `template_xyz9876`)

---

#### **Plantilla 2: Notificación a la Empresa (Opcional)**

1. Crea otra plantilla nueva
2. **Template Name:** `order_notification_company`

**Subject:**
```
🔔 Nuevo Pedido {{order_number}} - {{customer_name}}
```

**Content:**
```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>🎉 ¡Nuevo Pedido Recibido!</h2>
    
    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>📋 Pedido:</strong> {{order_number}}</p>
        <p><strong>👤 Cliente:</strong> {{customer_name}}</p>
        <p><strong>📧 Email:</strong> {{customer_email}}</p>
        <p><strong>📅 Fecha:</strong> {{order_date}}</p>
    </div>
    
    <h3>Productos:</h3>
    <pre style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 8px;">{{products_list}}</pre>
    
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold;">
        <p>💰 TOTAL: {{total}}</p>
    </div>
    
    <p style="margin-top: 20px; color: #6b7280;">
        <em>Recuerda contactar al cliente por WhatsApp para confirmar el pedido.</em>
    </p>
</body>
</html>
```

3. Guarda y copia el **Template ID**

---

### **Paso 4: Obtener Public Key**

1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key**

**Ejemplo:** `abcd1234EFGH5678`

---

### **Paso 5: Configurar las Credenciales en el Código**

Abre el archivo: `frontend/src/services/emailService.ts`

Reemplaza estas líneas (aproximadamente línea 5-9):

```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'TU_SERVICE_ID_AQUI',      // Del paso 2
  TEMPLATE_ID: 'TU_TEMPLATE_ID_AQUI',     // Del paso 3 (plantilla 1)
  PUBLIC_KEY: 'TU_PUBLIC_KEY_AQUI',       // Del paso 4
};
```

**Ejemplo configurado:**
```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_abc1234',
  TEMPLATE_ID: 'template_xyz9876',
  PUBLIC_KEY: 'abcd1234EFGH5678',
};
```

---

### **Paso 6: Configurar Email de la Empresa**

En el mismo archivo `emailService.ts`:

1. Busca la línea 48 (aproximadamente):
```typescript
company_email: 'asopromas@example.com', // Reemplazar con email de la empresa
```

2. Reemplaza con tu email real:
```typescript
company_email: 'info@asopromas.com', // o el email que uses
```

3. Busca la línea 73:
```typescript
to_email: 'asopromas@example.com', // Email de la empresa
```

4. Reemplaza también ahí:
```typescript
to_email: 'info@asopromas.com',
```

---

## ✅ ¡Listo! Probar la Funcionalidad

### **Flujo Completo:**

1. **Agregar productos al carrito**
2. **Clic en "Finalizar por WhatsApp"**
3. **Se abre modal pidiendo nombre y email** ✨ NUEVO
4. **Usuario ingresa sus datos**
5. **Sistema envía:**
   - ✅ Email al cliente con resumen del pedido
   - ✅ Notificación email a ASOPROMAS
   - ✅ Abre WhatsApp automáticamente
6. **Usuario ve confirmación**

---

## 🎨 Personalización del Email

### Cambiar Colores:

En la plantilla HTML, modifica estos valores:

```html
<!-- Header gradient -->
background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);

<!-- Total background -->
background: #fef3c7;

<!-- Total text color -->
color: #ea580c;
```

### Agregar Logo:

```html
<div class="header">
    <img src="URL_DE_TU_LOGO" alt="ASOPROMAS" style="max-width: 150px; margin-bottom: 15px;">
    <h1>🍫 ASOPROMAS</h1>
</div>
```

---

## 🐛 Solución de Problemas

### **Error: "Public Key not found"**
✅ Verifica que copiaste correctamente la Public Key de EmailJS

### **Error: "Service not found"**
✅ Asegúrate de que el Service ID es correcto
✅ Verifica que el servicio esté activo en EmailJS

### **Email no llega:**
✅ Revisa la carpeta de SPAM
✅ Verifica que el email del destinatario sea válido
✅ Comprueba el límite de 200 emails/mes

### **Error: "Template not found"**
✅ Copia el Template ID correcto desde EmailJS
✅ Asegúrate de haber guardado la plantilla

---

## 📊 Monitoreo

### Ver Emails Enviados:

1. Ve a **"Email History"** en EmailJS dashboard
2. Verás todos los emails enviados
3. Puedes ver si fueron entregados o si hubo errores

---

## 💰 Límites del Plan Gratuito

- ✅ **200 emails/mes** gratis
- ✅ Plantillas ilimitadas
- ✅ Sin límite de destinatarios

**¿Necesitas más?**
- **Lite:** $7/mes - 1,000 emails
- **Basic:** $15/mes - 5,000 emails
- **Pro:** $35/mes - 15,000 emails

---

## 🎯 Próximas Mejoras Opcionales

1. **Adjuntar PDF del pedido** al email
2. **Email de seguimiento** después de 24 horas
3. **Confirmación de pago** por email
4. **Tracking de entrega** por email
5. **Sistema de calificación** post-compra

---

## 📝 Checklist de Configuración

- [ ] Crear cuenta en EmailJS
- [ ] Conectar servicio de email
- [ ] Crear plantilla para cliente
- [ ] Crear plantilla para empresa (opcional)
- [ ] Copiar Service ID
- [ ] Copiar Template IDs
- [ ] Copiar Public Key
- [ ] Actualizar emailService.ts con credenciales
- [ ] Configurar email de la empresa
- [ ] Probar con un pedido de prueba
- [ ] Verificar recepción en inbox
- [ ] ¡Listo! 🎉

---

**¿Dudas?** Revisa la documentación oficial: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

**¡Tu sistema de emails está listo!** 📧✨
