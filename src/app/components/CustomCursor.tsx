import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a');
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: isHovering ? 2 : 1,
        opacity: isHovering ? 0.6 : 0.8,
      }}
      transition={{ type: 'spring', stiffness: 600, damping: 32 }}
    >
      <div
        className={`rounded-full transition-all duration-150 ${
          isHovering
            ? 'w-3 h-3 bg-white/40 border border-white/60'
            : 'w-2.5 h-2.5 bg-white/70'
        }`}
      />
    </motion.div>
  );
}
