import React, { memo, useEffect, useRef } from 'react';
import { useScrollPerformance } from '../../hooks/useScrollPerformance';

const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  const isScrolling = useScrollPerformance();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // Set canvas size to fill the hero section
    // Use device pixel ratio for crisp rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
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

    // Get display dimensions helper
    const getDisplayDims = () => {
      const dpr = window.devicePixelRatio || 1;
      return {
        width: canvas.width / dpr,
        height: canvas.height / dpr
      };
    };

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        const dims = getDisplayDims();
        // Random initial position using display dimensions
        this.x = Math.random() * dims.width;
        this.y = Math.random() * dims.height;
      }

      reset() {
        // Size variation: 0.7px to 1.8px (slightly more visible)
        this.size = Math.random() * 1.1 + 0.7;
        
        // Movement speed: increased more
        this.speedX = (Math.random() - 0.5) * 1.3; // -0.35 to 0.35
        this.speedY = (Math.random() - 0.5) * 1.3;
        
        // Opacity for twinkling: 0.5 to 0.8 (more visible)
        this.baseOpacity = Math.random() * 0.3 + 0.5;
        this.opacity = this.baseOpacity;
        
        // Twinkling speed (very slow)
        this.twinkleSpeed = Math.random() * 0.01 + 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        const dims = getDisplayDims();
        
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen edges (seamless loop) using display dimensions
        if (this.x < 0) this.x = dims.width;
        if (this.x > dims.width) this.x = 0;
        if (this.y < 0) this.y = dims.height;
        if (this.y > dims.height) this.y = 0;

        // Twinkling effect (subtle opacity changes)
        this.opacity += this.twinkleSpeed * this.twinkleDirection;
        if (this.opacity >= this.baseOpacity + 0.2 || this.opacity <= this.baseOpacity - 0.2) {
          this.twinkleDirection *= -1;
        }
        this.opacity = Math.max(0.3, Math.min(1, this.opacity));
      }

      draw() {
        // Minimal glow effect using radial gradient (reduced glow)
        const glowRadius = this.size * 2;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowRadius
        );
        
        // Warm off-white/cream color with slightly more glow
        gradient.addColorStop(0, `rgba(220, 220, 210, ${this.opacity * 0.7})`);
        gradient.addColorStop(0.5, `rgba(220, 220, 210, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(220, 220, 210, 0)');

        // Draw subtle glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw core star (slightly more visible)
        ctx.fillStyle = `rgba(230, 225, 215, ${this.opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Check if position is too close to existing particles
    const isTooClose = (x, y, minDistance = 80) => {
      return particles.some(particle => {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });
    };

    // Initialize particles with minimum spacing
    const initParticles = () => {
      particles = [];
      // Stars: 40-50 total (+10 from previous 30-40)
      const particleCount = Math.floor(Math.random() * 11 + 40); // 40-50
      
      let attempts = 0;
      const maxAttempts = particleCount * 10;

      while (particles.length < particleCount && attempts < maxAttempts) {
        const tempParticle = new Particle();
        
        // Check if this position is too close to existing particles
        if (particles.length === 0 || !isTooClose(tempParticle.x, tempParticle.y)) {
          particles.push(tempParticle);
        }
        attempts++;
      }
    };

    // Animation loop - pause during scroll to prevent jitter
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
      
      // Clear canvas using display dimensions
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Update and draw all particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    resizeCanvas();
    requestAnimationFrame(animate);

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isScrolling]);

  return (
    <>
      <div className="void-bg" />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          // Lenis compatibility - prevent jitter
          willChange: 'auto', // Change to 'auto' during scroll pause
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          // Isolate from scroll transforms
          isolation: 'isolate',
          // Prevent repaint during scroll
          contain: 'layout style paint',
        }}
      />
    </>
  );
};

export default memo(GalaxyBackground);