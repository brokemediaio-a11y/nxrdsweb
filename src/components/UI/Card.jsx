import React from 'react';
import { motion } from 'framer-motion';
import { tiltOnHover } from '../../utils/animations';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  tilt = false,
  ...props 
}) => {
  const hoverAnimation = tilt ? tiltOnHover : { scale: 1.02 };

  return (
    <motion.div 
      className={`neo-card ${className}`}
      whileHover={hover ? hoverAnimation : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      <div className="p-6 h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;