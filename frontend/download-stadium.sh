#!/bin/bash

# Stadium Model Download Script
# This script helps you download the Sketchfab stadium model

echo "================================================"
echo "   ZENITH 2026 - Stadium Model Downloader"
echo "================================================"
echo ""
echo "📌 Manual Download Required:"
echo ""
echo "1. Open your browser and go to:"
echo "   https://sketchfab.com/3d-models/football-stadium-soccer-stadium-f220069f47534232becbae2dc3a5123e"
echo ""
echo "2. Click 'Download 3D Model' button"
echo "3. Login or create free Sketchfab account if needed"
echo "4. Choose 'glTF' or 'GLB' format (GLB recommended)"
echo "5. Download the file"
echo ""
echo "6. Rename downloaded file to: stadium.glb"
echo "7. Move it to: public/models/stadium.glb"
echo ""
echo "================================================"
echo ""
echo "📂 Expected file location:"
echo "   $(pwd)/public/models/stadium.glb"
echo ""
echo "🔍 Checking if model exists..."

if [ -f "public/models/stadium.glb" ]; then
    echo "✅ Stadium model found!"
    ls -lh public/models/stadium.glb
else
    echo "❌ Stadium model NOT found"
    echo "   Please download manually and place at: public/models/stadium.glb"
fi

echo ""
echo "================================================"
echo "After placing the model, restart your dev server:"
echo "  npm run dev"
echo "================================================"
