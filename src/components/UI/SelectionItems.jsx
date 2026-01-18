import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * SelectionItems - A reusable component for selection tabs/items with glass morphism design
 * Can be used in navbar, services section, or any other selection interface
 * 
 * @param {Array} items - Array of items with { id, label, href?, onClick? }
 * @param {string} activeId - Currently active item ID
 * @param {Function} onItemClick - Callback when item is clicked (item) => void
 * @param {string} layoutId - Unique layoutId for animations (should be unique per instance)
 * @param {Object} containerStyle - Additional styles for the outer container
 * @param {Object} innerStyle - Additional styles for the inner wrapper (tabs container)
 * @param {Object} itemStyle - Additional styles for each item
 * @param {boolean} useAsAnchor - If true, renders as anchor tags, otherwise buttons
 * @param {string} className - Additional className for the wrapper
 */
const SelectionItems = ({
  items = [],
  activeId = null,
  onItemClick = () => {},
  layoutId = 'activeTab',
  containerStyle = {},
  innerStyle = {},
  itemStyle = {},
  useAsAnchor = false,
  className = ''
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleClick = (e, item) => {
    if (useAsAnchor && item.href) {
      e.preventDefault();
    }
    onItemClick(item);
  };

  return (
    <div 
      className={className}
      style={{ 
        marginBottom: '0',
        width: '100%',
        ...containerStyle
      }}
    >
      <style>
        {`
          .selection-items-wrapper::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      {/* Background container - fixed width, doesn't scroll */}
      <div 
        className="selection-items-wrapper"
        role={useAsAnchor ? "navigation" : "tablist"}
        style={{ 
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '999px',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
          position: 'relative',
          flexWrap: 'nowrap',
          width: 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          margin: 0,
          // Default values - can be overridden by innerStyle
          gap: isMobile ? '4px' : '6px',
          padding: isMobile ? '3px' : '4px',
          paddingTop: isMobile ? '10px' : '0px',
          // innerStyle MUST be last to override defaults
          ...innerStyle
        }}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          const Component = useAsAnchor ? motion.a : motion.button;
          
          const baseProps = {
            key: item.id,
            onClick: (e) => handleClick(e, item),
            style: {
              position: 'relative',
              border: 'none',
              background: 'transparent',
              textDecoration: useAsAnchor ? 'none' : 'none',
              color: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
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
              flexShrink: 0,
              margin: 0,
              // Default values - can be overridden by itemStyle
              padding: isMobile ? '6px 12px' : '8px 18px',
              // itemStyle MUST be last to override defaults
              ...itemStyle
            },
            whileHover: { color: 'rgba(255, 255, 255, 0.95)' }
          };

          if (useAsAnchor && item.href) {
            baseProps.href = item.href;
          }

          return (
            <Component {...baseProps}>
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  className="active-tab-bg"
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
              {/* Hover glass effect */}
              <motion.div
                layoutId={!isActive ? `hoverTab-${layoutId}` : undefined}
                className={`tab-hover-glass ${isActive ? 'active-tab-hover' : ''}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  zIndex: isActive ? -2 : -1,
                  pointerEvents: 'none',
                  opacity: 0
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
              <span style={{ 
                position: 'relative', 
                zIndex: 2
              }}>
                {item.label}
              </span>
            </Component>
          );
        })}
      </div>
    </div>
  );
};

export default SelectionItems;