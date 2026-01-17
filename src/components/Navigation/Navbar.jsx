import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [isVisible, setIsVisible] = useState(true);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const heroSection = document.querySelector('.hero');
          const heroHeight = heroSection ? heroSection.offsetHeight : 600;
          
          setIsScrolled(currentScrollY > 50);
          
          // Hide navbar when scrolling down within hero section, show when scrolling up or past hero
          if (currentScrollY < lastScrollY) {
            // Scrolling up - always show navbar
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY < heroHeight) {
            // Scrolling down within hero section - hide navbar
            setIsVisible(false);
          } else if (currentScrollY >= heroHeight) {
            // Past hero section - show navbar
            setIsVisible(true);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsMenuOpen(false);
      }
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
    handleScroll();
    calculateScrollbarWidth();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      handleResize();
      calculateScrollbarWidth();
    });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Capabilities', href: '#work' },
    { name: 'Portfolio', href: '#clients' },
    { name: 'Client Speak', href: '#clients' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href, name) => {
    setActiveLink(name);
    setIsMenuOpen(false);
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
      <nav className="navbar navbar-expand-lg sticky-top" style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: scrollbarWidth > 0 ? `calc(100vw - ${scrollbarWidth}px)` : '100vw',
        paddingTop: isScrolled ? '16px' : '20px', 
        paddingBottom: isScrolled ? '16px' : '20px',
        transition: 'transform 0.3s ease, opacity 0.3s ease, width 0.3s ease',
        zIndex: 1000,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        backgroundColor: isScrolled ? 'rgba(5,5,6,.25)' : 'rgba(5,5,6,.2)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        boxSizing: 'border-box'
      }}>
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

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 1001,
                transition: 'all 0.3s ease'
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                width: '20px',
                height: '2px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }} />
              <span style={{
                width: '20px',
                height: '2px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                opacity: isMenuOpen ? 0 : 1
              }} />
              <span style={{
                width: '20px',
                height: '2px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }} />
            </button>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
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
              <div style={{ 
                display: 'flex',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '4px',
                borderRadius: '999px',
                flexDirection: 'row',
                width: 'auto',
                flexWrap: 'nowrap',
                alignItems: 'center',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
              }}>
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href, link.name);
                    }}
                    style={{
                      position: 'relative',
                      textDecoration: 'none',
                      color: activeLink === link.name ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
                      padding: '8px 18px',
                      borderRadius: '999px',
                      fontWeight: 600,
                      fontSize: '14px',
                      fontFamily: "'Lemon Milk', sans-serif",
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      zIndex: 1,
                      whiteSpace: 'nowrap',
                      flexShrink: 0
                    }}
                    whileHover={{ 
                      color: 'rgba(255, 255, 255, 0.95)'
                    }}
                  >
                    {activeLink === link.name && (
                      <motion.div
                        layoutId="activeTab"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backdropFilter: 'blur(14px)',
                          WebkitBackdropFilter: 'blur(14px)',
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderRadius: '999px',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
                          zIndex: -1
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 2 }}>
                      {link.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobile && isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed',
                  top: isScrolled ? '64px' : '72px',
                  left: 0,
                  right: 0,
                  background: 'rgba(5, 5, 6, 0.98)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px 16px',
                  overflow: 'hidden',
                  zIndex: 999,
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {navLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        scrollToSection(link.href, link.name);
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navLinks.indexOf(link) * 0.05 }}
                      style={{
                        textDecoration: 'none',
                        color: activeLink === link.name ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
                        padding: '14px 16px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '15px',
                        fontFamily: "'Lemon Milk', sans-serif",
                        background: activeLink === link.name ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        transition: 'all 0.3s ease',
                        border: '1px solid transparent',
                        minHeight: '48px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      whileHover={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(236, 72, 153, 0.3)',
                        x: 4
                      }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </>
  );
};

export default Navbar;