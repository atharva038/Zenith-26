# 🎬 ZENITH 2026 - What You'll See

## Stadium Intro Experience (20 seconds)

### Scene 1: OPENING (0-3s)
```
🎥 CAMERA: Starts 120 meters above stadium
   Position: [0, 120, 0] - Bird's eye view
   FOV: 60° → 50° (zooming in)
   
✨ EFFECTS:
   - Camera shake (4 quick jitters)
   - 100 energy particles floating everywhere
   - Blue/Orange glowing lights
   - Stars in background (8000 count)
   
📺 UI:
   - "ZENITH STADIUM" gradient title (top)
   - "WELCOME TO THE ARENA" subtitle
   - "SGGSIE&T 2026" badge with decorative lines
   - Progress bar: 0% → 15%
```

### Scene 2: DESCENT (3-7s)
```
🎥 CAMERA: Swooping down toward field
   Position: [0, 80, 60] → [5, 8, 8]
   FOV: 50° → 70° (dramatic reveal)
   
⚽ PLAYER:
   - Your Ready Player Me avatar appears
   - Scale: 1.2x (heroic size)
   - Slight rotation (15°)
   - Gentle breathing animation
   - Football at feet with rotating animation
   
🌟 LIGHTING:
   - Spotlight from above (30 intensity)
   - Blue rim light from behind
   - Orange fill light from front
   - Ground energy ring (2m diameter, cyan)
   
💫 PARTICLES:
   - 100 particles moving vertically
   - Pulsing opacity
   - 3-color palette (Orange/Blue/White)
   
📺 UI:
   - Progress bar: 15% → 35%
   - "LIVE CAMERA FEED" indicator pulsing
```

### Scene 3: TITLE REVEAL (7-8s)
```
🎥 CAMERA: Close approach to player
   FOV: 70° (wide angle)
   
🏆 TITLE CARD APPEARS!
   - Giant 3D "ZENITH 2026" sign
   - Position: 25m high, 20m behind player
   - Orange glowing box (20m × 5m)
   - Blue neon borders (0.3m cylinders)
   - 20 particles orbiting title
   - Gentle rotation animation
   
👕 JERSEY OVERLAY:
   - Floating number above player chest
   - Pulsing orange emissive glow
   - Semi-transparent (90% opacity)
   
🌊 CROWD ENERGY:
   - 3 expanding wave rings on ground
   - Orange/Blue alternating
   - 3m, 5m, 7m diameter
   
📺 UI:
   - Progress bar: 35% → 40%
```

### Scene 4: HERO SHOT (8-11s)
```
🎥 CAMERA: Circling around player
   Position: [-8, 5, 5] (side angle)
   FOV: 45° (tight cinematic)
   Dynamic look-at with slight lag
   
⚽ PLAYER ANIMATION:
   - Gentle sway (rotation.y: ±0.05)
   - Vertical bob (0.02m)
   - Breathing (scale.y: 1 ± 0.01)
   - Ball hover animation (±0.02m)
   - Ball rotation (continuous)
   
🎆 POST-PROCESSING:
   - Bloom: 1.5 intensity
   - Vignette: 0.8 darkness
   - Glow on all emissive materials
   
📺 UI:
   - Progress bar: 40% → 55%
   - "Enter ZENITH →" button glowing
```

### Scene 5: FULL FIELD (11-15s)
```
🎥 CAMERA: Pulling back for wide shot
   Position: [-20, 15, -30]
   FOV: 75° (ultra-wide)
   
🏟️ STADIUM VISIBLE:
   - Full 105m × 68m field
   - 21 grass stripes (green alternating)
   - 4 floodlight towers (35m high)
   - 8000 crowd members in stands
   - 2 goal posts with nets
   - White field lines glowing
   
🎪 TITLE CARD:
   - Still visible in background
   - 20 particles still orbiting
   - Rotating gently
   
📺 UI:
   - Progress bar: 55% → 75%
```

### Scene 6: AERIAL RETURN (15-19s)
```
🎥 CAMERA: Rising back up
   Position: [0, 70, 0] (high aerial)
   FOV: 60° (balanced view)
   
🌌 ATMOSPHERE:
   - Stars more prominent
   - Fog at distance (100-250m)
   - Deep space background (#0a0a1f)
   
✨ PARTICLES:
   - All 100 still floating
   - Creating depth with parallax
   
📺 UI:
   - Progress bar: 75% → 95%
   - "LIVE CAMERA FEED" still active
```

### Scene 7: FINALE (19-20s)
```
🎥 CAMERA: Final ascent
   Position: [0, 120, 0] (back to start)
   FOV: 40° (dramatic zoom out)
   
🎬 TRANSITION:
   - Entire scene fades to black
   - 1.5 second fade duration
   - Auto-navigate to /home
   
📺 UI:
   - Progress bar: 95% → 100%
   - Corner brackets still visible
   - "Enter ZENITH →" button highlighted
```

---

## 🎮 Interactive Elements

### Skip Button (Always Available)
- **Location:** Bottom-right corner
- **Style:** Gradient Orange→Blue
- **Hover:** 
  - Scale: 110%
  - Glow: 60px orange shadow
  - Shimmer animation across button
  - Arrow moves 2px right
- **Action:** Immediate fade + navigate to /home (500ms)

### Progress Bar
- **Location:** Bottom-center
- **Width:** 384px (96 × 4px)
- **Update:** Every 100ms (0.5% increment)
- **Display:** "45% • Cinematic tour in progress..."

### UI Decorations
- **4 Corner L-brackets**
  - Top-left: Orange
  - Top-right: Blue
  - Bottom-left: Blue
  - Bottom-right: Orange
  - Size: 128px × 128px × 4px
  - Opacity: 50%

---

## 🎨 Color Psychology

- **Orange (#ff6b00):** Energy, Competition, Excitement
- **Blue (#00d4ff):** Trust, Technology, Innovation
- **White:** Purity, Excellence, Clarity
- **Black (#0a0a1f):** Sophistication, Focus, Drama

---

## 🔊 What You'll Hear (Future)
Currently silent, but planned audio:
- [ ] Ambient stadium noise (crowd murmur)
- [ ] Referee whistle at start
- [ ] Dramatic music score
- [ ] Crowd cheer at player reveal
- [ ] Whoosh sounds on camera movements

---

## 📱 Responsive Design
- **Desktop:** Full experience with all effects
- **Mobile:** Optimized particle count, simplified post-processing
- **Touch devices:** Custom cursor hidden automatically

---

## ⚡ Performance
- **60 FPS target** on modern GPUs
- **WebGL 2.0** required
- **Preloaded model** (no loading spinner)
- **Optimized materials** (shared via useMemo)
- **No shadows** (performance boost)

---

*Experience begins at: `http://localhost:5173/`* 🎬
*Homepage at: `http://localhost:5173/home`* 🏠
