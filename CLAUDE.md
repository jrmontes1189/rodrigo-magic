# CLAUDE.md — Magician Website (Rodrigo Montes)

## Contexto de Negocio

Sitio web profesional de **Rodrigo Montes**, maestro ilusionista y mentalista con base en Los Ángeles, California. El sitio funciona como portafolio profesional y tienda en línea.

**Estadísticas clave del artista:**
- 500+ eventos realizados
- 15+ años de experiencia
- 50+ ilusiones originales
- Calificación 5.0 estrellas

**Servicios ofrecidos (precios hardcodeados en HTML):**
- Private Parties — desde $750
- Corporate Events — desde $1,500
- Weddings — desde $2,000
- Trade Shows — desde $2,500
- Virtual Shows — desde $500
- Stage Illusions — desde $3,500

**Contacto del sitio:** `hello@themystician.com` | `(310) 000-0000` | Los Ángeles, California

---

## Stack Técnico

- **HTML5** — Markup semántico puro
- **CSS3** — Grid, Flexbox, Custom Properties, `clamp()`, animaciones
- **JavaScript ES6+ (Vanilla)** — Sin frameworks ni dependencias
- **Canvas API** — Sistema de partículas animadas (`particles.js`)
- **LocalStorage API** — Persistencia del carrito de compras
- **IntersectionObserver API** — Animaciones scroll-reveal
- **Google Fonts** — Cinzel, Cinzel Decorative, Cormorant Garamond, Bebas Neue, Permanent Marker, Oswald

**Sin build system, sin package.json, sin npm.** El sitio es 100% estático.

---

## Estructura de Carpetas

```
magician-website/
├── index.html          # Home — hero, stats, about, galería, servicios, testimonios
├── events.html         # Booking de eventos con formulario
├── shop.html           # Tienda con filtro por categoría y carrito
├── learn.html          # Cursos en video con niveles de habilidad
├── contact.html        # Formulario de contacto e información
├── css/
│   └── styles.css      # Hoja de estilos principal (~16,000+ líneas)
├── js/
│   ├── main.js         # Lógica principal: carrito, navegación, scroll-reveal
│   └── particles.js    # Sistema de partículas Canvas (suits de cartas, sparkles)
└── images/
    ├── rodrigo-cards-1.jpg    # ~4.7 MB
    ├── rodrigo-cards-2.jpg    # ~6.6 MB
    ├── rodrigo-cards-3.jpg    # ~5 MB
    └── rodrigo-portrait.jpg  # ~5.6 MB
```

---

## Sistema de Design

### Paleta de Colores (CSS Custom Properties en `styles.css`)

| Variable              | Valor       | Uso                        |
|-----------------------|-------------|----------------------------|
| `--gold`              | `#d4a847`   | Acento principal           |
| `--gold-light`        | `#f0c96a`   | Highlights                 |
| `--gold-dark`         | `#8b6914`   | Acentos oscuros            |
| `--bg-primary`        | `#0a0a0a`   | Fondo principal            |
| `--bg-secondary`      | `#0f0f0f`   | Fondo secundario           |
| `--text-primary`      | `#e8e0d0`   | Texto principal (beige)    |
| `--text-secondary`    | `#999`      | Texto secundario           |

### Tipografía

| Fuente              | Uso                          |
|---------------------|------------------------------|
| Bebas Neue          | Display / headers grandes    |
| Oswald              | Títulos de sección           |
| Cormorant Garamond  | Texto body, elegante         |
| Cinzel              | Acentos decorativos          |
| Permanent Marker    | Estilo graffiti / urbano     |

**Estética:** Dark luxury con acentos dorados, inspirado en arte urbano/graffiti mezclado con magia de alta gama.

---

## Convenciones de Código

### HTML
- Clases en `kebab-case` (e.g., `nav-logo`, `hero-content`, `cart-sidebar`)
- IDs en `kebab-case` (e.g., `#particles-canvas`, `#navbar`)
- Secciones envueltas en `<section>`, `<nav>`, `<footer>` semánticos

### CSS
- Variables CSS en `kebab-case` con prefijo `--`
- Nomenclatura BEM-like para componentes
- Layouts con CSS Grid para estructura, Flexbox para alineación
- Tipografía fluida con `clamp()` para responsividad
- Transiciones con `cubic-bezier` para suavidad

