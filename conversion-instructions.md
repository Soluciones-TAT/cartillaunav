# 🔄 Conversión de SVG a PNG

## Opción 1: Online (Recomendado)
1. Ve a https://convertio.co/svg-png/
2. Sube los archivos SVG
3. Configura la calidad al máximo
4. Descarga los PNG

## Opción 2: Usando Inkscape (Gratis)
```bash
# Instalar Inkscape primero
inkscape --export-type=png --export-width=192 --export-height=192 maskable-icon-192x192.svg
inkscape --export-type=png --export-width=512 --export-height=512 maskable-icon-512x512.svg
```

## Opción 3: Usando ImageMagick
```bash
convert -background none -size 192x192 maskable-icon-192x192.svg maskable-icon-192x192.png
convert -background none -size 512x512 maskable-icon-512x512.svg maskable-icon-512x512.png
```

## Opción 4: Photoshop/GIMP
1. Abre el SVG en Photoshop/GIMP
2. Configura el tamaño correcto (192x192 o 512x512)
3. Exporta como PNG con transparencia

¡Después de convertir, sube los PNG a tu carpeta icons/ en SharePoint!
