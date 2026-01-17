import React, { useEffect, useRef, useState } from 'react';
import './LaserBeamCanvas.css';

// Configuration variables
const CONFIG = {
  // Colors - Matching text pink gradient (#fff, #f472b6, #ec4899, #d946ef)
  beamCoreColor: 'rgba(255, 255, 255, 1)',
  beamMidColor: 'rgba(244, 114, 182, 0.85)', // Pink-400 glow
  beamOuterColor: 'rgba(236, 72, 153, 0.4)', // Pink-500 haze
  particleColor: 'rgba(255, 255, 255, 0.9)',
  particlePinkColor: 'rgba(244, 114, 182, 0.8)', // Pink-400
  impactFlareColor: 'rgba(255, 255, 255, 0.95)',
  impactGlowColor: 'rgba(244, 114, 182, 0.7)', // Pink-400
  spreadLineColor: 'rgba(244, 114, 182, 0.8)', // Pink-400
  auroraColor: 'rgba(244, 114, 182, 0.6)', // Pink-400
  
   // Durations (in seconds) - Slower, premium pacing
   convergenceDuration: 1.1, // 0.9-1.3s
   beamTravelDuration: 2.8, // 2.4-3.2s
   impactDuration: 0.5, // Slightly longer for smoother merge
   mergeDuration: 0.6, // Smooth merge phase between impact and spread
   spreadDuration: 3.2, // Slower, smoother horizontal spread
   beamFadeDuration: 0.5, // 0.3-0.6s
  
  // Beam properties - Broader gradient column
  beamCoreWidth: 10, // 6-14px (responsive)
  beamMidWidth: 50, // Medium width for magenta glow
  beamOuterWidth: 110, // 80-140px (responsive)
  
  // Particle counts - Higher quality, fewer particles
  convergenceParticles: 40, // 25-60
  travelParticles: 18, // 10-25
  scatterParticles: 35, // 20-50
  
  // Aurora pulsation
  auroraPulseDuration: 3.5, // 2.8-4.5s
  auroraMinOpacity: 0.45,
  auroraMaxOpacity: 0.75,
};

