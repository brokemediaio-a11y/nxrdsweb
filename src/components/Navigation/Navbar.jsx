import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useLenisContext } from '../../contexts/LenisContext';
import SelectionItems from '../UI/SelectionItems';
import Button from '../UI/Button';

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

    // Force navbar to stay fixed - prevent any transforms or position changes
    const enforceFixedPosition = () => {
      if (navRef.current) {
        const nav = navRef.current;
        // Check if html/body have transforms that break fixed positioning
        const htmlStyle = window.getComputedStyle(document.documentElement);
        const bodyStyle = window.getComputedStyle(document.body);
        
        // Force fixed position and reset any transforms
        nav.style.position = 'fixed';
        nav.style.top = '0';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.zIndex = '999999';
        nav.style.transform = 'translate3d(0, 0, 0)';
        nav.style.WebkitTransform = 'translate3d(0, 0, 0)';
        nav.style.visibility = 'visible';
        nav.style.opacity = '1';
        nav.style.display = 'block';
        
        // Debug: Log if html/body have transforms (these would break fixed)
        if (htmlStyle.transform !== 'none' || bodyStyle.transform !== 'none') {
          console.warn('WARNING: html or body has transform! This breaks position:fixed', {
            htmlTransform: htmlStyle.transform,
            bodyTransform: bodyStyle.transform
          });
        }
      }
    };

    // Initialize on mount
    handleResize();
    handleScroll();
    updateNavHeight();
    enforceFixedPosition();
    
    // Update height after a small delay to ensure render
    const heightTimer = setTimeout(() => {
      updateNavHeight();
      enforceFixedPosition();
    }, 100);
    
    // Wait for portal to render before setting up observer
    const setupObserver = () => {
      if (navRef.current) {
        // MutationObserver to detect and prevent any style changes to position/transform
        const observer = new MutationObserver((mutations) => {
          if (navRef.current) {
            const computed = window.getComputedStyle(navRef.current);
            // If position is not fixed, force it back
            if (computed.position !== 'fixed') {
              enforceFixedPosition();
            }
          }
        });
        
        observer.observe(navRef.current, {
          attributes: true,
          attributeFilter: ['style', 'class'],
          childList: false,
          subtree: false
        });
        
        return observer;
      }
      return null;
    };
    
    // Delay observer setup to allow portal to render
    const observerTimeout = setTimeout(() => {
      const observer = setupObserver();
      if (observer) {
        // Store in cleanup
        return () => observer.disconnect();
      }
    }, 200);
    
    // Continuous enforcement as backup - check every second
    const enforceInterval = setInterval(enforceFixedPosition, 1000);
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(heightTimer);
      clearTimeout(observerTimeout);
      clearInterval(enforceInterval);
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
      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const element = document.querySelector(href);
      if (element) {
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(element, { duration: 1.2, offset: -80 });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Navbar content to be rendered
  const navbarContent = (
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
        opacity: 1,
        display: 'block',
        margin: 0
      }}
    >
      <div className="container" style={{ 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: isMobile ? '0 12px' : '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'space-between' : 'space-between',
        width: '100%',
        position: 'relative',
        gap: isMobile ? '8px' : '0',
        flexWrap: 'nowrap'
      }}>
        {/* Logo - Left side */}
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
            zIndex: 1001,
            flex: isMobile ? '0 0 auto' : '0 0 auto'
          }}
        >
          <img src="/complete%20logowithout%20background.png" alt="NEXORDIS" style={{ 
            height: isMobile ? '38px' : '50px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 18px rgba(236,72,153,.55))',
            transition: 'all 0.3s ease'
          }} />
        </a>

        {/* Navigation - Centered on desktop, right-aligned on mobile */}
        <div className="navbar-collapse" style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : 'center',
          gap: '0',
          position: isMobile ? 'relative' : 'absolute',
          left: isMobile ? 'auto' : '50%',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          width: 'auto',
          flex: isMobile ? '1 1 auto' : 'none',
          minWidth: 0,
          zIndex: 1000
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

        {/* Get in touch button - Right side (Desktop only) */}
        {!isMobile && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexShrink: 0,
            zIndex: 1001,
            marginLeft: 'auto'
          }}>
            <Button
              variant="primary"
              size="md"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contact', 'Contact');
              }}
            >
              Get in touch
            </Button>
          </div>
        )}
      </div>
    </nav>
  );

  // Ensure portal target exists
  const portalTarget = typeof window !== 'undefined' && document.body ? document.body : null;

  return (
    <>
      {/* Portal navbar directly to document.body - completely outside React tree and Lenis control */}
      {portalTarget 
        ? createPortal(navbarContent, portalTarget)
        : navbarContent
      }
      {/* Spacer to prevent content from going under fixed navbar - stays in normal flow */}
      <div style={{ height: `${navHeight}px`, width: '100%' }} />
    </>
  );
};

export default Navbar;