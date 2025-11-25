# 🎬 Scroll-Triggered Animations Guide

## 🚀 Quick Access
Navigate to: **`http://localhost:5173/scroll-animations`**

## ✨ What's Implemented

This page showcases **next-level scroll-triggered animations** combining the power of **Framer Motion** and **GSAP ScrollTrigger** for the ultimate immersive experience.

---

## 🎯 Animation Effects Breakdown

### 1. **Slide from Bottom** 🔼
**Technology:** Framer Motion `useInView`

**Where Used:** 
- About section
- Footer

**Effect:**
- Elements start 100px below their final position
- Opacity fades from 0 to 1
- Smooth cubic-bezier easing
- Triggers when element is 100px from viewport

**Code Pattern:**
```jsx
<motion.section
  initial={{ opacity: 0, y: 100 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
>
  {content}
</motion.section>
```

---

### 2. **Fade with Blur** 🌫️
**Technology:** Framer Motion with CSS filters

**Where Used:**
- Section titles (About, Events)
- Events section container

**Effect:**
- Starts with `blur(20px)` and opacity 0
- Transitions to sharp focus `blur(0px)` and opacity 1
- Creates dreamy, cinematic entrance
- Perfect for headlines

**Code Pattern:**
```jsx
<motion.h2
  initial={{ opacity: 0, filter: "blur(20px)" }}
  whileInView={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 1 }}
>
  Title
</motion.h2>
```

---

### 3. **Rotate Slightly** 🔄
**Technology:** GSAP ScrollTrigger with 3D transforms

**Where Used:**
- Stats cards (About section)
- Event sport cards

**Effect:**
- Elements rotate on X or Y axis (rotateX: -15°, rotateY: ±25°)
- Combined with scale (0.9 → 1.0)
- 3D perspective for depth
- Staggered animation for multiple items

**Stats Cards (GSAP):**
```jsx
gsap.fromTo(
  cards,
  { opacity: 0, y: 60, rotateX: -15, scale: 0.9 },
  { 
    opacity: 1, 
    y: 0, 
    rotateX: 0, 
    scale: 1,
    stagger: 0.15,  // Each card animates 0.15s after previous
    scrollTrigger: {
      trigger: cardsContainer,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  }
);
```

**Event Cards (GSAP with alternating rotation):**
```jsx
rotateY: index % 2 === 0 ? -25 : 25,  // Alternates left/right
ease: "back.out(1.2)",  // Bouncy elastic effect
```

---

### 4. **Sparkle Effects** ✨
**Technology:** Framer Motion with random positioning

**Where Used:**
- Hero section background
- Stats cards
- Event cards on hover
- Footer

**Effect:**
- Random positioned particles
- Infinite pulsing animation
- Opacity: 0 → 1 → 0
- Scale: 0 → 1.5 → 0
- Rotation: 0 → 360°
- Staggered delays for natural feel

**Code:**
```jsx
const Sparkle = ({ delay = 0, size = 6 }) => (
  <motion.div
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 1.5,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2,
    }}
  />
);
```

---

## 🎨 Combined Techniques

### **Hero Section**
- **Mouse Parallax** (GSAP) - Stadium + text move opposite
- **Sparkle particles** - 15 animated sparkles
- **Scroll fade-out** - Hero fades/scales as you scroll (Framer Motion `useScroll`)
- **Entrance animations** - Title blur-in, button pop-in

### **About Section**
- **Section slide-up** - Entire section enters from bottom
- **Title fade-blur** - Headline with blur effect
- **Text slide-left** - Description from left side
- **Cards rotate + stagger** - 4 stat cards with GSAP stagger
- **Card sparkles** - 3 sparkles per card

### **Events Section**
- **Section fade-blur** - Container with blur entrance
- **Title rotate** - 3D rotateX effect
- **Event cards**:
  - GSAP scroll-trigger with alternating rotateY
  - Scale from 0.7 to 1.0
  - Bounce-out easing (`back.out`)
  - Hover: Scale + 3D tilt + sparkles
  - Icon spin on hover

### **Footer**
- **Section slide-up** - Enters from bottom
- **Title scale-in** - Pops from center
- **Social icons**:
  - Staggered fade-up (0.1s delay each)
  - Hover: Scale + spin 360° + color change
- **Background sparkles** - 10 ambient particles

---

## 🎮 Interactive Elements

### **Hover Effects (Framer Motion):**
```jsx
<motion.div
  whileHover={{ 
    scale: 1.05, 
    rotateY: 5,
    borderColor: "#ffb36a"
  }}
  whileTap={{ scale: 0.95 }}
>
```

### **Scroll Progress (Hero fade):**
```jsx
const { scrollYProgress } = useScroll();
const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
```

---

