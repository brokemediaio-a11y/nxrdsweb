import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { fadeInUp } from '../../utils/animations';

const RevealOnScroll = ({ 
  children, 
  variant = 'fadeInUp',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = ''
}) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce
  });

  const variants = {
    fadeInUp,
    fadeInLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }
      }
    },
    fadeInRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }
      }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[variant]}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;