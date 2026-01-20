import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage scroll locking for modals and overlays
 * Handles multiple modals, sidebar, and proper cleanup of html and body elements
 * 
 * @param {boolean} isLocked - Whether scroll should be locked
 * @param {string} id - Unique identifier for this lock instance (optional)
 */
const useScrollLock = (isLocked, id = 'default') => {
  const scrollYRef = useRef(0);
  const isLockedRef = useRef(false);

  useEffect(() => {
    // Get or initialize the global lock counter
    if (typeof window !== 'undefined') {
      if (!window.__scrollLockCount) {
        window.__scrollLockCount = 0;
        window.__scrollLockIds = new Set();
      }
    }

    const lockScroll = () => {
      // If already locked by this instance, skip
      if (isLockedRef.current) return;

      // Store current scroll position before locking
      scrollYRef.current = window.pageYOffset || window.scrollY || document.documentElement.scrollTop;

      // Increment lock counter
      window.__scrollLockCount++;
      window.__scrollLockIds.add(id);
      isLockedRef.current = true;

      // Only apply styles if this is the first lock
      if (window.__scrollLockCount === 1) {
        const html = document.documentElement;
        const body = document.body;
        
        // Store original values
        body.setAttribute('data-scroll-y', scrollYRef.current.toString());
        
        // Lock both html and body
        html.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollYRef.current}px`;
        body.style.left = '0';
        body.style.right = '0';
        body.style.width = '100%';
        body.style.overflow = 'hidden';
      }
    };

    const unlockScroll = () => {
      // If not locked by this instance, skip
      if (!isLockedRef.current) return;

      // Decrement lock counter
      window.__scrollLockCount = Math.max(0, window.__scrollLockCount - 1);
      window.__scrollLockIds.delete(id);
      isLockedRef.current = false;

      // Only remove styles if no more locks exist
      if (window.__scrollLockCount === 0) {
        const html = document.documentElement;
        const body = document.body;
        
        // Get stored scroll position
        const scrollY = body.getAttribute('data-scroll-y');
        
        // Remove all locking styles from both html and body
        html.style.overflow = '';
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        body.style.overflow = '';
        
        // Remove data attribute
        body.removeAttribute('data-scroll-y');
        
        // Restore scroll position
        const scrollPosition = scrollY ? parseInt(scrollY, 10) : 0;
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      }
    };

    // Apply or remove lock based on isLocked prop
    if (isLocked) {
      lockScroll();
    } else {
      unlockScroll();
    }

    // Cleanup function - always unlock on unmount
    return () => {
      if (isLockedRef.current) {
        unlockScroll();
      }
    };
  }, [isLocked, id]);

  // Return current lock state
  return {
    isLocked: isLockedRef.current,
    lockCount: typeof window !== 'undefined' ? (window.__scrollLockCount || 0) : 0,
  };
};

export default useScrollLock;
