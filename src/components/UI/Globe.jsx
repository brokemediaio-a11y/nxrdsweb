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
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and visibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for visibility-based rendering
  useEffect(() => {
    if (!canvasRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const canvas = canvasRef.current;
    observer.observe(canvas);
    
    // Check if already visible on mount
    const rect = canvas.getBoundingClientRect();
    const isCurrentlyVisible = 
      rect.top < window.innerHeight + 50 &&
      rect.bottom > -50 &&
      rect.left < window.innerWidth + 50 &&
      rect.right > -50;
    
    if (isCurrentlyVisible) {
      setIsVisible(true);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Only create globe when visible to save resources
    if (!isVisible) {
      // Clean up if not visible
      if (globeRef.current) {
        try {
          globeRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying globe:', e);
        }
        globeRef.current = null;
      }
      return;
    }

    // Wait for canvas to be properly sized
    const initializeGlobe = () => {
      const canvas = canvasRef.current;
      if (!canvas || !isVisible) return;

      // Get actual width with fallback
      const getWidth = () => {
        if (canvas.offsetWidth > 0) return canvas.offsetWidth;
        // Fallback: check parent or use default
        const parent = canvas.parentElement;
        if (parent && parent.offsetWidth > 0) return Math.min(parent.offsetWidth, 350);
        return 300; // Safe default
      };

      let width = getWidth();
      
      // Mobile optimizations - significantly reduce quality on mobile
      const mobileMapSamples = isMobile ? Math.min(8000, mapSamples) : mapSamples;
      const devicePixelRatio = isMobile ? 1 : 2; // Reduce DPR on mobile (1x instead of 2x = 4x less pixels)
      const mobileMapBrightness = isMobile ? Math.min(4, mapBrightness) : mapBrightness;

      // Ensure minimum width
      if (width < 100) {
        width = 100;
      }

      try {
        // Destroy existing globe if any
        if (globeRef.current) {
          globeRef.current.destroy();
          globeRef.current = null;
        }

        let phi = 0;

        const globe = createGlobe(canvas, {
          devicePixelRatio: devicePixelRatio,
          width: width * devicePixelRatio,
          height: width * devicePixelRatio,
          phi: 0,
          theta: theta,
          dark: dark,
          scale: scale,
          diffuse: diffuse,
          mapSamples: mobileMapSamples,
          mapBrightness: mobileMapBrightness,
          baseColor: baseColor,
          markerColor: markerColor,
          glowColor: glowColor,
          opacity: 1,
          offset: [0, 0],
          markers: [],
          onRender: (state) => {
            // Only animate when visible
            if (isVisible) {
              state.phi = phi;
              phi += 0.003;
            }
          },
        });

        globeRef.current = globe;
      } catch (error) {
        console.error('Error initializing globe:', error);
      }
    };

    // Delay initialization to ensure DOM is ready and visible
    const timeoutId = setTimeout(() => {
      if (isVisible) {
        initializeGlobe();
      }
    }, 150);

    // Handle resize
    const handleResize = () => {
      if (!isVisible) return;
      
      if (globeRef.current && canvasRef.current) {
        const width = canvasRef.current.offsetWidth || 300;
        if (width > 0) {
          try {
            globeRef.current.destroy();
            globeRef.current = null;
            setTimeout(() => {
              if (isVisible) {
                initializeGlobe();
              }
            }, 50);
          } catch (e) {
            console.warn('Error during resize:', e);
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        try {
          globeRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying globe on cleanup:', e);
        }
        globeRef.current = null;
      }
    };
  }, [theta, dark, scale, diffuse, mapSamples, mapBrightness, baseColor, markerColor, glowColor, isMobile, isVisible]);

  return (
    <div
      className={cn(
        'flex items-center justify-center z-[10] w-full max-w-[350px] mx-auto',
        className
      )}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          aspectRatio: '1',
        }}
      />
    </div>
  );
};

export default Earth;
