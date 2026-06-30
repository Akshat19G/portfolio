import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Lenis from "lenis";
import { Toaster } from "sonner";
import LoadingScreen from "@/components/portfolio/LoadingScreen";
import CustomCursor from "@/components/portfolio/CustomCursor";
import BackgroundEffects from "@/components/portfolio/BackgroundEffects";
import Navigation from "@/components/portfolio/Navigation";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import TechStack from "@/components/portfolio/TechStack";
import Projects from "@/components/portfolio/Projects";
import Analytics from "@/components/portfolio/Analytics";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";
import PortfolioAssistant from "@/components/portfolio/PortfolioAssistant";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Akshat — AI Engineer Portfolio" },
      { name: "description", content: "AI engineer portfolio showcasing production AI projects including Project Netr, resume analyzer, recommendation systems, and computer vision." },
    ],
  }),
  component: Index,
});

function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

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
              @media (pointer: fine) { * { cursor: none !important; } }
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
            <PortfolioAssistant />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgba(20,20,20,0.95)",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  backdropFilter: "blur(20px)",
                  fontSize: "13px",
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
