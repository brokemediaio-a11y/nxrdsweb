import { cn } from '../../lib/utils';
import { useEffect, useRef } from 'react';

/**
 * Marquee component for scrolling animations
 * Each instance creates an independent scrolling animation
 * Based on Option A fix from TESTIMONIAL_FIX_GUIDE.md
 */
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = '40s',
  uniqueId = Math.random().toString(36).substring(2, 9),
  ...props
}) {
  const containerRef = useRef(null);
  const animationName = `marquee-${vertical ? 'v' : 'h'}-${uniqueId}`;

  useEffect(() => {
    // Create unique keyframe animation for this instance
    // Using -50% for seamless loop (as per Option A guide)
    const keyframes = vertical
      ? `@keyframes ${animationName} {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }`
      : `@keyframes ${animationName} {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }`;

    // Check if style already exists to avoid duplicates
    const existingStyle = document.getElementById(`marquee-style-${animationName}`);
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleSheet = document.createElement('style');
    styleSheet.id = `marquee-style-${animationName}`;
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    return () => {
      // Cleanup: remove the style element when component unmounts
      const styleToRemove = document.getElementById(`marquee-style-${animationName}`);
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, [animationName, vertical]);

  // Duplicate children for seamless loop (as per Option A guide)
  // Handle both single child and array of children
  const childrenArray = Array.isArray(children) ? children : [children];
  const duplicatedChildren = Array(repeat).fill(0).flatMap(() => childrenArray);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        'group flex [--gap:0.75rem]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
      style={{
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        isolation: 'isolate',
      }}
    >
      <div
        className={cn('flex shrink-0', {
          'flex-row': !vertical,
          'flex-col': vertical,
          'group-hover:[animation-play-state:paused]': pauseOnHover,
        })}
        style={{
          gap: 'var(--gap)',
          animation: `${animationName} ${duration} linear infinite ${reverse ? 'reverse' : 'normal'}`,
          willChange: 'transform',
        }}
      >
        {duplicatedChildren}
        {duplicatedChildren}
      </div>
    </div>
  );
}
