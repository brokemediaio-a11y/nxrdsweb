import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import StarField from './StarField';
import type { CallStatus } from './useRetell';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PreCallFormData {
  caller_name: string;
  business_name: string;
  industry: string;
  industry_other: string;
  weekly_call_volume: string;
  pain_point: string[];
  pain_point_other: string;
  current_setup: string;
  current_setup_other: string;
  call_goal: string;
  call_goal_other: string;
}

interface PreCallFormProps {
  isOpen: boolean;
  callStatus: CallStatus;
  onClose: () => void;
  onSubmit: (data: PreCallFormData) => Promise<void>;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const TOTAL_STEPS = 7;

const INDUSTRIES = [
  'Barber shop', 'Dental clinic', 'Medical clinic / GP', 'Law firm',
  'Real estate agency', 'HVAC / Plumbing', 'Beauty salon / Spa',
  'Fitness gym / Studio', 'Auto repair shop', 'Restaurant / Cafe',
  'Property management', 'Cleaning service', 'Accounting / Financial services',
  'Coaching / Consulting', 'Other',
];

const CALL_VOLUMES = ['Fewer than 10', '10–30', '30–70', '70–150', '150–300', '300+'];

const PAIN_POINTS = [
  'Missing calls after hours',
  'Staff overwhelmed by call volume',
  'Too many repetitive questions',
  'Losing leads to competitors who answer faster',
  'Appointment booking issues',
  'High receptionist cost',
  'Other — type your own',
];

const CURRENT_SETUPS = [
  'Full-time receptionist',
  'Part-time receptionist',
  'Shared or virtual assistant',
  'I handle calls myself',
  'No one — calls often go unanswered',
  'Other — type your own',
];

const CALL_GOALS = [
  'See a live demo',
  'Understand the pricing',
  'Know if it works for my industry',
  'See how appointment booking works',
  'Understand setup and integration',
  'Other — type your own',
];

const EMPTY_FORM: PreCallFormData = {
  caller_name: '',
  business_name: '',
  industry: '',
  industry_other: '',
  weekly_call_volume: '',
  pain_point: [],
  pain_point_other: '',
  current_setup: '',
  current_setup_other: '',
  call_goal: '',
  call_goal_other: '',
};

// ─── Google Sheets poster ──────────────────────────────────────────────────
// Uses a Google Apps Script Web App as a serverless proxy.
// API keys are read-only — write access requires the Apps Script approach.
//
// SETUP (one-time):
//  1. Open your Google Sheet → Extensions → Apps Script
//  2. Paste the script from SHEETS_SETUP.md and deploy as a Web App
//     (Execute as: Me  |  Who has access: Anyone)
//  3. Copy the /exec URL and paste it below as APPS_SCRIPT_URL

const APPS_SCRIPT_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL ?? '';

export async function postToSheets(data: PreCallFormData): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    console.warn('[postToSheets] VITE_SHEETS_WEBHOOK_URL is not set — skipping Sheets write.');
    return;
  }

  const industry = data.industry === 'Other' && data.industry_other.trim()
    ? data.industry_other.trim()
    : data.industry;

  const painPoints = data.pain_point
    .map(p => p === 'Other — type your own' && data.pain_point_other.trim()
      ? data.pain_point_other.trim()
      : p)
    .filter(Boolean)
    .join(', ');

  const currentSetup = data.current_setup === 'Other — type your own' && data.current_setup_other.trim()
    ? data.current_setup_other.trim()
    : data.current_setup;

  const callGoal = data.call_goal === 'Other — type your own' && data.call_goal_other.trim()
    ? data.call_goal_other.trim()
    : data.call_goal;

  const timestamp = new Intl.DateTimeFormat('en-PK', {
    timeZone: 'Asia/Karachi',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(new Date());

  const payload = {
    timestamp,
    caller_name:        data.caller_name,
    business_name:      data.business_name,
    industry,
    weekly_call_volume: data.weekly_call_volume,
    pain_points:        painPoints,
    current_setup:      currentSetup,
    call_goal:          callGoal,
    status:             'Pending',
  };

  // Google Apps Script redirects POST requests to a different subdomain.
  // 'no-cors' lets the request follow the redirect — Apps Script receives and
  // processes the data. The response is opaque (unreadable) but that's fine;
  // if fetch() doesn't throw, the payload reached the server.
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  });
}

