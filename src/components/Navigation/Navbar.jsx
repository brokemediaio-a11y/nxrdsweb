import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
    };

    // Initialize on mount
    handleResize();
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#work' },
    { name: 'Portfolio', href: '#clients' },
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
      <nav className="navbar navbar-expand-lg sticky-top" style={{ 
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: isScrolled ? '8px' : '10px', 
        paddingBottom: isScrolled ? '8px' : '10px',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        backgroundColor: isScrolled ? 'rgba(5,5,6,.45)' : 'rgba(5,5,6,.35)',
        borderBottom: '1px solid rgba(255,255,255,.06)'
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
              flexShrink: 0
            }}
          >
            <img src="/logo.png" alt="NEXORDIS" style={{ 
              height: isMobile ? '50px' : '70px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(138,43,226,.4))',
              transition: 'all 0.3s ease'
            }} />
          </a>

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
              gap: isMobile ? '4px' : '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: isMobile ? '3px' : '4px',
              borderRadius: '999px',
              flexDirection: 'row',
              width: 'auto',
              flexWrap: 'nowrap',
              alignItems: 'center',
              overflowX: 'auto',
              overflowY: 'hidden',
              WebkitOverflowScrolling: 'touch',
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
                    padding: isMobile ? '6px 12px' : '8px 18px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: isMobile ? '11px' : '14px',
                    fontFamily: "'Lemon Milk', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                    visibility: 'visible',
                    opacity: 1,
                    display: 'block',
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
        </div>
      </nav>
    </>
  );
};

export default Navbar;