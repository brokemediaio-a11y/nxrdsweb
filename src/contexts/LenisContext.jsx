import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

export const useLenisContext = () => {
  const context = useContext(LenisContext);
  // Return null if context is not available (defensive)
  if (context === undefined) {
    console.warn('useLenisContext must be used within LenisProvider');
    return null;
  }
  return context;
};

export const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const [lenisInstance, setLenisInstance] = useState(null);

  useEffect(() => {
    // Wait for DOM to be ready
    if (typeof window === 'undefined' || !document.documentElement) {
      return;
    }

    let rafId = null;
    let lenisInstance = null;

    // Delay initialization slightly to ensure DOM is fully ready
    const initTimer = setTimeout(() => {
      try {
        // Check if Lenis is available
        if (!Lenis || typeof Lenis !== 'function') {
          console.warn('Lenis is not available, continuing without smooth scroll');
          setLenisInstance(null);
          return;
        }

        // Initialize Lenis with proper configuration
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
          // Don't set wrapper/content - let it use window/documentElement by default
          // This allows fixed elements to stay fixed
          prevent: (node) => {
            // Prevent Lenis from transforming the navbar
            return node.classList.contains('navbar') || 
                   node.closest('.navbar') !== null ||
                   node.hasAttribute('data-lenis-prevent');
          },
        });

        lenisRef.current = lenisInstance;
        setLenisInstance(lenisInstance);

        // Animation loop - integrate with Lenis
        function raf(time) {
          try {
            if (lenisInstance) {
              lenisInstance.raf(time);
              rafId = requestAnimationFrame(raf);
            }
          } catch (e) {
            console.warn('Error in Lenis RAF:', e);
            if (rafId) {
              cancelAnimationFrame(rafId);
            }
          }
        }

        rafId = requestAnimationFrame(raf);
      } catch (error) {
        console.error('Error initializing Lenis:', error);
        // Continue without Lenis - app should still work
        setLenisInstance(null);
      }
    }, 100); // Small delay to ensure DOM is ready

    // Cleanup function
    return () => {
      clearTimeout(initTimer);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      try {
        if (lenisInstance && typeof lenisInstance.destroy === 'function') {
          lenisInstance.destroy();
        }
      } catch (e) {
        console.warn('Error destroying Lenis:', e);
      }
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
};
