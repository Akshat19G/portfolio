import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useEffect, useState, useRef, useCallback } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

// Easing curves — Apple/Linear-grade
const EASE_OUT_EXPO  = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_QUINT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT    = [0.37, 0, 0.63, 1] as const;

// Circumference of the SVG progress ring
const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// ─── Ambient orb ────────────────────────────────────────────────────────────
function AmbientOrb({
  size, x, y, delay, duration, opacity,
}: {
  size: number; x: string; y: string;
  delay: number; duration: number; opacity: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size,
        left: x, top: y,
        background: 'radial-gradient(circle, rgba(255,255,255,0.055) 0%, transparent 70%)',
        filter: 'blur(40px)',
        translateX: '-50%',
        translateY: '-50%',
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0, opacity, opacity * 0.7, opacity],
        scale:   [0.6, 1, 0.92, 1],
        x: ['0px', '18px', '-12px', '0px'],
        y: ['0px', '-14px', '10px', '0px'],
      }}
      transition={{
        delay,
        duration,
        repeat: Infinity,
        ease: EASE_IN_OUT,
      }}
    />
  );
}

// ─── Animated progress ring ─────────────────────────────────────────────────
function ProgressRing({ progress }: { progress: number }) {
  const rawProgress   = useMotionValue(0);
  const springedValue = useSpring(rawProgress, { stiffness: 80, damping: 22, mass: 0.8 });
  const dashOffset    = useTransform(springedValue, [0, 100], [CIRCUMFERENCE, 0]);

  useEffect(() => { rawProgress.set(progress); }, [progress, rawProgress]);

  return (
    <svg
      width="80" height="80"
      viewBox="0 0 80 80"
      className="absolute"
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Track */}
      <circle
        cx="40" cy="40" r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.5"
      />
      {/* Fill — animated */}
      <motion.circle
        cx="40" cy="40" r={RADIUS}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          strokeDasharray: CIRCUMFERENCE,
          strokeDashoffset: dashOffset,
          filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.25))',
        }}
      />
    </svg>
  );
}

// ─── Horizontal scan line ────────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 80%, transparent)',
      }}
      initial={{ top: '0%', opacity: 0 }}
      animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2.4,
        delay: 0.3,
        ease: EASE_IN_OUT,
        times: [0, 0.08, 0.92, 1],
        repeat: Infinity,
        repeatDelay: 1.6,
      }}
    />
  );
}

// ─── Monogram letter ─────────────────────────────────────────────────────────
function Monogram({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Outer glow halo */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 96, height: 96,
              background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
              filter: 'blur(12px)',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: EASE_IN_OUT }}
          />

          {/* Ring */}
          <ProgressRing progress={0} />

          {/* Monogram */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            style={{ width: 80, height: 80 }}
          >
            <motion.span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 500,
                letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1,
              }}
              initial={{ opacity: 0, scale: 0.82, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: EASE_OUT_EXPO }}
            >
              AS
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Status line ─────────────────────────────────────────────────────────────
const STATUS_MESSAGES = [
  'Initializing',
  'Loading assets',
  'Configuring modules',
  'Almost ready',
  'Complete',
] as const;