// ─── Style helpers ─────────────────────────────────────────────────────────

const inputStyle = (error?: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '13px 16px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: '12px',
  color: 'rgba(255, 255, 255, 0.92)',
  fontFamily: "'Lemon Milk', sans-serif",
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  caretColor: '#ec4899',
  transition: 'border-color 0.2s, box-shadow 0.2s',
});

const selectStyle = (error?: boolean): React.CSSProperties => ({
  ...inputStyle(error),
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 14px center',
  paddingRight: '40px',
  cursor: 'pointer',
});

const pillBtnStyle = (selected: boolean, danger?: boolean): React.CSSProperties => ({
  padding: '11px 14px',
  borderRadius: '10px',
  border: selected
    ? '1.5px solid #ec4899'
    : danger
    ? '1px solid #ef4444'
    : '1px solid rgba(255,255,255,0.1)',
  background: selected
    ? 'rgba(236,72,153,0.1)'
    : danger
    ? 'rgba(220,38,38,0.1)'
    : 'rgba(255,255,255,0.03)',
  color: selected ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
  cursor: 'pointer',
  fontSize: '13px',
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1.45,
  textAlign: 'left' as const,
  transition: 'all 0.18s',
  boxShadow: selected ? '0 0 0 1px rgba(236,72,153,0.3), 0 0 12px rgba(236,72,153,0.12)' : 'none',
});

const labelStyle: React.CSSProperties = {
  fontFamily: "'Lemon Milk', sans-serif",
  fontSize: '17px',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.95)',
  letterSpacing: '0.02em',
  lineHeight: 1.35,
};

const subLabelStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '13px',
  color: 'rgba(255,255,255,0.45)',
  marginTop: '6px',
  lineHeight: 1.55,
};

const errorStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: '12px',
  color: 'rgba(239,68,68,0.85)',
  marginTop: '6px',
};

// ─── Animation variants ─────────────────────────────────────────────────────

const stepVariants = {
  enter: (dir: number) => ({ x: dir * 55, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: (dir: number) => ({ x: dir * -55, opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as [number, number, number, number] } }),
};

// ─── Focus-enhanced input wrapper ──────────────────────────────────────────

const FocusInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}> = ({ value, onChange, placeholder, error, autoFocus, style }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      autoFocus={autoFocus}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      style={{
        ...inputStyle(error),
        ...(focused ? { borderColor: '#ec4899', boxShadow: '0 0 0 1.5px rgba(236,72,153,0.25)' } : {}),
        ...style,
      }}
    />
  );
};

const FocusTextarea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}> = ({ value, onChange, placeholder, error }) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      rows={2}
      style={{
        ...inputStyle(error),
        resize: 'none',
        ...(focused ? { borderColor: '#ec4899', boxShadow: '0 0 0 1.5px rgba(236,72,153,0.25)' } : {}),
      }}
    />
  );
};

