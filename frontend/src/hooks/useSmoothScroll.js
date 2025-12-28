import {useEffect} from "react";
import Lenis from "lenis";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook to enable smooth scrolling with Lenis
 * Integrates with GSAP ScrollTrigger for synchronized animations
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize Lenis with optimal settings
    const lenis = new Lenis({
      duration: 1.2, // Smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      direction: "vertical", // Vertical scrolling
      gestureDirection: "vertical",
      smooth: true,
      smoothTouch: false, // Disable on touch for native mobile feel
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync GSAP ticker with Lenis RAF
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Optional: Add scroll-to functionality for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const id = target.getAttribute("href");
        if (id && id !== "#") {
          e.preventDefault();
          const element = document.querySelector(id);
          if (element) {
            lenis.scrollTo(element, {
              offset: 0,
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);
};
