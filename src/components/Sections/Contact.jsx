import { useState } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import emailjs from '@emailjs/browser';
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';
import Earth from '../UI/Globe';
import { SparklesCore } from '../UI/Sparkles';
import { Label } from '../UI/Label';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [formRef, isInView] = useInView({ 
    once: true, 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Check EmailJS configuration on mount
  React.useEffect(() => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setError('EmailJS configuration is missing. Please check your environment variables. For Hostinger: Create a .env file in your project root with VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY before building.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Get EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const autoReplyTemplateId = 'template_ewzlevo'; // Auto-reply template ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Validate configuration
      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          'EmailJS configuration is missing. ' +
          'For production on Hostinger: Create a .env file in your project root with VITE_EMAILJS_SERVICE_ID, ' +
          'VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY, then rebuild and redeploy. ' +
          'Environment variables must be set before running npm run build.'
        );
      }

      // Prepare template parameters for notification email (to you)
      const notificationParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: 'Nexordis Team', // Recipient name
      };

      // Prepare template parameters for auto-reply (to user)
      const autoReplyParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_name: name, // User's name for greeting
      };

      // Send both emails in parallel
      await Promise.all([
        // Send notification email to you
        emailjs.send(
          serviceId,
          templateId,
          notificationParams,
          publicKey
        ),
        // Send auto-reply email to user
        emailjs.send(
          serviceId,
          autoReplyTemplateId,
          autoReplyParams,
          publicKey
        )
      ]);

      // Reset form on success
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitted(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      // Handle different error types
      let errorMessage = 'Failed to send message. Please try again later.';
      
      if (error.text) {
        errorMessage = error.text;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full overflow-hidden py-16 md:py-24" style={{ background: '#000000' }}>
      {/* Background gradient blurs */}
      <div
        className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: `radial-gradient(circle at center, #ec4899, transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full opacity-10 blur-[100px]"
        style={{
          background: `radial-gradient(circle at center, #ec4899, transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6" style={{ maxWidth: '1280px' }}>
        <div className={cn(
          'mx-auto max-w-5xl overflow-hidden rounded-[28px] border shadow-xl backdrop-blur-sm',
          'border-white/10 bg-white/5'
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Form - First on Mobile, First on Desktop */}
            <div className="relative p-4 sm:p-6 md:p-10 order-1 md:order-1" ref={formRef} style={{ width: '100%', maxWidth: '100%' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex w-full gap-2 relative"
              >
                <h2 className={cn(
                  'mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl',
                  'from-white to-white/80'
                )}>
                  Contact
                </h2>
                <span className="text-accent-pink relative z-10 w-full text-4xl font-bold tracking-tight italic md:text-5xl">
                  Us
                </span>
                <SparklesCore
                  id="tsparticles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={500}
                  className="absolute inset-0 top-0 h-24 w-full"
                  particleColor="#ec4899"
                />
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.3 }}
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
                style={{ width: '100%' }}
              >
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    required
                    className="h-40"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative"
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full rounded-lg px-4 py-3 text-sm font-semibold text-white',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'transition-all duration-200 flex items-center justify-center gap-2',
                      'outline-none cursor-pointer relative overflow-hidden'
                    )}
                    style={{
                      border: '1px solid rgba(255,255,255,.08)',
                      background: 'linear-gradient(180deg, rgba(15,17,22,.82), rgba(10,11,14,.60))',
                      boxShadow: '0 16px 52px rgba(0,0,0,.55)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.borderColor = 'rgba(236,72,153,.25)';
                        e.currentTarget.style.boxShadow = '0 22px 70px rgba(0,0,0,.70)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)';
                      e.currentTarget.style.boxShadow = '0 16px 52px rgba(0,0,0,.55)';
                    }}
                  >
                    {/* Purple/Pink radial gradient overlay (matching neo-card style) */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: '-1px',
                        background: 'radial-gradient(600px 220px at 20% 0%, rgba(236,72,153,.12), transparent 60%), radial-gradient(600px 220px at 75% 0%, rgba(138,43,226,.18), transparent 60%)',
                        opacity: 0.9,
                        pointerEvents: 'none',
                        zIndex: 0,
                        borderRadius: '8px',
                      }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <Check className="h-4 w-4" />
                          Message Sent!
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </span>
                  </button>
                </motion.div>
              </motion.form>
            </div>

            {/* Globe Container - Second on Mobile, Second on Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative my-8 flex items-center justify-center order-2 md:order-2"
              style={{
                overflow: 'visible',
              }}
            >
              <div className="flex flex-col items-center justify-center w-full">
                <article className={cn(
                  'relative mx-auto h-[450px] min-h-72 w-full max-w-[500px] rounded-3xl',
                  'p-6 md:p-8 text-2xl md:text-3xl tracking-tight text-white',
                  'md:h-[550px] md:min-h-96 md:p-10 md:text-4xl md:leading-[1.05] lg:text-5xl',
                  'md:border md:border-white/20',
                  'md:bg-gradient-to-b md:from-accent-pink md:to-accent-pink/5',
                  'bg-transparent border-0',
                  'overflow-hidden'
                )}>
                  <div 
                    className="relative z-20"
                    style={{ 
                      maxWidth: isMobile ? '55%' : '280px',
                      paddingRight: isMobile ? '0' : '0',
                      fontSize: '32px',
                      fontFamily: '"Lemon Milk", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    }}
                  >
                    Powering the Next Order of Digital Experiences
                  </div>
                  <div 
                    className="absolute z-10 flex items-center justify-center"
                    style={{
                      // Position on right side, slightly cropped on mobile (like the image)
                      right: isMobile ? '-15%' : '16px',
                      bottom: isMobile ? '-20%' : 'auto',
                      top: isMobile ? 'auto' : '50%',
                      transform: isMobile 
                        ? 'rotate(12deg)' 
                        : 'translateY(-50%) rotate(12deg)',
                      width: isMobile ? '380px' : '400px',
                      height: isMobile ? '380px' : '400px',
                    }}
                  >
                    <Earth
                      scale={1.2}
                      baseColor={[1, 0, 0.3]}
                      markerColor={[0, 0, 0]}
                      glowColor={[1, 0.3, 0.4]}
                    />
                  </div>
                </article>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
