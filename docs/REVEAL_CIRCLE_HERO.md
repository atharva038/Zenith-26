# 🎯 Reveal Circle Hero — Premium Interactive Design

## Overview

The Team Page now features a **premium, experimental hero section** that rewards user curiosity. This is a design pattern seen on high-end agency sites and product pages — rarely on college fest websites.

---

## 🧠 Core Concept: "Reveal on Curiosity"

### Default State
- Hero covered with **dark overlay (90% black)**
- Only **bold typography visible**
- Creates mystery and intrigue

### On Hover (Desktop)
- **Circular window follows the cursor**
- Inside the circle → background image revealed
- Outside the circle → remains dark
- User feels like they're **discovering** Zenith

---

## 🎨 Visual Layers (Top → Bottom)

| Layer | Description |
|-------|-------------|
| **1. Text** | "TEAM ZENITH" + tagline — always visible, white, high contrast |
| **2. Dark Overlay** | 90% black on desktop, 60% on mobile |
| **3. Reveal Mask** | Circular mask following cursor with feathered edge |
| **4. Background Image** | Team photo, scale 1.05, slightly desaturated |

---

## 🎥 Technical Implementation

### Mouse Tracking with Inertia
```javascript
// Smooth lerp (linear interpolation) for natural feel
const lerp = (start, end, factor) => start + (end - start) * factor;

// Factor of 0.08 = high inertia, smooth follow
setSmoothPosition(prev => ({
  x: lerp(prev.x, mousePosition.x, 0.08),
  y: lerp(prev.y, mousePosition.y, 0.08),
}));
```

### CSS Mask for Circular Reveal
```css
mask-image: radial-gradient(
  circle 140px at ${x}px ${y}px, 
  black 0%, 
  black 70%, 
  transparent 100%
);
```

- **140px radius** — large enough to see content
- **70% solid → 100% transparent** — soft feathered edge
- **No hard boundaries** — premium feel

---

## 📱 Mobile Behavior

- **Hover disabled** — touch devices can't hover
- **Lighter overlay (60%)** — image visible by default
- **Text remains centered**
- No interaction needed — mobile users see the full design

---

## 🎞️ Animation Details

| Animation | Details |
|-----------|---------|
| Text entrance | Fade + slide up, 1.2s, custom easing |
| Tagline | Delayed fade, 0.5s delay |
| "Hover to explore" hint | Appears after 2s, 40% opacity |
| Scroll indicator | Subtle vertical line with gradient |
| Reveal circle | Real-time follow with inertia |
| Circle appearance | 0.4s fade when entering/leaving |

---

## 🧠 Emotional Goal

> "There's more beneath the surface. Explore."

The hero communicates:
- **Mystery** — What's hidden?
- **Discovery** — Reward for curiosity
- **Confidence** — Minimal, controlled design
- **Premium** — Unlike typical college sites

---

## 🚫 Design Rules Followed

| Rule | Status |
|------|--------|
| ❌ No bright colors | ✅ Black/white/gray only |
| ❌ No heavy motion | ✅ Only cursor-driven reveal |
| ❌ No text inside reveal | ✅ Text always above |
| ❌ No spotlight/glow | ✅ Pure mask, no effects |
| ❌ No auto animation | ✅ Static until interaction |

---

## 🔧 Configuration

### Adjustable Parameters

```javascript
// Circle radius (currently 140px)
circle 140px at ${x}px ${y}px

// Inertia factor (lower = more smooth, 0.08 is balanced)
const lerp = (start, end, 0.08);

// Feather edge (70% solid before fade)
black 70%, transparent 100%

// Desktop overlay darkness
bg-black/90

// Mobile overlay darkness  
bg-black/60
```

---

## 📊 Performance Notes

- **requestAnimationFrame** used for smooth 60fps tracking
- **Cleanup on unmount** — no memory leaks
- **CSS transforms** for GPU acceleration
- **Minimal re-renders** — only position state updates

---

## ✨ Result

A hero section that feels:
- ✅ Editorial
- ✅ Premium  
- ✅ Curious
- ✅ Unlike "normal college fest websites"

---

*Implemented: January 2026*
*Pattern: Agency-grade interactive design*
