/**
 * Script para generar iconos maskable para PWA
 * Los iconos maskable necesitan contenido dentro del 80% central del área total
 */

const fs = require('fs');
const path = require('path');

// Función para crear SVG maskable
function createMaskableSVG(size) {
    const radius = size / 2;
    const safeZoneRadius = radius * 0.8; // 80% del radio total
    const fontSize = size * 0.35; // Tamaño de fuente proporcional
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background circle covering the entire icon -->
  <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#23236c"/>
  
  <!-- Gradient overlay for depth -->
  <defs>
    <radialGradient id="grad${size}" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#3a3a8c;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#23236c;stop-opacity:1" />
    </radialGradient>
  </defs>
  <circle cx="${radius}" cy="${radius}" r="${radius}" fill="url(#grad${size})"/>
  
  <!-- Safe zone indicator (for development, remove in production) -->
  <!-- <circle cx="${radius}" cy="${radius}" r="${safeZoneRadius}" fill="none" stroke="rgba(255,0,0,0.3)" stroke-width="2" stroke-dasharray="5,5"/> -->
  
  <!-- Main content - "U" letter centered and sized for safe zone -->
  <text x="${radius}" y="${radius}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="central">U</text>
  
  <!-- Decorative elements within safe zone -->
  <circle cx="${radius}" cy="${radius - safeZoneRadius * 0.4}" r="${size * 0.015}" fill="rgba(255,255,255,0.4)"/>
  <circle cx="${radius - safeZoneRadius * 0.3}" cy="${radius + safeZoneRadius * 0.5}" r="${size * 0.012}" fill="rgba(255,255,255,0.3)"/>
  <circle cx="${radius + safeZoneRadius * 0.3}" cy="${radius + safeZoneRadius * 0.5}" r="${size * 0.012}" fill="rgba(255,255,255,0.3)"/>
  
  <!-- Subtle border ring -->
  <circle cx="${radius}" cy="${radius}" r="${radius - 4}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
</svg>`;
}

// Función para crear HTML de prueba
function createTestHTML() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maskable Icons Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        .icon-test {
            display: inline-block;
            margin: 20px;
            text-align: center;
        }
        .icon-container {
            position: relative;
            display: inline-block;
        }
        .icon {
            border-radius: 20%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .mask-overlay {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            opacity: 0.3;
        }
        .circle-mask { border-radius: 50%; background: rgba(255,0,0,0.2); }
        .rounded-mask { border-radius: 25%; background: rgba(0,255,0,0.2); }
        .square-mask { border-radius: 0%; background: rgba(0,0,255,0.2); }
        
        h2 { color: #333; margin-top: 40px; }
        p { color: #666; margin-bottom: 30px; }
        
        .size-192 { width: 192px; height: 192px; }
        .size-512 { width: 128px; height: 128px; } /* Mostrar más pequeño para la página */
        
        .mask-demo {
            display: flex;
            gap: 20px;
            align-items: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>🎭 Maskable Icons Test - UNAV Cartilla</h1>
    <p>Los iconos maskable se adaptan a diferentes formas según el sistema operativo.</p>
    
    <h2>📱 Iconos Generados</h2>
    
    <div class="icon-test">
        <h3>192x192 (Maskable)</h3>
        <div class="icon-container">
            <img src="maskable-icon-192x192.svg" alt="Maskable 192" class="icon size-192">
        </div>
    </div>
    
    <div class="icon-test">
        <h3>512x512 (Maskable)</h3>
        <div class="icon-container">
            <img src="maskable-icon-512x512.svg" alt="Maskable 512" class="icon size-512">
        </div>
    </div>
    
    <h2>🔍 Simulación de Máscaras</h2>
    <p>Así se verían los iconos con diferentes formas aplicadas por el sistema:</p>
    
    <div class="mask-demo">
        <div class="icon-container">
            <img src="maskable-icon-192x192.svg" alt="Circle mask" class="icon" style="width: 100px; height: 100px; border-radius: 50%;">
            <div class="mask-overlay circle-mask" style="width: 100px; height: 100px;"></div>
        </div>
        <span>Círculo (iOS)</span>
    </div>
    
    <div class="mask-demo">
        <div class="icon-container">
            <img src="maskable-icon-192x192.svg" alt="Rounded mask" class="icon" style="width: 100px; height: 100px; border-radius: 25%;">
            <div class="mask-overlay rounded-mask" style="width: 100px; height: 100px;"></div>
        </div>
        <span>Redondeado (Android)</span>
    </div>
    
    <div class="mask-demo">
        <div class="icon-container">
            <img src="maskable-icon-192x192.svg" alt="Square mask" class="icon" style="width: 100px; height: 100px; border-radius: 15%;">
            <div class="mask-overlay square-mask" style="width: 100px; height: 100px;"></div>
        </div>
        <span>Cuadrado (Algunos Android)</span>
    </div>
    
    <h2>✅ Checklist de Maskable Icons</h2>
    <ul>
        <li>✅ Contenido dentro del 80% central</li>
        <li>✅ Fondo que cubre toda el área</li>
        <li>✅ Contraste adecuado</li>
        <li>✅ Elementos importantes no cerca de los bordes</li>
        <li>✅ Funciona en formas circulares, cuadradas y redondeadas</li>
    </ul>
    
    <h2>🔗 Herramientas Útiles</h2>
    <ul>
        <li><a href="https://maskable.app/" target="_blank">Maskable.app</a> - Editor online</li>
        <li><a href="https://web.dev/maskable-icon/" target="_blank">Web.dev Guide</a> - Documentación oficial</li>
    </ul>
    
    <p><em>Generado para Cartilla de Emergencia UNAV - PWA Icons</em></p>
</body>
</html>`;
}