function StatusLine({ progress }: { progress: number }) {
  const idx = Math.min(
    Math.floor(progress / 25),
    STATUS_MESSAGES.length - 1,
  );
  const label = STATUS_MESSAGES[idx];

  return (
    <motion.p
      key={label}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.4, ease: EASE_OUT_QUINT }}
      style={{
        fontFamily: 'var(--font-text)',
        fontSize: '11px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.28)',
      }}
    >
      {label}
    </motion.p>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress,   setProgress]   = useState(0);
  const [phase,      setPhase]      = useState<'enter' | 'load' | 'finish'>('enter');
  const [exiting,    setExiting]    = useState(false);
  const doneRef = useRef(false);

  // Drive loading progress with a natural, slightly randomised curve
  const advanceProgress = useCallback(() => {
    setProgress(prev => {
      if (prev >= 100) return 100;
      // Slow near 100 for anticipation
      const remaining = 100 - prev;
      const step = remaining < 10 ? 0.5 : remaining < 25 ? 1.2 : 2.2;
      return Math.min(100, prev + step + Math.random() * 0.8);
    });
  }, []);

  // Phase: enter → load → finish
  useEffect(() => {
    const t = setTimeout(() => setPhase('load'), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== 'load') return;
    const id = setInterval(advanceProgress, 20);
    return () => clearInterval(id);
  }, [phase, advanceProgress]);

  // Trigger exit when progress hits 100
  useEffect(() => {
    if (progress < 100 || doneRef.current) return;
    doneRef.current = true;
    const t = setTimeout(() => {
      setExiting(true);
      // Give the exit animation time to complete
      setTimeout(onLoadingComplete, 800);
    }, 260);
    return () => clearTimeout(t);
  }, [progress, onLoadingComplete]);

  // Respect prefers-reduced-motion
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ background: '#080808' }}
          initial={{ opacity: 1 }}
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.015 }
          }
          transition={{ duration: reduced ? 0.15 : 0.72, ease: EASE_OUT_EXPO }}
        >
          {/* ── Ambient background gradient ────────────────────────────────── */}
          {!reduced && (
            <>
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 55% at 50% 42%, rgba(255,255,255,0.025) 0%, transparent 100%)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 1.4 }}
              />

              {/* Drifting ambient orbs */}
              <AmbientOrb size={420} x="20%"  y="30%"  delay={0.5} duration={8}   opacity={0.7} />
              <AmbientOrb size={320} x="78%"  y="65%"  delay={1.2} duration={10}  opacity={0.5} />
              <AmbientOrb size={260} x="60%"  y="18%"  delay={0.8} duration={9}   opacity={0.4} />
              <AmbientOrb size={200} x="35%"  y="75%"  delay={1.6} duration={7.5} opacity={0.35} />

              {/* Subtle scanline */}
              <ScanLine />
            </>
          )}

          {/* ── Glass card ─────────────────────────────────────────────────── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: EASE_OUT_EXPO }}
            >
              {/* ── Monogram + ring + progress indicator ─────────────────── */}
              <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
                {/* Progress ring — wraps everything */}
                <ProgressRing progress={progress} />

                {/* Monogram letter */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Monogram visible />
                </div>
              </div>

              {/* ── Spacer ───────────────────────────────────────────────── */}
              <div className="mt-9 flex flex-col items-center gap-3">

                {/* Name reveal */}
                <motion.div
                  className="overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: EASE_OUT_QUINT }}
                >
                  <motion.p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13px',
                      fontWeight: 500,
                      letterSpacing: '-0.01em',
                      color: 'rgba(255,255,255,0.55)',
                    }}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 0.52, duration: 0.65, ease: EASE_OUT_EXPO }}
                  >
                    Akshat Srivastava
                  </motion.p>
                </motion.div>

                {/* Role reveal */}
                <motion.div
                  className="overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.6, ease: EASE_OUT_QUINT }}
                >
                  <motion.p
                    style={{
                      fontFamily: 'var(--font-text)',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.22)',
                    }}
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 0.67, duration: 0.65, ease: EASE_OUT_EXPO }}
                  >
                    Machine Learning Engineer
                  </motion.p>
                </motion.div>

                {/* Hairline divider */}
                <motion.div
                  style={{
                    width: 1,
                    height: 20,
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)',
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: 0.85, duration: 0.5, ease: EASE_OUT_QUINT }}
                />

                {/* Status text */}
                <AnimatePresence mode="wait">
                  <StatusLine key={Math.floor(progress / 25)} progress={progress} />
                </AnimatePresence>

                {/* Progress percentage — monospaced, minimal */}
                <motion.p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.18)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: progress > 0 ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {String(Math.round(progress)).padStart(3, '0')}
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* ── Corner marks — ultra-subtle ────────────────────────────────── */}
          {!reduced && (
            <>
              {[
                { style: { top: 20, left: 20,  borderTop: '1px solid rgba(255,255,255,0.07)', borderLeft: '1px solid rgba(255,255,255,0.07)' }},
                { style: { top: 20, right: 20, borderTop: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)' }},
                { style: { bottom: 20, left: 20,  borderBottom: '1px solid rgba(255,255,255,0.07)', borderLeft: '1px solid rgba(255,255,255,0.07)' }},
                { style: { bottom: 20, right: 20, borderBottom: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)' }},
              ].map((corner, i) => (
                <motion.div
                  key={i}
                  className="absolute w-5 h-5 pointer-events-none"
                  style={corner.style}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: EASE_OUT_EXPO }}
                />
              ))}
            </>
          )}

          {/* ── Bottom version tag ─────────────────────────────────────────── */}
          <motion.div
            className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.12)',
              }}
            >
              Portfolio&nbsp;·&nbsp;v2025
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
