import { useEffect, useRef } from 'react';
import { useScrollPerformance } from '../../hooks/useScrollPerformance';

export function SparklesCore({
  id,
  background = 'transparent',
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 500,
  particleColor = '#ec4899',
  className = '',
}) {
  const canvasRef = useRef(null);
  const isScrolling = useScrollPerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set actual canvas size (accounting for device pixel ratio)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale context to account for device pixel ratio
      ctx.scale(dpr, dpr);
      
      // Set display size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      initParticles();
    };

    const initParticles = () => {
      particles.length = 0;
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;
      const numParticles = Math.floor((displayWidth * displayHeight) / particleDensity);

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * displayWidth,
          y: Math.random() * displayHeight,
          size: Math.random() * (maxSize - minSize) + minSize,
          opacity: Math.random() * 0.5 + 0.3,
          speed: Math.random() * 0.5 + 0.2,
        });
      }
    };

    let lastFrameTime = performance.now();
    let isPaused = false;
    
    const animate = (currentTime) => {
      // During active scroll: completely pause animation to prevent jitter
      if (isScrolling) {
        isPaused = true;
        // Still request frames but don't update - keeps last frame visible
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      
      // Resume animation when scroll stops
      if (isPaused) {
        isPaused = false;
        lastFrameTime = currentTime; // Reset time to prevent jumps
      }
      
      const timeSinceLastFrame = currentTime - lastFrameTime;
      lastFrameTime = currentTime;

      // Get display dimensions (accounting for device pixel ratio)
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;
      
      ctx.clearRect(0, 0, displayWidth, displayHeight);
      
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        if (particle.y < 0) {
          particle.y = displayHeight;
          particle.x = Math.random() * displayWidth;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    requestAnimationFrame(animate);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [minSize, maxSize, particleDensity, particleColor, isScrolling]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        background,
        // Lenis compatibility - prevent jitter
        willChange: 'auto',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        // Prevent repaint during scroll
        contain: 'layout style paint',
        isolation: 'isolate',
      }}
    />
  );
}



