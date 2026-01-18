import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLenisContext } from '../../contexts/LenisContext';
import SelectionItems from '../UI/SelectionItems';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [navHeight, setNavHeight] = useState(0);
  const navRef = useRef(null);
  const lenis = useLenisContext();

  useEffect(() => {
    // Calculate navbar height
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      updateNavHeight();
    };

    // Initialize on mount
    handleResize();
    handleScroll();
    updateNavHeight();
    
    // Update height after a small delay to ensure render
    const heightTimer = setTimeout(updateNavHeight, 100);
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(heightTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isScrolled, isMobile]);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav 
        ref={navRef}
        className="navbar navbar-expand-lg sticky-navbar" 
        data-lenis-prevent
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          paddingTop: isScrolled ? '8px' : '10px', 
          paddingBottom: isScrolled ? '8px' : '10px',
          transition: 'all 0.3s ease',
          zIndex: 999999,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          backgroundColor: isScrolled ? 'rgba(5,5,6,.85)' : 'rgba(5,5,6,.75)',
          borderBottom: '1px solid rgba(255,255,255,.06)',
          boxSizing: 'border-box',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          pointerEvents: 'auto',
          visibility: 'visible',
          opacity: 1
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
      {/* Spacer to prevent content from going under fixed navbar */}
      <div style={{ height: `${navHeight}px`, width: '100%' }} />
    </>
  );
};

export default Navbar;