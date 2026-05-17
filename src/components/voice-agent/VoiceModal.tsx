import React, { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaveAnimation from './WaveAnimation';
import CallControls from './CallControls';
import StarField from './StarField';
import type { CallStatus, SpeakingState } from './useRetell';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  callStatus: CallStatus;
  speakingState: SpeakingState;
  isMuted: boolean;
  transcript: { role: 'agent' | 'user'; content: string }[];
  onStartCall: () => void;
  onEndCall: () => void;
  onToggleMute: () => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  callStatus,
  speakingState,
  isMuted,
  onStartCall,
  onEndCall,
  onToggleMute,
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (callStatus === 'active' || callStatus === 'connecting') onEndCall();
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, callStatus, onEndCall, onClose]);

  const statusLabel = (() => {
    if (callStatus === 'connecting') return null;
    if (callStatus === 'error') return 'Connection failed. Try again.';
    if (callStatus === 'ended') return 'Call ended.';
    if (speakingState === 'agent_speaking') return 'AI is speaking...';
    if (speakingState === 'user_speaking') return 'Listening to you...';
    if (callStatus === 'active') return 'Listening...';
    return null;
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000001,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000000',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="AI Voice Assistant"
        >
          {/* Star field */}
          <StarField />

          {/* Nebula ambient */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 700px 450px at 25% 35%, rgba(138,43,226,0.07), transparent 70%),
              radial-gradient(ellipse 600px 500px at 75% 65%, rgba(236,72,153,0.05), transparent 70%)
            `,
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Close button */}
          <motion.button
            onClick={() => {
              if (callStatus === 'active' || callStatus === 'connecting') onEndCall();
              onClose();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.12, background: 'rgba(236,72,153,0.1)', borderColor: 'rgba(236,72,153,0.4)' }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1000002,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.75)',
            }}
            aria-label="Close voice assistant"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Main content */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            style={{
              position: 'relative',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '36px',
              width: '100%',
              maxWidth: '640px',
              padding: '0 32px',
            }}
          >
            {/* Title */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontFamily: "'Lemon Milk', sans-serif",
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                margin: 0,
                background: 'linear-gradient(135deg, #fff 0%, #f472b6 40%, #ec4899 70%, #d946ef 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textTransform: 'uppercase',
              }}>
                AI Voice Assistant
              </h2>
              <p style={{
                fontFamily: "'Lemon Milk', sans-serif",
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                margin: '10px 0 0',
                letterSpacing: '0.04em',
              }}>
                {callStatus === 'idle' || callStatus === 'ended' || callStatus === 'error'
                  ? 'Start a live conversation with our AI assistant'
                  : 'Powered by Nexordis AI'}
              </p>
            </div>

            {/* Wave — full width of the content column */}
            <div style={{ width: '100%' }}>
              <WaveAnimation speakingState={speakingState} callStatus={callStatus} />
            </div>

            {/* Live status label */}
            <AnimatePresence mode="wait">
              {statusLabel && (
                <motion.span
                  key={statusLabel}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    fontFamily: "'Lemon Milk', sans-serif",
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: callStatus === 'error'
                      ? 'rgba(239,68,68,0.8)'
                      : speakingState === 'agent_speaking'
                      ? 'rgba(236,72,153,0.8)'
                      : 'rgba(255,255,255,0.4)',
                    marginTop: '-18px',
                  }}
                >
                  {statusLabel}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Controls */}
            <CallControls
              callStatus={callStatus}
              isMuted={isMuted}
              onStartCall={onStartCall}
              onEndCall={onEndCall}
              onToggleMute={onToggleMute}
            />

            {/* Hint */}
            {(callStatus === 'idle' || callStatus === 'ended') && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.25)',
                  textAlign: 'center',
                  margin: '-16px 0 0',
                  lineHeight: 1.7,
                }}
              >
                Your browser will request microphone access.
                <br />
                The conversation is processed in real time.
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(VoiceModal);
