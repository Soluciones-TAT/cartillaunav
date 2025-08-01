# 🚀 Guía de Implementación PWA - Cartilla UNAV

## 📋 Checklist de Implementación

### ✅ Paso 1: Preparación de archivos

1. **Subir archivos a SharePoint:**
   - Copia toda la carpeta `install/` a tu SharePoint
   - URL destino: `https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/`

2. **Verificar permisos:**
   - Asegúrate de que los archivos sean accesibles públicamente
   - Prueba accediendo a: `https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/manifest.json`

### ✅ Paso 2: Modificar init.aspx

Agrega este código al `<head>` de tu archivo `init.aspx`:

```html
<!-- PWA Configuration -->
<link rel="manifest" href="install/manifest.json">
<meta name="theme-color" content="#23236c">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="UNAV Cartilla">

<!-- PWA Installation Script -->
<script src="install/install-pwa.js"></script>

<!-- Service Worker Registration -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('install/sw.js')
      .then(registration => {
        console.log('✅ SW registrado:', registration.scope);
      })
      .catch(error => {
        console.error('❌ Error SW:', error);
      });
  });
}
</script>
```

### ✅ Paso 3: Verificar iconos

Confirma que existan estos archivos en `/icons/`:

**Iconos regulares (purpose: "any"):**
- ✅ icon-72x72.png
- ✅ icon-96x96.png  
- ✅ icon-128x128.png
- ✅ icon-144x144.png
- ✅ icon-152x152.png
- ✅ icon-192x192.png
- ✅ icon-384x384.png
- ✅ icon-512x512.png

**Iconos maskable (purpose: "maskable"):**
- ✅ maskable-icon-192x192.png
- ✅ maskable-icon-512x512.png

**Generar iconos maskable:**
```bash
cd install
node generate-maskable-icons.js
# Esto genera los SVG, luego conviértelos a PNG
```

### ✅ Paso 4: Testing

1. **Abrir en Chrome/Edge:**
   ```
   https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/init.aspx
   ```

2. **Verificar en DevTools:**
   - F12 → Application → Manifest
   - F12 → Application → Service Workers
   - F12 → Lighthouse → PWA Audit

3. **Probar instalación:**
   - Deberías ver el banner "Instalar aplicación"
   - O botón flotante de instalación

## 📱 Generación de APK/IPA

### Método 1: PWABuilder.com (Recomendado)

1. **Ir a PWABuilder:**
   ```
   https://www.pwabuilder.com
   ```

2. **Ingresar URL:**
   ```
   https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/
   ```

3. **Generar paquetes:**
   - Android: Descarga APK
   - iOS: Descarga proyecto Xcode
   - Windows: Descarga MSIX

### Método 2: PWABuilder CLI

```bash
# Instalar CLI
npm install -g @pwabuilder/cli

# Generar desde URL
pwa package https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/

# O desde archivo local
pwa package --manifest install/pwabuilder.json
```

## 🔧 Configuraciones Específicas

### Android APK

**Configuración recomendada:**
- Package ID: `com.unav.cartilla`
- Version: `1.0.0`
- Min SDK: `21` (Android 5.0+)
- Target SDK: `33`
- Signing: Usar certificado propio para distribución

**Distribución:**
- ✅ Instalación directa (sideloading)
- ✅ Distribución por email/intranet
- ✅ Google Play (requiere cuenta desarrollador)

### iOS IPA

**Configuración recomendada:**
- Bundle ID: `com.unav.cartilla`
- Version: `1.0.0`
- Min iOS: `13.0`
- Certificado: Apple Developer Enterprise

**Distribución:**
- ⚠️ Requiere certificado Apple Developer
- ✅ TestFlight para beta testing
- ✅ App Store (requiere revisión)
- ⚠️ Enterprise distribution (solo para empleados)

## 📋 URLs de Testing

### Página de instalación:
```
https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/
```

### Manifest:
```
https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/manifest.json
```

### Service Worker:
```
https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/sw.js
```

## 🛠 Herramientas de Validación

### Online:
- **Manifest Validator:** https://manifest-validator.appspot.com/
- **PWA Testing:** https://web.dev/measure/
- **Lighthouse:** https://pagespeed.web.dev/

### Browser DevTools:
- Chrome: F12 → Application → Manifest/Service Workers
- Edge: F12 → Application → Manifest/Service Workers
- Firefox: F12 → Application → Manifest

## 🚨 Troubleshooting

### Problema: No aparece banner de instalación

**Soluciones:**
1. Verificar que sea HTTPS
2. Comprobar manifest.json válido
3. Verificar Service Worker registrado
4. Probar en Chrome/Edge (Safari no soporta)

### Problema: Service Worker no se registra

**Soluciones:**
1. Verificar ruta del archivo `sw.js`
2. Comprobar errores en consola
3. Verificar permisos de archivo
4. Probar en modo incógnito

### Problema: Iconos no aparecen

**Soluciones:**
1. Verificar rutas en manifest.json
2. Comprobar que archivos existan
3. Verificar tamaños correctos
4. Usar rutas absolutas

## 📊 Métricas de Éxito

### PWA Score (Lighthouse):
- ✅ Installable: 100%
- ✅ PWA Optimized: 100%
- ✅ Fast and Reliable: 90%+
- ✅ Engaging: 80%+

### Funcionalidades:
- ✅ Instala correctamente
- ✅ Funciona offline
- ✅ Splash screen personalizado
- ✅ Tema consistente
- ✅ Shortcuts funcionan

## 📞 Contacto y Soporte

**Para problemas técnicos:**
1. Revisar consola del navegador
2. Verificar Network tab en DevTools
3. Probar en diferentes dispositivos
4. Usar herramientas de validación online

**Recursos adicionales:**
- PWA Documentation: https://web.dev/progressive-web-apps/
- PWABuilder Docs: https://docs.pwabuilder.com/
- Service Worker Cookbook: https://serviceworke.rs/

---

**¡Tu PWA está lista para distribuir! 🎉**

*Desarrollado para Cartilla de Emergencia Marítima*