import { useState, useEffect, useRef, useCallback } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error';
export type SpeakingState = 'idle' | 'agent_speaking' | 'user_speaking';

// Subset of form fields sent to the n8n webhook so it can create the call
// and log context on the server side. Matches PreCallFormData field names.
export interface CallFormData {
  caller_name: string;
  business_name: string;
  industry: string;
  industry_other: string;
  weekly_call_volume: string;
  pain_point: string[];
  current_setup: string;
  call_goal: string;
}

interface TranscriptEntry {
  role: 'agent' | 'user';
  content: string;
}

interface UseRetellReturn {
  callStatus: CallStatus;
  speakingState: SpeakingState;
  isMuted: boolean;
  transcript: TranscriptEntry[];
  startCall: (formData: CallFormData) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
}

const N8N_WEBHOOK_URL = 'https://n8n.brokemediaio.com/webhook/start-precall-demo';

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

  const startCall = useCallback(async (formData: CallFormData) => {
    if (!clientRef.current) return;

    setCallStatus('connecting');
    setTranscript([]);
    setIsMuted(false);

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caller_name:        formData.caller_name,
          business_name:      formData.business_name,
          industry:           formData.industry,
          industry_other:     formData.industry_other,
          weekly_call_volume: formData.weekly_call_volume,
          pain_point:         formData.pain_point,
          current_setup:      formData.current_setup,
          call_goal:          formData.call_goal,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
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