### JavaScript
- `camelCase` para funciones y variables
- Estado del carrito en objeto `Cart` centralizado
- Manipulación directa del DOM (sin jQuery ni virtual DOM)
- Handlers `onclick` inline en HTML para elementos del carrito/shop
- Event listeners en `main.js` para comportamientos globales

---

## Componentes y Funcionalidades Clave

### Carrito de Compras (`main.js`)

```javascript
// Modelo de item en el carrito
{
  id: string,
  name: string,
  price: string,   // número como string
  emoji: string,
  qty: number
}
```

- Persistido en `localStorage` con clave `'magicCart'`
- Productos se agregan desde `index.html`, `shop.html` y `learn.html`
- Sidebar con overlay, botón de cierre
- Toast notifications para feedback al usuario

### Sistema de Partículas (`particles.js`)

- Canvas responsivo que se redibuja en resize
- ~140 partículas flotantes con suits de cartas (♠ ♥ ♦ ♣)
- Efectos sparkle en movimiento del mouse
- Fondo nebulosa con gradientes dinámicos
- Animación a 60fps con `requestAnimationFrame`

### Scroll Reveal (`main.js`)

- `IntersectionObserver` con `threshold: 0.12`, `rootMargin: '-50px'`
- Clases de delay: `reveal-delay-1`, `reveal-delay-2`, `reveal-delay-3`
- Aplicar clase `.reveal` a elementos para activar la animación

### Navegación Móvil

- Hamburger menu para pantallas pequeñas
- Oculto en desktop via CSS
- Clase activa para mostrar/ocultar menú

### Filtrado de Productos (`shop.html`, `learn.html`)

- Filtrado client-side por categoría
- Categorías de shop: Cards, Coins, Mentalism, Stage
- Niveles de cursos: Beginner, Intermediate, Advanced

---

## Formularios

Tanto el formulario de contacto (`contact.html`) como el de booking (`events.html`) son **solo client-side**:
- `preventDefault()` en submit
- Muestran toast de confirmación
- **No hay backend ni envío real de datos**

Para implementar envío real, se necesitaría integrar un servicio como Formspree, EmailJS, o un backend propio.

---

## Variables de Entorno

**No existen variables de entorno.** Todo el contenido es estático y hardcodeado en HTML/CSS/JS.

Si en el futuro se añade un backend, las variables típicas serían:
- `CONTACT_EMAIL` — email destino del formulario
- `STRIPE_KEY` — para pagos en la tienda
- `API_URL` — endpoint del backend

---

## Comandos Frecuentes

No hay build system. Para desarrollo local:

```bash
# Servir localmente (evita problemas de CORS con fuentes)
python3 -m http.server 8000
# o
npx serve .
# o con live-reload
npx browser-sync start --server --files "**/*"
```

Abrir en el navegador: `http://localhost:8000`

---

## Consideraciones de Performance

**Problemas conocidos:**
- Imágenes muy grandes (5–6.6 MB c/u) — candidatas a optimización con WebP + lazy loading
- Google Fonts carga de forma bloqueante (6 familias)
- Canvas a 60fps puede ser intensivo en dispositivos lentos
- CSS no está minificado (~16,000 líneas en un solo archivo)

**Optimizaciones posibles:**
- Convertir imágenes a WebP y agregar `loading="lazy"`
- Usar `font-display: swap` en Google Fonts
- Minificar `styles.css` y archivos JS para producción
- Implementar `will-change: transform` en elementos animados

---

## Páginas y Rutas

| Archivo         | Ruta        | Propósito                              |
|-----------------|-------------|----------------------------------------|
| `index.html`    | `/`         | Home — portafolio y vitrina principal  |
| `events.html`   | `/events`   | Booking de eventos con precios         |
| `shop.html`     | `/shop`     | Tienda con carrito funcional           |
| `learn.html`    | `/learn`    | Cursos en video por nivel              |
| `contact.html`  | `/contact`  | Formulario de contacto y redes sociales|

---

## Redes Sociales (hardcodeadas en `contact.html`)

- Instagram, YouTube, Facebook, TikTok, Twitter
- Links placeholder (no URLs reales configuradas aún)
