import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Input } from '../UI/Input';
import { Textarea } from '../UI/Textarea';
import Earth from '../UI/Globe';
import { SparklesCore } from '../UI/Sparkles';
import { Label } from '../UI/Label';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formRef, isInView] = useInView({ 
    once: true, 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Perform form submission logic here
      console.log('Form submitted:', { name, email, message });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
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
            {/* Globe Container - Second on Mobile, Second on Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative my-8 flex items-center justify-center overflow-hidden pr-8 order-2 md:order-2"
            >
              <div className="flex flex-col items-center justify-center overflow-hidden">
                <article className={cn(
                  'relative mx-auto h-[450px] min-h-72 max-w-[500px] overflow-hidden rounded-3xl',
                  'p-8 text-3xl tracking-tight text-white',
                  'md:h-[550px] md:min-h-96 md:p-10 md:text-4xl md:leading-[1.05] lg:text-5xl',
                  'md:border md:border-white/20',
                  'md:bg-gradient-to-b md:from-accent-pink md:to-accent-pink/5',
                  'bg-transparent border-0'
                )}>
                  <div className="relative z-20 max-w-[280px] md:max-w-[350px]">
                    Powering the Next Order of Digital Experiences
                  </div>
                  <div className="absolute -right-20 -bottom-20 z-10 mx-auto flex h-full w-full max-w-[300px] items-center justify-center transition-all duration-700 hover:scale-105 md:-right-28 md:-bottom-28 md:max-w-[550px]">
                    <Earth
                      scale={1.1}
                      baseColor={[1, 0, 0.3]}
                      markerColor={[0, 0, 0]}
                      glowColor={[1, 0.3, 0.4]}
                    />
                  </div>
                </article>
              </div>
            </motion.div>

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
          </div>
        </div>
      </div>
    </section>
  );
}
