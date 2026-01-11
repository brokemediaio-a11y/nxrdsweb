import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  active = false,
  ...props 
}) => {
  // Glass effect base styles (always visible)
  const glassBaseStyle = {
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'hidden'
  };

  // Variant styles
  const variantStyles = {
    primary: {
      ...glassBaseStyle,
      background: active 
        ? 'rgba(255, 255, 255, 0.18)' 
        : 'rgba(255, 255, 255, 0.1)',
      border: active 
        ? '1px solid rgba(255, 255, 255, 0.3)' 
        : '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: active
        ? '0 8px 32px 0 rgba(255, 255, 255, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.25)'
        : '0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.15)',
      color: active ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'
    },
    secondary: {
      ...glassBaseStyle,
      background: 'rgba(81, 80, 247, 0.12)',
      border: '1px solid rgba(81, 80, 247, 0.25)',
      boxShadow: '0 8px 32px 0 rgba(81, 80, 247, 0.15), inset 0 0 0 1px rgba(81, 80, 247, 0.2)',
      color: 'rgba(255, 255, 255, 0.9)'
    },
    outline: {
      ...glassBaseStyle,
      background: 'rgba(255, 255, 255, 0.06)',
      border: '2px solid rgba(240, 26, 174, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(240, 26, 174, 0.12), inset 0 0 0 1px rgba(240, 26, 174, 0.15)',
      color: 'rgba(240, 26, 174, 0.9)'
    }
  };

  // Size styles
  const sizeStyles = {
    sm: {
      padding: '6px 16px',
      fontSize: '12px',
      fontWeight: 600
    },
    md: {
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: 600
    },
    lg: {
      padding: '14px 32px',
      fontSize: '16px',
      fontWeight: 600
    }
  };

  const { type, style, ...restProps } = props;

  const combinedStyle = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: '999px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Lemon Milk', sans-serif",
    ...style
  };

  return (
    <motion.button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={combinedStyle}
      whileHover={disabled ? {} : { 
        scale: 1.08,
        background: variant === 'primary' 
          ? (active ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.15)')
          : variant === 'secondary'
          ? 'rgba(81, 80, 247, 0.22)'
          : 'rgba(240, 26, 174, 0.2)',
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.3)',
        border: variant === 'primary' 
          ? '1px solid rgba(255, 255, 255, 0.3)'
          : variant === 'secondary'
          ? '1px solid rgba(81, 80, 247, 0.3)'
          : '2px solid rgba(240, 26, 174, 0.4)'
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...restProps}
    >
      {/* Glass shimmer effect on hover (reduced opacity) */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
          transition: 'left 0.5s ease'
        }}
        whileHover={{
          left: '100%'
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </motion.button>
  );
};

export default Button;