import React from 'react';
import { motion } from 'framer-motion';
import GalaxyBackground from './GalaxyBackground';
import HeroText from './HeroText';
import LaserBeamCanvas from './LaserBeamCanvas';
import { isMobile } from '../../utils/animations';

const Hero = () => {
  const mobile = isMobile();

  return (
    <header className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Galaxy Background - z-index: 1 */}
      <GalaxyBackground />
      
      {/* Hero Effects Wrapper - z-index: 4 */}
      <div className="hero-effects" style={{
        position: 'absolute',
        inset: 0,
        zIndex: 4,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {/* Laser Beam Canvas Animation */}
        <LaserBeamCanvas />
      </div>
      
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