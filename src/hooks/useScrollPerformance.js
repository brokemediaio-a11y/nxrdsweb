import { useEffect, useRef, useState } from 'react';
import { useLenisContext } from '../contexts/LenisContext';

/**
 * Hook to detect scrolling state and optimize performance
 * Works with Lenis smooth scroll - listens to Lenis scroll events
 * Reduces (but doesn't pause) heavy animations during active scrolling
 */
export const useScrollPerformance = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const lenis = useLenisContext();

  useEffect(() => {
    if (!lenis) {
      // Fallback to native scroll if Lenis not available
      let ticking = false;
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            setIsScrolling(true);
            if (scrollTimeoutRef.current) {
              clearTimeout(scrollTimeoutRef.current);
            }
            scrollTimeoutRef.current = setTimeout(() => {
              setIsScrolling(false);
            }, 100);
            ticking = false;
          });
          ticking = true;
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }

    // Listen to Lenis scroll events
    let lastVelocity = 0;
    const handleLenisScroll = ({ scroll, limit, velocity, direction, progress }) => {
      // Detect active scrolling based on velocity
      const isActivelyScrolling = Math.abs(velocity) > 0.5;
      
      if (isActivelyScrolling) {
        setIsScrolling(true);
        lastVelocity = velocity;
        
        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      } else {
        // Scrolling has stopped or is very slow
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 100); // Shorter delay for faster resume
      }
    };

    // Safely attach event listener
    try {
      if (lenis && typeof lenis.on === 'function') {
        lenis.on('scroll', handleLenisScroll);
      }
    } catch (error) {
      console.warn('Error attaching Lenis scroll listener:', error);
    }

    return () => {
      try {
        if (lenis && typeof lenis.off === 'function') {
          lenis.off('scroll', handleLenisScroll);
        }
      } catch (error) {
        console.warn('Error removing Lenis scroll listener:', error);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lenis]);

  return isScrolling;
};