const LaserBeamCanvas = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const phaseRef = useRef('convergence');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let beamProgress = 0;
    let impactProgress = 0;
    let spreadProgress = 0;
    let beamOpacity = 1;
    let animationStartTime = null;
    let loopTimeout = null;
    let auroraStartTime = null; // For continuous aurora pulsation

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Get canvas dimensions helper
    const getCanvasDims = () => {
      const dpr = window.devicePixelRatio || 1;
      return {
        width: canvas.width / dpr,
        height: canvas.height / dpr,
        centerX: canvas.width / (2 * dpr)
      };
    };

    // Particle class - More realistic energy dust/sparks
    class Particle {
      constructor(x, y, type = 'convergence') {
        this.type = type;
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.vx = 0;
        this.vy = 0;
        
        // For convergence and travel particles: match star style (small, star-like)
        if (type === 'convergence' || type === 'travel') {
          // Size variation: 0.7px to 1.8px (matching stars)
          this.size = Math.random() * 1.1 + 0.7;
          // Opacity for twinkling: 0.5 to 0.8 (matching stars)
          this.baseOpacity = Math.random() * 0.3 + 0.5;
          this.opacity = this.baseOpacity;
          // Twinkling speed (very slow, matching stars)
          this.flickerSpeed = Math.random() * 0.01 + 0.005;
          this.flickerPhase = Math.random() * Math.PI * 2;
          this.flickerDirection = Math.random() > 0.5 ? 1 : -1;
        } else {
          // For scatter particles: keep original size
          this.size = Math.random() * 2.2 + 0.6;
          this.baseOpacity = Math.random() * 0.4 + 0.6;
          this.opacity = this.baseOpacity;
          this.flickerSpeed = Math.random() * 0.02 + 0.01;
          this.flickerPhase = Math.random() * Math.PI * 2;
        }
        
        this.life = 1;
        this.color = Math.random() > 0.5 ? CONFIG.particleColor : CONFIG.particlePinkColor;
        this.jitterAmount = Math.random() * 0.3 + 0.1; // Horizontal jitter
        
        const dims = getCanvasDims();
        
        if (type === 'convergence') {
          const targetX = dims.centerX;
          const targetY = 0;
          const distance = Math.sqrt(
            Math.pow(targetX - x, 2) + Math.pow(targetY - y, 2)
          );
          const speed = distance / (CONFIG.convergenceDuration * 60);
          this.vx = (targetX - x) / distance * speed;
          this.vy = (targetY - y) / distance * speed;
        } else if (type === 'travel') {
          // Slight horizontal jitter + downward drift
          this.vx = (Math.random() - 0.5) * 0.8 + Math.sin(Date.now() * 0.01) * this.jitterAmount;
          this.vy = Math.random() * 1.5 + 0.8;
        } else if (type === 'scatter') {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 2.5 + 1.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.abs(Math.sin(angle)) * speed + Math.random() * 1.5;
        }
      }

      update(deltaTime, currentTime) {
        const dims = getCanvasDims();
        
        // For convergence and travel particles: twinkling effect (matching stars)
        if (this.type === 'convergence' || this.type === 'travel') {
          this.opacity += this.flickerSpeed * this.flickerDirection * deltaTime * 60;
          if (this.opacity >= this.baseOpacity + 0.2 || this.opacity <= this.baseOpacity - 0.2) {
            this.flickerDirection *= -1;
          }
          this.opacity = Math.max(0.3, Math.min(1, this.opacity));
          this.opacity *= this.life; // Apply life multiplier
        } else {
          // For scatter particles: subtle flicker effect
          this.flickerPhase += this.flickerSpeed * deltaTime;
          const flicker = Math.sin(this.flickerPhase) * 0.15 + 1;
          this.opacity = this.baseOpacity * this.life * flicker;
        }
        
        if (this.type === 'convergence') {
          this.x += this.vx * deltaTime;
          this.y += this.vy * deltaTime;
          const targetX = dims.centerX;
          const targetY = 0;
          const distance = Math.sqrt(
            Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2)
          );
          if (distance < 5) {
            this.life = 0;
          }
        } else if (this.type === 'travel') {
          // Add horizontal jitter near beam
          this.vx = (Math.random() - 0.5) * 0.8 + Math.sin(currentTime * 0.01) * this.jitterAmount;
          this.x += this.vx * deltaTime;
          this.y += this.vy * deltaTime;
          this.life -= 0.006 * deltaTime;
        } else if (this.type === 'scatter') {
          this.x += this.vx * deltaTime;
          this.y += this.vy * deltaTime;
          this.vy += 0.06 * deltaTime; // gravity
          this.life -= 0.01 * deltaTime;
        }
        
        this.opacity = Math.max(0, Math.min(1, this.opacity));
        const isAlive = this.life > 0;
        const isInBounds = this.y < dims.height + 50;
        return isAlive && isInBounds;
      }

      draw(ctx) {
        if (this.opacity <= 0) return;
        
        ctx.save();
        
        // For convergence and travel particles: draw like stars (matching GalaxyBackground)
        if (this.type === 'convergence' || this.type === 'travel') {
          // Warm off-white/cream color matching stars
          const starColor = 'rgba(220, 220, 210, 1)';
          const starCoreColor = 'rgba(230, 225, 215, 1)';
          
          // Minimal glow effect using radial gradient (matching stars)
          const glowRadius = this.size * 2;
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowRadius
          );
          
          // Warm off-white/cream color with glow
          gradient.addColorStop(0, `rgba(220, 220, 210, ${this.opacity * 0.7})`);
          gradient.addColorStop(0.5, `rgba(220, 220, 210, ${this.opacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(220, 220, 210, 0)');
          
          // Draw subtle glow
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw core star (matching stars)
          ctx.fillStyle = `rgba(230, 225, 215, ${this.opacity * 0.9})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // For scatter particles: original style
          ctx.globalAlpha = this.opacity;
          ctx.fillStyle = this.color;
          // Soft blur/glow per particle
          ctx.shadowBlur = this.size * 3;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Initialize convergence particles
    const initConvergenceParticles = () => {
      particles = [];
      const dims = getCanvasDims();
      const spread = 150;
      
      for (let i = 0; i < CONFIG.convergenceParticles; i++) {
        const angle = (Math.PI * 2 * i) / CONFIG.convergenceParticles;
        const distance = Math.random() * spread + 50;
        const x = dims.centerX + Math.cos(angle) * distance;
        const y = Math.random() * 100 + 50;
        particles.push(new Particle(x, y, 'convergence'));
      }
    };

    // Initialize travel particles
    const initTravelParticles = () => {
      const dims = getCanvasDims();
      for (let i = 0; i < CONFIG.travelParticles; i++) {
        const x = dims.centerX + (Math.random() - 0.5) * CONFIG.beamOuterWidth;
        const y = Math.random() * 80;
        particles.push(new Particle(x, y, 'travel'));
      }
    };

    // Initialize scatter particles - Low near bottom edge
    const initScatterParticles = () => {
      const dims = getCanvasDims();
      
      for (let i = 0; i < CONFIG.scatterParticles; i++) {
        const x = dims.centerX + (Math.random() - 0.5) * 40;
        const y = dims.height - Math.random() * 30; // Low near bottom
        particles.push(new Particle(x, y, 'scatter'));
      }
    };

     // Draw beam - Matching horizontal spread style (vertical orientation)
     const drawBeam = (progress, opacity = 1) => {
       const dims = getCanvasDims();
       const beamLength = dims.height * progress;
       const centerX = dims.centerX;
       
       // Responsive beam widths - Increased for smoother fade
       const isMobile = dims.width < 768;
       const coreWidth = isMobile ? 3 : 4;
       const glowRadius = isMobile ? 50 : 70; // Increased for smoother fade
       const outerGlowRadius = isMobile ? 90 : 120; // Increased for smoother fade
       
       ctx.save();
       ctx.globalCompositeOperation = 'screen';
       ctx.globalAlpha *= opacity;
       
       // Background pink gradient - Matching text pink gradient
       const bgGradient = ctx.createLinearGradient(
         centerX, 0,
         centerX, beamLength
       );
       bgGradient.addColorStop(0, `rgba(217, 70, 239, ${0.15 * opacity})`); // Magenta #d946ef
       bgGradient.addColorStop(0.3, `rgba(236, 72, 153, ${0.2 * opacity})`); // Pink-500 #ec4899
       bgGradient.addColorStop(0.5, `rgba(244, 114, 182, ${0.25 * opacity})`); // Pink-400 #f472b6
       bgGradient.addColorStop(0.7, `rgba(236, 72, 153, ${0.2 * opacity})`); // Pink-500 #ec4899
       bgGradient.addColorStop(1, `rgba(217, 70, 239, ${0.15 * opacity})`); // Magenta #d946ef
       
       ctx.globalAlpha = 1;
       ctx.fillStyle = bgGradient;
       ctx.fillRect(
         centerX - outerGlowRadius / 2,
         0,
         outerGlowRadius,
         beamLength
       );
       
       // Create smooth radial glow - Ultra-smooth elegant fade
       // Outer glow halo - Extended fade-out with increased width for elegant submersion
       const segments = Math.ceil(beamLength / 8);
       for (let i = 0; i <= segments; i++) {
         const y = (i / segments) * beamLength;
         const radialGradient = ctx.createRadialGradient(
           centerX, y,
           0,
           centerX, y,
           outerGlowRadius / 2
         );
         // Ultra-smooth elegant fade with extended gradual transitions
         radialGradient.addColorStop(0, `rgba(244, 114, 182, ${0.1 * opacity})`); // Pink-400
         radialGradient.addColorStop(0.05, `rgba(242, 107, 176, ${0.095 * opacity})`);
         radialGradient.addColorStop(0.1, `rgba(240, 100, 170, ${0.09 * opacity})`);
         radialGradient.addColorStop(0.15, `rgba(238, 86, 162, ${0.085 * opacity})`);
         radialGradient.addColorStop(0.2, `rgba(236, 72, 153, ${0.08 * opacity})`); // Pink-500
         radialGradient.addColorStop(0.25, `rgba(233, 76, 156, ${0.075 * opacity})`);
         radialGradient.addColorStop(0.3, `rgba(230, 80, 160, ${0.07 * opacity})`);
         radialGradient.addColorStop(0.35, `rgba(225, 75, 155, ${0.06 * opacity})`);
         radialGradient.addColorStop(0.4, `rgba(217, 70, 239, ${0.05 * opacity})`); // Magenta
         radialGradient.addColorStop(0.45, `rgba(218, 72, 200, ${0.045 * opacity})`);
         radialGradient.addColorStop(0.5, `rgba(220, 75, 165, ${0.04 * opacity})`);
         radialGradient.addColorStop(0.55, `rgba(228, 73, 159, ${0.035 * opacity})`);
         radialGradient.addColorStop(0.6, `rgba(236, 72, 153, ${0.03 * opacity})`); // Pink-500
         radialGradient.addColorStop(0.65, `rgba(238, 82, 164, ${0.027 * opacity})`);
         radialGradient.addColorStop(0.7, `rgba(240, 90, 175, ${0.025 * opacity})`);
         radialGradient.addColorStop(0.75, `rgba(242, 100, 180, ${0.022 * opacity})`);
         radialGradient.addColorStop(0.8, `rgba(244, 114, 182, ${0.02 * opacity})`); // Pink-400
         radialGradient.addColorStop(0.84, `rgba(244, 117, 183, ${0.017 * opacity})`);
         radialGradient.addColorStop(0.88, `rgba(245, 120, 185, ${0.014 * opacity})`);
         radialGradient.addColorStop(0.91, `rgba(245, 123, 186, ${0.011 * opacity})`);
         radialGradient.addColorStop(0.94, `rgba(246, 125, 188, ${0.008 * opacity})`);
         radialGradient.addColorStop(0.96, `rgba(246, 128, 189, ${0.006 * opacity})`);
         radialGradient.addColorStop(0.97, `rgba(247, 130, 190, ${0.005 * opacity})`);
         radialGradient.addColorStop(0.98, `rgba(247, 133, 191, ${0.003 * opacity})`);
         radialGradient.addColorStop(0.985, `rgba(248, 135, 192, ${0.002 * opacity})`);
         radialGradient.addColorStop(0.99, `rgba(248, 138, 193, ${0.001 * opacity})`);
         radialGradient.addColorStop(0.995, `rgba(248, 140, 194, ${0.0005 * opacity})`);
         radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fully transparent - elegant merge
         
         ctx.globalAlpha = 1;
         ctx.fillStyle = radialGradient;
         ctx.beginPath();
         ctx.arc(centerX, y, outerGlowRadius / 2, 0, Math.PI * 2);
         ctx.fill();
       }
       
       // Middle glow halo - Ultra-smooth elegant fade
       for (let i = 0; i <= segments; i++) {
         const y = (i / segments) * beamLength;
         const radialGradient = ctx.createRadialGradient(
           centerX, y,
           0,
           centerX, y,
           glowRadius / 2
         );
         // Ultra-smooth elegant fade with extended gradual transitions
         radialGradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 * opacity})`); // White
         radialGradient.addColorStop(0.04, `rgba(255, 250, 255, ${0.195 * opacity})`);
         radialGradient.addColorStop(0.08, `rgba(255, 240, 255, ${0.19 * opacity})`);
         radialGradient.addColorStop(0.12, `rgba(252, 220, 255, ${0.185 * opacity})`);
         radialGradient.addColorStop(0.15, `rgba(250, 200, 255, ${0.18 * opacity})`);
         radialGradient.addColorStop(0.19, `rgba(247, 160, 220, ${0.17 * opacity})`);
         radialGradient.addColorStop(0.22, `rgba(244, 114, 182, ${0.16 * opacity})`); // Pink-400
         radialGradient.addColorStop(0.26, `rgba(242, 107, 176, ${0.155 * opacity})`);
         radialGradient.addColorStop(0.3, `rgba(240, 100, 170, ${0.15 * opacity})`);
         radialGradient.addColorStop(0.34, `rgba(238, 86, 162, ${0.14 * opacity})`);
         radialGradient.addColorStop(0.38, `rgba(236, 72, 153, ${0.13 * opacity})`); // Pink-500
         radialGradient.addColorStop(0.42, `rgba(233, 76, 156, ${0.125 * opacity})`);
         radialGradient.addColorStop(0.45, `rgba(230, 80, 160, ${0.12 * opacity})`);
         radialGradient.addColorStop(0.49, `rgba(225, 75, 155, ${0.11 * opacity})`);
         radialGradient.addColorStop(0.52, `rgba(217, 70, 239, ${0.1 * opacity})`); // Magenta
         radialGradient.addColorStop(0.56, `rgba(218, 72, 200, ${0.09 * opacity})`);
         radialGradient.addColorStop(0.6, `rgba(220, 75, 165, ${0.08 * opacity})`);
         radialGradient.addColorStop(0.64, `rgba(228, 73, 159, ${0.075 * opacity})`);
         radialGradient.addColorStop(0.68, `rgba(236, 72, 153, ${0.07 * opacity})`); // Pink-500
         radialGradient.addColorStop(0.72, `rgba(238, 82, 164, ${0.065 * opacity})`);
         radialGradient.addColorStop(0.75, `rgba(240, 90, 175, ${0.06 * opacity})`);
         radialGradient.addColorStop(0.79, `rgba(242, 100, 180, ${0.055 * opacity})`);
         radialGradient.addColorStop(0.82, `rgba(244, 114, 182, ${0.05 * opacity})`); // Pink-400
         radialGradient.addColorStop(0.85, `rgba(244, 117, 183, ${0.045 * opacity})`);
         radialGradient.addColorStop(0.88, `rgba(245, 120, 185, ${0.04 * opacity})`);
         radialGradient.addColorStop(0.91, `rgba(245, 123, 186, ${0.035 * opacity})`);
         radialGradient.addColorStop(0.93, `rgba(246, 125, 188, ${0.03 * opacity})`);
         radialGradient.addColorStop(0.95, `rgba(246, 128, 189, ${0.025 * opacity})`);
         radialGradient.addColorStop(0.96, `rgba(246, 130, 190, ${0.02 * opacity})`);
         radialGradient.addColorStop(0.97, `rgba(247, 133, 191, ${0.017 * opacity})`);
         radialGradient.addColorStop(0.98, `rgba(247, 135, 192, ${0.014 * opacity})`);
         radialGradient.addColorStop(0.985, `rgba(247, 138, 193, ${0.01 * opacity})`);
         radialGradient.addColorStop(0.99, `rgba(248, 140, 194, ${0.007 * opacity})`);
         radialGradient.addColorStop(0.992, `rgba(248, 141, 194, ${0.005 * opacity})`);
         radialGradient.addColorStop(0.995, `rgba(248, 142, 195, ${0.003 * opacity})`);
         radialGradient.addColorStop(0.998, `rgba(248, 143, 195, ${0.001 * opacity})`);
         radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fully transparent - elegant merge
         
         ctx.globalAlpha = 1;
         ctx.fillStyle = radialGradient;
         ctx.beginPath();
         ctx.arc(centerX, y, glowRadius / 2, 0, Math.PI * 2);
         ctx.fill();
       }
       
       // Core beam - Matching horizontal spread core exactly
       ctx.shadowBlur = 0;
       const coreGradient = ctx.createLinearGradient(
         centerX, 0,
         centerX, beamLength
       );
       coreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.7 * opacity})`); // White
       coreGradient.addColorStop(0.2, `rgba(244, 114, 182, ${0.75 * opacity})`); // Pink-400
       coreGradient.addColorStop(0.4, `rgba(236, 72, 153, ${0.8 * opacity})`); // Pink-500
       coreGradient.addColorStop(0.5, `rgba(244, 114, 182, ${0.85 * opacity})`); // Pink-400
       coreGradient.addColorStop(0.6, `rgba(236, 72, 153, ${0.8 * opacity})`); // Pink-500
       coreGradient.addColorStop(0.8, `rgba(244, 114, 182, ${0.75 * opacity})`); // Pink-400
       coreGradient.addColorStop(1, `rgba(255, 255, 255, ${0.7 * opacity})`); // White
       
       ctx.globalAlpha = 1;
       ctx.fillStyle = coreGradient;
       ctx.fillRect(
         centerX - coreWidth / 2,
         0,
         coreWidth,
         beamLength
       );
       
       // Inner bright core highlight - Matching horizontal spread exactly
       const innerCoreGradient = ctx.createLinearGradient(
         centerX, 0,
         centerX, beamLength
       );
       innerCoreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.6 * opacity})`);
       innerCoreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.75 * opacity})`);
       innerCoreGradient.addColorStop(1, `rgba(255, 255, 255, ${0.6 * opacity})`);
       
       ctx.globalAlpha = 1;
       ctx.fillStyle = innerCoreGradient;
       ctx.fillRect(
         centerX - coreWidth / 3,
         0,
         (coreWidth / 1.5),
         beamLength
       );
       
       ctx.restore();
     };

     // Draw impact flare - Magenta-pink matching laser beam, consistent impact/merge
     const drawImpactFlare = (progress, mergeProgress = 0) => {
       const dims = getCanvasDims();
       const maxRadius = 100; // Larger for bolder effect
       const radius = maxRadius * progress;
       // During merge phase, maintain full intensity for consistency
       const opacity = mergeProgress > 0 ? 1 : (1 - progress * 0.2);
       
       ctx.save();
       ctx.globalCompositeOperation = 'screen';
       ctx.globalAlpha = opacity;
       
       // Outer glow - Pink radial gradient matching text colors
       const outerGradient = ctx.createRadialGradient(
         dims.centerX, dims.height, 0,
         dims.centerX, dims.height, radius
       );
       // Ultra-smooth fade with pink colors matching text gradient
       outerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright white center
       outerGradient.addColorStop(0.08, 'rgba(244, 114, 182, 0.95)'); // Pink-400
       outerGradient.addColorStop(0.15, 'rgba(236, 72, 153, 0.9)'); // Pink-500
       outerGradient.addColorStop(0.22, 'rgba(244, 114, 182, 0.85)'); // Pink-400
       outerGradient.addColorStop(0.3, 'rgba(217, 70, 239, 0.78)'); // Magenta
       outerGradient.addColorStop(0.38, 'rgba(236, 72, 153, 0.7)'); // Pink-500
       outerGradient.addColorStop(0.45, 'rgba(244, 114, 182, 0.62)'); // Pink-400
       outerGradient.addColorStop(0.52, 'rgba(236, 72, 153, 0.54)'); // Pink-500
       outerGradient.addColorStop(0.58, 'rgba(217, 70, 239, 0.46)'); // Magenta
       outerGradient.addColorStop(0.64, 'rgba(236, 72, 153, 0.38)'); // Pink-500
       outerGradient.addColorStop(0.7, 'rgba(244, 114, 182, 0.32)'); // Pink-400
       outerGradient.addColorStop(0.75, 'rgba(236, 72, 153, 0.28)'); // Pink-500
       outerGradient.addColorStop(0.8, 'rgba(217, 70, 239, 0.24)'); // Magenta
       outerGradient.addColorStop(0.84, 'rgba(236, 72, 153, 0.2)'); // Pink-500
       outerGradient.addColorStop(0.88, 'rgba(244, 114, 182, 0.16)'); // Pink-400
       outerGradient.addColorStop(0.92, 'rgba(236, 72, 153, 0.12)'); // Pink-500
       outerGradient.addColorStop(0.95, 'rgba(217, 70, 239, 0.08)'); // Magenta
       outerGradient.addColorStop(0.97, 'rgba(244, 114, 182, 0.05)'); // Pink-400
       outerGradient.addColorStop(0.99, 'rgba(236, 72, 153, 0.02)'); // Pink-500
       outerGradient.addColorStop(1, 'transparent');
       
       ctx.fillStyle = outerGradient;
       ctx.beginPath();
       ctx.arc(dims.centerX, dims.height, radius, 0, Math.PI * 2);
       ctx.fill();
       
       // Core flare - Bright white-pink matching beam core
       const coreGradient = ctx.createRadialGradient(
         dims.centerX, dims.height, 0,
         dims.centerX, dims.height, radius * 0.45
       );
       coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Bright white core
       coreGradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.98)'); // White
       coreGradient.addColorStop(0.18, 'rgba(244, 114, 182, 0.96)'); // Pink-400
       coreGradient.addColorStop(0.25, 'rgba(236, 72, 153, 0.94)'); // Pink-500
       coreGradient.addColorStop(0.32, 'rgba(244, 114, 182, 0.91)'); // Pink-400
       coreGradient.addColorStop(0.38, 'rgba(217, 70, 239, 0.88)'); // Magenta
       coreGradient.addColorStop(0.44, 'rgba(236, 72, 153, 0.85)'); // Pink-500
       coreGradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.81)'); // Pink-400
       coreGradient.addColorStop(0.56, 'rgba(236, 72, 153, 0.76)'); // Pink-500
       coreGradient.addColorStop(0.62, 'rgba(217, 70, 239, 0.7)'); // Magenta
       coreGradient.addColorStop(0.68, 'rgba(236, 72, 153, 0.64)'); // Pink-500
       coreGradient.addColorStop(0.74, 'rgba(244, 114, 182, 0.56)'); // Pink-400
       coreGradient.addColorStop(0.8, 'rgba(236, 72, 153, 0.48)'); // Pink-500
       coreGradient.addColorStop(0.85, 'rgba(217, 70, 239, 0.4)'); // Magenta
       coreGradient.addColorStop(0.9, 'rgba(244, 114, 182, 0.3)'); // Pink-400
       coreGradient.addColorStop(0.94, 'rgba(236, 72, 153, 0.2)'); // Pink-500
       coreGradient.addColorStop(0.97, 'rgba(217, 70, 239, 0.1)'); // Magenta
       coreGradient.addColorStop(1, 'transparent');
       
       ctx.fillStyle = coreGradient;
       ctx.beginPath();
       ctx.arc(dims.centerX, dims.height, radius * 0.45, 0, Math.PI * 2);
       ctx.fill();
       
       // Smooth fading pink accent layer matching text gradient
       const accentGradient = ctx.createRadialGradient(
         dims.centerX, dims.height, 0,
         dims.centerX, dims.height, radius * 0.75
       );
       accentGradient.addColorStop(0, 'rgba(244, 114, 182, 0.7)'); // Pink-400
       accentGradient.addColorStop(0.15, 'rgba(236, 72, 153, 0.65)'); // Pink-500
       accentGradient.addColorStop(0.28, 'rgba(217, 70, 239, 0.6)'); // Magenta
       accentGradient.addColorStop(0.4, 'rgba(244, 114, 182, 0.55)'); // Pink-400
       accentGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.5)'); // Pink-500
       accentGradient.addColorStop(0.58, 'rgba(217, 70, 239, 0.45)'); // Magenta
       accentGradient.addColorStop(0.65, 'rgba(244, 114, 182, 0.4)'); // Pink-400
       accentGradient.addColorStop(0.72, 'rgba(236, 72, 153, 0.35)'); // Pink-500
       accentGradient.addColorStop(0.78, 'rgba(217, 70, 239, 0.28)'); // Magenta
       accentGradient.addColorStop(0.84, 'rgba(244, 114, 182, 0.22)'); // Pink-400
       accentGradient.addColorStop(0.89, 'rgba(236, 72, 153, 0.15)'); // Pink-500
       accentGradient.addColorStop(0.94, 'rgba(217, 70, 239, 0.08)'); // Magenta
       accentGradient.addColorStop(0.97, 'rgba(244, 114, 182, 0.04)'); // Pink-400
       accentGradient.addColorStop(1, 'transparent');
       
       ctx.fillStyle = accentGradient;
       ctx.beginPath();
       ctx.arc(dims.centerX, dims.height, radius * 0.75, 0, Math.PI * 2);
       ctx.fill();
       
       ctx.restore();
     };

     // Draw horizontal spread - Smooth radial glow expanding horizontally from bottom
     const drawHorizontalSpread = (spreadProgress, pulseIntensity = 1) => {
       const dims = getCanvasDims();
       const bottomY = dims.height;
       const centerX = dims.width / 2;
       
       // Calculate spread width - expands from center outward
       const maxWidth = dims.width;
       const currentWidth = maxWidth * spreadProgress;
       // Reduced glow height - smaller below button
       const maxGlowHeight = dims.height * 0.14; // Reduced height (was 0.18)
       const currentGlowHeight = maxGlowHeight * spreadProgress; // Expand upward as width expands
       
       // Responsive sizing
       const isMobile = dims.width < 768;
       const coreHeight = isMobile ? 3 : 4;
       
       ctx.save();
       ctx.globalCompositeOperation = 'screen';
       ctx.globalAlpha *= pulseIntensity;
       
       // Bright horizontal core line at bottom - Lightened gradient
       const coreGradient = ctx.createLinearGradient(
         centerX - currentWidth / 2, 0,
         centerX + currentWidth / 2, 0
       );
       // Straight, even brightness across the width - Reduced white tint
       coreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 * pulseIntensity})`); // Reduced white
       coreGradient.addColorStop(0.5, `rgba(244, 114, 182, ${0.35 * pulseIntensity})`); // Pink-400
       coreGradient.addColorStop(1, `rgba(255, 255, 255, ${0.2 * pulseIntensity})`); // Reduced white
       
       ctx.globalAlpha = 1;
       ctx.fillStyle = coreGradient;
       ctx.fillRect(
         centerX - currentWidth / 2,
         bottomY - coreHeight / 2,
         currentWidth,
         coreHeight
       );
       
       // Ultra-smooth radial glow - More segments for straight, even distribution
       const glowSegments = Math.max(60, Math.ceil(currentWidth / 6)); // More segments for even glow
       
       // Outer radial glow - Ultra-smooth elegant fade with extended transitions
       for (let i = 0; i <= glowSegments; i++) {
         const x = centerX - currentWidth / 2 + (i / glowSegments) * currentWidth;
         // Straight radius - minimal variation for even glow
         const centerDist = Math.abs((i / glowSegments) - 0.5) * 2;
         const radiusMultiplier = 1 - (centerDist * 0.08); // Very little variation for straight glow
         const glowRadius = currentGlowHeight * radiusMultiplier;
         
         // Ultra-smooth elegant fade with many color stops for seamless merge
         const outerRadial = ctx.createRadialGradient(
           x, bottomY, 0,
           x, bottomY, glowRadius
         );
         outerRadial.addColorStop(0, `rgba(244, 114, 182, ${0.12 * pulseIntensity})`); // Pink-400
         outerRadial.addColorStop(0.05, `rgba(242, 107, 176, ${0.118 * pulseIntensity})`);
         outerRadial.addColorStop(0.1, `rgba(236, 72, 153, ${0.115 * pulseIntensity})`); // Pink-500
         outerRadial.addColorStop(0.15, `rgba(233, 76, 156, ${0.112 * pulseIntensity})`);
         outerRadial.addColorStop(0.2, `rgba(217, 70, 239, ${0.11 * pulseIntensity})`); // Magenta
         outerRadial.addColorStop(0.25, `rgba(220, 72, 200, ${0.108 * pulseIntensity})`);
         outerRadial.addColorStop(0.3, `rgba(244, 114, 182, ${0.105 * pulseIntensity})`); // Pink-400
         outerRadial.addColorStop(0.35, `rgba(238, 86, 162, ${0.102 * pulseIntensity})`);
         outerRadial.addColorStop(0.4, `rgba(236, 72, 153, ${0.1 * pulseIntensity})`); // Pink-500
         outerRadial.addColorStop(0.45, `rgba(230, 80, 160, ${0.098 * pulseIntensity})`);
         outerRadial.addColorStop(0.5, `rgba(217, 70, 239, ${0.095 * pulseIntensity})`); // Magenta
         outerRadial.addColorStop(0.55, `rgba(220, 75, 165, ${0.09 * pulseIntensity})`);
         outerRadial.addColorStop(0.6, `rgba(244, 114, 182, ${0.08 * pulseIntensity})`); // Pink-400
         outerRadial.addColorStop(0.65, `rgba(238, 82, 164, ${0.075 * pulseIntensity})`);
         outerRadial.addColorStop(0.7, `rgba(236, 72, 153, ${0.07 * pulseIntensity})`); // Pink-500
         outerRadial.addColorStop(0.75, `rgba(217, 70, 239, ${0.06 * pulseIntensity})`); // Magenta
         outerRadial.addColorStop(0.8, `rgba(244, 114, 182, ${0.055 * pulseIntensity})`); // Pink-400
         outerRadial.addColorStop(0.84, `rgba(242, 100, 180, ${0.05 * pulseIntensity})`);
         outerRadial.addColorStop(0.88, `rgba(236, 72, 153, ${0.045 * pulseIntensity})`); // Pink-500
         outerRadial.addColorStop(0.91, `rgba(217, 70, 239, ${0.04 * pulseIntensity})`); // Magenta
         outerRadial.addColorStop(0.94, `rgba(244, 114, 182, ${0.035 * pulseIntensity})`); // Pink-400
         outerRadial.addColorStop(0.96, `rgba(236, 72, 153, ${0.03 * pulseIntensity})`); // Pink-500
         outerRadial.addColorStop(0.97, `rgba(220, 100, 180, ${0.025 * pulseIntensity})`);
         outerRadial.addColorStop(0.98, `rgba(217, 70, 239, ${0.02 * pulseIntensity})`); // Magenta
         outerRadial.addColorStop(0.985, `rgba(244, 114, 182, ${0.015 * pulseIntensity})`); // Pink-400
         outerRadial.addColorStop(0.99, `rgba(245, 120, 185, ${0.01 * pulseIntensity})`);
         outerRadial.addColorStop(0.992, `rgba(246, 125, 188, ${0.007 * pulseIntensity})`);
         outerRadial.addColorStop(0.995, `rgba(247, 130, 190, ${0.004 * pulseIntensity})`);
         outerRadial.addColorStop(0.998, `rgba(248, 135, 192, ${0.002 * pulseIntensity})`);
         outerRadial.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fully transparent - elegant merge
         
         ctx.globalAlpha = 1;
         ctx.fillStyle = outerRadial;
         ctx.beginPath();
         ctx.arc(x, bottomY, glowRadius, 0, Math.PI * 2);
         ctx.fill();
       }
       
       // Inner radial glow - Smoother, more even gradient fade
       for (let i = 0; i <= glowSegments; i++) {
         const x = centerX - currentWidth / 2 + (i / glowSegments) * currentWidth;
         const centerDist = Math.abs((i / glowSegments) - 0.5) * 2;
         const radiusMultiplier = 1 - (centerDist * 0.06); // Very little variation for straight glow
         const innerGlowRadius = (currentGlowHeight * 0.45) * radiusMultiplier; // Smaller for subtlety
         
         // Smoother gradient fade with more color stops for even transition
         const innerRadial = ctx.createRadialGradient(
           x, bottomY, 0,
           x, bottomY, innerGlowRadius
         );
         innerRadial.addColorStop(0, `rgba(244, 114, 182, ${0.18 * pulseIntensity})`); // Pink-400 (reduced white)
         innerRadial.addColorStop(0.1, `rgba(236, 72, 153, ${0.175 * pulseIntensity})`); // Pink-500
         innerRadial.addColorStop(0.2, `rgba(236, 72, 153, ${0.17 * pulseIntensity})`); // Pink-500
         innerRadial.addColorStop(0.3, `rgba(217, 70, 239, ${0.165 * pulseIntensity})`); // Magenta
         innerRadial.addColorStop(0.4, `rgba(244, 114, 182, ${0.16 * pulseIntensity})`); // Pink-400
         innerRadial.addColorStop(0.5, `rgba(236, 72, 153, ${0.155 * pulseIntensity})`); // Pink-500
         innerRadial.addColorStop(0.6, `rgba(217, 70, 239, ${0.15 * pulseIntensity})`); // Magenta
         innerRadial.addColorStop(0.7, `rgba(244, 114, 182, ${0.145 * pulseIntensity})`); // Pink-400
         innerRadial.addColorStop(0.75, `rgba(236, 72, 153, ${0.14 * pulseIntensity})`); // Pink-500
         innerRadial.addColorStop(0.8, `rgba(217, 70, 239, ${0.135 * pulseIntensity})`); // Magenta
         innerRadial.addColorStop(0.85, `rgba(244, 114, 182, ${0.13 * pulseIntensity})`); // Pink-400
         innerRadial.addColorStop(0.9, `rgba(236, 72, 153, ${0.12 * pulseIntensity})`); // Pink-500
         innerRadial.addColorStop(0.92, `rgba(217, 70, 239, ${0.1 * pulseIntensity})`); // Magenta
         innerRadial.addColorStop(0.94, `rgba(244, 114, 182, ${0.08 * pulseIntensity})`); // Pink-400
         innerRadial.addColorStop(0.95, `rgba(240, 100, 170, ${0.075 * pulseIntensity})`);
         innerRadial.addColorStop(0.96, `rgba(236, 72, 153, ${0.06 * pulseIntensity})`); // Pink-500
         innerRadial.addColorStop(0.97, `rgba(230, 90, 170, ${0.05 * pulseIntensity})`);
         innerRadial.addColorStop(0.98, `rgba(217, 70, 239, ${0.04 * pulseIntensity})`); // Magenta
         innerRadial.addColorStop(0.985, `rgba(220, 100, 180, ${0.03 * pulseIntensity})`);
         innerRadial.addColorStop(0.99, `rgba(240, 110, 185, ${0.02 * pulseIntensity})`);
         innerRadial.addColorStop(0.992, `rgba(242, 115, 187, ${0.015 * pulseIntensity})`);
         innerRadial.addColorStop(0.995, `rgba(244, 120, 189, ${0.01 * pulseIntensity})`);
         innerRadial.addColorStop(0.998, `rgba(246, 125, 191, ${0.005 * pulseIntensity})`);
         innerRadial.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fully transparent - elegant merge
         
         ctx.globalAlpha = 1;
         ctx.fillStyle = innerRadial;
         ctx.beginPath();
         ctx.arc(x, bottomY, innerGlowRadius, 0, Math.PI * 2);
         ctx.fill();
       }
       
       ctx.restore();
     };

     // Draw bottom aurora - Same radial glow style as horizontal spread (stays at bottom, pulsating)
     const drawBottomAurora = (pulseProgress = 0) => {
       const dims = getCanvasDims();
       const bottomY = dims.height;
       const centerX = dims.width / 2;
       const currentWidth = dims.width; // Full width
       
       // Calculate pulsating intensity
       const pulseIntensity = CONFIG.auroraMinOpacity + 
         (CONFIG.auroraMaxOpacity - CONFIG.auroraMinOpacity) * 
         (Math.sin(pulseProgress * Math.PI * 2) * 0.5 + 0.5);
       
        // Same glow height as horizontal spread (reduced below button)
        const maxGlowHeight = dims.height * 0.14;
        const glowHeight = maxGlowHeight; // Full glow height (doesn't expand, stays constant)
       
       // Responsive sizing
       const isMobile = dims.width < 768;
       const coreHeight = isMobile ? 3 : 4;
       
       ctx.save();
       ctx.globalCompositeOperation = 'screen';
       ctx.globalAlpha *= pulseIntensity;
       
        // Bright horizontal core line at bottom - Lightened gradient
        const coreGradient = ctx.createLinearGradient(
          centerX - currentWidth / 2, 0,
          centerX + currentWidth / 2, 0
        );
        // Straight, even brightness across the width - Reduced white tint
        coreGradient.addColorStop(0, `rgba(255, 255, 255, ${0.2 * pulseIntensity})`); // Reduced white
        coreGradient.addColorStop(0.5, `rgba(244, 114, 182, ${0.35 * pulseIntensity})`); // Pink-400
        coreGradient.addColorStop(1, `rgba(255, 255, 255, ${0.2 * pulseIntensity})`); // Reduced white
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = coreGradient;
        ctx.fillRect(
          centerX - currentWidth / 2,
          bottomY - coreHeight / 2,
          currentWidth,
          coreHeight
        );
        
        // Ultra-smooth radial glow - More segments for straight, even distribution
        const glowSegments = Math.max(60, Math.ceil(currentWidth / 6)); // More segments for even glow
        
        // Outer radial glow - Smoother, more even gradient fade
        for (let i = 0; i <= glowSegments; i++) {
          const x = centerX - currentWidth / 2 + (i / glowSegments) * currentWidth;
          // Straight radius - minimal variation for even glow
          const centerDist = Math.abs((i / glowSegments) - 0.5) * 2;
          const radiusMultiplier = 1 - (centerDist * 0.08); // Very little variation for straight glow
          const glowRadius = glowHeight * radiusMultiplier;
          
          // Smoother gradient fade with more color stops for even transition
          const outerRadial = ctx.createRadialGradient(
            x, bottomY, 0,
            x, bottomY, glowRadius
          );
          outerRadial.addColorStop(0, `rgba(244, 114, 182, ${0.12 * pulseIntensity})`); // Pink-400
          outerRadial.addColorStop(0.1, `rgba(236, 72, 153, ${0.115 * pulseIntensity})`); // Pink-500
          outerRadial.addColorStop(0.2, `rgba(217, 70, 239, ${0.11 * pulseIntensity})`); // Magenta
          outerRadial.addColorStop(0.3, `rgba(244, 114, 182, ${0.105 * pulseIntensity})`); // Pink-400
          outerRadial.addColorStop(0.4, `rgba(236, 72, 153, ${0.1 * pulseIntensity})`); // Pink-500
          outerRadial.addColorStop(0.5, `rgba(217, 70, 239, ${0.095 * pulseIntensity})`); // Magenta
          outerRadial.addColorStop(0.6, `rgba(244, 114, 182, ${0.08 * pulseIntensity})`); // Pink-400
          outerRadial.addColorStop(0.7, `rgba(236, 72, 153, ${0.07 * pulseIntensity})`); // Pink-500
          outerRadial.addColorStop(0.75, `rgba(217, 70, 239, ${0.06 * pulseIntensity})`); // Magenta
          outerRadial.addColorStop(0.8, `rgba(244, 114, 182, ${0.055 * pulseIntensity})`); // Pink-400
          outerRadial.addColorStop(0.85, `rgba(236, 72, 153, ${0.05 * pulseIntensity})`); // Pink-500
          outerRadial.addColorStop(0.9, `rgba(217, 70, 239, ${0.04 * pulseIntensity})`); // Magenta
          outerRadial.addColorStop(0.92, `rgba(244, 114, 182, ${0.03 * pulseIntensity})`); // Pink-400
          outerRadial.addColorStop(0.94, `rgba(236, 72, 153, ${0.025 * pulseIntensity})`); // Pink-500
          outerRadial.addColorStop(0.96, `rgba(217, 70, 239, ${0.02 * pulseIntensity})`); // Magenta
          outerRadial.addColorStop(0.97, `rgba(220, 100, 180, ${0.015 * pulseIntensity})`);
          outerRadial.addColorStop(0.98, `rgba(244, 114, 182, ${0.01 * pulseIntensity})`); // Pink-400
          outerRadial.addColorStop(0.99, `rgba(245, 120, 185, ${0.005 * pulseIntensity})`);
          outerRadial.addColorStop(0.995, `rgba(246, 125, 188, ${0.002 * pulseIntensity})`);
          outerRadial.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fully transparent - smooth merge
          
          ctx.globalAlpha = 1;
          ctx.fillStyle = outerRadial;
          ctx.beginPath();
          ctx.arc(x, bottomY, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Inner radial glow - Smoother, more even gradient fade
        for (let i = 0; i <= glowSegments; i++) {
          const x = centerX - currentWidth / 2 + (i / glowSegments) * currentWidth;
          const centerDist = Math.abs((i / glowSegments) - 0.5) * 2;
          const radiusMultiplier = 1 - (centerDist * 0.06); // Very little variation for straight glow
          const innerGlowRadius = (glowHeight * 0.45) * radiusMultiplier; // Smaller for subtlety
          
          // Smoother gradient fade with more color stops for even transition
          const innerRadial = ctx.createRadialGradient(
            x, bottomY, 0,
            x, bottomY, innerGlowRadius
          );
          innerRadial.addColorStop(0, `rgba(244, 114, 182, ${0.18 * pulseIntensity})`); // Pink-400 (reduced white)
          innerRadial.addColorStop(0.1, `rgba(236, 72, 153, ${0.175 * pulseIntensity})`); // Pink-500
          innerRadial.addColorStop(0.2, `rgba(217, 70, 239, ${0.17 * pulseIntensity})`); // Magenta
          innerRadial.addColorStop(0.3, `rgba(217, 70, 239, ${0.165 * pulseIntensity})`); // Magenta
          innerRadial.addColorStop(0.4, `rgba(244, 114, 182, ${0.16 * pulseIntensity})`); // Pink-400
          innerRadial.addColorStop(0.5, `rgba(236, 72, 153, ${0.155 * pulseIntensity})`); // Pink-500
          innerRadial.addColorStop(0.6, `rgba(217, 70, 239, ${0.15 * pulseIntensity})`); // Magenta
          innerRadial.addColorStop(0.7, `rgba(244, 114, 182, ${0.145 * pulseIntensity})`); // Pink-400
          innerRadial.addColorStop(0.75, `rgba(236, 72, 153, ${0.14 * pulseIntensity})`); // Pink-500
          innerRadial.addColorStop(0.8, `rgba(217, 70, 239, ${0.135 * pulseIntensity})`); // Magenta
          innerRadial.addColorStop(0.85, `rgba(244, 114, 182, ${0.13 * pulseIntensity})`); // Pink-400
          innerRadial.addColorStop(0.9, `rgba(236, 72, 153, ${0.12 * pulseIntensity})`); // Pink-500
          innerRadial.addColorStop(0.92, `rgba(217, 70, 239, ${0.1 * pulseIntensity})`); // Magenta
          innerRadial.addColorStop(0.94, `rgba(244, 114, 182, ${0.08 * pulseIntensity})`); // Pink-400
          innerRadial.addColorStop(0.96, `rgba(236, 72, 153, ${0.06 * pulseIntensity})`); // Pink-500
          innerRadial.addColorStop(0.97, `rgba(230, 90, 170, ${0.05 * pulseIntensity})`);
          innerRadial.addColorStop(0.98, `rgba(217, 70, 239, ${0.04 * pulseIntensity})`); // Magenta
          innerRadial.addColorStop(0.99, `rgba(220, 100, 180, ${0.02 * pulseIntensity})`);
          innerRadial.addColorStop(0.995, `rgba(240, 110, 185, ${0.01 * pulseIntensity})`);
          innerRadial.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fully transparent - smooth merge
          
          ctx.globalAlpha = 1;
          ctx.fillStyle = innerRadial;
          ctx.beginPath();
          ctx.arc(x, bottomY, innerGlowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
       
       ctx.restore();
     };

     // Static glow for reduced motion - Matching horizontal spread style
     const drawStaticGlow = () => {
       const dims = getCanvasDims();
       const bottomY = dims.height;
       const centerY = bottomY;
       const centerX = dims.width / 2;
       const currentWidth = dims.width;
       
       // Responsive beam heights - Matching horizontal spread exactly
       const isMobile = dims.width < 768;
       const coreHeight = isMobile ? 3 : 4;
       const glowHeight = isMobile ? 35 : 50;
       const outerGlowHeight = isMobile ? 60 : 80;
       
       ctx.save();
       ctx.globalCompositeOperation = 'screen';
       
       // Background pink gradient - Matching text pink gradient
       const bgGradient = ctx.createLinearGradient(
         centerX - currentWidth / 2, 0,
         centerX + currentWidth / 2, 0
       );
       bgGradient.addColorStop(0, 'rgba(217, 70, 239, 0.15)'); // Magenta #d946ef
       bgGradient.addColorStop(0.3, 'rgba(236, 72, 153, 0.2)'); // Pink-500 #ec4899
       bgGradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.25)'); // Pink-400 #f472b6
       bgGradient.addColorStop(0.7, 'rgba(236, 72, 153, 0.2)'); // Pink-500 #ec4899
       bgGradient.addColorStop(1, 'rgba(217, 70, 239, 0.15)'); // Magenta #d946ef
       
       ctx.globalAlpha = 1;
       ctx.fillStyle = bgGradient;
       ctx.fillRect(
         centerX - currentWidth / 2,
         centerY - outerGlowHeight / 2,
         currentWidth,
         outerGlowHeight
       );
       
       // Static horizon line - Matching horizontal spread core
       const coreGradient = ctx.createLinearGradient(
         centerX - currentWidth / 2, 0,
         centerX + currentWidth / 2, 0
       );
       coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)'); // White
       coreGradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.85)'); // Pink-400
       coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0.7)'); // White
       
       ctx.globalAlpha = 1;
       ctx.fillStyle = coreGradient;
       ctx.fillRect(
         centerX - currentWidth / 2,
         centerY - coreHeight / 2,
         currentWidth,
         coreHeight
       );
       
       ctx.restore();
     };

    // Easing function - easeInOutCubic
    const easeInOutCubic = (t) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Animation loop
    let lastTime = null;
    const animate = (currentTime) => {
      if (!animationStartTime) {
        animationStartTime = currentTime;
        auroraStartTime = currentTime; // Start aurora pulsation
        lastTime = currentTime;
      }

      const elapsed = (currentTime - animationStartTime) / 1000;
      const deltaTime = lastTime ? (currentTime - lastTime) / 16.67 : 1;
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (reducedMotion) {
        drawStaticGlow();
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const totalAnimationDuration = CONFIG.convergenceDuration + CONFIG.beamTravelDuration + CONFIG.impactDuration + (CONFIG.mergeDuration || 0) + CONFIG.spreadDuration;
      const beamFadeStart = totalAnimationDuration; // Beam stays visible until spread completes
      const beamFadeEnd = beamFadeStart + CONFIG.beamFadeDuration;

      // Calculate aurora pulse progress (continuous)
      const auroraElapsed = (currentTime - auroraStartTime) / 1000;
      const auroraPulseProgress = (auroraElapsed % CONFIG.auroraPulseDuration) / CONFIG.auroraPulseDuration;

      // Phase: Convergence
      if (elapsed < CONFIG.convergenceDuration) {
        phaseRef.current = 'convergence';
        if (particles.length === 0 || (particles.length > 0 && particles[0].type !== 'convergence')) {
          initConvergenceParticles();
        }
        
        particles = particles.filter(p => {
          const alive = p.update(deltaTime, currentTime);
          if (alive) p.draw(ctx);
          return alive;
        });
      }
      // Phase: Beam Travel (with easeInOutCubic)
      else if (elapsed < CONFIG.convergenceDuration + CONFIG.beamTravelDuration) {
        phaseRef.current = 'travel';
        const travelElapsed = elapsed - CONFIG.convergenceDuration;
        const rawProgress = travelElapsed / CONFIG.beamTravelDuration;
        beamProgress = easeInOutCubic(Math.min(1, rawProgress));
        
        // Initialize travel particles once
        if (particles.length === 0 || (particles.length > 0 && particles[0].type !== 'travel')) {
          initTravelParticles();
        }
        
        drawBeam(beamProgress, beamOpacity);
        
        particles = particles.filter(p => {
          const alive = p.update(deltaTime, currentTime);
          if (alive) p.draw(ctx);
          return alive;
        });
      }
      // Phase: Impact
      else if (elapsed < CONFIG.convergenceDuration + CONFIG.beamTravelDuration + CONFIG.impactDuration) {
        phaseRef.current = 'impact';
        const impactElapsed = elapsed - CONFIG.convergenceDuration - CONFIG.beamTravelDuration;
        impactProgress = Math.min(1, impactElapsed / CONFIG.impactDuration);
        
        drawBeam(1, 1); // Full beam opacity - concentrated energy
        drawImpactFlare(impactProgress, 0);
        
        // Initialize scatter particles on impact start
        if (impactProgress < 0.1 && (particles.length === 0 || (particles.length > 0 && particles[0].type !== 'scatter'))) {
          initScatterParticles();
        }
        
        particles = particles.filter(p => {
          const alive = p.update(deltaTime, currentTime);
          if (alive) p.draw(ctx);
          return alive;
        });
      }
      // Phase: Merge - Smooth transition from impact to spread
      else if (elapsed < CONFIG.convergenceDuration + CONFIG.beamTravelDuration + CONFIG.impactDuration + (CONFIG.mergeDuration || 0)) {
        phaseRef.current = 'merge';
        const mergeElapsed = elapsed - CONFIG.convergenceDuration - CONFIG.beamTravelDuration - CONFIG.impactDuration;
        const mergeProgress = Math.min(1, mergeElapsed / (CONFIG.mergeDuration || 0.6));
        
        // Smooth ease-out transition
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const smoothMerge = easeOut(mergeProgress);
        
        drawBeam(1, 1); // Full beam opacity - concentrated energy
        drawImpactFlare(1, smoothMerge); // Maintain impact flare intensity during merge
        // Start spread smoothly from 0, gradually expanding during merge
        const initialSpread = smoothMerge * 0.12; // Smaller initial spread for smoother transition
        const auroraElapsed = (currentTime - auroraStartTime) / 1000;
        const auroraPulseProgress = (auroraElapsed % CONFIG.auroraPulseDuration) / CONFIG.auroraPulseDuration;
        const pulseIntensity = CONFIG.auroraMinOpacity + 
          (CONFIG.auroraMaxOpacity - CONFIG.auroraMinOpacity) * 
          (Math.sin(auroraPulseProgress * Math.PI * 2) * 0.5 + 0.5);
        drawHorizontalSpread(initialSpread, pulseIntensity);
        
        particles = particles.filter(p => {
          const alive = p.update(deltaTime, currentTime);
          if (alive) p.draw(ctx);
          return alive;
        });
      }
       // Phase: Horizontal Spread - Smooth expansion, beam stays visible
       else if (elapsed < beamFadeStart) {
         phaseRef.current = 'spread';
         const spreadElapsed = elapsed - CONFIG.convergenceDuration - CONFIG.beamTravelDuration - CONFIG.impactDuration - (CONFIG.mergeDuration || 0);
         const rawProgress = Math.min(1, spreadElapsed / CONFIG.spreadDuration);
         
         // Use smooth easeInOutCubic for very smooth, elegant horizontal expansion
         const easeInOutCubicSmooth = (t) => {
           return t < 0.5 
             ? 4 * t * t * t 
             : 1 - Math.pow(-2 * t + 2, 3) / 2;
         };
         // Continue from merge's initial spread (0.12) to full width (1.0) smoothly
         const mergeInitialSpread = 0.12; // Match merge phase end
         const spreadRange = 1.0 - mergeInitialSpread;
         spreadProgress = mergeInitialSpread + (easeInOutCubicSmooth(rawProgress) * spreadRange);
         
         drawBeam(1, 1); // Full beam opacity - concentrated energy until spread completes
         drawImpactFlare(1, 1); // Maintain impact flare during spread
         // Use same pulse intensity as aurora for seamless transition
         const auroraElapsed = (currentTime - auroraStartTime) / 1000;
         const auroraPulseProgress = (auroraElapsed % CONFIG.auroraPulseDuration) / CONFIG.auroraPulseDuration;
         const pulseIntensity = CONFIG.auroraMinOpacity + 
           (CONFIG.auroraMaxOpacity - CONFIG.auroraMinOpacity) * 
           (Math.sin(auroraPulseProgress * Math.PI * 2) * 0.5 + 0.5);
         drawHorizontalSpread(spreadProgress, pulseIntensity);
         
         particles = particles.filter(p => {
           const alive = p.update(deltaTime, currentTime);
           if (alive) p.draw(ctx);
           return alive;
         });
       }
       // Phase: Beam Fade Out (after spread completes)
       else if (elapsed < beamFadeEnd) {
         phaseRef.current = 'fade';
         const fadeElapsed = elapsed - beamFadeStart;
         beamOpacity = Math.max(0, 1 - (fadeElapsed / CONFIG.beamFadeDuration));
         
         // Continue showing horizontal spread at full width with pulse
         const auroraElapsed = (currentTime - auroraStartTime) / 1000;
         const auroraPulseProgress = (auroraElapsed % CONFIG.auroraPulseDuration) / CONFIG.auroraPulseDuration;
         const pulseIntensity = CONFIG.auroraMinOpacity + 
           (CONFIG.auroraMaxOpacity - CONFIG.auroraMinOpacity) * 
           (Math.sin(auroraPulseProgress * Math.PI * 2) * 0.5 + 0.5);
         
         drawBeam(1, beamOpacity); // Beam fades out smoothly
         drawImpactFlare(1, beamOpacity); // Impact flare fades with beam
         drawHorizontalSpread(1, pulseIntensity); // Full spread with pulse
       
         particles = particles.filter(p => {
           const alive = p.update(deltaTime, currentTime);
           if (alive) p.draw(ctx);
           return alive;
         });
       }
      // Phase: Persistent Pulsating Aurora (forever)
      else {
        phaseRef.current = 'aurora';
        beamOpacity = 0;
        
        // Draw persistent pulsating aurora - full width, continuous pulse
        drawBottomAurora(auroraPulseProgress);
        
        // Particles fade out naturally
        particles = particles.filter(p => {
          const alive = p.update(deltaTime, currentTime);
          if (alive) p.draw(ctx);
          return alive;
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (loopTimeout) {
        clearTimeout(loopTimeout);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="laser-beam-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  );
};

export default LaserBeamCanvas;

