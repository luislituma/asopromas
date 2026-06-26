# BRAND.md — Identidad Visual ASOPROMAS & Kujeñito

> Fuente de verdad para colores, tipografía, logos y reglas de uso.
> Claude Code debe consultar este archivo antes de escribir cualquier CSS, variable Tailwind o componente visual.
> Stack: React + TypeScript + Tailwind + Vite + Supabase.

---

## Contexto de marcas

```
ASOPROMAS (cooperativa institucional — B2B, exportación, EUDR)
  └── vende cacao en grano directamente, sin marca comercial adicional
  └── Kujeñito (marca comercial — derivados de cacao y licores, B2C)
```

**Regla crítica:** ASOPROMAS y Kujeñito **nunca aparecen en el mismo bloque visual**.
En la navegación web coexisten, pero con separación visual clara y jerarquía definida.

---

## 1. ASOPROMAS — Paleta Completa

Logo actual: mazorca de cacao + hoja verde. Tagline: "Cacao · Bosques · Origen"
> Nota histórica: en la versión anterior del logo, la hoja era Negro Grafito (#1A1A1A).
> En el rediseño actual, la hoja migró a Verde Selva (#2B4D3F). El grafito solo se conserva para texto de cuerpo.

### 1.1 Colores base del logo (institucional)

| Token                 | Hex       | RGB          | Nombre           | Rol                                          |
|-----------------------|-----------|--------------|------------------|----------------------------------------------|
| `--asop-brown-dark`   | `#3C1E00` | 60 · 30 · 0  | Cacao Profundo   | Primario dominante — tipografía, mazorca      |
| `--asop-brown-mid`    | `#694B1E` | 105 · 75 · 30| Cacao Medio      | Complementario — volumen mazorca, subtítulos  |
| `--asop-text`         | `#1A1A1A` | 26 · 26 · 26 | Negro Grafito    | Texto de cuerpo — NO es color del isotipo    |

### 1.2 Colores del rediseño (sostenibilidad y familia visual)

| Token                 | Hex       | RGB          | Nombre           | Rol                                          |
|-----------------------|-----------|--------------|------------------|----------------------------------------------|
| `--asop-green`        | `#2B4D3F` | 43 · 77 · 63 | Verde Selva      | Hoja del logo rediseñado — puente con Kujeñito|
| `--asop-green-deep`   | `#1A3028` | 26 · 48 · 40 | Verde Bosque     | Fondos oscuros — secciones formales B2B       |
| `--asop-green-cert`   | `#7A9E3B` | 122 · 158 · 59| Verde Orgánico  | Badges EUDR, sellos certificación, infografías|

### 1.3 Colores de apoyo

| Token                 | Hex       | RGB            | Nombre           | Rol                                          |
|-----------------------|-----------|----------------|------------------|----------------------------------------------|
| `--asop-cream`        | `#F2EAD8` | 242 · 234 · 216| Crema Pergamino  | Fondo principal web y documentos             |
| `--asop-cta`          | `#C45A28` | 196 · 90 · 40  | Naranja Cacao    | Botones CTA — vínculo sobrio con Kujeñito    |
| `--asop-white`        | `#FFFFFF` | 255 · 255 · 255| Blanco Limpio    | Interfaces digitales, tarjetas, contratos    |

### 1.4 Combinaciones recomendadas ASOPROMAS

| Nombre               | Fondo     | Texto/Primario | Acento    | Contexto                          |
|----------------------|-----------|----------------|-----------|-----------------------------------|
| Institucional Formal | `#F2EAD8` | `#3C1E00`      | `#2B4D3F` | Contratos, catálogos B2B, EUDR    |
| Digital Institucional| `#FFFFFF`  | `#3C1E00`      | `#C45A28` | asopromas.com, interfaces web     |
| Sostenibilidad       | `#F2EAD8` | `#1A3028`      | `#7A9E3B` | Reportes impacto, trazabilidad    |
| Territorio y Origen  | `#3C1E00` | `#F2EAD8`      | `#694B1E` | Instagram, contenido de campo     |

---

## 2. Kujeñito — Paleta Completa

Logo: mono sosteniendo una mazorca. Tagline: "Cacao y bosques"
Producto: derivados de cacao y licores. Contexto: B2C, packaging, e-commerce, ferias.

### 2.1 Colores base del logo

| Token                 | Hex       | RGB           | Nombre              | Rol                                           |
|-----------------------|-----------|---------------|---------------------|-----------------------------------------------|
| `--kuj-orange`        | `#D8683C` | 216 · 104 · 60| Bermellón Amazónico | Primario dominante — letras KUJE e ITO, CTA   |
| `--kuj-green`         | `#385034` | 56 · 80 · 52  | Verde Bosque        | Secundario — letra Ñ, tagline, puente familiar|
| `--kuj-brown`         | `#402818` | 64 · 40 · 24  | Cacao Salvaje       | Silueta del mono, contornos, texto secundario |

### 2.2 Colores de apoyo

| Token                 | Hex       | RGB             | Nombre           | Rol                                           |
|-----------------------|-----------|-----------------|------------------|-----------------------------------------------|
| `--kuj-cream`         | `#FDF6EE` | 253 · 246 · 238 | Crema Amazónico  | Fondo principal — packaging, etiquetas, web   |
| `--kuj-dark`          | `#1E2A1A` | 30 · 42 · 26    | Verde Noche      | Hero oscuro, packaging premium, licores       |
| `--kuj-white`         | `#FFFFFF` | 255 · 255 · 255 | Blanco Limpio    | E-commerce, fichas de producto                |

### 2.3 Combinaciones recomendadas Kujeñito

| Nombre              | Fondo     | Texto/Primario | Acento    | Contexto                              |
|---------------------|-----------|----------------|-----------|---------------------------------------|
| Energía Amazónica   | `#FDF6EE` | `#D8683C`      | `#402818` | Etiquetas, packaging, Instagram       |
| Selva Nocturna      | `#1E2A1A` | `#FDF6EE`      | `#D8683C` | Licores, packaging premium, gift sets |
| Naturaleza Activa   | `#FFFFFF`  | `#385034`      | `#D8683C` | Web, tienda online, campañas digitales|
| Contraste Máximo    | `#1E2A1A` | `#D8683C`      | —         | Banners de feria, displays, POP       |

---

## 3. Familia visual — Colores compartidos

| Color          | Hex       | En ASOPROMAS          | En Kujeñito              |
|----------------|-----------|-----------------------|--------------------------|
| Verde Selva    | `#2B4D3F` | Hoja del logo         | Base del Verde Bosque    |
| Crema cálido   | `~F2EAD8` | Crema Pergamino       | Crema Amazónico (#FDF6EE)|
| Marrón oscuro  | `~3C1E00` | Cacao Profundo        | Cacao Salvaje (#402818)  |

**Tipografía compartida:** Montserrat — peso 900 para nombres de marca, 600 para eslogan, 400 para cuerpo.
Segunda fuente de cuerpo: Rubik (300/400/500).

---

## 4. Tokens CSS — Producción

```css
:root {
  /* ── ASOPROMAS ── */
  --asop-brown-dark:  #3C1E00;   /* Cacao Profundo — primario */
  --asop-brown-mid:   #694B1E;   /* Cacao Medio — complementario */
  --asop-text:        #1A1A1A;   /* Negro Grafito — texto cuerpo (no isotipo) */
  --asop-green:       #2B4D3F;   /* Verde Selva — hoja rediseño, puente familiar */
  --asop-green-deep:  #1A3028;   /* Verde Bosque — fondos oscuros B2B */
  --asop-green-cert:  #7A9E3B;   /* Verde Orgánico — badges EUDR */
  --asop-cream:       #F2EAD8;   /* Crema Pergamino — fondo principal */
  --asop-cta:         #C45A28;   /* Naranja Cacao — CTA, botones */
  --asop-white:       #FFFFFF;

  /* ── KUJEÑITO ── */
  --kuj-orange:       #D8683C;   /* Bermellón Amazónico — primario */
  --kuj-green:        #385034;   /* Verde Bosque — secundario, Ñ del logo */
  --kuj-brown:        #402818;   /* Cacao Salvaje — silueta mono */
  --kuj-cream:        #FDF6EE;   /* Crema Amazónico — fondo principal */
  --kuj-dark:         #1E2A1A;   /* Verde Noche — hero oscuro, premium */
  --kuj-white:        #FFFFFF;

  /* ── COMPARTIDOS ── */
  --shared-divider:   #E0D5C8;   /* Líneas y separadores */
}
```

---

## 5. Tailwind — `tailwind.config.js`

```js
// tailwind.config.js
theme: {
  extend: {
    colors: {
      // ASOPROMAS
      'asop-dark':  '#3C1E00',
      'asop-mid':   '#694B1E',
      'asop-text':  '#1A1A1A',
      'asop-green': '#2B4D3F',
      'asop-deep':  '#1A3028',
      'asop-cert':  '#7A9E3B',
      'asop-cream': '#F2EAD8',
      'asop-cta':   '#C45A28',

      // Kujeñito
      'kuj-orange': '#D8683C',
      'kuj-green':  '#385034',
      'kuj-brown':  '#402818',
      'kuj-cream':  '#FDF6EE',
      'kuj-dark':   '#1E2A1A',

      // Compartidos
      'brand-divider': '#E0D5C8',
    },
    fontFamily: {
      'brand':  ['Montserrat', 'sans-serif'],  // títulos
      'body':   ['Rubik', 'sans-serif'],        // cuerpo
    },
  }
}
```

---

## 6. Assets de logos

```
/public/assets/logos/
  asopromas-logo.png        ← Logo actual ASOPROMAS (hoja verde, fondo blanco)
  kujenito-logo.png         ← Logo Kujeñito (mono + tipografía, fondo blanco)
```

> **Nota histórica:** existe una versión anterior del logo ASOPROMAS con la hoja en negro grafito.
> El logo vigente tiene la hoja en Verde Selva #2B4D3F. Usar siempre la versión actual.
> Solicitar versiones SVG al diseñador para uso en producción web.

---

## 7. Reglas para Claude Code

- Antes de escribir color, preguntar: ¿contexto ASOPROMAS o Kujeñito?
- Nunca hardcodear hex en componentes. Usar tokens CSS o clases Tailwind de arriba.
- ASOPROMAS y Kujeñito no aparecen juntas en el mismo bloque visual.
- Espaciado Apple-style: `py-20` mínimo (80px) en secciones de página.
- El grafito `#1A1A1A` es solo para texto de cuerpo, nunca para isotipos o iconografía de marca.
- El Verde Orgánico `#7A9E3B` es exclusivo para badges de certificación y EUDR. No decorativo.
- El Bermellón `#D8683C` (Kujeñito) y el Naranja Cacao `#C45A28` (ASOPROMAS) son distintos. No intercambiar.