// Crear directorio si no existe
const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generar iconos maskable
const sizes = [192, 512];

sizes.forEach(size => {
    const svgContent = createMaskableSVG(size);
    const filename = `maskable-icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    
    fs.writeFileSync(filepath, svgContent, 'utf8');
    console.log(`✅ Generado: ${filename}`);
});

// Generar página de prueba
const testHTML = createTestHTML();
const testPath = path.join(__dirname, 'maskable-icons-test.html');
fs.writeFileSync(testPath, testHTML, 'utf8');
console.log('✅ Generado: maskable-icons-test.html');

console.log(`
🎉 Iconos maskable generados exitosamente!

📁 Archivos creados:
- icons/maskable-icon-192x192.svg
- icons/maskable-icon-512x512.svg  
- install/maskable-icons-test.html

📋 Próximos pasos:
1. Convierte los SVG a PNG usando tu herramienta favorita
2. Sube los PNG a la carpeta icons/ en SharePoint
3. Abre maskable-icons-test.html para verificar el diseño
4. Prueba en https://maskable.app/ para validar

💡 Nota: Los iconos maskable tienen el contenido dentro del 80% central
para que funcionen correctamente cuando el sistema les aplique formas.
`);

// Crear también las instrucciones de conversión
const conversionInstructions = `# 🔄 Conversión de SVG a PNG

## Opción 1: Online (Recomendado)
1. Ve a https://convertio.co/svg-png/
2. Sube los archivos SVG
3. Configura la calidad al máximo
4. Descarga los PNG

## Opción 2: Usando Inkscape (Gratis)
\`\`\`bash
# Instalar Inkscape primero
inkscape --export-type=png --export-width=192 --export-height=192 maskable-icon-192x192.svg
inkscape --export-type=png --export-width=512 --export-height=512 maskable-icon-512x512.svg
\`\`\`

## Opción 3: Usando ImageMagick
\`\`\`bash
convert -background none -size 192x192 maskable-icon-192x192.svg maskable-icon-192x192.png
convert -background none -size 512x512 maskable-icon-512x512.svg maskable-icon-512x512.png
\`\`\`

## Opción 4: Photoshop/GIMP
1. Abre el SVG en Photoshop/GIMP
2. Configura el tamaño correcto (192x192 o 512x512)
3. Exporta como PNG con transparencia

¡Después de convertir, sube los PNG a tu carpeta icons/ en SharePoint!
`;

fs.writeFileSync(path.join(__dirname, 'conversion-instructions.md'), conversionInstructions, 'utf8');
console.log('✅ Generado: conversion-instructions.md');