import React from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInUp } from '../../utils/animations';
import Button from '../UI/Button';

const HeroText = () => {
  return (
    <div style={{ textAlign: 'left', maxWidth: '100%' }}>
      {/* Main Title */}
      <motion.h1 
        className="hero-title"
        style={{ textAlign: 'left', opacity: 1, transform: 'translateY(0)' }}
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
        style={{ textAlign: 'left', margin: '2rem 0 0 0', opacity: 1, transform: 'translateY(0)' }}
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
        style={{ marginTop: '2rem', display: 'flex', gap: '12px', flexWrap: 'wrap', opacity: 1, transform: 'translateY(0)' }}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        <Button 
          variant="primary"
          size="lg"
          onClick={() => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
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