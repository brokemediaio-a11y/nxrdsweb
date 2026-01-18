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
      willChange: 'auto',
      transform: 'translateZ(0)',
      WebkitTransform: 'translateZ(0)',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      // Isolate from scroll transforms to prevent jitter
      isolation: 'isolate',
      contain: 'layout style',
    }}>
      {/* Galaxy Background - z-index: 1 */}
      <GalaxyBackground />
      
      <div className="container" style={{ 
        position: 'relative', 
        zIndex: 5,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: mobile ? '0 16px' : '0 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          minHeight: mobile ? 'auto' : '60vh',
          paddingTop: mobile ? '20px' : '30px',
          paddingBottom: mobile ? '40px' : '60px',
          textAlign: 'center'
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