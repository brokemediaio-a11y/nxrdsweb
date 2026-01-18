import React from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInUp } from '../../utils/animations';
import Button from '../UI/Button';
import { useLenisContext } from '../../contexts/LenisContext';

const HeroText = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const lenis = useLenisContext();
  
  return (
    <div style={{ textAlign: 'center', maxWidth: '100%', width: '100%' }}>
      {/* Main Title */}
      <motion.h1 
        className="hero-title"
        style={{ 
          textAlign: 'center', 
          opacity: 1, 
          transform: 'translateY(0)',
          marginBottom: isMobile ? '1rem' : '1.5rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
        variants={fadeInLeft}
        initial="hidden"
        animate="visible"
      >
        AI Solutions
        <br />
        Automation
        <br />
        Development
      </motion.h1>
      
      {/* Subtitle */}
      <motion.p 
        className="hero-subtitle"
        style={{ 
          textAlign: 'center', 
          margin: isMobile ? '1rem auto 0' : '2rem auto 0', 
          opacity: 1, 
          transform: 'translateY(0)',
          maxWidth: '100%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        We build intelligent systems that drive efficiency, scale operations, 
        and transform how businesses operate in the digital age.
      </motion.p>
      
      {/* CTA Button */}
      <motion.div
        style={{ 
          marginTop: isMobile ? '1.5rem' : '2rem', 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          opacity: 1, 
          transform: 'translateY(0)'
        }}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <Button 
          variant="primary"
          size={isMobile ? "md" : "lg"}
          onClick={() => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
              if (lenis && typeof lenis.scrollTo === 'function') {
                try {
                  lenis.scrollTo(contactSection, { duration: 1.2, offset: -80 });
                } catch (error) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }
          }}
        >
          Book a Discovery Call
        </Button>
      </motion.div>
    </div>
  );
};

export default HeroText;