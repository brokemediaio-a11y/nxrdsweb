import React from 'react';
import { motion } from 'framer-motion';
import GalaxyBackground from './GalaxyBackground';
import HeroText from './HeroText';
import CustomLaserBeam from './CustomLaserBeam';
import { isMobile } from '../../utils/animations';

const Hero = () => {
  const mobile = isMobile();

  return (
    <header className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Custom Laser Beam - positioned absolutely to span entire hero */}
      <CustomLaserBeam />
      
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: mobile ? 'center' : 'flex-start',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: mobile ? '280px' : '320px',
          justifyContent: 'flex-start',
          paddingTop: mobile ? '20px' : '30px',
          paddingBottom: mobile ? '50px' : '60px'
        }}>
          {/* Hero Text */}
          <div style={{ position: 'relative', zIndex: 3, maxWidth: mobile ? '100%' : '60%' }}>
            <HeroText />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;