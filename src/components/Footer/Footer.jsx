import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Instagram, Send } from 'lucide-react';
import { useLenisContext } from '../../contexts/LenisContext';

const Footer = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const canvasRef = useRef(null);
  const lenis = useLenisContext();

  // Animated light beam on top edge using canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let animationFrameId;
    let position = -120;
    
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const speed = 1.5;
    const beamWidth = 120;
    const beamHeight = 3;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      // Moving light beam gradient
      const gradient = ctx.createLinearGradient(position - beamWidth, 0, position + beamWidth, 0);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.3, 'rgba(236, 72, 153, 0.3)');
      gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.8)');
      gradient.addColorStop(0.7, 'rgba(244, 114, 182, 0.8)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(236, 72, 153, 0.9)';
      ctx.fillRect(position - beamWidth, 0, beamWidth * 2, beamHeight);

      // Secondary glow
      const glowGradient = ctx.createLinearGradient(position - beamWidth * 0.8, 0, position + beamWidth * 0.8, 0);
      glowGradient.addColorStop(0, 'transparent');
      glowGradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.5)');
      glowGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = glowGradient;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(244, 114, 182, 0.7)';
      ctx.fillRect(position - beamWidth * 0.8, 0, beamWidth * 1.6, beamHeight * 0.6);

      position += speed;
      const canvasWidth = canvas.width / dpr;
      if (position > canvasWidth + beamWidth) {
        position = -beamWidth;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Capabilities', href: '#work' },
    { name: 'About Us', href: '#about' },
    { name: 'Portfolio', href: '#clients' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: <Linkedin size={20} />, href: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com', name: 'Twitter' },
    { icon: <Github size={20} />, href: 'https://github.com', name: 'GitHub' },
    { icon: <Instagram size={20} />, href: 'https://instagram.com', name: 'Instagram' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      if (lenis && typeof lenis.scrollTo === 'function') {
        try {
          lenis.scrollTo(element, { duration: 1.2, offset: -80 });
        } catch (error) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer style={{ 
      position: 'relative', 
      background: 'linear-gradient(180deg, rgba(5, 5, 6, 0.95) 0%, #000000 100%)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      overflow: 'hidden'
    }}>
      {/* Moving Light Beam on Top Edge */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '3px',
        width: '100%',
        overflow: 'hidden'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      {/* Glassmorphism Background Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 800px 200px at 50% 0%, rgba(236, 72, 153, 0.08), transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: isMobile ? '40px 16px 24px' : '64px 24px 40px',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr 1fr' : '1.2fr 1.5fr 1.3fr'),
          gap: isMobile ? '32px' : (isTablet ? '40px' : '60px'),
          marginBottom: isMobile ? '24px' : (isTablet ? '36px' : '48px')
        }}>
          {/* Left: Logo with Animation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '20px',
              position: 'relative'
            }}
          >
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src="/nexordis-logo-1.png"
                alt="Nexordis Logo"
                style={{
                  height: isMobile ? '40px' : '48px',
                  width: 'auto',
                  filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))'
                }}
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))',
                    'drop-shadow(0 0 15px rgba(244, 114, 182, 0.5))',
                    'drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              <motion.span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: isMobile ? '1.25rem' : '1.5rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  textShadow: '0 0 10px rgba(236, 72, 153, 0.3)'
                }}
                animate={{
                  textShadow: [
                    '0 0 10px rgba(236, 72, 153, 0.3)',
                    '0 0 15px rgba(244, 114, 182, 0.5)',
                    '0 0 10px rgba(236, 72, 153, 0.3)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                NEXORDIS
              </motion.span>
            </motion.div>
            
            <p style={{
              fontSize: isMobile ? '0.813rem' : '0.95rem',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6',
              maxWidth: isMobile ? '100%' : '300px',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}>
              Transforming businesses through intelligent automation and cutting-edge technology.
            </p>

            {/* Subtle logo glow effect */}
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                top: isMobile ? '40px' : '50px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                zIndex: -1
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.div>

          {/* Middle: Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '24px'
            }}
          >
            <h3 style={{
              fontSize: isMobile ? '0.95rem' : '1.125rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Navigation
            </h3>
            <nav style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '10px' : '12px'
            }}>
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  style={{
                    fontSize: isMobile ? '0.875rem' : '0.95rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    textDecoration: 'none',
                    position: 'relative',
                    paddingBottom: '4px',
                    transition: 'color 0.3s ease',
                    width: 'fit-content',
                    minHeight: isMobile ? '36px' : 'auto',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  whileHover={{ 
                    color: 'rgba(236, 72, 153, 1)',
                    x: isMobile ? 0 : 4
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  {link.name}
                  {!isMobile && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, rgba(236, 72, 153, 1), transparent)',
                        width: '0%'
                      }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Right: Contact Details & Social Media */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '24px'
            }}
          >
            <h3 style={{
              fontSize: isMobile ? '0.95rem' : '1.125rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Get In Touch
            </h3>

            {/* Contact Details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '12px' : '16px',
              marginBottom: '8px'
            }}>
              <motion.a
                href="mailto:contact@nexordis.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '10px' : '12px',
                  fontSize: isMobile ? '0.813rem' : '0.95rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  minHeight: '44px'
                }}
                whileHover={{ 
                  color: 'rgba(236, 72, 153, 1)',
                  x: isMobile ? 0 : 4
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Mail size={isMobile ? 16 : 18} style={{ color: 'rgba(236, 72, 153, 0.8)', flexShrink: 0 }} />
                <span style={{ lineHeight: '1.4' }}>contact@nexordis.com</span>
              </motion.a>

              <motion.a
                href="tel:+1234567890"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '10px' : '12px',
                  fontSize: isMobile ? '0.813rem' : '0.95rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  minHeight: '44px'
                }}
                whileHover={{ 
                  color: 'rgba(236, 72, 153, 1)',
                  x: isMobile ? 0 : 4
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone size={isMobile ? 16 : 18} style={{ color: 'rgba(236, 72, 153, 0.8)', flexShrink: 0 }} />
                <span style={{ lineHeight: '1.4' }}>+1 (234) 567-890</span>
              </motion.a>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: isMobile ? '10px' : '12px',
                fontSize: isMobile ? '0.813rem' : '0.95rem',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: '1.6',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                <MapPin size={isMobile ? 16 : 18} style={{ color: 'rgba(236, 72, 153, 0.8)', marginTop: '2px', flexShrink: 0 }} />
                <span>Global • Remote & On-Site Services</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <p style={{
                fontSize: isMobile ? '0.875rem' : '0.95rem',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '4px'
              }}>
                Follow Us
              </p>
              <div style={{
                display: 'flex',
                gap: isMobile ? '10px' : '12px',
                flexWrap: 'wrap',
                justifyContent: isMobile ? 'flex-start' : 'flex-start'
              }}>
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: isMobile ? '44px' : '44px',
                      height: isMobile ? '44px' : '44px',
                      minWidth: '44px',
                      minHeight: '44px',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      borderColor: 'rgba(236, 72, 153, 0.5)',
                      color: '#ec4899',
                      boxShadow: '0 8px 24px rgba(236, 72, 153, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
                        opacity: 0,
                        borderRadius: '12px'
                      }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {React.cloneElement(social.icon, { size: isMobile ? 18 : 20 })}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            paddingTop: isMobile ? '24px' : '40px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '16px' : '24px',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <p style={{ margin: 0, lineHeight: '1.5' }}>
            © {new Date().getFullYear()} Nexordis. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '24px',
            flexWrap: 'wrap',
            alignItems: isMobile ? 'flex-start' : 'center'
          }}>
            <a 
              href="#" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.target.style.color = 'rgba(236, 72, 153, 1)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              style={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.target.style.color = 'rgba(236, 72, 153, 1)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}
            >
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

