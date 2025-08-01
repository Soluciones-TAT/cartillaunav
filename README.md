# 📱 PWA Installation - Cartilla de Emergencia UNAV

Este directorio contiene todos los archivos necesarios para convertir la aplicación Cartilla de Emergencia UNAV en una Progressive Web App (PWA) instalable en dispositivos móviles Android e iOS.

## 🎯 Objetivo

Permitir que los usuarios instalen la aplicación directamente en sus dispositivos móviles sin pasar por App Store o Google Play Store, creando un acceso directo con funcionalidad offline.

## 📁 Estructura de Archivos

```
install/
├── manifest.json           # Manifiesto de la PWA
├── sw.js                  # Service Worker principal
├── pwabuilder-sw.js       # Service Worker optimizado para PWABuilder
├── pwabuilder.json        # Configuración para PWABuilder
├── index.html             # Página de instalación
└── README.md              # Este archivo
```

## 🚀 Implementación

### Paso 1: Subir archivos a SharePoint

1. Sube todos los archivos de este directorio a la carpeta raíz de tu aplicación en SharePoint:
   ```
   https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/
   ```

### Paso 2: Actualizar el archivo principal

Agrega estas líneas al `<head>` de tu archivo `init.aspx`:

```html
<!-- PWA Manifest -->
<link rel="manifest" href="install/manifest.json">

<!-- PWA Meta Tags -->
<meta name="theme-color" content="#23236c">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="UNAV Cartilla">

<!-- Service Worker Registration -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('install/sw.js')
      .then(registration => {
        console.log('✅ SW registrado:', registration);
      })
      .catch(error => {
        console.error('❌ Error SW:', error);
      });
  });
}
</script>
```

### Paso 3: Verificar iconos

Asegúrate de que existan estos iconos en la carpeta `icons/`:

**Iconos regulares (purpose: "any"):**
- icon-72x72.png
- icon-96x96.png  
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

**Iconos maskable (purpose: "maskable"):**
- maskable-icon-192x192.png
- maskable-icon-512x512.png

> **Nota:** Los iconos maskable son especiales - tienen el contenido dentro del 80% central para que funcionen cuando el sistema operativo les aplique formas (círculo, cuadrado redondeado, etc.). Usa el script `install/generate-maskable-icons.js` para generarlos.

## 📲 Instalación Manual

### Para usuarios finales:

1. **Accede a la página de instalación:**
   ```
   https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/
   ```

2. **Sigue las instrucciones en pantalla** según tu dispositivo:
   - **Android:** Toca "Instalar aplicación" cuando aparezca el banner
   - **iOS:** Usa Safari → Compartir → "Agregar a pantalla de inicio"

## 🛠 Generación de APK/IPA con PWABuilder

### Opción 1: PWABuilder Online

1. Ve a [PWABuilder.com](https://www.pwabuilder.com)
2. Ingresa la URL: `https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/`
3. Haz clic en "Start" y espera el análisis
4. Descarga los paquetes para Android e iOS

### Opción 2: PWABuilder CLI

```bash
# Instalar PWABuilder CLI
npm install -g @pwabuilder/cli

# Generar paquetes
pwa package https://ultranavgroup.sharepoint.com/sites/unavqa/appsea/AppMobile/install/

# O usar el archivo de configuración local
pwa package --manifest pwabuilder.json
```

## 📦 Distribución

### Android (.apk)
- **Instalación directa:** Los usuarios pueden instalar el APK directamente
- **Distribución:** Email, intranet, o servicios de distribución empresarial
- **Requisitos:** Android 5.0+ (API 21+)

### iOS (.ipa)  
- **Distribución empresarial:** Requiere certificado de desarrollador empresarial de Apple
- **TestFlight:** Para distribución beta
- **Instalación directa:** Solo con dispositivos con jailbreak (no recomendado)

## 🔧 Configuración Avanzada

### Personalización del Service Worker

Edita `sw.js` para:
- Agregar más URLs al cache
- Modificar estrategias de cache
- Agregar funcionalidad offline personalizada

### Personalización del Manifest

Edita `manifest.json` para:
- Cambiar colores del tema
- Agregar más shortcuts
- Modificar comportamiento de pantalla

## 🧪 Testing

### Herramientas de prueba:
1. **Chrome DevTools:** Application → Manifest / Service Workers
2. **Lighthouse:** Auditoría de PWA
3. **PWA Testing:** [web.dev/measure](https://web.dev/measure)

### Checklist de PWA:
- ✅ Manifest válido
- ✅ Service Worker registrado  
- ✅ HTTPS habilitado
- ✅ Iconos en múltiples tamaños
- ✅ Funcionalidad offline básica
- ✅ Responsive design

## 🚨 Consideraciones de Seguridad

1. **HTTPS requerido:** Las PWAs solo funcionan sobre HTTPS
2. **Permisos mínimos:** Solo solicita los permisos necesarios
3. **Validación de origen:** Verifica que las peticiones vengan del dominio correcto
4. **Cache seguro:** No cachees información sensible

## 🔄 Actualizaciones

Para actualizar la PWA:

1. Incrementa la versión en `manifest.json` y `pwabuilder.json`
2. Actualiza `CACHE_NAME` en `sw.js`
3. Sube los archivos actualizados
4. Los usuarios recibirán la actualización automáticamente

## 📞 Soporte

Para problemas con la instalación:

1. Verifica que todos los archivos estén accesibles vía HTTPS
2. Comprueba la consola del navegador para errores
3. Usa las herramientas de desarrollo para debuggear el Service Worker
4. Valida el manifest con herramientas online

## 🎉 Resultado Esperado

Una vez implementado correctamente:

- ✅ Los usuarios verán un banner de "Instalar aplicación" 
- ✅ La app aparecerá en la pantalla de inicio como una app nativa
- ✅ Funcionará offline con datos cacheados
- ✅ Tendrá splash screen personalizado
- ✅ Se comportará como una aplicación independiente

---

**Desarrollado para Ultranav**  
*Cartilla de Emergencia Marítima - Versión PWA*