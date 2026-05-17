import React, { memo, useEffect, useRef } from 'react';
import type { SpeakingState, CallStatus } from './useRetell';

interface WaveAnimationProps {
  speakingState: SpeakingState;
  callStatus: CallStatus;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({ speakingState, callStatus }) => {
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
      const { speakingState, callStatus } = stateRef.current;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Determine amplitude and speed per state
      let amp = 8;
      let speed = 0.0015;
      if (speakingState === 'agent_speaking') { amp = 38; speed = 0.0045; }
      else if (speakingState === 'user_speaking') { amp = 28; speed = 0.0035; }
      else if (callStatus === 'connecting') { amp = 16; speed = 0.003; }
      else if (callStatus === 'active') { amp = 10; speed = 0.002; }

      // 4 layered waves — each filled with gradient to bottom, then stroke on top
      const waves = [
        {
          freq: 0.012, phase: elapsed * speed,           harmFreq: 0.028, harmPhase: elapsed * speed * 1.6,
          ampMult: 1.0, harmMult: 0.28,
          fillTop: 'rgba(236, 72, 153, 0.12)', fillBot: 'rgba(236, 72, 153, 0)',
          strokeColor: 'rgba(236, 72, 153, 0.72)', lineWidth: 2.5,
        },
        {
          freq: 0.018, phase: elapsed * speed * 1.25 + 1.2, harmFreq: 0.038, harmPhase: elapsed * speed * 0.9 + 0.5,
          ampMult: 0.78, harmMult: 0.22,
          fillTop: 'rgba(217, 70, 239, 0.09)', fillBot: 'rgba(217, 70, 239, 0)',
          strokeColor: 'rgba(217, 70, 239, 0.6)', lineWidth: 2,
        },
        {
          freq: 0.022, phase: elapsed * speed * 0.75 + 2.5, harmFreq: 0.05, harmPhase: elapsed * speed * 1.4 + 1.8,
          ampMult: 0.55, harmMult: 0.18,
          fillTop: 'rgba(138, 43, 226, 0.06)', fillBot: 'rgba(138, 43, 226, 0)',
          strokeColor: 'rgba(176, 92, 255, 0.5)', lineWidth: 1.5,
        },
        {
          freq: 0.009, phase: elapsed * speed * 1.5 + 3.8, harmFreq: 0.02, harmPhase: elapsed * speed * 0.6 + 2.2,
          ampMult: 0.38, harmMult: 0.15,
          fillTop: 'rgba(236, 72, 153, 0.04)', fillBot: 'rgba(236, 72, 153, 0)',
          strokeColor: 'rgba(236, 72, 153, 0.3)', lineWidth: 1.2,
        },
      ];

      waves.forEach(wave => {
        const wAmp = amp * wave.ampMult;

        // Build wave path points
        const points: [number, number][] = [];
        for (let x = 0; x <= w; x += 2) {
          const y = cy
            + Math.sin(x * wave.freq + wave.phase) * wAmp
            + Math.sin(x * wave.harmFreq + wave.harmPhase) * wAmp * wave.harmMult;
          points.push([x, y]);
        }

        // Filled gradient area (wave down to bottom)
        const fillGrad = ctx.createLinearGradient(0, cy - wAmp, 0, h);
        fillGrad.addColorStop(0, wave.fillTop);
        fillGrad.addColorStop(1, wave.fillBot);

        ctx.beginPath();
        ctx.moveTo(0, h);
        points.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Stroke on top of wave
        ctx.beginPath();
        points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.strokeStyle = wave.strokeColor;
        ctx.lineWidth = wave.lineWidth;
        ctx.lineJoin = 'round';
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
        height: '120px',
        opacity: callStatus === 'idle' ? 0.5 : callStatus === 'ended' ? 0.3 : 1,
        transition: 'opacity 0.6s ease',
        display: 'block',
        // Fade edges into the black background — no sharp cutoff
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    />
  );
};

export default memo(WaveAnimation);
