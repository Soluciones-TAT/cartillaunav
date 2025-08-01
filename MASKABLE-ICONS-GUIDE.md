# 🎭 Guía de Iconos Maskable para PWA

## 🎯 ¿Qué son los iconos maskable?

Los iconos **maskable** son una nueva categoría de iconos para PWAs que se adaptan automáticamente a diferentes formas según el sistema operativo:

- **iOS**: Círculos
- **Android**: Formas redondeadas, círculos, cuadrados
- **Windows**: Cuadrados con esquinas redondeadas

## 🔧 Diferencias con iconos regulares

| Tipo | Purpose | Características |
|------|---------|----------------|
| **Regular** | `"any"` | Forma fija, no se adapta |
| **Maskable** | `"maskable"` | Se adapta a formas del sistema |

## 📏 Zona de seguridad (Safe Zone)

Los iconos maskable deben seguir la regla del **80%**:

```
┌─────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ ← Área que puede ser cortada
│ ░░┌─────────────────┐░░ │
│ ░░│                 │░░ │
│ ░░│   CONTENIDO     │░░ │ ← 80% central (zona segura)
│ ░░│    SEGURO       │░░ │
│ ░░│                 │░░ │
│ ░░└─────────────────┘░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░ │ ← Área que puede ser cortada
└─────────────────────────┘
```

## ✅ Checklist de diseño

### Obligatorio:
- ✅ Contenido importante dentro del 80% central
- ✅ Fondo que cubra toda el área (512x512 o 192x192)
- ✅ Sin elementos importantes cerca de los bordes
- ✅ Contraste adecuado

### Recomendado:
- ✅ Gradientes sutiles para profundidad
- ✅ Colores consistentes con el tema de la app
- ✅ Elementos decorativos dentro de la zona segura
- ✅ Pruebas en diferentes formas

## 🛠 Herramientas para crear iconos maskable

### 1. Maskable.app (Recomendado)
```
https://maskable.app/
```
- Editor online gratuito
- Previsualización en tiempo real
- Exportación directa

### 2. Figma/Adobe XD
- Crear artboard de 512x512px
- Dibujar círculo de 410px (80%) como guía
- Mantener contenido dentro del círculo

### 3. Photoshop/GIMP
- Canvas de 512x512px
- Capa de guía con círculo de 80%
- Exportar como PNG

## 📱 Cómo se ven en diferentes sistemas

### Android (Material You)
```css
/* Formas comunes en Android */
border-radius: 50%;        /* Círculo */
border-radius: 25%;        /* Redondeado */
border-radius: 15%;        /* Poco redondeado */
clip-path: polygon(...);   /* Formas personalizadas */
```

### iOS
```css
/* iOS siempre usa círculos */
border-radius: 50%;
```

### Windows
```css
/* Windows usa esquinas redondeadas */
border-radius: 8px;
```

## 🧪 Testing de iconos maskable

### 1. Herramientas online:
- **Maskable.app**: https://maskable.app/
- **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator

### 2. DevTools:
```javascript
// Chrome DevTools Console
// Simular diferentes formas
document.querySelector('img').style.clipPath = 'circle(50%)';
document.querySelector('img').style.borderRadius = '25%';
```

### 3. Dispositivos reales:
- Instalar PWA en Android/iOS
- Verificar en diferentes launchers
- Comprobar en widgets y shortcuts

## 📋 Manifest.json correcto

```json
{
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/maskable-icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/maskable-icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## ❌ Errores comunes

### 1. Contenido muy cerca del borde
```
❌ Malo: Logo ocupa 95% del espacio
✅ Bueno: Logo ocupa 70% del espacio
```

### 2. Fondo transparente
```
❌ Malo: background: transparent
✅ Bueno: background: #23236c
```

### 3. Texto muy pequeño
```
❌ Malo: Texto de 12px en icon de 192px
✅ Bueno: Texto de 60px+ en icon de 192px
```

### 4. Elementos cortados
```
❌ Malo: Texto que se corta en círculo
✅ Bueno: Texto completamente visible
```

## 🎨 Ejemplo práctico: UNAV Cartilla

### Diseño actual:
- **Fondo**: Azul corporativo (#23236c)
- **Contenido**: Letra "U" centrada
- **Zona segura**: 80% central
- **Elementos decorativos**: Puntos sutiles

### Código SVG:
```svg
<svg width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#23236c"/>
  <text x="256" y="256" font-size="180" fill="white">U</text>
</svg>
```

## 🔄 Workflow de producción

1. **Diseñar** en herramienta preferida
2. **Validar** en maskable.app
3. **Exportar** como PNG (192x192 y 512x512)
4. **Subir** a carpeta icons/
5. **Actualizar** manifest.json
6. **Probar** en dispositivos reales

## 📊 Métricas de éxito

- ✅ Pasa validación en maskable.app
- ✅ Se ve bien en forma circular
- ✅ Se ve bien en forma cuadrada redondeada
- ✅ Contraste > 4.5:1
- ✅ Contenido legible en 192x192px

## 🔗 Recursos adicionales

- **Especificación W3C**: https://w3c.github.io/manifest/#purpose-member
- **Web.dev Guide**: https://web.dev/maskable-icon/
- **MDN Documentation**: https://developer.mozilla.org/en-US/docs/Web/Manifest/icons
- **Maskable.app**: https://maskable.app/

---

**¡Tus iconos maskable están listos para cualquier forma! 🎉**

*Guía creada para Cartilla de Emergencia UNAV - PWA*