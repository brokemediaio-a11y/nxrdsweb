// Animation variants for Framer Motion
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const scaleOnHover = {
  scale: 1.02,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20
  }
};

export const tiltOnHover = {
  scale: 1.02,
  rotateX: 2,
  rotateY: 2,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20
  }
};

// Custom easing functions
export const customEasing = [0.16, 1, 0.3, 1];
export const springConfig = { type: "spring", stiffness: 300, damping: 30 };

// Performance check for reduced motion
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Device detection for performance optimization
export const isMobile = () => {
  return window.innerWidth < 768;
};

export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1200;
};

export const isDesktop = () => {
  return window.innerWidth >= 1200;
};