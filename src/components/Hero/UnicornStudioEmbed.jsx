import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const UnicornStudioEmbed = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if UnicornStudio is already loaded
    if (window.UnicornStudio && window.UnicornStudio.isInitialized) {
      setIsLoaded(true);
      return;
    }

    // Load UnicornStudio script if not already present
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.0/dist/unicornStudio.umd.js';
      script.async = true;
      
      script.onload = () => {
        try {
          if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
            window.UnicornStudio.init();
            window.UnicornStudio.isInitialized = true;
          }
          setIsLoaded(true);
        } catch (error) {
          console.error('Error initializing UnicornStudio:', error);
          setHasError(true);
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load UnicornStudio script');
        setHasError(true);
      };
      
      (document.head || document.body).appendChild(script);
    }
  }, []);

  if (hasError) {
    return (
      <motion.div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          background: 'transparent',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.62)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #f800f7 0%, #961998 100%)',
            borderRadius: '50%',
            opacity: 0.2,
          }}></div>
          <p>3D Element Loading...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="relative w-full h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      {/* Loading State */}
      {!isLoaded && (
        <motion.div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            zIndex: 10,
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.62)' }}>
            <motion.div 
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #f800f7 0%, #961998 100%)',
                borderRadius: '50%',
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <p>Loading 3D Experience...</p>
          </div>
        </motion.div>
      )}
      
      {/* UnicornStudio Embed */}
      <div 
        data-us-project="4mVyiq16pPpZsv8IsS0U" 
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '500px',
          position: 'relative',
          zIndex: 0
        }}
        className="relative z-0"
      />
    </motion.div>
  );
};

export default UnicornStudioEmbed;