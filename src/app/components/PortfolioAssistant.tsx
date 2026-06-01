import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

/* ─── Types ─── */
type Phase = 'hidden' | 'entering' | 'waving' | 'speaking' | 'idle' | 'exiting';

/* ─── Constants ─── */
const MESSAGES = [
  "You caught up! 👋",
  "Thanks for exploring my portfolio.",
  "Let's build something amazing together.",
];
const TRIGGER_THRESHOLD = 0.95; // 95 % page scroll

export default function PortfolioAssistant() {
  const [phase, setPhase] = useState<Phase>('hidden');
  const [msgIndex, setMsgIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);

  const hasTriggered = useRef(false);   // once per session
  const wasDismissed = useRef(false);   // user explicitly closed

  /* ── Scroll detection ── */
  const handleScroll = useCallback(() => {
    const scrolled =
      window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

    if (!hasTriggered.current && scrolled >= TRIGGER_THRESHOLD) {
      hasTriggered.current = true;
      setPhase('entering');
    }

    // Auto-hide when user scrolls far back up (< 50 %) AFTER appearing
    if (
      !wasDismissed.current &&
      hasTriggered.current &&
      scrolled < 0.50 &&
      (phase === 'waving' || phase === 'speaking' || phase === 'idle')
    ) {
      setPhase('exiting');
    }
  }, [phase]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── Sequence after entering ── */
  useEffect(() => {
    if (phase !== 'entering') return;

    // After entrance animation completes (~800ms), start wave
    const t1 = setTimeout(() => {
      setPhase('waving');
      setIsWaving(true);
    }, 850);

    return () => clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'waving') return;

    // Wave for 1 s, then start showing messages
    const t1 = setTimeout(() => {
      setIsWaving(false);
      setPhase('speaking');
      setMsgIndex(0);
    }, 1000);

    return () => clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'speaking') return;

    if (msgIndex < MESSAGES.length - 1) {
      const t = setTimeout(() => setMsgIndex((i) => i + 1), 1200);
      return () => clearTimeout(t);
    } else {
      // All messages shown → settle into idle
      const t = setTimeout(() => setPhase('idle'), 1200);
      return () => clearTimeout(t);
    }
  }, [phase, msgIndex]);

  /* ── Natural blinking ── */
  useEffect(() => {
    if (phase === 'hidden' || phase === 'exiting') return;
    const tick = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 130);
    };
    const id = setInterval(tick, 3200 + Math.random() * 2400);
    return () => clearInterval(id);
  }, [phase]);

  /* ── Dismiss handler ── */
  const dismiss = () => {
    wasDismissed.current = true;
    setPhase('exiting');
  };

  /* ── Contact scroll ── */
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    dismiss();
  };

  /* ── Visibility ── */
  const isVisible =
    phase === 'entering' ||
    phase === 'waving' ||
    phase === 'speaking' ||
    phase === 'idle';

  /* ─── Render ─── */
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="assistant-root"
          /* Entrance: slide up + fade from bottom-right */
          initial={{ opacity: 0, y: 60, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.92, transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } }}
          transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-5 sm:right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none"
          style={{ maxWidth: 'min(340px, calc(100vw - 24px))' }}
        >

          {/* ── Particle trail (decorative) ── */}
          <ParticleTrail />

          {/* ── Speech bubble ── */}
          <AnimatePresence mode="wait">
            {(phase === 'speaking' || phase === 'idle') && (
              <motion.div
                key={`msg-${msgIndex}`}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto relative px-4 py-3 rounded-2xl text-[13.5px] leading-snug font-medium text-white/90 select-none"
                style={{
                  background: 'rgba(18, 18, 22, 0.82)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                  fontFamily: 'var(--font-text)',
                  maxWidth: '240px',
                }}
              >
                {MESSAGES[msgIndex]}
                {/* Tail */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-7px',
                    right: '52px',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '7px solid rgba(18,18,22,0.82)',
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CTA button (idle only) ── */}
          <AnimatePresence>
            {phase === 'idle' && (
              <motion.button
                key="cta"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={scrollToContact}
                className="pointer-events-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold text-white/90 transition-all duration-200 hover:text-white active:scale-95"
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  fontFamily: 'var(--font-text)',
                }}
              >
                <span>Contact Me</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 6h7M6.5 3.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── AI figure + close button row ── */}
          <div className="flex items-end gap-2 pointer-events-auto">

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={dismiss}
              aria-label="Dismiss assistant"
              className="mb-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-white/10 text-white/40 hover:text-white/70"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <X size={11} strokeWidth={2.2} />
            </motion.button>

            {/* The AI figure */}
            <AssistantFigure isBlinking={isBlinking} isWaving={isWaving} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   Sub-component: AssistantFigure
   ───────────────────────────────────────────── */
function AssistantFigure({
  isBlinking,
  isWaving,
}: {
  isBlinking: boolean;
  isWaving: boolean;
}) {
  return (
    <div className="relative select-none" style={{ width: 88, height: 108 }}>

      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 72,
          height: 20,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(120,160,255,0.18) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />

      {/* SVG figure */}
      <svg
        viewBox="0 0 88 108"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          {/* Titanium-white body gradient */}
          <linearGradient id="bodyGrad" x1="44" y1="44" x2="44" y2="108" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e8ecf0" />
            <stop offset="55%" stopColor="#c8cdd4" />
            <stop offset="100%" stopColor="#9ea5af" />
          </linearGradient>

          {/* Head gradient */}
          <radialGradient id="headGrad" cx="50%" cy="40%" r="58%">
            <stop offset="0%" stopColor="#f2f4f6" />
            <stop offset="60%" stopColor="#d8dde4" />
            <stop offset="100%" stopColor="#adb4be" />
          </radialGradient>

          {/* Blue iris gradient */}
          <radialGradient id="irisGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#a8c4ff" />
            <stop offset="60%" stopColor="#5588ee" />
            <stop offset="100%" stopColor="#2244aa" />
          </radialGradient>

          {/* Waving arm gradient */}
          <linearGradient id="armGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c8cdd4" />
            <stop offset="100%" stopColor="#e2e6ea" />
          </linearGradient>

          {/* Subtle neck/torso seam */}
          <linearGradient id="torsoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d0d5dc" />
            <stop offset="100%" stopColor="#adb4be" />
          </linearGradient>

          {/* Inner glow filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Torso / body ── */}
        <rect x="20" y="62" width="48" height="42" rx="12" fill="url(#bodyGrad)" />
        {/* Torso highlight */}
        <rect x="20" y="62" width="48" height="14" rx="10" fill="rgba(255,255,255,0.18)" />
        {/* Chest detail lines */}
        <line x1="30" y1="74" x2="58" y2="74" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="33" y1="79" x2="55" y2="79" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" strokeLinecap="round" />
        {/* Core node */}
        <circle cx="44" cy="86" r="5.5" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" />
        <circle cx="44" cy="86" r="2.5" fill="rgba(120,180,255,0.55)" />

        {/* ── Left arm (static) ── */}
        <rect x="8" y="65" width="13" height="30" rx="6.5" fill="url(#torsoGrad)" />
        <ellipse cx="14.5" cy="97" rx="5" ry="5.5" fill="#c0c7d0" />

        {/* ── Right arm (waving) ── */}
        <motion.g
          style={{ originX: '67px', originY: '70px' }}
          animate={
            isWaving
              ? { rotate: [0, -28, 12, -22, 8, -14, 0] }
              : { rotate: 0 }
          }
          transition={
            isWaving
              ? { duration: 0.95, ease: 'easeInOut' }
              : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
          }
        >
          <rect x="67" y="65" width="13" height="30" rx="6.5" fill="url(#torsoGrad)" />
          <ellipse cx="73.5" cy="97" rx="5" ry="5.5" fill="#c0c7d0" />
        </motion.g>

        {/* ── Neck ── */}
        <rect x="36" y="54" width="16" height="12" rx="4" fill="#d2d7de" />

        {/* ── Head ── */}
        <ellipse cx="44" cy="42" rx="22" ry="24" fill="url(#headGrad)" />
        {/* Head rim shadow */}
        <ellipse cx="44" cy="42" rx="22" ry="24" fill="none" stroke="rgba(100,110,130,0.22)" strokeWidth="1" />
        {/* Forehead highlight */}
        <ellipse cx="40" cy="30" rx="12" ry="7" fill="rgba(255,255,255,0.30)" />

        {/* ── Eyes ── */}
        {/* Left eye socket */}
        <ellipse cx="36" cy="42" rx="6.5" ry="7" fill="rgba(30,34,44,0.80)" />
        {/* Left iris */}
        <motion.ellipse
          cx="36"
          cy="42"
          rx="4.5"
          ry={isBlinking ? 0.5 : 5}
          fill="url(#irisGrad)"
          transition={{ duration: 0.12 }}
        />
        {/* Left pupil */}
        {!isBlinking && (
          <ellipse cx="35.5" cy="41.5" rx="2" ry="2.2" fill="rgba(10,14,26,0.95)" />
        )}
        {/* Left specular */}
        {!isBlinking && (
          <ellipse cx="34.8" cy="40.2" rx="1.1" ry="1" fill="rgba(255,255,255,0.85)" />
        )}

        {/* Right eye socket */}
        <ellipse cx="52" cy="42" rx="6.5" ry="7" fill="rgba(30,34,44,0.80)" />
        {/* Right iris */}
        <motion.ellipse
          cx="52"
          cy="42"
          rx="4.5"
          ry={isBlinking ? 0.5 : 5}
          fill="url(#irisGrad)"
          transition={{ duration: 0.12 }}
        />
        {/* Right pupil */}
        {!isBlinking && (
          <ellipse cx="51.5" cy="41.5" rx="2" ry="2.2" fill="rgba(10,14,26,0.95)" />
        )}
        {/* Right specular */}
        {!isBlinking && (
          <ellipse cx="50.8" cy="40.2" rx="1.1" ry="1" fill="rgba(255,255,255,0.85)" />
        )}

        {/* ── Subtle smile ── */}
        <path
          d="M37.5 52.5 Q44 56 50.5 52.5"
          stroke="rgba(80,90,110,0.50)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Ear stubs ── */}
        <ellipse cx="22.5" cy="42" rx="2.5" ry="4" fill="#c8cdd6" />
        <ellipse cx="65.5" cy="42" rx="2.5" ry="4" fill="#c8cdd6" />

        {/* ── Breathing motion on whole figure ── */}
        <motion.rect
          x="0" y="0" width="88" height="108"
          fill="transparent"
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      {/* Blue ambient rim light overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 75% 20%, rgba(100,160,255,0.10) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-component: ParticleTrail
   ───────────────────────────────────────────── */
function ParticleTrail() {
  const particles = [
    { cx: 10, cy: 0,  r: 1.8, delay: 0    },
    { cx: 28, cy: -8, r: 1.2, delay: 0.12 },
    { cx: 46, cy: -3, r: 1.0, delay: 0.22 },
    { cx: 18, cy: -16, r: 0.9, delay: 0.08 },
    { cx: 36, cy: -20, r: 1.4, delay: 0.18 },
    { cx: 6,  cy: -22, r: 0.7, delay: 0.30 },
  ];

  return (
    <svg
      width="60"
      height="28"
      viewBox="0 0 60 28"
      fill="none"
      style={{
        position: 'absolute',
        bottom: 4,
        right: 10,
        pointerEvents: 'none',
        opacity: 0.7,
      }}
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy + 24}
          r={p.r}
          fill="rgba(140,185,255,0.7)"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: [0, 0.8, 0], y: [8, -4, -16] }}
          transition={{
            duration: 1.4,
            delay: p.delay,
            repeat: 3,
            ease: 'easeOut',
          }}
        />
      ))}
    </svg>
  );
}
