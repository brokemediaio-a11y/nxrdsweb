import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SparklesCore } from '../UI/Sparkles';

const TechStack = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 992);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [titleRef, titleInView] = useInView({ 
    once: true, 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });

  // Row 1 - scrolls left to right (→)
  const row1Logos = [
    'n8n.svg',
    'react.svg',
    'mongodb.svg',
    'nextjs.svg',
    'postgresql.svg',
    'python.svg',
    'fastapi.svg',
    'nodejs.svg'
  ];

  // Row 2 - scrolls right to left (←)
  const row2Logos = [
    'jupyter.svg',
    'colab.svg',
    'vuejs.svg',
    'twilio.svg',
    'elevenlabs.svg',
    'cal-com.svg',
    'openai.svg',
    'google-workspace.svg',
    'aws.svg',
    'hostinger.svg'
  ];

  const CarouselRow = ({ logos, direction, speed }) => {
    // Duplicate logos for seamless loop
    const duplicatedLogos = [...logos, ...logos];
    
    // Calculate animation values
    const logoWidth = isMobile ? 80 : isTablet ? 100 : 120;
    const gap = isMobile ? 40 : isTablet ? 50 : 60;
    const singleRowWidth = logos.length * (logoWidth + gap);
    
    // Animation: For left direction (→), animate from 0 to -50%
    // For right direction (←), animate from -50% to 0
    const animateX = direction === 'left' 
      ? [0, -singleRowWidth]
      : [-singleRowWidth, 0];

    return (
      <div 
        style={{ 
          overflow: 'hidden', 
          position: 'relative',
          height: isMobile ? '100px' : '120px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minHeight: isMobile ? '100px' : '120px'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          style={{
            display: 'flex',
            gap: `${gap}px`,
            alignItems: 'center',
            willChange: 'transform',
            transform: 'translateZ(0)',
            width: 'max-content',
            height: '100%'
          }}
          animate={!isPaused ? {
            x: animateX
          } : {}}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: speed,
              ease: "linear"
            }
          }}
        >
          {duplicatedLogos.map((logo, index) => {
            const logoName = logo.replace('.svg', '');
            return (
              <div
                key={`${logo}-${index}`}
                style={{
                  minWidth: `${logoWidth}px`,
                  width: `${logoWidth}px`,
                  height: isMobile ? '80px' : '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative'
                }}
              >
                <img
                  src={`/logos/${logo}`}
                  alt={logoName}
                  onError={(e) => {
                    // Hide image and show placeholder text
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent && !parent.querySelector('.logo-placeholder')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'logo-placeholder';
                      placeholder.textContent = logoName.replace(/-/g, ' ').toUpperCase();
                      placeholder.style.cssText = `
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: 'Lemon Milk', sans-serif;
                        font-size: 11px;
                        font-weight: 600;
                        color: rgba(255, 255, 255, 0.4);
                        text-align: center;
                        opacity: 0.6;
                        word-break: break-word;
                        padding: 4px;
                        line-height: 1.2;
                      `;
                      parent.appendChild(placeholder);
                    }
                  }}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'brightness(0.95)',
                    opacity: 0.9,
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    if (e.target.style.display !== 'none') {
                      e.target.style.filter = 'brightness(1.1)';
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.target.style.display !== 'none') {
                      e.target.style.filter = 'brightness(0.95)';
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  const vignetteWidth = isMobile ? '80px' : isTablet ? '150px' : '200px';

  return (
    <section id="tech-stack" className="section" style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      paddingBottom: isMobile ? '60px' : '100px',
      paddingTop: isMobile ? '60px' : '100px',
      background: '#050506'
    }}>
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
            <h2>Tools & <span className="accent">Tech Stack</span></h2>
            <SparklesCore
              id="tsparticles-techstack"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={500}
              className="absolute inset-0 top-0 h-24 w-full"
              particleColor="#ec4899"
            />
          </motion.div>
        </div>

        {/* Carousel Container with Vignettes */}
        <div 
          style={{ 
            position: 'relative',
            overflow: 'hidden',
            marginTop: '60px',
            paddingTop: isMobile ? '20px' : '30px',
            paddingBottom: isMobile ? '20px' : '30px',
            minHeight: isMobile ? '280px' : '320px',
            background: 'transparent'
          }}
        >
          {/* LEFT VIGNETTE - fades in from left */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: vignetteWidth,
              height: '100%',
              background: 'linear-gradient(to right, #050506 0%, rgba(5,5,6,0.9) 30%, rgba(5,5,6,0.5) 70%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 10
            }} 
          />

          {/* RIGHT VIGNETTE - fades in from right */}
          <div 
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: vignetteWidth,
              height: '100%',
              background: 'linear-gradient(to left, #050506 0%, rgba(5,5,6,0.9) 30%, rgba(5,5,6,0.5) 70%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 10
            }} 
          />

          {/* Row 1 - Left to Right (→) */}
          <CarouselRow 
            logos={row1Logos} 
            direction="left" 
            speed={isMobile ? 50 : isTablet ? 40 : 30} 
          />

          {/* Spacing between rows */}
          <div style={{ height: isMobile ? '30px' : '40px' }} />

          {/* Row 2 - Right to Left (←) */}
          <CarouselRow 
            logos={row2Logos} 
            direction="right" 
            speed={isMobile ? 55 : isTablet ? 45 : 35} 
          />
        </div>
      </div>
    </section>
  );
};

export default TechStack;
