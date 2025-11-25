# 🎮 Interactive Parallax Demo

## 🚀 Quick Access

Navigate to: **`http://localhost:5173/parallax-demo`**

## ✨ What You'll See

This is a **live, interactive demonstration** of next-level parallax effects using GSAP. The demo includes:

### 🎯 Visual Features

1. **Stadium Background Parallax**
   - Moves subtly WITH your mouse movement
   - Creates a 3D depth sensation
   - Smooth GSAP animations

2. **Text Parallax (Opposite Direction)**
   - Title and subtitle move OPPOSITE to mouse
   - More pronounced movement than background
   - Creates incredible immersive feel

3. **Multi-Layer Particle System**
   - 3 layers of particles moving at different speeds
   - Background (slowest) → Midground → Foreground (fastest)
   - Simulates true depth perception

4. **Custom Cursor**
   - Follow-along cursor with smooth GSAP animation
   - Visual feedback for mouse position

### 🎛️ Interactive Controls

The demo includes a **live control panel** where you can:

- **Adjust Intensity** (5-50px): Control how much elements move
- **Switch Demo Modes**:
  - `All`: See all effects combined
  - `Stadium`: Only background parallax
  - `Text`: Only text parallax
  - `Layers`: Only particle layers
- **Toggle Grid**: Show/hide alignment grid
- **Reset Positions**: Snap everything back to center
- **Real-time Mouse Position**: See normalized coordinates

### 📊 Visual Indicators

- **Grid Overlay**: 12x12 grid to visualize movement
- **Center Crosshair**: Reference point for parallax
- **Active Effect Badges**: Shows which effects are enabled
- **Mouse Position Display**: Live X/Y coordinates

## 🎨 How It Works

### The Magic Formula:

```javascript
// Stadium moves WITH mouse (subtle)
x = mouseX * intensity * 0.5
y = mouseY * intensity * 0.5

// Text moves OPPOSITE (pronounced)
x = -mouseX * intensity * 1.5
y = -mouseY * intensity * 1.5

// Layers have different multipliers
layer1: 0.3x (slowest)
layer2: 0.8x (medium)
layer3: 1.5x (fastest)
```

### GSAP Animation Settings:

- **Duration**: 0.5s - 1s (different per layer)
- **Easing**: `power2.out` (smooth deceleration)
- **Performance**: `will-change-transform` for GPU acceleration

## 🎯 Testing Different Scenarios

### 1. Maximum Intensity
- Set slider to **50px**
- Mode: **All**
- Move mouse in large circles
- **Result**: Dramatic depth effect

### 2. Subtle & Elegant
- Set slider to **10px**
- Mode: **All**
- Gentle mouse movements
- **Result**: Refined, premium feel

### 3. Text-Only Focus
- Set slider to **30px**
- Mode: **Text**
- **Result**: See how opposite movement creates tension

### 4. Background-Only Focus
- Set slider to **20px**
- Mode: **Stadium**
- **Result**: Subtle 3D background shift

### 5. Layer Depth Demo
- Set slider to **40px**
- Mode: **Layers**
- **Result**: Pure depth perception with particles

## 💡 Key Observations

### What Makes This "Next-Level":

1. **Opposite Direction Movement**
   - Stadium + text moving in opposite directions = mind-blowing depth
   - Creates visual tension that draws the eye

2. **Multiple Speed Layers**
   - Each element moves at different speed
   - Simulates real-world parallax (like looking out a train window)

3. **Smooth GSAP Animations**
   - No janky CSS transitions
   - Butter-smooth 60fps animations
   - Smart easing functions

4. **Real-time Feedback**
   - See exactly what's happening
   - Adjust parameters live
   - Understand the mechanics

## 🎬 Recommended Test Sequence

1. **Start with Grid ON** - See the movement clearly
2. **Try "All" mode at 20px** - Balanced demo
3. **Increase to 40px** - Feel the drama
4. **Switch to "Text" only** - Isolate the effect
5. **Try "Layers" mode** - See depth layers
6. **Turn Grid OFF** - Experience the final result
7. **Reset** - Start over with different settings

## 🔥 Pro Tips

- **Slow movements** = elegant, premium feel
- **Fast movements** = dramatic, energetic feel
- **High intensity** = good for hero sections
- **Low intensity** = good for content areas
- **Grid helps** during development
- **Grid off** for final experience

## 📱 Performance Notes

- Uses **GPU-accelerated transforms** (translateX/Y)
- **will-change-transform** optimization
- Smooth on modern devices
- Mobile-optimized (touch events coming soon)

## 🎓 Learning Outcomes

After using this demo, you'll understand:

1. How to normalize mouse coordinates (-1 to 1)
2. How to apply different movement multipliers
3. How opposite-direction creates depth
4. How GSAP makes animations smooth
5. How to layer effects for maximum impact

## 🚀 Apply to Your Homepage

The techniques in this demo can be directly applied to:
- Hero sections
- Landing pages
- Product showcases
- Interactive backgrounds
- Any immersive experience

---

**Ready to experience it?** Start your dev server and visit `/parallax-demo`!

```bash
npm run dev
# Then navigate to http://localhost:5173/parallax-demo
```
