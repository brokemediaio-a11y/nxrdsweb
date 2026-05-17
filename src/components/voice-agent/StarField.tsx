import React, { memo, useEffect, useRef } from 'react';

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 9000));
      for (let i = 0; i < count; i++) {
        // ~15% of stars get a subtle pink/purple tint
        const colorType = Math.random();
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 1.4 + 0.6,
          speedX: (Math.random() - 0.5) * 0.45,
          speedY: (Math.random() - 0.5) * 0.45,
          baseOpacity: Math.random() * 0.3 + 0.62,
          opacity: 0.62,
          twinkleSpeed: Math.random() * 0.012 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          // colorType: 0=white, 1=pink-tint, 2=purple-tint
          colorType: colorType < 0.82 ? 0 : colorType < 0.91 ? 1 : 2,
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        p.opacity += p.twinkleSpeed * p.twinkleDir;
        if (p.opacity >= p.baseOpacity + 0.22 || p.opacity <= p.baseOpacity - 0.22) {
          p.twinkleDir *= -1;
        }
        p.opacity = Math.max(0.35, Math.min(1, p.opacity));

        // Star color based on type
        const coreColor = p.colorType === 1
          ? `rgba(255, 190, 220, ${p.opacity * 0.95})`
          : p.colorType === 2
          ? `rgba(210, 180, 255, ${p.opacity * 0.95})`
          : `rgba(235, 232, 225, ${p.opacity * 0.95})`;
        const glowColor0 = p.colorType === 1
          ? `rgba(236, 72, 153, ${p.opacity * 0.7})`
          : p.colorType === 2
          ? `rgba(180, 120, 255, ${p.opacity * 0.7})`
          : `rgba(225, 222, 215, ${p.opacity * 0.7})`;
        const glowColor1 = p.colorType === 1
          ? `rgba(236, 72, 153, ${p.opacity * 0.25})`
          : p.colorType === 2
          ? `rgba(180, 120, 255, ${p.opacity * 0.25})`
          : `rgba(225, 222, 215, ${p.opacity * 0.25})`;

        const glowRadius = p.size * 3;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        grad.addColorStop(0, glowColor0);
        grad.addColorStop(0.5, glowColor1);
        grad.addColorStop(1, 'rgba(220, 220, 210, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = coreColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default memo(StarField);
