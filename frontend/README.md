# ZENITH 2026 - Cinematic Sports Intro

A stunning 3D cinematic intro animation for the ZENITH 2026 college sports festival website, built with React, Three.js, GSAP, and Framer Motion.

## 🎬 Features

- **Immersive 3D Environment**: Stadium setting with cricket player, ball, and atmospheric lighting
- **GSAP Animation Timeline**: Smooth, sequenced animations (player swing → ball flight → impact → logo reveal)
- **Particle Effects**: Dynamic particle bursts on ball impact
- **Neon Logo Reveal**: Energetic ZENITH 2026 logo with glow effects
- **Smooth Transitions**: Framer Motion page transitions from intro to homepage
- **Mouse Parallax**: Interactive camera movement based on mouse position
- **Skip Functionality**: Allow users to skip the intro
- **Smart Fallback**: Detects WebGL support and device capabilities, serves 2D version for mobile/low-end devices
- **Responsive Design**: Works beautifully on all screen sizes

## 🚀 Tech Stack

- **React 18** with Vite
- **Three.js** + **React Three Fiber** - 3D graphics
- **@react-three/drei** - 3D helpers and utilities
- **GSAP** - Animation timeline and sequencing
- **Framer Motion** - Page transitions and UI animations
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Custom Fonts**: Orbitron & Rajdhani (sporty, futuristic)

## 📦 Installation

```bash
npm install
```

## 🎮 Usage

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🎯 Key Components

### IntroScene
The main 3D cinematic experience featuring:
- Stadium environment with ground, lights, and boundary markers
- 3D player model with cricket bat
- Ball with glow effects and motion trail
- GSAP timeline for synchronized animations
- Particle explosion on impact
- Logo reveal with neon effects

### SimplifiedIntro
Lightweight 2D alternative that:
- Uses only CSS/Framer Motion animations
- Shows ball flying animation
- Reveals logo with smooth transitions
- Perfect for mobile devices

### Homepage
Feature-rich landing page with:
- Hero section with gradient text
- Stats showcase
- Events preview grid
- Smooth scroll animations
- Responsive design

## 🎬 Animation Timeline

1. **Initial State (0-1s)**: Camera pans to player
2. **Swing (1-1.5s)**: Player swings bat using GSAP rotation
3. **Ball Flight (1.5-3s)**: Ball flies toward camera with scale/position tweens
4. **Impact (3-3.3s)**: Flash effect + particle burst
5. **Logo Reveal (3.3-5.3s)**: ZENITH 2026 appears with elastic easing
6. **Transition (5.3-6.3s)**: Fade out and navigate to homepage

## 🎨 Color Scheme

- **Neon Blue**: `#00d4ff`
- **Neon Orange**: `#ff6b35`
- **Electric Cyan**: `#00ffff`
- **Dark Background**: `#0a0a0a`

## 📱 Testing

### Reset Intro (for testing)
Open browser console and run:
```javascript
localStorage.removeItem('introPlayed');
```
Then refresh the page to see the intro again.

## 🎉 Credits

Built with ❤️ for ZENITH 2026 Sports Festival

---

**Ready to experience the intro?** Run `npm run dev` and open the browser! 🚀

