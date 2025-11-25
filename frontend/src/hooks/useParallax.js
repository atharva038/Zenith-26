import {useEffect} from "react";
import {gsap} from "gsap";

/**
 * Custom hook for mouse-based parallax effect
 * @param {Object} refs - References to elements to animate
 * @param {Object} options - Configuration options
 */
export function useMouseParallax(refs, options = {}) {
  const {
    stadiumMovement = 20,
    textMovement = 30,
    stadiumDuration = 0.8,
    textDuration = 0.6,
    ease = "power2.out",
  } = options;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const {clientX, clientY} = e;
      const {innerWidth, innerHeight} = window;

      // Calculate mouse position as percentage (-0.5 to 0.5)
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      // Stadium moves with mouse (subtle movement)
      if (refs.stadiumRef?.current) {
        gsap.to(refs.stadiumRef.current, {
          x: xPercent * stadiumMovement,
          y: yPercent * stadiumMovement,
          duration: stadiumDuration,
          ease,
        });
      }

      // Text moves opposite direction (more pronounced)
      if (refs.textRef?.current) {
        gsap.to(refs.textRef.current, {
          x: -xPercent * textMovement,
          y: -yPercent * textMovement,
          duration: textDuration,
          ease,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    refs,
    stadiumMovement,
    textMovement,
    stadiumDuration,
    textDuration,
    ease,
  ]);
}

/**
 * Custom hook for tilt effect on mouse move
 * Great for 3D card effects
 */
export function useTiltEffect(elementRef, options = {}) {
  const {maxTilt = 15, duration = 0.4, ease = "power2.out"} = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * maxTilt;
      const rotateY = ((centerX - x) / centerX) * maxTilt;

      gsap.to(element, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration,
        ease,
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotationX: 0,
        rotationY: 0,
        duration,
        ease,
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [elementRef, maxTilt, duration, ease]);
}
