import { useState, useEffect, useRef, useCallback } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';
export type SpeakingState = 'idle' | 'agent_speaking' | 'user_speaking';

interface TranscriptEntry {
  role: 'agent' | 'user';
  content: string;
}

interface UseRetellReturn {
  callStatus: CallStatus;
  speakingState: SpeakingState;
  isMuted: boolean;
  transcript: TranscriptEntry[];
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
}

const RETELL_API_KEY = 'key_bbe8fdd9b7295c1562644d46bdae';
const AGENT_ID = 'agent_64210c6dcd7b46788e935a2f4c';

export function useRetell(): UseRetellReturn {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const clientRef = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    const client = new RetellWebClient();
    clientRef.current = client;

    client.on('call_started', () => {
      setCallStatus('active');
      setSpeakingState('idle');
    });

    client.on('call_ended', () => {
      setCallStatus('ended');
      setSpeakingState('idle');
    });

    client.on('agent_start_talking', () => {
      setSpeakingState('agent_speaking');
    });

    client.on('agent_stop_talking', () => {
      setSpeakingState('idle');
    });

    client.on('update', (update: any) => {
      if (update?.transcript) {
        const entries: TranscriptEntry[] = update.transcript.map((t: any) => ({
          role: t.role === 'agent' ? 'agent' : 'user',
          content: t.content,
        }));
        setTranscript(entries);
      }
    });

    client.on('error', (error: any) => {
      console.error('Retell error:', error);
      setCallStatus('error');
      setSpeakingState('idle');
      client.stopCall();
    });

    return () => {
      client.stopCall();
    };
  }, []);

  const startCall = useCallback(async () => {
    if (!clientRef.current) return;

    setCallStatus('connecting');
    setTranscript([]);
    setIsMuted(false);

    try {
      const response = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RETELL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: AGENT_ID,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create web call: ${response.status}`);
      }

      const data = await response.json();

      await clientRef.current.startCall({
        accessToken: data.access_token,
        sampleRate: 24000,
      });
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus('error');
    }
  }, []);

  const endCall = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.stopCall();
      setCallStatus('ended');
      setSpeakingState('idle');
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (clientRef.current && callStatus === 'active') {
      if (isMuted) {
        clientRef.current.unmute();
      } else {
        clientRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  }, [callStatus, isMuted]);

  return {
    callStatus,
    speakingState,
    isMuted,
    transcript,
    startCall,
    endCall,
    toggleMute,
  };
}
