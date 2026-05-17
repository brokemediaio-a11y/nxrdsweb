import React, { memo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { SpeakingState, CallStatus } from './useRetell';

interface VoiceOrbProps {
  speakingState: SpeakingState;
  callStatus: CallStatus;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({ speakingState, callStatus }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ speakingState, callStatus });

  useEffect(() => {
    stateRef.current = { speakingState, callStatus };
  }, [speakingState, callStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const SIZE = 260;

    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    const cx = SIZE / 2;
    const cy = SIZE / 2;

    // Orbital dots — 4 dots on two orbital paths
    const orbitals = [
      { orbitRadius: 68, angle: 0, speed: 0.012, size: 3.5, hue: 330 },
      { orbitRadius: 68, angle: Math.PI, speed: 0.012, size: 2.5, hue: 280 },
      { orbitRadius: 84, angle: Math.PI / 2, speed: -0.008, size: 2, hue: 310 },
      { orbitRadius: 84, angle: (Math.PI * 3) / 2, speed: -0.008, size: 1.5, hue: 260 },
    ];

    // Tiny floating sparks — subtle, few
    const sparks = Array.from({ length: 18 }, () => ({
      angle: Math.random() * Math.PI * 2,
      r: 48 + Math.random() * 42,
      speed: (Math.random() - 0.5) * 0.006,
      opacity: Math.random() * 0.4 + 0.1,
      size: Math.random() * 1.2 + 0.4,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    const startTime = performance.now();

    const animate = (now: number) => {
      const t = now - startTime;
      const { speakingState, callStatus } = stateRef.current;

      // Intensity drives all reactive effects
      let intensity = 0;
      if (speakingState === 'agent_speaking') intensity = 1;
      else if (speakingState === 'user_speaking') intensity = 0.7;
      else if (callStatus === 'connecting') intensity = 0.45;
      else if (callStatus === 'active') intensity = 0.18;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // === Outer ambient halo ===
      const haloR = 108 + Math.sin(t * 0.0018) * 6 * (1 + intensity * 0.5);
      const halo = ctx.createRadialGradient(cx, cy, haloR * 0.55, cx, cy, haloR);
      halo.addColorStop(0, `rgba(217, 70, 239, ${0.04 + intensity * 0.07})`);
      halo.addColorStop(1, 'rgba(138, 43, 226, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
      ctx.fill();

      // === Concentric rings — 3 rings ===
      const ringData = [
        { r: 52 + intensity * 8, opacity: 0.18 + intensity * 0.22, width: 1 },
        { r: 68 + intensity * 6, opacity: 0.1 + intensity * 0.14, width: 0.8 },
        { r: 84 + intensity * 5, opacity: 0.06 + intensity * 0.08, width: 0.6 },
      ];
      ringData.forEach(({ r, opacity, width }, i) => {
        const pulse = Math.sin(t * 0.002 + i * 1.2) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(236, 72, 153, ${opacity * (0.7 + 0.3 * pulse)})`;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // === Core sphere — layered radial gradients for depth ===
      const coreR = 38 + Math.sin(t * 0.002) * 3 + intensity * 10;

      // Deep glow behind sphere
      const deepGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.2);
      deepGlow.addColorStop(0, `rgba(236, 72, 153, ${0.12 + intensity * 0.2})`);
      deepGlow.addColorStop(0.45, `rgba(217, 70, 239, ${0.07 + intensity * 0.1})`);
      deepGlow.addColorStop(1, 'rgba(138, 43, 226, 0)');
      ctx.fillStyle = deepGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Mid glow
      const midGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 1.4);
      midGlow.addColorStop(0, `rgba(255, 200, 230, ${0.15 + intensity * 0.25})`);
      midGlow.addColorStop(0.5, `rgba(236, 72, 153, ${0.18 + intensity * 0.22})`);
      midGlow.addColorStop(1, `rgba(138, 43, 226, ${0.04 + intensity * 0.06})`);
      ctx.fillStyle = midGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Sphere surface
      const sphere = ctx.createRadialGradient(cx - coreR * 0.2, cy - coreR * 0.25, coreR * 0.05, cx, cy, coreR);
      sphere.addColorStop(0, `rgba(255, 240, 248, ${0.55 + intensity * 0.25})`);
      sphere.addColorStop(0.35, `rgba(236, 72, 153, ${0.45 + intensity * 0.3})`);
      sphere.addColorStop(0.7, `rgba(180, 40, 180, ${0.3 + intensity * 0.2})`);
      sphere.addColorStop(1, `rgba(100, 20, 140, ${0.2 + intensity * 0.15})`);
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight
      const specR = coreR * 0.45;
      const specX = cx - coreR * 0.28;
      const specY = cy - coreR * 0.3;
      const spec = ctx.createRadialGradient(specX, specY, 0, specX, specY, specR);
      spec.addColorStop(0, `rgba(255, 255, 255, ${0.35 + intensity * 0.15})`);
      spec.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spec;
      ctx.beginPath();
      ctx.arc(specX, specY, specR, 0, Math.PI * 2);
      ctx.fill();

      // === Orbital dots ===
      orbitals.forEach(dot => {
        dot.angle += dot.speed * (1 + intensity * 1.5);
        const x = cx + Math.cos(dot.angle) * dot.orbitRadius;
        const y = cy + Math.sin(dot.angle) * dot.orbitRadius * 0.35; // elliptical

        const dotOpacity = 0.5 + intensity * 0.4;
        const dotGlow = ctx.createRadialGradient(x, y, 0, x, y, dot.size * 3);
        dotGlow.addColorStop(0, `hsla(${dot.hue}, 75%, 70%, ${dotOpacity})`);
        dotGlow.addColorStop(0.5, `hsla(${dot.hue}, 75%, 60%, ${dotOpacity * 0.4})`);
        dotGlow.addColorStop(1, `hsla(${dot.hue}, 75%, 60%, 0)`);
        ctx.fillStyle = dotGlow;
        ctx.beginPath();
        ctx.arc(x, y, dot.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsla(${dot.hue}, 80%, 85%, ${dotOpacity})`;
        ctx.beginPath();
        ctx.arc(x, y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // === Subtle sparks ===
      sparks.forEach(s => {
        s.angle += s.speed;
        const twinkle = (Math.sin(t * 0.004 + s.twinklePhase) + 1) / 2;
        const op = s.opacity * (0.3 + 0.7 * twinkle) * (callStatus === 'active' || callStatus === 'connecting' ? 1 : 0.5);
        const x = cx + Math.cos(s.angle) * s.r;
        const y = cy + Math.sin(s.angle) * s.r * 0.55;

        ctx.fillStyle = `rgba(236, 100, 180, ${op})`;
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const statusLabel = (() => {
    if (callStatus === 'connecting') return 'Connecting...';
    if (callStatus === 'error') return 'Connection Error';
    if (callStatus === 'ended') return 'Call Ended';
    if (speakingState === 'agent_speaking') return 'AI Speaking';
    if (speakingState === 'user_speaking') return 'Listening...';
    if (callStatus === 'active') return 'Active';
    return 'Ready';
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'relative', width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />

        {/* Mic icon in center */}
        <motion.div
          animate={speakingState !== 'idle' ? { scale: [1, 1.07, 1] } : { scale: 1 }}
          transition={{ duration: 0.9, repeat: speakingState !== 'idle' ? Infinity : 0, ease: 'easeInOut' }}
          style={{
            position: 'relative',
            zIndex: 2,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(236, 72, 153, 0.18)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(236, 72, 153, 0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {callStatus === 'connecting' ? (
              <motion.circle cx="12" cy="12" r="9" strokeDasharray="56" strokeDashoffset="14"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '12px 12px' }}
              />
            ) : (
              <>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </>
            )}
          </svg>
        </motion.div>
      </motion.div>

      {/* Status */}
      <motion.span
        key={statusLabel}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          fontFamily: "'Lemon Milk', sans-serif",
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: callStatus === 'error'
            ? 'rgba(239, 68, 68, 0.85)'
            : speakingState === 'agent_speaking'
            ? 'rgba(236, 72, 153, 0.85)'
            : 'rgba(255, 255, 255, 0.45)',
        }}
      >
        {statusLabel}
      </motion.span>
    </div>
  );
};

export default memo(VoiceOrb);
