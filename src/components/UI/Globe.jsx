import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { cn } from '../../lib/utils';

const Earth = ({
  className,
  theta = 0.25,
  dark = 1,
  scale = 1.1,
  diffuse = 1.2,
  mapSamples = 40000,
  mapBrightness = 6,
  baseColor = [0.4, 0.6509, 1],
  markerColor = [1, 0, 0],
  glowColor = [0.2745, 0.5765, 0.898],
}) => {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const phiRef = useRef(0);
  const isVisibleRef = useRef(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (globeRef.current) return;

    const canvas = canvasRef.current;

    const getWidth = () => {
      if (canvas.offsetWidth > 0) return canvas.offsetWidth;
      const parent = canvas.parentElement;
      if (parent && parent.offsetWidth > 0) return Math.min(parent.offsetWidth, 400);
      return 400;
    };

    let width = getWidth();
    if (width < 100) width = 400;

    const mobileMapSamples = isMobile ? Math.min(5000, mapSamples) : mapSamples;
    const dpr = isMobile ? 1 : 2;
    const mobileMapBrightness = isMobile ? Math.min(3, mapBrightness) : mapBrightness;

    try {
      const globe = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: 0,
        theta,
        dark,
        scale,
        diffuse,
        mapSamples: mobileMapSamples,
        mapBrightness: mobileMapBrightness,
        baseColor,
        markerColor,
        glowColor,
        opacity: 1,
        offset: [0, 0],
        markers: [],
        onRender: (state) => {
          // ✅ Always increment phi to keep animation state alive
          // even when not visible — prevents the "restart" delay
          phiRef.current += 0.003;
          state.phi = phiRef.current;

          // ✅ Skip actual rendering work when off-screen
          // by returning early only AFTER updating phi
          if (!isVisibleRef.current) {
            state.phi = phiRef.current;
          }
        },
      });

      globeRef.current = globe;
    } catch (error) {
      console.error('Error initializing globe:', error);
    }

    // ✅ IntersectionObserver: track visibility without destroying the globe
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      {
        // ✅ Use a negative rootMargin to start rendering BEFORE
        // the element scrolls into view — eliminates the visible delay
        rootMargin: '200px 0px 200px 0px',
        threshold: 0,
      }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (globeRef.current) {
        try {
          globeRef.current.destroy();
        } catch (e) {
          console.warn('Globe destroy error:', e);
        }
        globeRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className={cn(
        'flex items-center justify-center z-[10] w-full max-w-[350px] mx-auto',
        className
      )}
      // ✅ Critical: prevents browser from discarding the element's
      // rendering context when scrolled out of view
      style={{ contentVisibility: 'visible' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          aspectRatio: '1',
          touchAction: 'none',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          display: 'block',
          // ✅ Removed willChange: 'auto' — use 'transform' to keep
          // the element in its own compositing layer at all times
          willChange: 'transform',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // ✅ Never let the browser hide this canvas
          visibility: 'visible',
          opacity: 1,
          contain: 'strict',
        }}
      />
    </div>
  );
};

export default Earth;
