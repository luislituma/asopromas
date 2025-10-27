# 📧 Nueva Plantilla de Email con Información de Pago

## 🎯 Concepto Mejorado

**Email único con todo incluido:**
- ✅ Resumen completo del pedido
- ✅ Instrucciones de pago por transferencia
- ✅ Datos bancarios destacados
- ✅ Botón para contactar por WhatsApp
- ✅ PDF descargable del pedido
- ❌ Ya NO abre WhatsApp automáticamente

---

## 📋 Nueva Plantilla HTML para EmailJS

### **Paso 1: Actualizar la Plantilla en EmailJS**

1. Ve a https://dashboard.emailjs.com/admin/templates
2. Abre tu plantilla: `template_3vc5pdh`
3. Reemplaza el contenido HTML con este:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
        }
        .header { 
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .order-info { 
            background: #f3f4f6; 
            padding: 15px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .products { 
            margin: 20px 0; 
            background: #f9fafb; 
            padding: 15px; 
            border-radius: 8px; 
        }
        .total { 
            background: #fef3c7; 
            padding: 15px; 
            border-radius: 8px; 
            font-size: 18px; 
            font-weight: bold; 
            margin-top: 20px; 
        }
        .payment-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 2px solid #3b82f6;
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
        }
        .payment-box h3 {
            color: #1e40af;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .bank-details {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
        }
        .bank-details p {
            margin: 8px 0;
            font-size: 14px;
        }
        .bank-details strong {
            color: #1e40af;
            display: inline-block;
            min-width: 140px;
        }
        .account-number {
            background: #f0f9ff;
            padding: 12px;
            border-radius: 6px;
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            text-align: center;
            margin: 10px 0;
            letter-spacing: 1px;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px 5px;
            text-align: center;
        }
        .btn-whatsapp {
            background: #25D366;
            color: white;
        }
        .btn-whatsapp:hover {
            background: #20BA5A;
        }
        .button-container {
            text-align: center;
            margin: 25px 0;
        }
        .info-box {
            background: #dbeafe; 
            padding: 15px; 
            border-radius: 8px; 
            margin-top: 20px;
        }
        .footer { 
            text-align: center; 
            padding: 20px; 
            color: #6b7280; 
            font-size: 14px; 
            border-top: 1px solid #e5e7eb; 
            margin-top: 30px; 
        }
        .highlight {
            background: #fef3c7;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🍫 ASOPROMAS</h1>
        <p>Chocolate Artesanal KUJEÑITO</p>
    </div>
    
    <div class="container">
        <h2>¡Hola {{to_name}}! 👋</h2>
        <p>¡Gracias por tu pedido! A continuación encontrarás todos los detalles:</p>
        
        <div class="order-info">
            <p><strong>📋 Número de Pedido:</strong> {{order_number}}</p>
            <p><strong>📅 Fecha:</strong> {{order_date}}</p>
        </div>
        
        <h3>🛍️ Detalle del Pedido:</h3>
        <div class="products">
            <pre style="white-space: pre-wrap; font-family: Arial; line-height: 1.8;">{{products_list}}</pre>
        </div>
        
        <div class="total">
            <p style="margin: 5px 0;">Subtotal (sin IVA): {{subtotal}}</p>
            <p style="margin: 5px 0;">IVA (15%): {{iva}}</p>
            <p style="margin: 10px 0 0 0; font-size: 22px; color: #ea580c;">TOTAL: {{total}}</p>
        </div>
        
        <!-- INFORMACIÓN DE PAGO -->
        <div class="payment-box">
            <h3>💳 Información para Transferencia Bancaria</h3>
            <div class="bank-details">
                <p><strong>Banco:</strong> {{bank_name}}</p>
                <p><strong>Tipo de Cuenta:</strong> {{account_type}}</p>
                <p><strong>Titular:</strong> {{account_holder}}</p>
                <p><strong>RUC/Cédula:</strong> {{id_number}}</p>
                
                <div class="account-number">
                    {{account_number}}
                </div>
                
                <p style="margin-top: 15px; font-size: 13px; color: #6b7280;">
                    ⚠️ <strong>Importante:</strong> Por favor, incluye tu nombre y el número de pedido 
                    <span class="highlight">{{order_number}}</span> como referencia en la transferencia.
                </p>
            </div>
        </div>
        
        <!-- PRÓXIMOS PASOS -->
        <div class="info-box">
            <h3>📦 Próximos Pasos:</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
                <li>Realiza la transferencia bancaria por el monto de <strong>{{total}}</strong></li>
                <li>Envíanos el comprobante de pago por WhatsApp</li>
                <li>Confirmaremos tu pago y coordinaremos la entrega</li>
            </ol>
        </div>
        
        <!-- BOTÓN DE WHATSAPP -->
        <div class="button-container">
            <a href="{{whatsapp_link}}" class="button btn-whatsapp">
                📱 Enviar Comprobante por WhatsApp
            </a>
        </div>
        
        <p style="text-align: center; color: #6b7280; font-size: 13px;">
            También puedes llamarnos al {{company_phone}}
        </p>
        
        <div class="footer">
            <p><strong>ASOPROMAS</strong></p>
            <p>Asociación de Productores Orgánicos</p>
            <p>Playas de Cuje, Zumbi, Zamora Chinchipe, Ecuador</p>
            <p style="margin-top: 15px;">
                ¿Preguntas?<br>
                📧 Email: {{company_email}}<br>
                📱 WhatsApp: {{company_phone}}
            </p>
        </div>
    </div>
</body>
</html>
```

### **Paso 2: Configurar los Campos de la Plantilla**

En la sección **Settings** de la plantilla, asegúrate de tener:

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
✅ Pedido {{order_number}} - Instrucciones de Pago - ASOPROMAS
```

**Reply To:**
```
{{company_email}}
```

### **Paso 3: Verificar Todos los Campos**

La plantilla usa estos campos (ya enviados desde el código):

✅ **Datos del Pedido:**
- `{{to_email}}` - Email del cliente
- `{{to_name}}` - Nombre del cliente
- `{{order_number}}` - Número de pedido
- `{{order_date}}` - Fecha del pedido
- `{{products_list}}` - Lista de productos
- `{{subtotal}}` - Subtotal (sin IVA)
- `{{iva}}` - IVA (15%)
- `{{total}}` - Total (con IVA incluido)

✅ **Datos Bancarios:** (NUEVO)
- `{{bank_name}}` - Nombre del banco
- `{{account_type}}` - Tipo de cuenta
- `{{account_number}}` - Número de cuenta
- `{{account_holder}}` - Titular
- `{{id_number}}` - RUC o Cédula

✅ **Datos de Contacto:** (NUEVO)
- `{{company_email}}` - Email de ASOPROMAS
- `{{company_phone}}` - Teléfono/WhatsApp
- `{{whatsapp_link}}` - Link directo a WhatsApp

---

## ⚙️ Configurar Datos Bancarios

Edita el archivo: `frontend/src/config/site.ts`

```typescript
PAYMENT_INFO: {
  BANK_NAME: 'Banco Pichincha',        // Cambiar
  ACCOUNT_TYPE: 'Cuenta de Ahorros',   // Cambiar
  ACCOUNT_NUMBER: '2100123456',        // Cambiar
  ACCOUNT_HOLDER: 'ASOPROMAS',         // Cambiar
  ID_NUMBER: '1234567890001',          // RUC o Cédula
},
```

---

## 🔄 Nuevo Flujo del Pedido

```
Cliente finaliza pedido
    ↓
Ingresa nombre y email
    ↓
Click en "Finalizar Pedido"
    ↓
┌─────────────────────────────────────┐
│ Sistema ejecuta:                     │
├─────────────────────────────────────┤
│ 1. 📥 Descarga PDF del pedido       │
│ 2. 📧 Envía email AL CLIENTE con:   │
│    • Resumen del pedido             │
│    • Datos bancarios                │
│    • Botón de WhatsApp              │
│ 3. 📧 Envía notificación a ASOPROMAS│
│ 4. 🧹 Limpia el carrito             │
└─────────────────────────────────────┘
    ↓
Cliente recibe email
    ↓
Cliente hace transferencia
    ↓
Cliente hace click en botón WhatsApp
    ↓
Cliente envía comprobante por WhatsApp
    ↓
ASOPROMAS confirma pago
    ↓
Se coordina entrega
    ↓
¡Pedido completado! ✅
```

---

## ✅ Ventajas del Nuevo Sistema

### **Para el Cliente:**
✅ Recibe todo en un solo email
✅ Datos bancarios claros y profesionales
✅ Botón directo a WhatsApp para enviar comprobante
✅ Instrucciones paso a paso
✅ PDF del pedido descargado automáticamente

### **Para ASOPROMAS:**
✅ Proceso más profesional
✅ Cliente paga antes de contactar
✅ Menos mensajes sin compromisoserious
✅ Mejor control de inventario
✅ Registro automático de pedidos (PDF)

### **Mejoras vs Sistema Anterior:**
❌ Antes: WhatsApp se abría automáticamente
✅ Ahora: Cliente elige cuándo contactar

❌ Antes: Sin información de pago
✅ Ahora: Datos bancarios en el email

❌ Antes: Confuso para el cliente
✅ Ahora: Proceso claro y profesional

---

## 🧪 Probar el Nuevo Sistema

1. **Recarga la página** (Ctrl + Shift + R)
2. Agrega productos al carrito
3. Click en **"Finalizar Pedido"** (ya no dice "por WhatsApp")
4. Ingresa email y nombre
5. Envía
6. ✅ PDF se descarga
7. ✅ Revisa tu email - debe tener:
   - Resumen del pedido
   - Datos bancarios destacados
   - Botón verde de WhatsApp
8. ✅ Click en el botón de WhatsApp (opcional)

---

## 💡 Para Agregar PDF Adjunto al Email

**Requiere:** EmailJS Premium ($15/mes)

Si quieres que el PDF llegue adjunto en el email:

1. Upgrade a plan Basic o superior
2. En el código, modificar `emailService.ts` para incluir attachment
3. EmailJS soporta adjuntos en base64

---

## 📊 Resumen de Cambios

| Característica | Antes | Ahora |
|----------------|-------|-------|
| Botón del carrito | "Finalizar por WhatsApp" | "Finalizar Pedido" |
| Abrir WhatsApp | Automático | Opcional (botón en email) |
| Información de pago | No incluida | Datos bancarios en email |
| Email al cliente | Simple | Completo con botones |
| PDF del pedido | Se descarga | Se descarga |
| Profesionalismo | Medio | Alto ✅ |

---

**¡El nuevo sistema está completamente implementado!** 🎉

Ahora el proceso es mucho más profesional y centrado en el pago por transferencia bancaria.