## 🔧 Technical Implementation

### **Framer Motion Features Used:**
1. `useInView` - Detect when elements enter viewport
2. `useScroll` - Track scroll position
3. `useTransform` - Map scroll to values
4. `whileInView` - Animate when visible
5. `whileHover` / `whileTap` - Interactive states
6. `viewport={{ once: true }}` - Animate only once
7. CSS filter animations (blur)

### **GSAP ScrollTrigger Features Used:**
1. `scrollTrigger.trigger` - Element to watch
2. `start: "top 80%"` - Animation start point
3. `toggleActions` - Play/reverse on scroll
4. `stagger` - Sequential animation
5. 3D transforms (rotateX, rotateY, perspective)
6. Custom easing (`back.out`, `power3.out`)

### **Performance Optimizations:**
- `will-change-transform` on animated elements
- `perspective` on parent containers
- `once: true` prevents re-animation
- GPU-accelerated transforms
- Lazy sparkle rendering
- Mobile parallax disabled

---

## 📱 Animation Specifications

### Timings:
- **Fast**: 0.5-0.6s (buttons, small elements)
- **Medium**: 0.8s (sections, cards)
- **Slow**: 1-1.2s (titles, blur effects)
- **Stagger**: 0.1-0.15s between items

### Easing Functions:
- **Framer Motion**: `[0.25, 0.4, 0.25, 1]` (custom cubic-bezier)
- **GSAP**: `power2.out`, `power3.out`, `back.out(1.2)`

### Trigger Points:
- Hero: Immediate (on load)
- Sections: `top 80%` (when 80% down viewport)
- Cards: `top 85%` (slightly later)
- Viewport margin: `-100px` (100px before visible)

---

## 🎓 Animation Variants Explained

### **slideUp**
```jsx
hidden: { opacity: 0, y: 100 }
visible: { opacity: 1, y: 0 }
```
Use for: Sections, containers, footers

### **fadeBlur**
```jsx
hidden: { opacity: 0, filter: "blur(10px)" }
visible: { opacity: 1, filter: "blur(0px)" }
```
Use for: Titles, hero text, headlines

### **rotate**
```jsx
hidden: { opacity: 0, rotateX: 45, scale: 0.8 }
visible: { opacity: 1, rotateX: 0, scale: 1 }
```
Use for: Cards, images, special elements

### **slideLeft / slideRight**
```jsx
hidden: { opacity: 0, x: -100 }
visible: { opacity: 1, x: 0 }
```
Use for: Text blocks, side content

---

## 🚀 Usage in Your Project

### 1. Import Required Libraries:
```jsx
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

### 2. Create Animated Section Wrapper:
```jsx
const AnimatedSection = ({ children, variant = "slideUp" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section
      ref={ref}
      variants={variants[variant]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.section>
  );
};
```

### 3. Use GSAP for Complex Sequences:
```jsx
useEffect(() => {
  gsap.fromTo(
    elements,
    { initial state },
    { 
      final state,
      stagger: 0.15,
      scrollTrigger: { trigger, start, end }
    }
  );
}, []);
```

---

## 🎯 Best Practices

1. **Use `once: true`** - Prevents animation replay on scroll up
2. **Stagger delays** - Makes lists feel natural (0.1-0.15s)
3. **Match easing curves** - Consistent feel across animations
4. **Perspective for 3D** - Add `perspective: "1000px"` to parent
5. **Sparkles sparingly** - 3-8 per section, not overwhelming
6. **Mobile considerations** - Disable heavy animations on mobile
7. **Cleanup ScrollTriggers** - `ScrollTrigger.getAll().forEach(t => t.kill())`

---

## 🔥 What Makes This "Next-Level"

1. ✅ **Combines two animation libraries** (Framer Motion + GSAP)
2. ✅ **Multiple animation types** (slide, fade, blur, rotate, sparkle)
3. ✅ **Staggered sequences** (cards animate one after another)
4. ✅ **3D transforms** (rotateX, rotateY for depth)
5. ✅ **Interactive hovers** (scale, rotate, color change)
6. ✅ **Scroll-driven effects** (hero fade, progress-based)
7. ✅ **Particle systems** (sparkles for magic feel)
8. ✅ **Performance optimized** (GPU acceleration, once: true)

---

## 🎬 See It Live

```bash
npm run dev
# Navigate to http://localhost:5173/scroll-animations
```

**Scroll slowly** to see each animation trigger. **Hover** on cards and icons for interactive effects!

---

## 📚 Learn More

- [Framer Motion Docs](https://www.framer.com/motion/)
- [GSAP ScrollTrigger Docs](https://greensock.com/scrolltrigger/)
- [CSS 3D Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

**Ready to create magic? Start scrolling!** ✨🚀
