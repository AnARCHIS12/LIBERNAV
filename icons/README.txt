Placez ici les PNG générés à partir de votre SVG pour toutes les tailles standards :
icon-16x16.png
icon-32x32.png
icon-48x48.png
icon-64x64.png
icon-128x128.png
icon-256x256.png
icon-512x512.png
icon-1024x1024.png

Exemple de commande Inkscape :

for size in 16 32 48 64 128 256 512 1024; do
  inkscape -o icons/icon-${size}x${size}.png -w $size -h $size libernav-rouge-noir.svg
done

Ensuite, dans package.json :
"build": {
  "icon": "icons"
}
