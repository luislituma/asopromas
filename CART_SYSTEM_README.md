# 🛒 Sistema de Carrito de Compras - ASOPROMAS

## 📦 Componentes Implementados

### 1. CartContext
- **Ubicación**: `src/context/CartContext.tsx`
- **Función**: Maneja el estado global del carrito
- **Características**:
  - Persistencia en localStorage
  - Agregar/eliminar/actualizar productos
  - Cálculo automático de totales

### 2. AddToCartButton
- **Ubicación**: `src/components/AddToCartButton.tsx`
- **Uso**: Botón circular con icono de carrito
- **Props requeridas**:
  ```typescript
  productId: string
  productName: string
  productPrice: number
  productImage?: string (opcional)
  variant?: string (opcional)
  ```

### 3. CartWidget  
- **Ubicación**: `src/components/CartWidget.tsx`
- **Función**: Carrito flotante + modal lateral
- **Características**:
  - Botón flotante en esquina inferior derecha
  - Panel deslizante con productos
  - Controles de cantidad (+/-)
  - Botón "Finalizar por WhatsApp"

### 4. ButtonBuy (Actualizado)
- **Ubicación**: `src/components/ButtonBuy.tsx`
- **Función**: Wrapper de AddToCartButton
- **Props requeridas**:
  ```typescript
  productId: string
  productName: string
  productPrice: number
  productImage?: string (opcional)
  variant?: string (opcional)
  ```

## 🚀 Cómo Usar

### Ejemplo básico:
```tsx
<ButtonBuy
  productId="chocolate-bar-70"
  productName="Barra de Chocolate 70%"
  productPrice={12.99}
  productImage="/images/chocolate-bar.jpg"
/>
```

### Ejemplo en ProductCard:
```tsx
<AddToCartButton
  productId={product.id}
  productName={product.name}
  productPrice={product.price}
  productImage={product.image}
/>
```

## 📱 Flujo de Usuario

1. Usuario navega productos
2. Hace clic en botón de carrito (🛒) en cada producto
3. Se muestra feedback visual (✓)
4. Botón flotante muestra cantidad de items
5. Usuario abre el carrito (clic en botón flotante)
6. Revisa productos, ajusta cantidades
7. Clic en "Finalizar por WhatsApp"
8. Se abre WhatsApp con mensaje formateado
9. Usuario confirma pedido directamente en WhatsApp

## 🎨 Características de UX

- ✅ Animaciones suaves
- ✅ Feedback visual inmediato
- ✅ Contador de productos en badge
- ✅ Persistencia del carrito (localStorage)
- ✅ Responsive (móvil y desktop)
- ✅ Controles intuitivos (+/-)
- ✅ Mensaje de WhatsApp pre-formateado
- ✅ Cálculo automático de totales

## 📝 Tareas Pendientes

Para completar la integración del carrito, necesitas:

1. **Actualizar todos los componentes de productos** para incluir:
   - `productId` único
   - `productName`
   - `productPrice` (número)
   - `productImage` (opcional)

2. **Eliminar props obsoletas**:
   - Ya no se usa `size`
   - Ya no se usa `variant` de tipo "primary" | "secondary" | "whatsapp"
   - Ya no se usa `phone`

3. **Configuración de WhatsApp**:
   - El número se toma de `SITE_CONFIG.CONTACT_PHONE` en `src/config/site.ts`
   - Actualmente: `+593 96 170 6421`

## 🔧 Configuración

El número de WhatsApp se configura en `src/config/site.ts`:

```typescript
export const SITE_CONFIG = {
  CONTACT_PHONE: '+593 96 170 6421',
  // ...
};
```

## 🐛 Solución de Problemas

### Error: "Type is missing properties productId, productName, productPrice"
**Solución**: Asegúrate de pasar todas las props requeridas:
```tsx
<ButtonBuy
  productId="unique-id"
  productName="Producto"
  productPrice={19.99}
/>
```

### El carrito no persiste
**Solución**: El carrito se guarda en localStorage automáticamente. Verifica la consola del navegador para errores.

### WhatsApp no abre
**Solución**: Verifica que el número de teléfono en `site.ts` esté en formato internacional sin espacios especiales.

## 📊 Formato del Mensaje de WhatsApp

```
¡Hola! Me gustaría hacer el siguiente pedido:

1. *Barra de Chocolate 70%*
   Cantidad: 2
   Precio: $25.98

2. *Nibs de Cacao*
   Cantidad: 1
   Precio: $15.99

*Total: $41.97*

¿Podrían confirmar disponibilidad y opciones de entrega?
```

## 🎯 Próximos Pasos Recomendados

1. Agregar fotos de productos reales
2. Configurar precios reales de productos
3. Agregar variantes de productos (tamaños, presentaciones)
4. Implementar cupones de descuento (opcional)
5. Agregar mínimo de compra (opcional)
6. Integrar con sistema de inventario (futuro)

---

**¿Necesitas ayuda?** Consulta la documentación de los componentes individuales o pregunta en el equipo de desarrollo.
