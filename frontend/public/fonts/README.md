# Font Setup Instructions

To enable the 3D metallic logo text, you need to add a Three.js-compatible font file.

## Quick Setup:

1. **Download the Orbitron font in JSON format:**
   - Visit: https://gero3.github.io/facetype.js/
   - Or use a pre-converted font from: https://github.com/mrdoob/three.js/tree/dev/examples/fonts

2. **Place the font file here:**
   ```
   public/fonts/Orbitron_Bold.json
   ```

## Alternative: Use a different font

If you prefer a different font, you can:
1. Convert any .ttf font to Three.js JSON format using: https://gero3.github.io/facetype.js/
2. Save it as `YourFont.json` in this folder
3. Update the font path in `CinematicIntro.jsx`:
   ```javascript
   font="/fonts/YourFont.json"
   ```

## Temporary Solution:

The component will work without the 3D text - it will just show a warning in the console.
You can replace the `<Text3D>` components with regular `<Text>` from @react-three/drei if needed.

## Default Fonts Available:

Three.js includes some default fonts you can use:
- helvetiker
- optimer
- gentilis

Example path: `/fonts/helvetiker_regular.typeface.json`
