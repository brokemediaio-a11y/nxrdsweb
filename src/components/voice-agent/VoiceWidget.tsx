import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import VoiceModal from './VoiceModal';
import PreCallForm, { type PreCallFormData } from './PreCallForm';
import { useRetell, type CallFormData } from './useRetell';

const PhoneCallIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ position: 'relative', zIndex: 1 }}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const VoiceWidget: React.FC = () => {
  // showForm: pre-call intake form is open
  // showCall: voice call modal is open
  const [showForm, setShowForm] = useState(false);
  const [showCall, setShowCall] = useState(false);
  // Keep the last submitted form data so VoiceModal can re-trigger the call if needed
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

  // Once call becomes active, close the form and open the call UI
  useEffect(() => {
    if (callStatus === 'active' && showForm) {
      setShowForm(false);
      setShowCall(true);
    }
  }, [callStatus, showForm]);

  // If call errors while form is open, keep form visible so user sees the error state
  // (PreCallForm watches callStatus === 'error' via the connecting→error transition)

  const handleFloatingClick = useCallback(() => {
    setShowForm(true);
  }, []);

  // Called by PreCallForm once Sheets write is confirmed — start the call via n8n
  const handleFormSubmit = useCallback(async (data: PreCallFormData) => {
    lastFormData.current = data;
    await startCall(data);
  }, [startCall]);

  // Used by VoiceModal's "Start Call" button — reuses the last submitted form data
  const handleModalStartCall = useCallback(async () => {
    if (lastFormData.current) {
      await startCall(lastFormData.current);
    }
  }, [startCall]);

  const handleFormClose = useCallback(() => {
    // If already connecting when user closes, end the call attempt too
    if (callStatus === 'connecting') endCall();
    setShowForm(false);
  }, [callStatus, endCall]);

  const handleCallClose = useCallback(() => {
    if (callStatus === 'active' || callStatus === 'connecting') endCall();
    setShowCall(false);
  }, [callStatus, endCall]);

  const isAnyModalOpen = showForm || showCall;

  return (
    <>
      {/* Floating pill button — hidden while any modal is open */}
      <AnimatePresence>
        {!isAnyModalOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            style={{
              position: 'fixed',
              bottom: 28,
              right: 28,
              zIndex: 999997,
            }}
          >
            {/* Pulse ring 1 */}
            <motion.div
              animate={{ scale: [1, 1.5, 1.7], opacity: [0.35, 0.15, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                border: '1px solid rgba(236,72,153,0.45)',
                pointerEvents: 'none',
              }}
            />
            {/* Pulse ring 2 */}
            <motion.div
              animate={{ scale: [1, 1.35, 1.55], opacity: [0.25, 0.1, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', delay: 0.9 }}
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                border: '1px solid rgba(217,70,239,0.3)',
                pointerEvents: 'none',
              }}
            />

            <motion.button
              onClick={handleFloatingClick}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 50px rgba(236,72,153,0.4), 0 0 90px rgba(217,70,239,0.18)',
              }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                position: 'relative',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(236,72,153,0.22) 0%, rgba(217,70,239,0.16) 50%, rgba(138,43,226,0.22) 100%)',
                border: '1px solid rgba(236,72,153,0.35)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 0 32px rgba(236,72,153,0.22), 0 8px 32px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.92)',
                overflow: 'hidden',
              }}
              aria-label="Talk to our Voice AI Agent"
            >
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '50%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)',
                  pointerEvents: 'none',
                }}
              />
              <PhoneCallIcon />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-call intake form */}
      <PreCallForm
        isOpen={showForm}
        callStatus={callStatus}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />

      {/* Voice call modal (rendered via portal inside PreCallForm already; VoiceModal here separately) */}
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
    </>
  );
};

export default memo(VoiceWidget);
