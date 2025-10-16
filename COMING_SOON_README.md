# ASOPROMAS - Modo "Coming Soon"

## 🚀 Cómo gestionar el modo "Coming Soon"

### Para activar/desactivar el modo "Coming Soon":

1. Ve al archivo: `src/config/site.ts`
2. Cambia el valor de `COMING_SOON_MODE`:
   - `true` = Muestra la página "Coming Soon"
   - `false` = Muestra el sitio web completo

```typescript
export const SITE_CONFIG = {
  COMING_SOON_MODE: true,  // 👈 Cambiar a false para mostrar el sitio completo
  // ...
}
```

### Configuraciones disponibles:

| Configuración | Descripción | Ejemplo |
|---------------|-------------|---------|
| `COMING_SOON_MODE` | Activa/desactiva el modo "Coming Soon" | `true` o `false` |
| `LAUNCH_DAYS_FROM_NOW` | Días para el contador regresivo | `14` (2 semanas) |
| `CONTACT_EMAIL` | Email de contacto | `info@asopromas.com` |
| `CONTACT_PHONE` | Teléfono de contacto | `+593 123 456 789` |

### 📅 Para cambiar la fecha de lanzamiento:

Modifica `LAUNCH_DAYS_FROM_NOW` en `src/config/site.ts`

### 📧 Para cambiar información de contacto:

Actualiza `CONTACT_EMAIL` y `CONTACT_PHONE` en `src/config/site.ts`

### 🎨 Características de la página "Coming Soon":

- ✅ Contador regresivo en tiempo real
- ✅ Diseño responsivo (móvil y desktop)
- ✅ Temática de chocolate/cacao
- ✅ Formulario de suscripción
- ✅ Información de contacto
- ✅ Animaciones suaves
- ✅ Colores de la marca ASOPROMAS

### 🔄 Workflow recomendado:

1. **Desarrollo**: Mantén `COMING_SOON_MODE: false` para trabajar en el sitio
2. **Despliegue temporal**: Cambia a `COMING_SOON_MODE: true` antes del deploy
3. **Lanzamiento final**: Cambia a `COMING_SOON_MODE: false` cuando esté listo

### 📁 Archivos relacionados:

- `src/config/site.ts` - Configuración principal
- `src/pages/ComingSoon.tsx` - Página "Coming Soon"
- `src/App.tsx` - Lógica de activación

---

**Nota**: Recuerda hacer commit de los cambios antes de desplegar en Vercel.