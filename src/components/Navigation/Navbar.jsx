import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLenisContext } from '../../contexts/LenisContext';
import SelectionItems from '../UI/SelectionItems';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const lenis = useLenisContext();

  useEffect(() => {
    let lastScrollY = 0;
    let rafId = null;
    let lastUpdateTime = 0;
    const THROTTLE_MS = 16; // ~60fps max update rate
    
    const updateNavbar = (scrollY) => {
      // Only update scrolled state for styling changes
      setIsScrolled(scrollY > 50);
      lastScrollY = scrollY;
    };
    
    if (lenis && typeof lenis.on === 'function') {
      // Use Lenis scroll events
      const handleLenisScroll = ({ scroll, limit, velocity, direction, progress }) => {
        const now = performance.now();
        
        if (now - lastUpdateTime < THROTTLE_MS) {
          return;
        }
        
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
          updateNavbar(scroll);
          lastUpdateTime = now;
          rafId = null;
        });
      };
      
      try {
        lenis.on('scroll', handleLenisScroll);
        
        // Initial update
        if (lenis.scroll !== undefined) {
          updateNavbar(lenis.scroll);
        }
      } catch (error) {
        console.warn('Error setting up Lenis scroll listener:', error);
      }
      
      return () => {
        try {
          if (lenis && typeof lenis.off === 'function') {
            lenis.off('scroll', handleLenisScroll);
          }
        } catch (error) {
          console.warn('Error removing Lenis scroll listener:', error);
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    } else {
      // Fallback to native scroll
      const handleScroll = () => {
        const now = performance.now();
        
        if (now - lastUpdateTime < THROTTLE_MS) {
          return;
        }
        
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
          updateNavbar(currentScrollY);
          lastUpdateTime = now;
          rafId = null;
        });
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Calculate scrollbar width
    const calculateScrollbarWidth = () => {
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      outer.style.msOverflowStyle = 'scrollbar';
      document.body.appendChild(outer);
      
      const inner = document.createElement('div');
      outer.appendChild(inner);
      
      const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
      outer.parentNode?.removeChild(outer);
      setScrollbarWidth(scrollbarWidth);
    };

    // Initialize on mount
    handleResize();
    calculateScrollbarWidth();
    
    window.addEventListener('resize', () => {
      handleResize();
      calculateScrollbarWidth();
    });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [lenis]);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Capabilities', href: '#work' },
    { name: 'Portfolio', href: '#clients' },
    { name: 'Client Speak', href: '#clients' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href, name) => {
    setActiveLink(name);
    if (href === '#') {
      if (lenis && typeof lenis.scrollTo === 'function') {
        try {
          lenis.scrollTo(0, { duration: 1.2 });
        } catch (error) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const element = document.querySelector(href);
      if (element) {
        if (lenis && typeof lenis.scrollTo === 'function') {
          try {
            lenis.scrollTo(element, { duration: 1.2, offset: -80 });
          } catch (error) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <>
      <nav 
        className="navbar navbar-expand-lg" 
        data-lenis-prevent 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          paddingTop: isScrolled ? '16px' : '20px', 
          paddingBottom: isMobile ? (isScrolled ? '5px' : '7px') : (isScrolled ? '16px' : '20px'),
          transition: 'padding 0.3s ease, background-color 0.3s ease',
          zIndex: 99999,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          backgroundColor: isScrolled ? 'rgba(5,5,6,.95)' : 'rgba(5,5,6,.9)',
          borderBottom: '1px solid rgba(255,255,255,.08)',
          boxSizing: 'border-box',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'auto'
        }}
      >
        <div className="container" style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: isMobile ? '0 12px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'relative',
          gap: isMobile ? '8px' : '0',
          flexWrap: 'nowrap'
        }}>
          <a 
            className="navbar-brand" 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#', 'Home');
            }}
            style={{ 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
              zIndex: 1001
            }}
          >
            <img src="/nexordis-logo-1.png" alt="NEXORDIS" style={{ 
              height: isMobile ? '32px' : '38px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 18px rgba(236,72,153,.55))',
              transition: 'all 0.3s ease'
            }} />
            <span style={{
              fontFamily: "'Azonix', sans-serif",
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 'normal',
              letterSpacing: '0.15em',
              color: '#ffffff',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              NEXORDIS
            </span>
          </a>

          {/* Navigation - Always visible, horizontally scrollable on mobile */}
          <div className="navbar-collapse" style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0',
            position: 'relative',
            width: 'auto',
            flex: '1 1 auto',
            minWidth: 0
          }}>
            <SelectionItems
              items={navLinks.map(link => ({ 
                id: link.name, 
                label: link.name, 
                href: link.href 
              }))}
              activeId={activeLink}
              onItemClick={(item) => scrollToSection(item.href, item.id)}
              layoutId="activeNavTab"
              useAsAnchor={true}
              containerStyle={{ 
                marginBottom: '0',
                width: 'auto'
              }}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;