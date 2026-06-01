import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export default function AIRobot() {
  const robotRef = useRef<HTMLDivElement>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [headRotation, setHeadRotation] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!robotRef.current) return;

      const rect = robotRef.current.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - robotCenterX;
      const deltaY = e.clientY - robotCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 20, 6);

      setEyePosition({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });

      setHeadRotation({
        x: (deltaY / window.innerHeight) * 6,
        y: (deltaX / window.innerWidth) * 6,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3500 + Math.random() * 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, []);

  return (
    <motion.div
      ref={robotRef}
      className="relative w-64 h-80 lg:w-80 lg:h-96"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: headRotation.x,
        rotateY: headRotation.y,
      }}
    >
      {/* Robot body */}
      <div className="absolute inset-0 bg-[#111111] rounded-3xl border border-white/[0.08]" style={{ boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3)' }}>
        {/* Subtle inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent rounded-3xl" />

        {/* Robot head area */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 lg:w-40 lg:h-40">
          <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border border-white/[0.1]" style={{ boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.04)' }}>
            {/* Eyes container */}
            <div className="absolute inset-3 bg-[#0d0d0d] rounded-full flex items-center justify-around px-5">
              {/* Left eye */}
              <div className="relative w-8 h-11 lg:w-10 lg:h-13 bg-[#050505] rounded-full border border-white/[0.06] overflow-hidden">
                <motion.div
                  className="absolute top-1/2 left-1/2 w-6 h-6 lg:w-7 lg:h-7 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    x: eyePosition.x,
                    y: eyePosition.y,
                    scaleY: isBlinking ? 0.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-300 to-slate-500">
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/70" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white/30" />
                  </div>
                </motion.div>
              </div>

              {/* Right eye */}
              <div className="relative w-8 h-11 lg:w-10 lg:h-13 bg-[#050505] rounded-full border border-white/[0.06] overflow-hidden">
                <motion.div
                  className="absolute top-1/2 left-1/2 w-6 h-6 lg:w-7 lg:h-7 -translate-x-1/2 -translate-y-1/2"
                  animate={{
                    x: eyePosition.x,
                    y: eyePosition.y,
                    scaleY: isBlinking ? 0.05 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-300 to-slate-500">
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white/70" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white/30" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Status panel */}
        <div className="absolute top-44 lg:top-56 left-1/2 -translate-x-1/2 w-40 h-28 lg:w-48 lg:h-32 bg-[#0d0d0d] rounded-2xl border border-white/[0.07]">
          <div className="absolute inset-1.5 bg-[#0a0a0a] rounded-xl flex flex-col items-center justify-center gap-2">
            <motion.div
              className="text-white/50 text-[10px] lg:text-xs font-mono tracking-widest"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              AI SYSTEMS ONLINE
            </motion.div>
            {/* Status dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/30"
                  animate={{ opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.35 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Side details */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-14 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              top: `${40 + i * 15}%`,
              left: i % 2 === 0 ? '10%' : '75%',
            }}
          />
        ))}
      </div>

      {/* Floating data panels */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-28 h-20 border border-white/[0.07] rounded-xl bg-white/[0.02] backdrop-blur-sm"
          style={{
            top: `${25 + i * 20}%`,
            right: i % 2 === 0 ? '-7rem' : '-8.5rem',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.7, x: 0 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="p-2 text-[8px] font-mono text-white/30">
            <div className="mb-1.5">SYS_{i + 1}: ACTIVE</div>
            <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/20 rounded-full"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
