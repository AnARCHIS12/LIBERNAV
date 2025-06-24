#!/bin/bash
# Génère tous les PNG multi-tailles pour Electron à partir du SVG
# Usage : ./gen-icons.sh

SVG="../public/libernav-rouge-noir.svg"

for size in 16 32 48 64 128 256 512 1024; do
  inkscape -o icon-${size}x${size}.png -w $size -h $size "$SVG"
done

echo "Icônes générées dans $(pwd) :"
ls -lh icon-*.png
