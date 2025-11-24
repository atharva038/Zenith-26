# Three.js Animation Debug Guide

## How to Check if Animations Are Working

1. **Open Browser Console** (F12 or Cmd+Option+I on Mac)

2. **Look for these console messages:**
   ```
   Three.js scene initialized with 3 balls
   Starting animation loop...
   Canvas added to container: <canvas>
   Calling animate() to start animation loop
   Animation running, frame: 60 intro: 0.42
   Animation running, frame: 120 intro: 0.84
   Animation running, frame: 180 intro: 1.00
   ```

3. **What Each Animation Does:**

   - **Camera Zoom In** (first ~3 seconds)
     - Camera moves from position (0, 5.2, 26) to (0, 3.2, 20)
     - Should see a gradual zoom-in effect

   - **Halo Rings Rotation**
     - 3 concentric orange/gold rings rotating slowly
     - Located at y = -0.8, should be visible in lower center

   - **Scan Line Movement**
     - Horizontal orange line sweeping left to right
     - Positioned on the ground plane

   - **Spotlight Cone Breathing**
     - 4 stadium spotlight cones pulsing opacity
     - Located at corners: (±22, 18, 12) and (±20, 18, -14)

   - **Sports Balls Animation**
     - Cricket ball (red) at position (-3.2, 0.6, -1.6) - spinning fastest
     - Basketball (orange) at position (0.8, 0.85, -0.2) - medium spin
     - Volleyball (white) at position (3.2, 0.65, 1.2) - slowest spin
     - All balls: rotating + gentle vertical bob + horizontal drift

   - **Mouse Parallax**
     - Move mouse around the screen
     - Camera should follow mouse with smooth lag

## If No Animations Visible:

### Check Console Errors
- Look for any Three.js errors
- Check if all textures loaded
- Verify renderer was created

### Check Z-Index Layering
```
z-[1]   - Stadium background image
z-[10]  - Gradient overlay (subtle)
z-[50]  - Three.js canvas layer ← Should be here
z-[100] - Vignette overlay (very subtle)
z-[200] - Title text
```

### Verify Canvas is Present
In browser console:
```javascript
document.querySelector('canvas')
// Should return <canvas> element
```

### Check if Objects Are in View
The camera is looking at (0, 0.2, 0) from position (0, 3.2, 20).
All objects should be visible within this frustum.

## Expected Visual Result:

- Stadium background image (darker orange sunset)
- Subtle dark gradient overlay
- Three.js elements ON TOP:
  - Glowing halo rings (rotating)
  - Sweeping scan line
  - 3 animated sports balls
  - 4 pulsing spotlight cones
- Title text "ZENITH 2026" on top of everything
- CTA button "Register Now" below title

## Performance Notes:

- Animation should run at 60 FPS
- Pixel ratio capped at 2x for performance
- Console logs every 60 frames (1 second)

## Quick Test:

If you see the stadium background but NO Three.js elements:
1. Check browser console for errors
2. Verify canvas element exists
3. Check if renderer.render() is being called
4. Verify camera position and lookAt are correct

If you see Three.js elements but they're NOT MOVING:
1. Check if requestAnimationFrame is being called
2. Verify the animate() function is actually running (check console logs)
3. Check if the cleanup is canceling the animation frame
