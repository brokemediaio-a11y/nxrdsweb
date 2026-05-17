import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { CallStatus } from './useRetell';

interface CallControlsProps {
  callStatus: CallStatus;
  isMuted: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
}

const iconBtnBase: React.CSSProperties = {
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
};

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PhoneEndIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
    <line x1="23" y1="1" x2="1" y2="23" />
  </svg>
);

const MicIcon = ({ muted }: { muted: boolean }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    {muted ? (
      <>
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.36 2.17" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </>
    ) : (
      <>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </>
    )}
  </svg>
);

const CallControls: React.FC<CallControlsProps> = ({
  callStatus,
  isMuted,
  onStartCall,
  onEndCall,
  onToggleMute,
}) => {
  const isActive = callStatus === 'active';

  // Idle / ended / error — pill "Start Call" button
  if (callStatus === 'idle' || callStatus === 'ended' || callStatus === 'error') {
    return (
      <motion.button
        onClick={onStartCall}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{
          scale: 1.04,
          boxShadow: '0 0 40px rgba(236, 72, 153, 0.4), 0 0 80px rgba(217, 70, 239, 0.18)',
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '15px 36px',
          borderRadius: '999px',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.18) 0%, rgba(217, 70, 239, 0.14) 50%, rgba(138, 43, 226, 0.18) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.38)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 0 28px rgba(236, 72, 153, 0.2), 0 8px 32px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)',
          cursor: 'pointer',
          color: 'rgba(255, 255, 255, 0.92)',
          fontFamily: "'Lemon Milk', sans-serif",
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          whiteSpace: 'nowrap' as const,
          position: 'relative' as const,
          overflow: 'hidden',
        }}
        aria-label="Start call"
      >
        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
            pointerEvents: 'none',
          }}
        />
        <PhoneIcon />
        <span style={{ position: 'relative', zIndex: 1 }}>Start Call</span>
      </motion.button>
    );
  }

  // Connecting — pill button disabled-style
  if (callStatus === 'connecting') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '15px 36px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)',
          fontFamily: "'Lemon Milk', sans-serif",
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          style={{ width: 16, height: 16, border: '2px solid rgba(236,72,153,0.4)', borderTopColor: 'rgba(236,72,153,0.9)', borderRadius: '50%' }}
        />
        Connecting...
      </motion.div>
    );
  }

  // Active — mute icon + End Call pill button
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
    >
      {/* Mute toggle */}
      <motion.button
        onClick={onToggleMute}
        disabled={!isActive}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          ...iconBtnBase,
          width: 46,
          height: 46,
          background: isMuted ? 'rgba(239, 68, 68, 0.14)' : 'rgba(255,255,255,0.06)',
          border: isMuted ? '1px solid rgba(239,68,68,0.32)' : '1px solid rgba(255,255,255,0.12)',
          boxShadow: isMuted ? '0 0 16px rgba(239,68,68,0.15)' : 'none',
          color: isMuted ? 'rgba(239,68,68,0.9)' : 'rgba(255,255,255,0.75)',
          opacity: isActive ? 1 : 0.4,
        }}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <MicIcon muted={isMuted} />
      </motion.button>

      {/* End Call pill */}
      <motion.button
        onClick={onEndCall}
        whileHover={{ scale: 1.05, boxShadow: '0 0 32px rgba(239,68,68,0.35)' }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '9px',
          padding: '13px 28px',
          borderRadius: '999px',
          background: 'rgba(239,68,68,0.14)',
          border: '1px solid rgba(239,68,68,0.35)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 0 20px rgba(239,68,68,0.14)',
          cursor: 'pointer',
          color: 'rgba(239,68,68,0.92)',
          fontFamily: "'Lemon Milk', sans-serif",
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          whiteSpace: 'nowrap' as const,
        }}
        aria-label="End call"
      >
        <PhoneEndIcon />
        <span>End Call</span>
      </motion.button>
    </motion.div>
  );
};

export default memo(CallControls);
