import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import StarField from '../components/voice-agent/StarField';
import PreCallForm, { type PreCallFormData } from '../components/voice-agent/PreCallForm';
import VoiceModal from '../components/voice-agent/VoiceModal';
import { useRetell, type CallFormData } from '../components/voice-agent/useRetell';

// ─── Flowing wave visual that morphs into a rotating brand globe on hover ──

// Brand palette (from index.css :root)
const BRAND = {
  pink: [236, 72, 153] as const,     // #ec4899
  magenta: [217, 70, 239] as const,  // #d946ef
  purple2: [176, 92, 255] as const,  // #b05cff
  purple: [138, 43, 226] as const,   // #8a2be2
  softPink: [244, 114, 182] as const,// #f472b6
};

// Blend two rgb triplets
const mix = (a: readonly number[], b: readonly number[], k: number): [number, number, number] => [
  Math.round(a[0] + (b[0] - a[0]) * k),
  Math.round(a[1] + (b[1] - a[1]) * k),
  Math.round(a[2] + (b[2] - a[2]) * k),
];

const HeroWaveVisual: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hoverRef = useRef(false);
  const morphRef = useRef(0); // 0 = waves, 1 = globe

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const W = 480;
    const H = 300;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2;
    const R = 92; // globe radius

    const onEnter = () => { hoverRef.current = true; };
    const onLeave = () => { hoverRef.current = false; };
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mouseleave', onLeave);

    const startTime = performance.now();

    // Each parallel (latitude ring) corresponds to one wave line.
    // Latitudes spread evenly from near-north to near-south pole.
    const NUM_PARALLELS = 7;
    const waveDefs = [
      { freq: 0.014, harmFreq: 0.032, speed: 0.003, harmSpeed: 0.0048, ampMult: 1.0, harmMult: 0.3, lineWidth: 2.6, fillOpacity: 0.10 },
      { freq: 0.019, harmFreq: 0.042, speed: 0.0038, harmSpeed: 0.0028, ampMult: 0.82, harmMult: 0.25, lineWidth: 2.2, fillOpacity: 0.07 },
      { freq: 0.024, harmFreq: 0.055, speed: 0.0025, harmSpeed: 0.0042, ampMult: 0.6, harmMult: 0.2, lineWidth: 1.9, fillOpacity: 0.05 },
      { freq: 0.011, harmFreq: 0.025, speed: 0.0045, harmSpeed: 0.002, ampMult: 0.45, harmMult: 0.18, lineWidth: 1.7, fillOpacity: 0.04 },
      { freq: 0.03, harmFreq: 0.06, speed: 0.002, harmSpeed: 0.005, ampMult: 0.55, harmMult: 0.15, lineWidth: 1.5, fillOpacity: 0.035 },
      { freq: 0.008, harmFreq: 0.018, speed: 0.005, harmSpeed: 0.0015, ampMult: 0.75, harmMult: 0.22, lineWidth: 1.9, fillOpacity: 0.045 },
      { freq: 0.017, harmFreq: 0.038, speed: 0.0033, harmSpeed: 0.0036, ampMult: 0.68, harmMult: 0.2, lineWidth: 1.6, fillOpacity: 0.04 },
    ];

    // Color a point by its vertical position on the globe: pink (top) → magenta → purple (bottom)
    const colorByLat = (k: number): [number, number, number] => {
      // k: 0 = top, 1 = bottom
      if (k < 0.5) return mix(BRAND.softPink, BRAND.magenta, k / 0.5);
      return mix(BRAND.magenta, BRAND.purple, (k - 0.5) / 0.5);
    };

    // Project a 3D point (already rotated) to 2D with depth shading
    const project = (x3: number, y3: number, z3: number) => {
      const persp = 1 + z3 / (R * 4); // mild perspective
      return {
        x: cx + x3 * persp,
        y: cy + y3 * persp,
        depth: (z3 + R) / (2 * R), // 0 (back) → 1 (front)
      };
    };

    const animate = (now: number) => {
      const t = now - startTime;
      ctx.clearRect(0, 0, W, H);

      // Smooth morph
      const target = hoverRef.current ? 1 : 0;
      morphRef.current += (target - morphRef.current) * 0.045;
      const morph = morphRef.current;
      const ease = morph * morph * (3 - 2 * morph); // smoothstep

      const breathe = Math.sin(t * 0.0008) * 0.12 + 1;
      const baseAmp = 34 * breathe;

      // Globe rotation
      const ry = t * 0.0004;
      const rx = 0.32; // fixed tilt for a nice 3/4 view
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const cosX = Math.cos(rx), sinX = Math.sin(rx);

      // ── Ambient glow behind everything (centered) ──
      const glowR = 150 + ease * 20;
      const glowI = 0.05 + ease * 0.13;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0, `rgba(236, 72, 153, ${glowI})`);
      glow.addColorStop(0.45, `rgba(217, 70, 239, ${glowI * 0.55})`);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // ── Globe core sphere (fades in with hover) ──
      if (ease > 0.02) {
        const coreR = R * 0.92;
        const core = ctx.createRadialGradient(cx - R * 0.22, cy - R * 0.28, R * 0.1, cx, cy, coreR);
        core.addColorStop(0, `rgba(255, 230, 245, ${0.18 * ease})`);
        core.addColorStop(0.4, `rgba(236, 72, 153, ${0.14 * ease})`);
        core.addColorStop(0.75, `rgba(168, 50, 200, ${0.10 * ease})`);
        core.addColorStop(1, `rgba(138, 43, 226, 0)`);
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Helper to draw a polyline of {x,y,depth,color} with depth-based alpha
      const drawSegments = (pts: { x: number; y: number; depth: number }[], rgb: [number, number, number], lw: number, baseAlpha: number) => {
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const d = (p0.depth + p1.depth) / 2;
          // Back of globe dimmer, front brighter
          const depthAlpha = 0.25 + 0.75 * d;
          ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${baseAlpha * depthAlpha})`;
          ctx.lineWidth = lw * (0.7 + 0.5 * d);
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();
        }
      };

      // ── Parallels (latitude rings) — these are the morphed wave lines ──
      waveDefs.forEach((wave, wi) => {
        const phaseOffset = wi * 1.1;
        const phase = t * wave.speed + phaseOffset;
        const harmPhase = t * wave.harmSpeed + phaseOffset * 0.7;
        const wAmp = baseAmp * wave.ampMult;

        const latK = wi / (NUM_PARALLELS - 1); // 0 top → 1 bottom
        const lat = (latK - 0.5) * Math.PI * 0.9; // -..+ latitude
        const ringColor = colorByLat(latK);

        const STEPS = 120;
        const pts: { x: number; y: number; depth: number }[] = [];

        for (let i = 0; i <= STEPS; i++) {
          const frac = i / STEPS;

          // Wave-mode position (flat flowing line)
          const xWave = frac * W;
          const yWave = cy
            + Math.sin(xWave * wave.freq + phase) * wAmp
            + Math.sin(xWave * wave.harmFreq + harmPhase) * wAmp * wave.harmMult
            + Math.sin(xWave * 0.005 + t * 0.001) * wAmp * 0.12;

          // Globe-mode position (latitude ring rotated in 3D)
          const lon = frac * Math.PI * 2;
          let x3 = R * Math.cos(lat) * Math.cos(lon);
          let y3 = R * Math.sin(lat);
          let z3 = R * Math.cos(lat) * Math.sin(lon);
          // rotate Y
          let xr = x3 * cosY + z3 * sinY;
          let zr = -x3 * sinY + z3 * cosY;
          // rotate X (tilt)
          let yr = y3 * cosX - zr * sinX;
          let zr2 = y3 * sinX + zr * cosX;
          const proj = project(xr, yr, zr2);

          // Lerp wave → globe
          const x = xWave + (proj.x - xWave) * ease;
          const y = yWave + (proj.y - yWave) * ease;
          const depth = 0.5 + (proj.depth - 0.5) * ease; // neutral depth in wave mode

          pts.push({ x, y, depth });
        }

        // Fill under curve (wave mode only, fades out)
        const fillAlpha = wave.fillOpacity * (1 - ease);
        if (fillAlpha > 0.004) {
          const fillGrad = ctx.createLinearGradient(0, cy - wAmp, 0, cy + wAmp * 1.5);
          fillGrad.addColorStop(0, `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, ${fillAlpha})`);
          fillGrad.addColorStop(1, `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 0)`);
          ctx.beginPath();
          ctx.moveTo(pts[0].x, H);
          pts.forEach(p => ctx.lineTo(p.x, p.y));
          ctx.lineTo(pts[pts.length - 1].x, H);
          ctx.closePath();
          ctx.fillStyle = fillGrad;
          ctx.fill();
        }

        const strokeAlpha = (0.55 + 0.25 * Math.sin(t * 0.001 + wi)) * (1 - ease) + ease * 0.85;

        if (ease < 0.04) {
          // Pure wave mode — single smooth gradient stroke with faded edges
          ctx.beginPath();
          pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
          const sg = ctx.createLinearGradient(0, 0, W, 0);
          sg.addColorStop(0, `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 0)`);
          sg.addColorStop(0.15, `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, ${strokeAlpha})`);
          sg.addColorStop(0.85, `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, ${strokeAlpha})`);
          sg.addColorStop(1, `rgba(${ringColor[0]}, ${ringColor[1]}, ${ringColor[2]}, 0)`);
          ctx.strokeStyle = sg;
          ctx.lineWidth = wave.lineWidth;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';
          ctx.stroke();
        } else {
          // Globe mode — per-segment depth shading
          drawSegments(pts, ringColor, wave.lineWidth + 0.3, strokeAlpha);
        }
      });

      // ── Meridians (longitude lines) — only visible in globe mode ──
      if (ease > 0.05) {
        const NUM_MERIDIANS = 7;
        for (let m = 0; m < NUM_MERIDIANS; m++) {
          const lon0 = (m / NUM_MERIDIANS) * Math.PI * 2;
          const STEPS = 80;
          const pts: { x: number; y: number; depth: number }[] = [];
          for (let i = 0; i <= STEPS; i++) {
            const lat = (i / STEPS - 0.5) * Math.PI; // -90..+90
            let x3 = R * Math.cos(lat) * Math.cos(lon0);
            let y3 = R * Math.sin(lat);
            let z3 = R * Math.cos(lat) * Math.sin(lon0);
            let xr = x3 * cosY + z3 * sinY;
            let zr = -x3 * sinY + z3 * cosY;
            let yr = y3 * cosX - zr * sinX;
            let zr2 = y3 * sinX + zr * cosX;
            pts.push(project(xr, yr, zr2));
          }
          // meridian color shifts subtly across the globe
          const mc = mix(BRAND.pink, BRAND.purple2, m / NUM_MERIDIANS);
          drawSegments(pts, mc, 1.0, 0.35 * ease);
        }
      }

      // ── Specular highlight + rim light (globe mode) ──
      if (ease > 0.05) {
        // Soft top-left specular
        const specR = R * 0.55;
        const specX = cx - R * 0.3;
        const specY = cy - R * 0.32;
        const spec = ctx.createRadialGradient(specX, specY, 0, specX, specY, specR);
        spec.addColorStop(0, `rgba(255, 255, 255, ${0.16 * ease})`);
        spec.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = spec;
        ctx.beginPath();
        ctx.arc(specX, specY, specR, 0, Math.PI * 2);
        ctx.fill();

        // Outer rim ring
        ctx.beginPath();
        ctx.arc(cx, cy, R + 1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(244, 114, 182, ${0.22 * ease})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        maxWidth: '100%',
        cursor: 'pointer',
        maskImage: 'radial-gradient(ellipse 95% 88% at 50% 50%, black 50%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 95% 88% at 50% 50%, black 50%, transparent 100%)',
      }}
    />
  );
});

// ─── Feature card data ─────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
    title: 'Natural Voice',
    desc: 'Human-like conversation that understands context, tone, and intent in real time.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: '24/7 Availability',
    desc: 'Never miss a lead. Sophia answers every call, day or night, holidays included.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Personalised',
    desc: 'Sophia learns about your business before the call and tailors every conversation.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Books Appointments',
    desc: 'Schedules meetings directly into your calendar — no human hand-off needed.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Live Analytics',
    desc: 'Track every call, measure sentiment, and get actionable insights instantly.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Enterprise Secure',
    desc: 'End-to-end encrypted. Your data never leaves the secure pipeline.',
  },
];

// ─── Feature card component ────────────────────────────────────────────────

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; index: number }> = memo(
  ({ icon, title, desc, index }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-150, 150], [4, -4]);
    const rotateY = useTransform(mouseX, [-150, 150], [-4, 4]);

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouse}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        style={{
          perspective: 800,
        }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 20,
            padding: '32px 28px',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
          whileHover={{
            borderColor: 'rgba(236, 72, 153, 0.25)',
            boxShadow: '0 0 40px rgba(236, 72, 153, 0.08), 0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Corner glow */}
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(217,70,239,0.08))',
            border: '1px solid rgba(236,72,153,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ec4899',
            marginBottom: 20,
          }}>
            {icon}
          </div>

          <h3 style={{
            fontFamily: "'Lemon Milk', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 10px',
            letterSpacing: '0.02em',
          }}>
            {title}
          </h3>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.65,
            margin: 0,
          }}>
            {desc}
          </p>
        </motion.div>
      </motion.div>
    );
  }
);

// ─── Animated wave separator ───────────────────────────────────────────────

const WaveSeparator: React.FC = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      const waves = [
        { freq: 0.01, phase: elapsed * 0.001, amp: 12, stroke: 'rgba(236,72,153,0.35)', lineWidth: 1.5 },
        { freq: 0.015, phase: elapsed * 0.0008 + 1.2, amp: 8, stroke: 'rgba(217,70,239,0.25)', lineWidth: 1 },
        { freq: 0.02, phase: elapsed * 0.0012 + 2.5, amp: 5, stroke: 'rgba(138,43,226,0.15)', lineWidth: 0.8 },
      ];

      waves.forEach(wave => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = cy + Math.sin(x * wave.freq + wave.phase) * wave.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wave.stroke;
        ctx.lineWidth = wave.lineWidth;
        ctx.stroke();
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
        width: '100%',
        height: 60,
        display: 'block',
        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    />
  );
});

// ─── Main CallPage ─────────────────────────────────────────────────────────

const CallPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const lastFormData = useRef<CallFormData | null>(null);

  const {
    callStatus,
    speakingState,
    isMuted,
    transcript,
    startCall,
    endCall,
    toggleMute,
  } = useRetell();

  useEffect(() => {
    if (callStatus === 'active' && showForm) {
      setShowForm(false);
      setShowCall(true);
    }
  }, [callStatus, showForm]);

  const handleCTA = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleFormSubmit = useCallback(async (data: PreCallFormData) => {
    lastFormData.current = data;
    await startCall(data);
  }, [startCall]);

  const handleModalStartCall = useCallback(async () => {
    if (lastFormData.current) {
      await startCall(lastFormData.current);
    }
  }, [startCall]);

  const handleFormClose = useCallback(() => {
    if (callStatus === 'connecting') endCall();
    setShowForm(false);
  }, [callStatus, endCall]);

  const handleCallClose = useCallback(() => {
    if (callStatus === 'active' || callStatus === 'connecting') endCall();
    setShowCall(false);
  }, [callStatus, endCall]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050506',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background layers */}
      <StarField />
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 900px 600px at 25% 20%, rgba(138,43,226,0.06), transparent 70%),
          radial-gradient(ellipse 800px 600px at 75% 70%, rgba(236,72,153,0.04), transparent 70%),
          radial-gradient(ellipse 600px 400px at 50% 50%, rgba(217,70,239,0.03), transparent 60%)
        `,
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          zIndex: 100,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Lemon Milk', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            textDecoration: 'none',
            letterSpacing: '0.03em',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Home
        </Link>
      </motion.div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* ═══ Hero Section ═══ */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px 80px',
          textAlign: 'center',
        }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 999,
              background: 'rgba(236,72,153,0.08)',
              border: '1px solid rgba(236,72,153,0.2)',
              marginBottom: 40,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ec4899',
                boxShadow: '0 0 8px rgba(236,72,153,0.6)',
              }}
            />
            <span style={{
              fontFamily: "'Lemon Milk', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: 'rgba(236,72,153,0.9)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              AI Voice Agent — Live Demo
            </span>
          </motion.div>

          {/* Wave visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: 32, width: '100%', maxWidth: 480, display: 'flex', justifyContent: 'center' }}
          >
            <HeroWaveVisual />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Lemon Milk', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              margin: '0 0 20px',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.95)' }}>Meet </span>
            <span style={{
              background: 'linear-gradient(135deg, #fff 0%, #f472b6 45%, #d946ef 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              Sophia
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(15px, 2vw, 19px)',
              color: 'rgba(255,255,255,0.5)',
              maxWidth: 580,
              lineHeight: 1.7,
              margin: '0 auto 16px',
            }}
          >
            Your AI-powered voice agent that handles customer calls with the nuance
            of a seasoned professional — but never takes a day off.
          </motion.p>

          {/* Sub-detail */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              color: 'rgba(255,255,255,0.3)',
              maxWidth: 480,
              lineHeight: 1.7,
              margin: '0 auto 44px',
            }}
          >
            Powered by Nexordis AI. Sophia understands context, books appointments,
            qualifies leads, and provides answers — all in natural conversation.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              onClick={handleCTA}
              whileHover={{
                scale: 1.06,
                boxShadow: '0 0 60px rgba(236,72,153,0.4), 0 0 120px rgba(217,70,239,0.15)',
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 44px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(236,72,153,0.22) 0%, rgba(217,70,239,0.16) 50%, rgba(138,43,226,0.22) 100%)',
                border: '1px solid rgba(236,72,153,0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 0 40px rgba(236,72,153,0.2), 0 12px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.95)',
                fontFamily: "'Lemon Milk', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.04em',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Shimmer */}
              <motion.div
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                  pointerEvents: 'none',
                }}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span style={{ position: 'relative', zIndex: 1 }}>Talk to Sophia</span>
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Learn more
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        {/* ═══ Wave separator ═══ */}
        <WaveSeparator />

        {/* ═══ What Sophia Can Do ═══ */}
        <section style={{
          padding: '80px 24px 100px',
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{
              fontFamily: "'Lemon Milk', sans-serif",
              fontSize: 'clamp(24px, 3.5vw, 38px)',
              fontWeight: 700,
              margin: '0 0 16px',
              background: 'linear-gradient(135deg, #fff 0%, #f472b6 50%, #d946ef 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.01em',
            }}>
              What Sophia Can Do
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16,
              color: 'rgba(255,255,255,0.4)',
              maxWidth: 500,
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Built for businesses that want every call answered, every lead captured,
              and every customer impressed.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} index={i} />
            ))}
          </div>
        </section>

        {/* ═══ Wave separator ═══ */}
        <WaveSeparator />

        {/* ═══ How It Works ═══ */}
        <section style={{
          padding: '80px 24px 100px',
          maxWidth: 800,
          margin: '0 auto',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <h2 style={{
              fontFamily: "'Lemon Milk', sans-serif",
              fontSize: 'clamp(24px, 3.5vw, 38px)',
              fontWeight: 700,
              margin: '0 0 16px',
              background: 'linear-gradient(135deg, #fff 0%, #f472b6 50%, #d946ef 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              How It Works
            </h2>
          </motion.div>

          {/* Steps */}
          {[
            { step: '01', title: 'Tell Us About You', desc: 'Quick intake form so Sophia knows your business, industry, and goals before the call.', delay: 0 },
            { step: '02', title: 'Sophia Calls You', desc: 'A real-time voice conversation starts in your browser — no downloads, no app installs.', delay: 0.1 },
            { step: '03', title: 'Get a Personalised Demo', desc: 'Sophia tailors the conversation to your industry, showing exactly how she\'d handle your calls.', delay: 0.2 },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
                marginBottom: i < 2 ? 48 : 0,
                position: 'relative',
              }}
            >
              {/* Connector line */}
              {i < 2 && (
                <div style={{
                  position: 'absolute',
                  left: 27,
                  top: 56,
                  bottom: -48,
                  width: 1,
                  background: 'linear-gradient(to bottom, rgba(236,72,153,0.3), rgba(236,72,153,0.05))',
                }} />
              )}

              <div style={{
                flexShrink: 0,
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(217,70,239,0.08))',
                border: '1px solid rgba(236,72,153,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Lemon Milk', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: '#ec4899',
                boxShadow: '0 0 20px rgba(236,72,153,0.1)',
              }}>
                {item.step}
              </div>
              <div style={{ paddingTop: 4 }}>
                <h3 style={{
                  fontFamily: "'Lemon Milk', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.92)',
                  margin: '0 0 8px',
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* ═══ Final CTA ═══ */}
        <section style={{
          padding: '60px 24px 120px',
          textAlign: 'center',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 style={{
              fontFamily: "'Lemon Milk', sans-serif",
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 16px',
            }}>
              Ready to hear her in action?
            </h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: 36,
              lineHeight: 1.7,
            }}>
              60 seconds of setup. Then a live, personalised conversation with Sophia.
            </p>

            <motion.button
              onClick={handleCTA}
              whileHover={{
                scale: 1.06,
                boxShadow: '0 0 60px rgba(236,72,153,0.4), 0 0 120px rgba(217,70,239,0.15)',
              }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '18px 44px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, rgba(236,72,153,0.22) 0%, rgba(217,70,239,0.16) 50%, rgba(138,43,226,0.22) 100%)',
                border: '1px solid rgba(236,72,153,0.4)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 0 40px rgba(236,72,153,0.2), 0 12px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.95)',
                fontFamily: "'Lemon Milk', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: '0.04em',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                  pointerEvents: 'none',
                }}
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span style={{ position: 'relative', zIndex: 1 }}>Talk to Sophia</span>
            </motion.button>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: 'rgba(255,255,255,0.2)',
              marginTop: 60,
            }}
          >
            Powered by{' '}
            <Link
              to="/"
              style={{
                color: 'rgba(236,72,153,0.5)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(236,72,153,0.8)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(236,72,153,0.5)'; }}
            >
              Nexordis
            </Link>
          </motion.p>
        </section>
      </div>

      {/* ═══ Independent Form + Call modals ═══ */}
      <PreCallForm
        isOpen={showForm}
        callStatus={callStatus}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {createPortal(
        <VoiceModal
          isOpen={showCall}
          onClose={handleCallClose}
          callStatus={callStatus}
          speakingState={speakingState}
          isMuted={isMuted}
          transcript={transcript}
          onStartCall={handleModalStartCall}
          onEndCall={endCall}
          onToggleMute={toggleMute}
        />,
        document.body
      )}
    </div>
  );
};

export default CallPage;
