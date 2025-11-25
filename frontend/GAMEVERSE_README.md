# 🎮 GameVerse - 3D Interactive Sports Map

## Overview
GameVerse is an immersive 3D interactive experience built with Three.js that showcases all ZENITH 2026 sports events as floating islands in a cosmic space environment.

## Features

### 🏝️ Floating Islands
- **6 Sport Platforms**: Football, Cricket, Badminton, Basketball, Volleyball, Chess
- **Smooth Animations**: Gentle floating motion and continuous rotation
- **Gold Glow Effects**: Each island emits a golden aura matching the ZENITH theme
- **Orbital Particles**: 8 glowing particles orbit each island

### 🎨 Visual Effects
- **Bloom Post-Processing**: Beautiful glow effects on all golden elements
- **Black & Gold Theme**: Consistent with ZENITH brand identity
- **Dynamic Lighting**: Multiple point lights, directional lights, and ambient lighting
- **Starfield Background**: 5000+ stars create depth and atmosphere
- **Fog Effects**: Depth-based fog for dramatic distance rendering

### 🎥 Camera System
- **Auto-Orbiting Camera**: Slowly circles around the scene
- **Manual Controls**: Drag to rotate, scroll to zoom
- **Optimal Viewing**: Camera positioned for best overview of all islands

### 🖱️ Interactions
- **Clickable Islands**: Click any sport island to view details
- **Hover Effects**: Cursor changes to pointer on hover
- **Modal Details**: Beautiful modal popup with event information
- **Responsive Design**: Works on desktop and tablet

### 📱 Sport Details Modal
Each sport island opens a modal with:
- **Event Name & Icon**: Large emoji icon and sport title
- **Description**: Overview of the competition
- **Event Details**: Date, venue, team size, prize pool
- **Rules**: Complete list of tournament rules
- **Action Buttons**: Register Now & Learn More CTAs

## Technical Stack

### Core Technologies
- **React 19.2.0**: UI framework
- **Three.js 0.181.2**: 3D rendering engine
- **@react-three/fiber 9.4.0**: React renderer for Three.js
- **@react-three/drei 10.7.7**: Helper components and abstractions
- **@react-three/postprocessing 3.0.4**: Post-processing effects

### Animation & Styling
- **Framer Motion 12.23.24**: Modal animations
- **GSAP**: (already in project for other animations)
- **Tailwind CSS**: Styling and responsive design

## File Structure

```
frontend/src/
├── pages/
│   └── GameVerse.jsx          # Main 3D scene container
├── components/
│   └── gameverse/
│       ├── FloatingIsland.jsx # Individual sport island component
│       └── SportModal.jsx     # Event details modal
└── App.jsx                    # Route configuration
```

## Sports Configuration

### Available Sports
1. **Football** ⚽
   - Position: Center (0, 0, 0)
   - Color: Green (#2d5016)
   - Prize: ₹50,000

2. **Cricket** 🏏
   - Position: Left-Back (-6, 2, -4)
   - Color: Blue (#1a3a52)
   - Prize: ₹40,000

3. **Badminton** 🏸
   - Position: Right-Back (6, -1, -3)
   - Color: Red (#4a1a1a)
   - Prize: ₹25,000

4. **Basketball** 🏀
   - Position: Left-Front (-5, -2, 3)
   - Color: Brown (#5a2a0a)
   - Prize: ₹35,000

5. **Volleyball** 🏐
   - Position: Right-Front (5, 1, 4)
   - Color: Purple (#2a2a5a)
   - Prize: ₹30,000

6. **Chess** ♟️
   - Position: Top-Back (0, 3, -6)
   - Color: Black (#1a1a1a)
   - Prize: ₹20,000

## Navigation

### Access GameVerse
- **From Homepage**: Click "🎮 GameVerse" in the navigation bar
- **Direct URL**: `/gameverse`
- **Back to Home**: Click "← Back to Home" button in top-left

### Controls
- **Drag**: Rotate camera around the scene
- **Scroll**: Zoom in/out (min: 10 units, max: 30 units)
- **Click Island**: Open sport details modal
- **Close Modal**: Click X button or backdrop

## Customization

### Adding New Sports
Edit `sportsData` array in `GameVerse.jsx`:

```javascript
{
  id: 7,
  name: "TENNIS",
  icon: "🎾",
  color: "#2a5a2a",
  position: [x, y, z],
  tagline: "Your tagline",
  description: "Event description...",
  date: "March XX-XX, 2026",
  venue: "Venue name",
  teamSize: "1 vs 1",
  prize: "₹XX,000",
  rules: ["Rule 1", "Rule 2", ...]
}
```

### Adjusting Island Appearance
In `FloatingIsland.jsx`:
- **Size**: Change `RoundedBox args={[3, 0.5, 3]}`
- **Float Speed**: Modify `Math.sin(time * 0.5)` multiplier
- **Rotation Speed**: Adjust `time * 0.2` multiplier
- **Glow Intensity**: Change `emissiveIntensity` value

### Camera Settings
In `CameraRig` component:
- **Orbit Radius**: Change `radius = 18`
- **Orbit Speed**: Modify `time * 0.1` multiplier
- **Initial Position**: Adjust `position={[0, 8, 18]}`
- **Field of View**: Change `fov={50}`

### Lighting Customization
In `Scene` component:
- **Ambient Light**: Adjust `intensity={0.2}`
- **Directional Light**: Modify position and color
- **Point Lights**: Each island has individual light

### Bloom Effect
In `EffectComposer`:
```javascript
<Bloom
  intensity={1.2}          // Glow strength
  luminanceThreshold={0.2}  // Brightness cutoff
  luminanceSmoothing={0.9}  // Smoothness
/>
```

## Performance Optimization

### WebGL Settings
```javascript
gl={{
  antialias: true,           // Smooth edges
  alpha: true,               // Transparency support
  powerPreference: "high-performance"
}}
```

### Geometry Optimization
- **Low-poly models**: Simple rounded boxes and spheres
- **Instancing**: Reusable geometry for particles
- **LOD ready**: Can add Level of Detail if needed

### Render Optimization
- **Fog**: Reduces far-distance rendering
- **Frustum Culling**: Automatic in Three.js
- **60 FPS Target**: Optimized for smooth animation

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14.1+
- ✅ Opera 76+

### Requirements
- WebGL 2.0 support
- Modern JavaScript (ES6+)
- Hardware acceleration enabled

## Future Enhancements

### Planned Features
- [ ] GLB model loading for realistic sports equipment
- [ ] Particle effects on hover
- [ ] Sound effects on interactions
- [ ] Animated transitions between islands
- [ ] VR/AR support
- [ ] Mobile touch controls optimization
- [ ] Loading screen with progress bar
- [ ] Island discovery animations on first load

### Potential Additions
- Real-time event countdown timers
- Live registration status indicators
- Team logos on islands
- Weather effects (rain, snow)
- Day/night cycle
- Music/ambient sounds

## Troubleshooting

### Common Issues

**Black screen on load:**
- Check console for WebGL errors
- Ensure GPU acceleration is enabled
- Try different browser

**Low FPS:**
- Reduce bloom intensity
- Decrease star count
- Disable post-processing
- Lower canvas resolution

**Islands not clickable:**
- Check z-index conflicts
- Verify OrbitControls not blocking events
- Ensure proper event propagation

**Modal not appearing:**
- Check React state updates
- Verify Framer Motion animations
- Check z-index layering

## Credits

**Built for ZENITH 2026**
- Framework: React + Three.js
- Design: Black & Gold theme
- Animations: Framer Motion + Three.js
- Icons: Unicode Emojis

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
