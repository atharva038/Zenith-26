# Stadium Model Setup

## How to Download the Sketchfab Stadium

1. **Visit the Sketchfab Model Page:**
   - Go to: https://sketchfab.com/3d-models/football-stadium-soccer-stadium-f220069f47534232becbae2dc3a5123e

2. **Download the Model:**
   - Click the **"Download 3D Model"** button
   - Choose **GLB** or **GLTF** format (GLB is preferred)
   - You may need to create a free Sketchfab account

3. **Place the File:**
   - Download the file and rename it to `stadium.glb`
   - Place it in this folder: `public/models/stadium.glb`

4. **Restart the Dev Server:**
   - Stop the running dev server (Ctrl+C)
   - Run `npm run dev` again

## File Structure
```
public/
  models/
    stadium.glb  <-- Place your downloaded file here
    README.md    <-- This file
```

## Fallback
If the model is not found, the app will automatically use the built-in geometric stadium as a fallback.

## Model Info
- **Name:** Football Stadium / Soccer Stadium
- **Author:** Studio Lab
- **Platform:** Sketchfab
- **License:** Check Sketchfab for licensing details
