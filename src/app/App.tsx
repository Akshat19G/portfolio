import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Lenis from 'lenis';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import BackgroundEffects from './components/BackgroundEffects';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Analytics from './components/Analytics';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PortfolioAssistant from './components/PortfolioAssistant';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Loading screen — exits with AnimatePresence so its exit animation runs */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Main site — fades in once loading is done */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            key="main"
            className="relative min-h-screen bg-[#080808] text-white overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <style>{`
              @media (pointer: fine) {
                * { cursor: none !important; }
              }
              html { scroll-behavior: auto; }
            `}</style>

            <CustomCursor />
            <BackgroundEffects />
            <Navigation />

            <main className="relative z-10">
              <Hero />
              <About />
              <TechStack />
              <Projects />
              <Analytics />
              <Contact />
            </main>

            <Footer />

            {/* Easter Egg: Portfolio Completion Assistant */}
            <PortfolioAssistant />

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(20,20,20,0.95)',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(20px)',
                  fontSize: '13px',
                },
              }}
            />

            {/* Vercel Speed Insights */}
            <SpeedInsights />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
