import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Workflow, 
  Headset,
  ShieldCheck,
  Settings,
  TrendingUp,
  Box,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SparklesCore } from '../UI/Sparkles';

const Capabilities = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const capabilities = [
    {
      icon: <Workflow size={24} />,
      title: 'Workflow Orchestration',
      description: 'Connect your CRM, calendars, email, WhatsApp/SMS, and internal tools with clean, auditable logic.'
    },
    {
      icon: <Headset size={24} />,
      title: 'AI Receptionist',
      description: '24/7 call handling, FAQs, lead qualification, appointment booking, and smart escalation.'
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Compliance & Controls',
      description: 'Role-based access, safe prompt patterns, logging, and data minimization — built in.'
    },
    {
      icon: <Settings size={24} />,
      title: 'Custom Integrations',
      description: 'Webhook-first integrations and lightweight APIs to connect anything reliably.'
    },
    {
      icon: <TrendingUp size={24} />,
      title: 'Sales Systems',
      description: 'Lead routing, follow-up sequences, pipeline hygiene, and conversion analytics.'
    },
    {
      icon: <Box size={24} />,
      title: 'SaaS Foundations',
      description: 'Reusable templates, multi-tenant architecture patterns, and scalable configuration systems.'
    }
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  
  const [titleRef, titleInView] = useInView({ 
    once: true, 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });
  const [cardsRef, cardsInView] = useInView({ 
    once: true, 
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      y: -6,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % capabilities.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + capabilities.length) % capabilities.length);
  };

  const goToCard = (index) => {
    setCurrentCardIndex(index);
  };
  
  return (
    <section id="work" className="section" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '80px' }}>
      {/* Subtle Glow Behind Section */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '100%' : '85%',
          height: isMobile ? '75%' : '65%',
          background: 'radial-gradient(ellipse 900px 700px at center, rgba(236, 72, 153, 0.08) 0%, rgba(244, 114, 182, 0.06) 35%, transparent 75%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.7
        }}
      />

      <div className="container" style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: isMobile ? '0 16px' : '0 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="section-title" ref={titleRef}>
          <div className="glow-dot"></div>
          <motion.div 
            style={{ position: 'relative', width: 'fit-content' }}
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2>Capabilities that <span className="accent">ship</span></h2>
            <SparklesCore
              id="tsparticles-capabilities"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={500}
              className="absolute inset-0 top-0 h-24 w-full"
              particleColor="#ec4899"
            />
          </motion.div>
        </div>

        {/* Mobile Carousel */}
        {isMobile ? (
          <div style={{ marginTop: '40px', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCardIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {(() => {
                  const capability = capabilities[currentCardIndex];
                  return (
                    <motion.div
                      whileHover="hover"
                      style={{
                        position: 'relative',
                        borderRadius: '20px',
                        padding: '28px 20px',
                        background: 'rgba(10, 10, 12, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)'
                      }}
                    >
                      {/* Running Light Border Effect - Top Border */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, transparent, transparent)',
                          borderRadius: '20px 20px 0 0',
                          overflow: 'hidden',
                          pointerEvents: 'none',
                          zIndex: 3
                        }}
                      >
                        <motion.div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: '-50%',
                            width: '50%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, #ec4899, #f472b6, transparent)',
                            filter: 'blur(1px)',
                            boxShadow: '0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.6)'
                          }}
                          animate={{
                            left: ['-50%', '150%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: currentCardIndex * 0.5
                          }}
                        />
                      </div>

                      {/* Running Light Border Effect - Right Border */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          bottom: 0,
                          width: '2px',
                          background: 'linear-gradient(180deg, transparent, transparent, transparent)',
                          borderRadius: '0 20px 20px 0',
                          overflow: 'hidden',
                          pointerEvents: 'none',
                          zIndex: 3
                        }}
                      >
                        <motion.div
                          style={{
                            position: 'absolute',
                            top: '-50%',
                            right: 0,
                            width: '100%',
                            height: '50%',
                            background: 'linear-gradient(180deg, transparent, #f472b6, #ec4899, transparent)',
                            filter: 'blur(1px)',
                            boxShadow: '0 0 10px rgba(244, 114, 182, 0.8), 0 0 20px rgba(244, 114, 182, 0.6)'
                          }}
                          animate={{
                            top: ['-50%', '150%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: currentCardIndex * 0.5 + 0.75
                          }}
                        />
                      </div>

                      {/* Running Light Border Effect - Bottom Border */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, transparent, transparent, transparent)',
                          borderRadius: '0 0 20px 20px',
                          overflow: 'hidden',
                          pointerEvents: 'none',
                          zIndex: 3
                        }}
                      >
                        <motion.div
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: '-50%',
                            width: '50%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, #f472b6, #ec4899, transparent)',
                            filter: 'blur(1px)',
                            boxShadow: '0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.6)'
                          }}
                          animate={{
                            right: ['-50%', '150%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: currentCardIndex * 0.5 + 1.5
                          }}
                        />
                      </div>

                      {/* Running Light Border Effect - Left Border */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: '2px',
                          background: 'linear-gradient(180deg, transparent, transparent, transparent)',
                          borderRadius: '20px 0 0 20px',
                          overflow: 'hidden',
                          pointerEvents: 'none',
                          zIndex: 3
                        }}
                      >
                        <motion.div
                          style={{
                            position: 'absolute',
                            bottom: '-50%',
                            left: 0,
                            width: '100%',
                            height: '50%',
                            background: 'linear-gradient(180deg, transparent, #ec4899, #f472b6, transparent)',
                            filter: 'blur(1px)',
                            boxShadow: '0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.6)'
                          }}
                          animate={{
                            bottom: ['-50%', '150%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: currentCardIndex * 0.5 + 2.25
                          }}
                        />
                      </div>

                      {/* Card Background with Glassmorphism */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                          backdropFilter: 'blur(20px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                          borderRadius: '20px',
                          pointerEvents: 'none'
                        }}
                      />

                      {/* Content */}
                      <div style={{ position: 'relative', zIndex: 2 }}>
                        {/* Icon */}
                        <motion.div
                          variants={iconVariants}
                          whileHover="hover"
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.15) 100%)',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ec4899',
                            marginBottom: '24px',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <span style={{ position: 'relative', zIndex: 1 }}>
                            {React.cloneElement(capability.icon, { 
                              size: 24,
                              strokeWidth: 1.5
                            })}
                          </span>
                        </motion.div>

                        {/* Title */}
                        <h5 style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          marginBottom: '12px',
                          color: 'rgba(255, 255, 255, 0.95)',
                          lineHeight: '1.3',
                          letterSpacing: '-0.01em'
                        }}>
                          {capability.title}
                        </h5>

                        {/* Description */}
                        <p style={{
                          fontSize: '0.875rem',
                          lineHeight: '1.7',
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0
                        }}>
                          {capability.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginTop: '24px',
              gap: '16px'
            }}>
              <button
                onClick={prevCard}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ec4899',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)'
                }}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Dot Indicators */}
              <div style={{ display: 'flex', gap: '8px', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {capabilities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToCard(index)}
                    style={{
                      width: currentCardIndex === index ? '8px' : '6px',
                      height: currentCardIndex === index ? '8px' : '6px',
                      borderRadius: '50%',
                      background: currentCardIndex === index ? '#ec4899' : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: 0,
                      minWidth: currentCardIndex === index ? '8px' : '6px',
                      minHeight: currentCardIndex === index ? '8px' : '6px',
                      boxShadow: currentCardIndex === index ? '0 0 6px rgba(236, 72, 153, 0.5)' : 'none'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={nextCard}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ec4899',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Grid */
          <motion.div 
            ref={cardsRef}
            variants={containerVariants}
            initial="hidden"
            animate={cardsInView ? 'visible' : 'hidden'}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', 
              gap: isTablet ? '24px' : '28px',
              marginTop: '60px'
            }}
          >
            {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              variants={cardVariants}
              whileHover="hover"
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  padding: isTablet ? '32px 24px' : '40px 32px',
                background: 'rgba(10, 10, 12, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                overflow: 'hidden',
                willChange: 'transform',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)'
              }}
            >
              {/* Running Light Border Effect - Top Border */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, transparent, transparent)',
                  borderRadius: '20px 20px 0 0',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  zIndex: 3
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-50%',
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, #ec4899, #f472b6, transparent)',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.6)'
                  }}
                  animate={{
                    left: ['-50%', '150%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5
                  }}
                />
              </div>

              {/* Running Light Border Effect - Right Border */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'linear-gradient(180deg, transparent, transparent, transparent)',
                  borderRadius: '0 20px 20px 0',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  zIndex: 3
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    right: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(180deg, transparent, #f472b6, #ec4899, transparent)',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 10px rgba(244, 114, 182, 0.8), 0 0 20px rgba(244, 114, 182, 0.6)'
                  }}
                  animate={{
                    top: ['-50%', '150%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5 + 0.75
                  }}
                />
              </div>

              {/* Running Light Border Effect - Bottom Border */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, transparent, transparent)',
                  borderRadius: '0 0 20px 20px',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  zIndex: 3
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: '-50%',
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, #f472b6, #ec4899, transparent)',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.6)'
                  }}
                  animate={{
                    right: ['-50%', '150%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5 + 1.5
                  }}
                />
              </div>

              {/* Running Light Border Effect - Left Border */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '2px',
                  background: 'linear-gradient(180deg, transparent, transparent, transparent)',
                  borderRadius: '20px 0 0 20px',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  zIndex: 3
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: '-50%',
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(180deg, transparent, #ec4899, #f472b6, transparent)',
                    filter: 'blur(1px)',
                    boxShadow: '0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.6)'
                  }}
                  animate={{
                    bottom: ['-50%', '150%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5 + 2.25
                  }}
                />
              </div>

              {/* Card Background with Glassmorphism */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  borderRadius: '20px',
                  pointerEvents: 'none'
                }}
              />

              {/* Animated Corner Glow */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none',
                  opacity: 0
                }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '-50px',
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none',
                  opacity: 0
                }}
                whileHover={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
              />

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Icon */}
                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  style={{
                    width: isTablet ? '64px' : '70px',
                    height: isTablet ? '64px' : '70px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.15) 100%)',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ec4899',
                    marginBottom: '24px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Icon glow effect */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                      opacity: 0
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {React.cloneElement(capability.icon, { 
                      size: isTablet ? 28 : 30,
                      strokeWidth: 1.5
                    })}
                  </span>
                </motion.div>

                {/* Title */}
                <h5 style={{
                  fontSize: isTablet ? '1.2rem' : '1.3rem',
                  fontWeight: 600,
                  marginBottom: '14px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: '1.3',
                  letterSpacing: '-0.01em'
                }}>
                  {capability.title}
                </h5>

                {/* Description */}
                <p style={{
                  fontSize: isTablet ? '0.9rem' : '0.95rem',
                  lineHeight: '1.7',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0
                }}>
                  {capability.description}
                </p>
              </div>

              {/* Shimmer Effect on Hover */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
                initial={{ left: '-100%' }}
                whileHover={{
                  left: '100%',
                  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }}
              />
            </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Capabilities;
