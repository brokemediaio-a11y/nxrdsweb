import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SparklesCore } from '../UI/Sparkles';
import { Target, Zap, Globe, Award, TrendingUp, Users, Code, Rocket, User } from 'lucide-react';

const AboutUs = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  
  const [titleRef, titleInView] = useInView({ 
    once: true, 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });
  const [statsRef, statsInView] = useInView({ 
    once: true, 
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true
  });
  const [contentRef, contentInView] = useInView({ 
    once: true, 
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true
  });
  const [valuesRef, valuesInView] = useInView({ 
    once: true, 
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true
  });
  const [foundersRef, foundersInView] = useInView({ 
    once: true, 
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true
  });

  const founders = [
    {
      name: 'Sobaan Mahmood',
      position: 'Co-Founder',
      image: '/founders/PicsArt_07-15-04.41.13-1-e1734019477209-730x1024.jpg'
    },
    {
      name: 'Chaudhary Shahzaib Awais',
      position: 'Co-Founder',
      image: '/founders/IMG_7988-scaled-e1734019355244.jpg'
    },
    {
      name: 'Saad Hassan Butt',
      position: 'Co-Founder',
      image: '/founders/8f63633b-6cc3-4605-8a10-644e7c244a0e.jpg'
    }
  ];

  const stats = [
    { icon: <Users size={28} />, value: '50+', label: 'Projects Delivered', color: '#ec4899' },
    { icon: <Globe size={28} />, value: '15+', label: 'Countries Served', color: '#f472b6' },
    { icon: <TrendingUp size={28} />, value: '98%', label: 'Client Satisfaction', color: '#ec4899' },
    { icon: <Rocket size={28} />, value: '5+', label: 'Years Experience', color: '#f472b6' }
  ];

  const values = [
    {
      icon: <Target size={24} />,
      title: 'Innovation First',
      description: 'We push boundaries and embrace cutting-edge technologies to deliver solutions that redefine possibilities.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Rapid Execution',
      description: 'Speed without compromise. We deliver high-quality solutions efficiently, ensuring faster time-to-market.'
    },
    {
      icon: <Code size={24} />,
      title: 'Code Excellence',
      description: 'Clean, scalable, and maintainable code is the foundation of every project we build.'
    },
    {
      icon: <Award size={24} />,
      title: 'Quality Focused',
      description: 'Every detail matters. We maintain the highest standards in design, development, and delivery.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      scale: 1.08,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="about" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background gradient blurs */}
      <div
        className="absolute top-0 left-0 h-[600px] w-[600px] rounded-full opacity-15 blur-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, #ec4899, transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, #f472b6, transparent 70%)`,
        }}
      />

      {/* Floating Glass Orbs - Unique decorative elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.1) 50%, transparent 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2), inset 0 0 40px rgba(236, 72, 153, 0.1)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1]
        }}
      />
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(244, 114, 182, 0.2), inset 0 0 40px rgba(244, 114, 182, 0.1)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)'
        }}
        animate={{
          y: [0, 25, 0],
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 1
        }}
      />

      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Section Title */}
        <div className="section-title" ref={titleRef}>
          <div className="glow-dot"></div>
          <motion.div 
            style={{ position: 'relative', width: 'fit-content' }}
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2>About <span className="accent">Us</span></h2>
            <SparklesCore
              id="tsparticles-about"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={500}
              className="absolute inset-0 top-0 h-24 w-full"
              particleColor="#ec4899"
            />
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <motion.div
          ref={contentRef}
          variants={containerVariants}
          initial="hidden"
          animate={contentInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : 'repeat(2, 1fr)'),
            gap: isMobile ? '24px' : (isTablet ? '28px' : '32px'),
            marginTop: isMobile ? '32px' : '48px',
            marginBottom: isMobile ? '40px' : '64px'
          }}
        >
          {/* Left: Mission Statement */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              padding: isMobile ? '32px' : '48px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Animated glassmorphism gradient overlay */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
                opacity: 0.6,
                pointerEvents: 'none'
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, 100, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            
            {/* Glassmorphism glow effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.8), rgba(244, 114, 182, 0.8), transparent)',
                pointerEvents: 'none',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'
              }}
            />
            
            {/* Glass reflection effect */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '60%',
                height: '40%',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                opacity: 0.6
              }}
            />
            
            <motion.h3
              style={{
                fontSize: isMobile ? '1.75rem' : '2rem',
                fontWeight: 700,
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(236, 72, 153, 0.9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                position: 'relative',
                zIndex: 1
              }}
            >
              Our Mission
            </motion.h3>
            <p
              style={{
                fontSize: isMobile ? '1rem' : '1.125rem',
                lineHeight: '1.75',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '24px',
                position: 'relative',
                zIndex: 1
              }}
            >
              At Nexordis, we're dedicated to transforming businesses through intelligent automation and cutting-edge technology. We build AI-powered solutions that streamline operations, reduce costs, and unlock new possibilities for organizations worldwide.
            </p>
            <p
              style={{
                fontSize: isMobile ? '1rem' : '1.125rem',
                lineHeight: '1.75',
                color: 'rgba(255, 255, 255, 0.9)',
                position: 'relative',
                zIndex: 1
              }}
            >
              Our team combines deep technical expertise with a passion for innovation, delivering solutions that don't just meet expectations—they exceed them.
            </p>
          </motion.div>

          {/* Right: Vision Statement */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
            className="glass-card"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '24px',
              padding: isMobile ? '32px' : '48px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Animated glassmorphism gradient overlay */}
            <motion.div
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, transparent 70%)',
                opacity: 0.6,
                pointerEvents: 'none'
              }}
              animate={{
                x: [0, -100, 0],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
            
            {/* Glassmorphism glow effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(244, 114, 182, 0.8), rgba(236, 72, 153, 0.8), transparent)',
                pointerEvents: 'none',
                boxShadow: '0 0 20px rgba(244, 114, 182, 0.4)'
              }}
            />
            
            {/* Glass reflection effect */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                width: '60%',
                height: '40%',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
                borderRadius: '50%',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                opacity: 0.6
              }}
            />
            
            <motion.h3
              style={{
                fontSize: isMobile ? '1.75rem' : '2rem',
                fontWeight: 700,
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(244, 114, 182, 0.9) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                position: 'relative',
                zIndex: 1
              }}
            >
              Our Vision
            </motion.h3>
            <p
              style={{
                fontSize: isMobile ? '1rem' : '1.125rem',
                lineHeight: '1.75',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '24px',
                position: 'relative',
                zIndex: 1
              }}
            >
              We envision a future where intelligent automation empowers every business to operate at peak efficiency. By leveraging AI, machine learning, and advanced software engineering, we're building the next generation of digital solutions.
            </p>
            <p
              style={{
                fontSize: isMobile ? '1rem' : '1.125rem',
                lineHeight: '1.75',
                color: 'rgba(255, 255, 255, 0.9)',
                position: 'relative',
                zIndex: 1
              }}
            >
              Every project we undertake moves us closer to a world where technology seamlessly integrates with business operations, creating value and driving growth.
            </p>
          </motion.div>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
            gap: isMobile ? '16px' : (isTablet ? '20px' : '24px'),
            marginBottom: '64px',
            position: 'relative'
          }}
        >
          {/* Floating circle on the right of Years Experience */}
          {!isMobile && (
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                right: '-60px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                background: 'radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(244, 114, 182, 0.2), inset 0 0 40px rgba(244, 114, 182, 0.1)',
                pointerEvents: 'none',
                zIndex: 0,
                willChange: 'transform, opacity',
                transform: 'translateZ(0) translateY(-50%)',
                WebkitTransform: 'translateZ(0) translateY(-50%)'
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.08, 1],
                opacity: [0.6, 0.85, 0.6]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1]
              }}
            />
          )}
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={statVariants}
              whileHover="hover"
              className="glass-card"
              style={{
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: isMobile ? '24px' : '32px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
                willChange: 'transform, opacity',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)'
              }}
            >
              {/* Animated glassmorphism gradient */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at center, ${stat.color}20, transparent 70%)`,
                  opacity: 0,
                  borderRadius: '20px'
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Glass reflection */}
              <div
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '20%',
                  width: '50%',
                  height: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                  borderRadius: '50%',
                  filter: 'blur(30px)',
                  pointerEvents: 'none',
                  opacity: 0.4
                }}
              />
              
              {/* Animated border glow */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  padding: '1px',
                  background: `linear-gradient(135deg, ${stat.color}40, transparent, ${stat.color}40)`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  opacity: 0
                }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '16px',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                <motion.div
                  style={{
                    fontSize: isMobile ? '2rem' : '2.5rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                    background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring', stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <p style={{
                  fontSize: isMobile ? '0.875rem' : '1rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 500
                }}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values */}
        <motion.div
          ref={valuesRef}
          variants={containerVariants}
          initial="hidden"
          animate={valuesInView ? 'visible' : 'hidden'}
          style={{
            marginTop: '48px',
            width: '100%',
            position: 'relative'
          }}
        >
          <motion.h3
            variants={itemVariants}
            style={{
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: 700,
              marginBottom: isMobile ? '24px' : '32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(236, 72, 153, 0.9) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              width: '100%'
            }}
          >
            Our Core Values
          </motion.h3>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr' : 'repeat(2, 1fr)'),
              gap: isMobile ? '20px' : (isTablet ? '22px' : '24px'),
              width: '100%',
              position: 'relative'
            }}
          >
              {/* Floating circle on the left between Innovation First and Code Excellence */}
              {!isTablet && (
                <motion.div
                style={{
                  position: 'absolute',
                  left: '-60px',
                  top: '50%',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                  background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.1) 50%, transparent 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2), inset 0 0 40px rgba(236, 72, 153, 0.1)',
                  pointerEvents: 'none',
                  zIndex: 0,
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0) translateY(-50%)',
                  WebkitTransform: 'translateZ(0) translateY(-50%)'
                }}
                animate={{
                  y: [0, 18, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.75, 0.5]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  delay: 0.5
                }}
              />
            )}
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="glass-card"
                style={{
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  padding: '36px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)'
                }}
              >
                {/* Animated glassmorphism gradient */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
                    opacity: 0,
                    borderRadius: '20px'
                  }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Glass reflection */}
                <div
                  style={{
                    position: 'absolute',
                    top: '15%',
                    left: '15%',
                    width: '40%',
                    height: '40%',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%)',
                    borderRadius: '50%',
                    filter: 'blur(35px)',
                    pointerEvents: 'none',
                    opacity: 0.5
                  }}
                />
                
                {/* Animated top glow effect */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.8), rgba(244, 114, 182, 0.8), transparent)',
                    opacity: 0,
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)'
                  }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  width: '100%'
                }}>
                  <div                   style={{
                    flexShrink: 0,
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 114, 182, 0.15))',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ec4899'
                  }}>
                    {React.cloneElement(value.icon, { size: 24 })}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: '1.375rem',
                      fontWeight: 600,
                      marginBottom: '12px',
                      color: 'rgba(255, 255, 255, 0.95)',
                      lineHeight: '1.3'
                    }}>
                      {value.title}
                    </h4>
                    <p style={{
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: 'rgba(255, 255, 255, 0.75)',
                      margin: 0
                    }}>
                      {value.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Founders Section */}
        <motion.div
          ref={foundersRef}
          variants={containerVariants}
          initial="hidden"
          animate={foundersInView ? 'visible' : 'hidden'}
          style={{
            marginTop: '80px',
            width: '100%'
          }}
        >
          <motion.h3
            variants={itemVariants}
            style={{
              fontSize: isMobile ? '1.5rem' : '1.75rem',
              fontWeight: 700,
              marginBottom: isMobile ? '32px' : '48px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffffff 0%, rgba(236, 72, 153, 0.9) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              width: '100%'
            }}
          >
            Our Founders
          </motion.h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'),
              gap: isMobile ? '20px' : (isTablet ? '24px' : '32px'),
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03, 
                  y: -8,
                  rotateY: 5,
                  rotateX: -2,
                  transition: { duration: 0.3 }
                }}
                style={{
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '24px',
                  padding: isMobile ? '32px 24px' : '40px 32px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                        {/* Animated glassmorphism gradient overlay */}
                        <motion.div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
                            opacity: 0,
                            borderRadius: '24px',
                            pointerEvents: 'none'
                          }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Glassmorphism top glow effect */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, rgba(236, 72, 153, 0.8), rgba(244, 114, 182, 0.8), transparent)',
                            pointerEvents: 'none',
                            boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'
                          }}
                        />

                        {/* Glass reflection effect */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '10%',
                            left: '20%',
                            width: '60%',
                            height: '40%',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                            borderRadius: '50%',
                            filter: 'blur(40px)',
                            pointerEvents: 'none',
                            opacity: 0.5
                          }}
                        />

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                          {/* Founder Image */}
                          <motion.div
                            style={{
                              width: '120px',
                              height: '120px',
                              margin: '0 auto 24px',
                              borderRadius: '50%',
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(244, 114, 182, 0.2) 100%)',
                              border: '2px solid rgba(236, 72, 153, 0.3)',
                              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.3), inset 0 0 30px rgba(236, 72, 153, 0.1), 0 0 60px rgba(244, 114, 182, 0.2)',
                              transformStyle: 'preserve-3d',
                              perspective: '1000px',
                              overflow: 'hidden'
                            }}
                            whileHover={{ 
                              scale: 1.05, 
                              rotateY: 10,
                              rotateX: -5,
                              boxShadow: '0 12px 40px rgba(236, 72, 153, 0.4), inset 0 0 40px rgba(236, 72, 153, 0.15), 0 0 80px rgba(244, 114, 182, 0.3)'
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Inner glow effect */}
                            <div
                              style={{
                                position: 'absolute',
                                inset: '10%',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                                filter: 'blur(20px)',
                                pointerEvents: 'none',
                                zIndex: 1
                              }}
                            />
                            
                            {/* Founder Photo */}
                            <img
                              src={founder.image}
                              alt={founder.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                position: 'relative',
                                zIndex: 2
                              }}
                            />

                            {/* Outer ring glow */}
                            <motion.div
                              style={{
                                position: 'absolute',
                                inset: '-10px',
                                borderRadius: '50%',
                                border: '2px solid rgba(236, 72, 153, 0.2)',
                                pointerEvents: 'none',
                                opacity: 0,
                                zIndex: 3
                              }}
                              whileHover={{
                                opacity: 1,
                                scale: 1.1,
                                borderColor: 'rgba(244, 114, 182, 0.4)'
                              }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.div>

                          {/* Name */}
                          <h4
                            style={{
                              fontSize: '1.25rem',
                              fontWeight: 600,
                              marginBottom: '8px',
                              color: 'rgba(255, 255, 255, 0.95)',
                              lineHeight: '1.3'
                            }}
                          >
                            {founder.name}
                          </h4>

                          {/* Position */}
                          <p
                            style={{
                              fontSize: '0.95rem',
                              color: 'rgba(236, 72, 153, 0.9)',
                              fontWeight: 500,
                              margin: 0,
                              lineHeight: '1.4'
                            }}
                          >
                            {founder.position}
                          </p>
                        </div>

                        {/* 3D depth effect on hover */}
                        <motion.div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            opacity: 0,
                            pointerEvents: 'none',
                            transform: 'translateZ(20px)'
                          }}
                          whileHover={{ 
                            opacity: 1,
                            boxShadow: 'inset 0 0 40px rgba(236, 72, 153, 0.1)'
                          }}
                          transition={{ duration: 0.3 }}
                        />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;