const FocusSelect: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: boolean;
}> = ({ value, onChange, options, placeholder, error }) => {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...selectStyle(error),
        ...(focused ? { borderColor: '#ec4899', boxShadow: '0 0 0 1.5px rgba(236,72,153,0.25)' } : {}),
      }}
    >
      {placeholder && (
        <option value="" disabled style={{ background: '#0f1116' }}>{placeholder}</option>
      )}
      {options.map(opt => (
        <option key={opt} value={opt} style={{ background: '#0f1116', color: '#fff' }}>{opt}</option>
      ))}
    </select>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const PreCallForm: React.FC<PreCallFormProps> = ({ isOpen, callStatus, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<PreCallFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PreCallFormData | 'general', string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // sheetsOk = true once data is confirmed saved to Google Sheets
  const [sheetsOk, setSheetsOk] = useState(false);
  // starting = true while the Retell call is being initiated
  const [starting, setStarting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDir(1);
      setForm(EMPTY_FORM);
      setErrors({});
      setSubmitting(false);
      setSubmitError(null);
      setSheetsOk(false);
      setStarting(false);
    }
  }, [isOpen]);

  // Scroll card to top on step change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !submitting) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, submitting, onClose]);

  const set = useCallback(<K extends keyof PreCallFormData>(key: K, val: PreCallFormData[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }, []);

  const togglePill = useCallback((key: 'pain_point', val: string) => {
    setForm(f => {
      const arr = f[key] as string[];
      return {
        ...f,
        [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
      };
    });
    setErrors(e => ({ ...e, [key]: undefined }));
  }, []);

  // ─── Validation per step ─────────────────────────────────────────────────

  const validateStep = useCallback((s: number): boolean => {
    const errs: typeof errors = {};
    if (s === 1) {
      if (!form.caller_name.trim()) errs.caller_name = 'Please enter your name.';
    }
    if (s === 2) {
      if (!form.business_name.trim()) errs.business_name = 'Please enter your business name.';
    }
    if (s === 3) {
      if (!form.industry) errs.industry = 'Please select your industry.';
      if (form.industry === 'Other' && !form.industry_other.trim())
        errs.industry_other = 'Please describe your industry.';
    }
    if (s === 4) {
      if (!form.weekly_call_volume) errs.weekly_call_volume = 'Please select an option.';
    }
    if (s === 5) {
      if (form.pain_point.length === 0) errs.pain_point = 'Please select at least one challenge.';
      if (form.pain_point.includes('Other — type your own') && !form.pain_point_other.trim())
        errs.pain_point_other = 'Please describe your challenge.';
    }
    if (s === 6) {
      if (!form.current_setup) errs.current_setup = 'Please select an option.';
      if (form.current_setup === 'Other — type your own' && !form.current_setup_other.trim())
        errs.current_setup_other = 'Please describe your current setup.';
    }
    if (s === 7) {
      if (!form.call_goal) errs.call_goal = 'Please select what matters most.';
      if (form.call_goal === 'Other — type your own' && !form.call_goal_other.trim())
        errs.call_goal_other = 'Please describe your goal.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return false;
    }
    return true;
  }, [form]);

  const goNext = useCallback(() => {
    if (!validateStep(step)) return;
    setDir(1);
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setDir(-1);
    setStep(s => Math.max(s - 1, 1));
    setErrors({});
  }, []);

  // Phase 1: submit form data to Google Sheets
  const handleSubmitToSheets = useCallback(async () => {
    if (!validateStep(TOTAL_STEPS)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await postToSheets(form);
      setSheetsOk(true);
    } catch (err) {
      console.error('[PreCallForm] Sheets write error:', err);
      setSubmitError('Could not save your details. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }, [form, validateStep]);

  // Phase 2: start the live call (only called after sheetsOk = true)
  const handleStartCall = useCallback(async () => {
    setStarting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      console.error('[PreCallForm] call start error:', err);
      setStarting(false);
    }
  }, [form, onSubmit]);

  // ─── Step content renderers ──────────────────────────────────────────────

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={labelStyle}>What's your full name?</label>
            <FocusInput
              autoFocus
              value={form.caller_name}
              onChange={v => set('caller_name', v)}
              placeholder="e.g. John Smith"
              error={!!errors.caller_name}
            />
            {errors.caller_name && <span style={errorStyle}>{errors.caller_name}</span>}
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>What's your business name?</label>
              <p style={subLabelStyle}>Works best for owners and decision-makers — but all are welcome.</p>
            </div>
            <FocusInput
              autoFocus
              value={form.business_name}
              onChange={v => set('business_name', v)}
              placeholder="e.g. Smith Dental Clinic"
              error={!!errors.business_name}
            />
            {errors.business_name && <span style={errorStyle}>{errors.business_name}</span>}
          </div>
        );

      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>What industry are you in?</label>
              <p style={subLabelStyle}>Helps Sophia speak directly to your type of business.</p>
            </div>
            <FocusSelect
              value={form.industry}
              onChange={v => set('industry', v)}
              options={INDUSTRIES}
              placeholder="Select your industry…"
              error={!!errors.industry}
            />
            {errors.industry && <span style={errorStyle}>{errors.industry}</span>}

            <AnimatePresence>
              {form.industry === 'Other' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FocusInput
                    autoFocus
                    value={form.industry_other}
                    onChange={v => set('industry_other', v)}
                    placeholder="Describe your industry…"
                    error={!!errors.industry_other}
                    style={{ marginTop: '8px' }}
                  />
                  {errors.industry_other && <span style={errorStyle}>{errors.industry_other}</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>How many customer calls does your business receive per week?</label>
              <p style={subLabelStyle}>Even low volume matters — one missed high-value call can cost more than a month of our service.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CALL_VOLUMES.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set('weekly_call_volume', opt)}
                  style={pillBtnStyle(form.weekly_call_volume === opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.weekly_call_volume && <span style={errorStyle}>{errors.weekly_call_volume}</span>}
          </div>
        );

      case 5:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>What's your biggest challenge with customer calls right now?</label>
              <p style={subLabelStyle}>You can select more than one.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {PAIN_POINTS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => togglePill('pain_point', opt)}
                  style={{
                    ...pillBtnStyle(form.pain_point.includes(opt)),
                    gridColumn: opt === 'Other — type your own' ? '1 / -1' : undefined,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.pain_point && <span style={errorStyle}>{errors.pain_point}</span>}

            <AnimatePresence>
              {form.pain_point.includes('Other — type your own') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FocusTextarea
                    value={form.pain_point_other}
                    onChange={v => set('pain_point_other', v)}
                    placeholder="Describe your challenge…"
                    error={!!errors.pain_point_other}
                  />
                  {errors.pain_point_other && <span style={errorStyle}>{errors.pain_point_other}</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 6:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={labelStyle}>How are customer calls currently handled at your business?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CURRENT_SETUPS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set('current_setup', opt)}
                  style={{
                    ...pillBtnStyle(
                      form.current_setup === opt,
                      opt === 'No one — calls often go unanswered' && form.current_setup !== opt
                    ),
                    ...(opt === 'No one — calls often go unanswered' && form.current_setup === opt
                      ? { border: '1.5px solid #ef4444', background: 'rgba(239,68,68,0.15)', boxShadow: '0 0 0 1px rgba(239,68,68,0.3)' }
                      : {}),
                    gridColumn: (opt === 'No one — calls often go unanswered' || opt === 'Other — type your own') ? '1 / -1' : undefined,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.current_setup && <span style={errorStyle}>{errors.current_setup}</span>}

            <AnimatePresence>
              {form.current_setup === 'Other — type your own' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FocusTextarea
                    value={form.current_setup_other}
                    onChange={v => set('current_setup_other', v)}
                    placeholder="Describe your current setup…"
                    error={!!errors.current_setup_other}
                  />
                  {errors.current_setup_other && <span style={errorStyle}>{errors.current_setup_other}</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      case 7:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>What matters most to you on this call?</label>
              <p style={subLabelStyle}>Sophia will focus on exactly this.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CALL_GOALS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set('call_goal', opt)}
                  style={{
                    ...pillBtnStyle(form.call_goal === opt),
                    gridColumn: opt === 'Other — type your own' ? '1 / -1' : undefined,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {errors.call_goal && <span style={errorStyle}>{errors.call_goal}</span>}

            <AnimatePresence>
              {form.call_goal === 'Other — type your own' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FocusInput
                    autoFocus
                    value={form.call_goal_other}
                    onChange={v => set('call_goal_other', v)}
                    placeholder="What would you like to know?"
                    error={!!errors.call_goal_other}
                    style={{ marginTop: '8px' }}
                  />
                  {errors.call_goal_other && <span style={errorStyle}>{errors.call_goal_other}</span>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Derived loading flags ────────────────────────────────────────────────

  const isSubmittingToSheets = submitting;
  const isConnecting = starting || callStatus === 'connecting';

  // ─── Render ───────────────────────────────────────────────────────────────

  return createPortal(
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
            zIndex: 1000003,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
            overflowY: 'auto',
          }}
        >
          {/* Star field */}
          <StarField />

          {/* Nebula glow */}
          <div style={{
            position: 'fixed',
            inset: 0,
            background: `
              radial-gradient(ellipse 700px 450px at 20% 30%, rgba(138,43,226,0.07), transparent 70%),
              radial-gradient(ellipse 600px 500px at 80% 65%, rgba(236,72,153,0.05), transparent 70%)
            `,
            pointerEvents: 'none',
            zIndex: 1,
          }} />

          {/* Close button */}
          {!isConnecting && !isSubmittingToSheets && (
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
              whileHover={{ scale: 1.12, background: 'rgba(236,72,153,0.1)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 1000010,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.75)',
              }}
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.button>
          )}

          {/* Card */}
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 28, opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            ref={scrollRef}
            style={{
              position: 'relative',
              zIndex: 5,
              width: '100%',
              maxWidth: 560,
              background: 'rgba(10, 11, 14, 0.88)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(236,72,153,0.06)',
              overflow: 'hidden',
            }}
          >
            {/* Pink gradient top edge */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent 0%, rgba(236,72,153,0.5) 40%, rgba(217,70,239,0.5) 60%, transparent 100%)',
            }} />

            {/* Progress bar */}
            <div style={{ position: 'relative', height: 3, background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #ec4899, #d946ef)',
                  boxShadow: '0 0 10px rgba(236,72,153,0.6)',
                  borderRadius: '0 2px 2px 0',
                }}
              />
            </div>

            <div style={{ padding: '32px 32px 28px' }}>
              {/* Header */}
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                  fontFamily: "'Lemon Milk', sans-serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  margin: 0,
                  background: 'linear-gradient(135deg, #fff 0%, #f472b6 45%, #ec4899 70%, #d946ef 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  letterSpacing: '0.02em',
                  lineHeight: 1.25,
                }}>
                  Before we connect you to Sophia
                </h2>
                <p style={{ ...subLabelStyle, marginTop: '8px', fontSize: '14px' }}>
                  Takes 60 seconds — so she already knows who you are.
                </p>

                {/* Step indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '18px',
                }}>
                  {/* Dot indicators */}
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          width: i + 1 === step ? 20 : 6,
                          background: i + 1 < step
                            ? 'rgba(236,72,153,0.5)'
                            : i + 1 === step
                            ? '#ec4899'
                            : 'rgba(255,255,255,0.15)',
                        }}
                        transition={{ duration: 0.25 }}
                        style={{
                          height: 6,
                          borderRadius: 3,
                          boxShadow: i + 1 === step ? '0 0 8px rgba(236,72,153,0.5)' : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.04em',
                  }}>
                    {step} of {TOTAL_STEPS}
                  </span>
                </div>
              </div>

              {/* ── Phase A: Saving to Sheets spinner ── */}
              <AnimatePresence>
                {isSubmittingToSheets && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 0 20px',
                      gap: '20px',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: '3px solid rgba(236,72,153,0.15)',
                        borderTopColor: '#ec4899',
                        boxShadow: '0 0 20px rgba(236,72,153,0.25)',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontFamily: "'Lemon Milk', sans-serif",
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.85)',
                        margin: 0,
                        letterSpacing: '0.03em',
                      }}>
                        Saving your details…
                      </p>
                      <p style={{ ...subLabelStyle, marginTop: '8px' }}>
                        Just a moment
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Phase B: Success screen — data saved, ready to call ── */}
              <AnimatePresence>
                {sheetsOk && !isConnecting && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '12px 0 20px',
                      gap: '20px',
                    }}
                  >
                    {/* Animated checkmark */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(236,72,153,0.18), rgba(217,70,239,0.12))',
                        border: '1.5px solid rgba(236,72,153,0.45)',
                        boxShadow: '0 0 28px rgba(236,72,153,0.25), 0 0 60px rgba(236,72,153,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>

                    <div>
                      <p style={{
                        fontFamily: "'Lemon Milk', sans-serif",
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.95)',
                        margin: 0,
                        letterSpacing: '0.02em',
                        lineHeight: 1.3,
                      }}>
                        Details saved!
                      </p>
                      <p style={{ ...subLabelStyle, marginTop: '10px', fontSize: '14px', maxWidth: '260px' }}>
                        Sophia knows who you are. Start the live demo whenever you're ready.
                      </p>
                    </div>

                    {/* Start Live Demo button */}
                    <motion.button
                      onClick={handleStartCall}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 0 48px rgba(236,72,153,0.55), 0 0 90px rgba(217,70,239,0.25)',
                      }}
                      whileTap={{ scale: 0.96 }}
                      style={{
                        marginTop: '4px',
                        padding: '16px 40px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, rgba(236,72,153,0.28) 0%, rgba(217,70,239,0.22) 50%, rgba(138,43,226,0.28) 100%)',
                        border: '1px solid rgba(236,72,153,0.55)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        boxShadow: '0 0 28px rgba(236,72,153,0.25), inset 0 0 0 1px rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.97)',
                        fontFamily: "'Lemon Milk', sans-serif",
                        fontSize: '14px',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Start Live Demo
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Phase C: Connecting spinner ── */}
              <AnimatePresence>
                {isConnecting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 0 20px',
                      gap: '20px',
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: '3px solid rgba(236,72,153,0.15)',
                        borderTopColor: '#ec4899',
                        boxShadow: '0 0 20px rgba(236,72,153,0.25)',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontFamily: "'Lemon Milk', sans-serif",
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.85)',
                        margin: 0,
                        letterSpacing: '0.03em',
                      }}>
                        Connecting you to Sophia…
                      </p>
                      <p style={{ ...subLabelStyle, marginTop: '8px' }}>
                        Setting up your personalised call
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Phase D: Form steps (normal state) ── */}
              {!isSubmittingToSheets && !sheetsOk && !isConnecting && (
                <>
                  <div style={{ minHeight: 160, position: 'relative', overflow: 'hidden' }}>
                    <AnimatePresence mode="wait" custom={dir}>
                      <motion.div
                        key={step}
                        custom={dir}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                      >
                        {renderStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Submit error */}
                  {submitError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ ...errorStyle, marginTop: '12px', textAlign: 'center' }}
                    >
                      {submitError}
                    </motion.p>
                  )}

                  {/* Navigation */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: step === 1 ? 'flex-end' : 'space-between',
                    marginTop: '28px',
                    gap: '12px',
                  }}>
                    {/* Back */}
                    {step > 1 && (
                      <motion.button
                        onClick={goBack}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: '12px 22px',
                          borderRadius: '999px',
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'rgba(255,255,255,0.5)',
                          fontFamily: "'Lemon Milk', sans-serif",
                          fontSize: '12px',
                          fontWeight: 600,
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          transition: 'all 0.18s',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Back
                      </motion.button>
                    )}

                    {/* Next / Submit */}
                    {step < TOTAL_STEPS ? (
                      <motion.button
                        onClick={goNext}
                        whileHover={{
                          scale: 1.04,
                          boxShadow: '0 0 32px rgba(236,72,153,0.35)',
                        }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: '13px 30px',
                          borderRadius: '999px',
                          background: 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(217,70,239,0.15) 50%, rgba(138,43,226,0.2) 100%)',
                          border: '1px solid rgba(236,72,153,0.4)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          boxShadow: '0 0 20px rgba(236,72,153,0.15)',
                          color: 'rgba(255,255,255,0.92)',
                          fontFamily: "'Lemon Milk', sans-serif",
                          fontSize: '13px',
                          fontWeight: 600,
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        Continue
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleSubmitToSheets}
                        whileHover={{
                          scale: 1.04,
                          boxShadow: '0 0 40px rgba(236,72,153,0.45), 0 0 80px rgba(217,70,239,0.2)',
                        }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          padding: '15px 34px',
                          borderRadius: '999px',
                          background: 'linear-gradient(135deg, rgba(236,72,153,0.25) 0%, rgba(217,70,239,0.2) 50%, rgba(138,43,226,0.25) 100%)',
                          border: '1px solid rgba(236,72,153,0.5)',
                          backdropFilter: 'blur(14px)',
                          WebkitBackdropFilter: 'blur(14px)',
                          boxShadow: '0 0 24px rgba(236,72,153,0.2), inset 0 0 0 1px rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.95)',
                          fontFamily: "'Lemon Milk', sans-serif",
                          fontSize: '14px',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Submit
                      </motion.button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default memo(PreCallForm);
