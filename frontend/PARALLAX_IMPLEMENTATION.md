# 🎯 Parallax Effect Implementation

## Overview
The homepage now features an **INSANE immersive parallax effect** where:
- 🏟️ **Stadium background** moves subtly with mouse movement
- 📝 **Text content** moves in the **opposite direction**
- ✨ Creates depth and immersion

## Implementation Details

### Current Setup (Homepage.jsx)
The parallax effect is implemented using **GSAP** (GreenSock Animation Platform) for smooth, performant animations.

#### Key Features:
1. **Mouse Tracking**: Listens to `mousemove` events
2. **Normalized Coordinates**: Converts mouse position to -0.5 to 0.5 range
3. **Opposite Movement**: Stadium and text move in opposite directions
4. **Smooth Easing**: Uses `power2.out` for natural motion
5. **Performance Optimized**: Uses `will-change-transform` CSS property

### Code Breakdown

```jsx
// Refs to elements
const stadiumRef = useRef(null);
const textRef = useRef(null);

// Mouse move handler
useEffect(() => {
  const handleMouseMove = (e) => {
    // Get mouse position
    const {clientX, clientY} = e;
    const {innerWidth, innerHeight} = window;

    // Normalize to -0.5 to 0.5 range
    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;

    // Stadium moves WITH mouse (20px max)
    gsap.to(stadiumRef.current, {
      x: xPercent * 20,
      y: yPercent * 20,
      duration: 0.8,
      ease: "power2.out",
    });

    // Text moves OPPOSITE (30px max)
    gsap.to(textRef.current, {
      x: -xPercent * 30,  // ← Notice the negative!
      y: -yPercent * 30,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);
```

## Customization Options

### Adjust Movement Range
Change the multiplier values to increase/decrease movement:

```jsx
// More dramatic effect
x: xPercent * 40,  // Stadium moves more
x: -xPercent * 60, // Text moves more

// Subtle effect
x: xPercent * 10,  // Stadium moves less
x: -xPercent * 15, // Text moves less
```

### Adjust Animation Speed
Change the `duration` values:

```jsx
duration: 0.4,  // Faster, snappier
duration: 1.2,  // Slower, smoother
```

### Change Easing
Try different GSAP easing functions:

```jsx
ease: "power1.out",    // Linear-ish
ease: "power3.out",    // More dramatic
ease: "elastic.out",   // Bouncy
ease: "back.out",      // Overshoot
```

## Advanced Usage: Custom Hook

For reusability, you can use the custom hook in `/src/hooks/useParallax.js`:

```jsx
import {useMouseParallax} from '../hooks/useParallax';

function MyComponent() {
  const stadiumRef = useRef(null);
  const textRef = useRef(null);

  // Use the hook
  useMouseParallax(
    {stadiumRef, textRef},
    {
      stadiumMovement: 25,
      textMovement: 35,
      stadiumDuration: 0.7,
      textDuration: 0.5,
    }
  );

  return (
    <div>
      <div ref={stadiumRef}>Background</div>
      <div ref={textRef}>Text</div>
    </div>
  );
}
```

## Performance Considerations

### CSS Optimization
Added `will-change-transform` to animated elements:
```jsx
className="... will-change-transform"
```
This tells the browser to optimize for transformations.

### Event Throttling (Optional)
For even better performance on lower-end devices, add throttling:

```jsx
import {gsap} from 'gsap';

let ticking = false;

const handleMouseMove = (e) => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Your parallax code here
      ticking = false;
    });
    ticking = true;
  }
};
```

## Alternative: ScrollTrigger Parallax

For scroll-based parallax effects, you can use GSAP ScrollTrigger:

```bash
# Already installed with gsap
```

```jsx
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

useEffect(() => {
  gsap.to(stadiumRef.current, {
    y: -100,
    ease: "none",
    scrollTrigger: {
      trigger: stadiumRef.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}, []);
```

## Browser Support
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Mobile browsers

## Tips for Best Results

1. **Movement Range**: Keep movements subtle (10-30px) for elegance
2. **Speed Difference**: Make text slightly faster than background
3. **Opposite Direction**: Always move elements in opposite directions
4. **Easing**: Use `power2.out` or `power3.out` for smooth feel
5. **Mobile**: Consider disabling on mobile for performance:

```jsx
useEffect(() => {
  // Only enable on desktop
  if (window.innerWidth < 768) return;
  
  // ... parallax code
}, []);
```

## Troubleshooting

### Effect not visible?
- Check that refs are properly attached
- Verify GSAP is installed: `npm list gsap`
- Check browser console for errors

### Choppy animation?
- Reduce movement range
- Increase duration values
- Add `will-change-transform` CSS
- Implement event throttling

### Too dramatic?
- Reduce multiplier values (20 → 10, 30 → 15)
- Increase duration (0.6 → 1.0)
- Use gentler easing (`power1.out`)

## Resources
- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)
- [ScrollTrigger Demos](https://greensock.com/scrolltrigger/)

---

**Pro Tip**: Try moving your mouse slowly across the screen to see the depth effect! 🎯✨
