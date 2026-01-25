import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import Lenis from 'lenis';

type LenisInstance = InstanceType<typeof Lenis> | null;

const LenisContext = createContext<LenisInstance>(null);

export const useLenisContext = (): LenisInstance => {
  const context = useContext(LenisContext);
  if (context === undefined) {
    console.warn('useLenisContext must be used within LenisProvider');
    return null;
  }
  return context;
};

interface LenisProviderProps {
  children: ReactNode;
}

export const LenisProvider = ({ children }: LenisProviderProps) => {
  const lenisRef = useRef<LenisInstance>(null);
  const [lenisInstance, setLenisInstance] = useState<LenisInstance>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !document.documentElement) {
      return;
    }

    let rafId: number | null = null;
    let instance: LenisInstance = null;

    const initTimer = setTimeout(() => {
      try {
        if (!Lenis || typeof Lenis !== 'function') {
          console.warn('Lenis is not available, continuing without smooth scroll');
          setLenisInstance(null);
          return;
        }

        instance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          syncTouch: false,
          touchMultiplier: 2,
          infinite: false,
          prevent: (node: HTMLElement) => {
            const isNavbar = node.classList?.contains('navbar') || node.classList?.contains('sticky-navbar') || false;
            const hasNavbarParent = node.closest?.('.navbar') != null;
            const hasPreventAttr = node.hasAttribute?.('data-lenis-prevent') ?? false;
            return isNavbar || hasNavbarParent || hasPreventAttr;
          },
        });

        lenisRef.current = instance;
        setLenisInstance(instance);

        function raf(time: number) {
          try {
            if (instance) {
              instance.raf(time);
              rafId = requestAnimationFrame(raf);
            }
          } catch (e) {
            console.warn('Error in Lenis RAF:', e);
            if (rafId != null) cancelAnimationFrame(rafId);
          }
        }

        rafId = requestAnimationFrame(raf);
      } catch (error) {
        console.error('Error initializing Lenis:', error);
        setLenisInstance(null);
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (rafId != null) cancelAnimationFrame(rafId);
      try {
        if (instance?.destroy != null) instance.destroy();
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
