import React from 'react';
import { motion } from 'framer-motion';
import GalaxyBackground from './GalaxyBackground';
import HeroText from './HeroText';
import { isMobile } from '../../utils/animations';

const Hero = () => {
  const mobile = isMobile();

  return (
    <header className="hero" style={{ 
      position: 'relative', 
      overflow: 'hidden',
      height: mobile ? '100vh' : 'auto',
      minHeight: mobile ? '100vh' : '70vh',
      maxHeight: mobile ? '100vh' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      willChange: 'auto',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      // Isolate from scroll transforms to prevent jitter
      isolation: 'isolate',
      contain: 'layout style',
      padding: mobile ? '0' : '80px 0 40px',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      {/* Galaxy Background - z-index: 1 */}
      <GalaxyBackground />
      
      <div className="container" style={{ 
        position: 'relative', 
        zIndex: 5,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: mobile ? '0 16px' : '0 24px',
        height: mobile ? '100%' : 'auto',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: mobile ? '20px 0' : '30px 0 60px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          {/* Hero Text - z-index: 5 */}
          <div style={{ 
            position: 'relative', 
            zIndex: 5, 
            width: '100%',
            maxWidth: mobile ? '100%' : '90%'
          }}>
            <HeroText />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;