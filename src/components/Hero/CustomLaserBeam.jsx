import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './CustomLaserBeam.css';

const CustomLaserBeam = () => {
  const [pulseKey, setPulseKey] = useState(0);

  // Restart pulse animation on loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(prev => prev + 1);
    }, 3400); // Pulse every 3.4 seconds (adjusted for longer duration)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="custom-laser-container">
      
      
      {/* Vertical Laser Beam */}
      <div className="laser-beam-wrapper">
        <div className="laser-beam">
          {/* Core beam - brightest center */}
          <div className="beam-core"></div>
          
          {/* Multiple glow layers for depth */}
          <div className="beam-glow glow-layer-1"></div>
          <div className="beam-glow glow-layer-2"></div>
          <div className="beam-glow glow-layer-3"></div>
          <div className="beam-glow glow-layer-4"></div>
          
          {/* Multiple animated fog layers with different speeds */}
          <div className="beam-fog fog-layer-1"></div>
          <div className="beam-fog fog-layer-2"></div>
          <div className="beam-fog fog-layer-3"></div>
          <div className="beam-fog-side fog-side-left"></div>
          <div className="beam-fog-side fog-side-right"></div>
          
          {/* Rising steam/vapor effects along the beam */}
          <div className="beam-steam steam-1"></div>
          <div className="beam-steam steam-2"></div>
          <div className="beam-steam steam-3"></div>
          <div className="beam-steam steam-4"></div>
          <div className="beam-steam steam-5"></div>
          <div className="beam-steam steam-6"></div>
          
          
          {/* Multi-layer pulse animation traveling down the beam */}
          {/* White core layer with fast pulsing and horizontal expansion at 90% */}
          <motion.div 
            key={`pulse-core-${pulseKey}`}
            className="beam-pulse-core"
            initial={{ top: '-120px', opacity: 0, scale: 1, scaleX: 1 }}
            animate={{ 
              top: 'calc(100% + 20px)', 
              opacity: [0, 1, 1, 1, 1, 1, 0.95, 0.9, 0],
              scale: [0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5],
              scaleX: [1, 1, 1, 1, 1, 1, 3, 10, 20]
            }}
            transition={{ 
              duration: 2.2,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1],
              scale: {
                duration: 2.2,
                ease: "linear",
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1]
              },
              scaleX: {
                duration: 2.2,
                ease: [0.4, 0, 0.1, 1],
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1]
              }
            }}
          />
          
          {/* Blue middle layer with pulsing and horizontal expansion at 90% */}
          <motion.div 
            key={`pulse-middle-${pulseKey}`}
            className="beam-pulse-middle"
            initial={{ top: '-140px', left: '-70px', opacity: 0, scale: 1, scaleX: 1 }}
            animate={{ 
              top: 'calc(100% + 20px)', 
              opacity: [0, 0.9, 0.9, 0.9, 0.9, 0.9, 0.85, 0.75, 0],
              scale: [0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5],
              scaleX: [1, 1, 1, 1, 1, 1, 4, 12, 25]
            }}
            transition={{ 
              duration: 2.2,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1],
              scale: {
                duration: 2.2,
                ease: "linear",
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1]
              },
              scaleX: {
                duration: 2.2,
                ease: [0.4, 0, 0.1, 1],
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1]
              }
            }}
          />
          
          {/* Outer blue glow layer with pulsing and horizontal expansion at 90% */}
          <motion.div 
            key={`pulse-outer-${pulseKey}`}
            className="beam-pulse-outer"
            initial={{ top: '-140px', left: '-80px', opacity: 0, scale: 1, scaleX: 1 }}
            animate={{ 
              top: 'calc(100% + 40px)', 
              opacity: [0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.75, 0.65, 0],
              scale: [0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5],
              scaleX: [1, 1, 1, 1, 1, 1, 5, 15, 30]
            }}
            transition={{ 
              duration: 2.2,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1],
              scale: {
                duration: 2.2,
                ease: "linear",
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1]
              },
              scaleX: {
                duration: 2.2,
                ease: [0.4, 0, 0.1, 1],
                times: [0, 0.1, 0.3, 0.5, 0.7, 0.85, 0.90, 0.95, 1]
              }
            }}
          />

          

        </div>
      </div>

      {/* Bottom Pool Effect - spans full screen width */}
      <div className="bottom-pool-container">
        {/* Bright white center core */}
        <div className="pool-core-white"></div>
        
        {/* Intense glow at beam base for blending */}
        <div className="pool-beam-merge"></div>
        
        {/* Main pool layers */}
        <div className="pool-glow-main"></div>
        <div className="pool-glow-secondary"></div>
        <div className="pool-reflection"></div>
        <div className="pool-light-rays"></div>
        
        {/* Additional atmospheric layers for seamless blend */}
        <div className="pool-atmosphere"></div>
        
        {/* Collision splash effects - white core with blue glow */}
        {/* White core splash - smaller, inner layer */}
        <motion.div
          key={`splash-white-${pulseKey}`}
          className="pool-splash-white"
          initial={{ opacity: 0, top: '-50px' }}
          animate={{ 
            opacity: [0, 0.5, 0.9, 0.4, 0],
            top: ['-20px', '100px', '160px', '220px', '280px']

          }}
          transition={{ 
            duration: 5.5,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.2, 0.5, 0.75, 1],
            delay: 1.09
          }}
        />
        
        {/* Blue glow splash - larger, outer layer */}
        <motion.div
          key={`splash-main-${pulseKey}`}
          className="pool-splash-main"
          initial={{ opacity: 0, top: '-60px' }}
          animate={{ 
            opacity: [0, 0, 0, 0, 0],
            top: ['30px', '95px', '155px', '215px', '275px']

          }}
          transition={{ 
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.2, 0.5, 0.75, 1],
            delay: 1.06
          }}
        />
        
        {/* Blue wave splash - widest layer */}
        <motion.div
          key={`splash-wave-${pulseKey}`}
          className="pool-splash-wave"
          initial={{ opacity: 0, top: '-70px' }}
          animate={{ 
            opacity: [0, 0, 0, 0, 0],
            top: ['-20px', '70px', '130px', '190px', '250px']          }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            times: [0, 0.2, 0.5, 0.75, 1],
            delay: 1.06
          }}
        />
      </div>
    </div>
  );
};

export default CustomLaserBeam;
