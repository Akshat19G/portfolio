import { motion } from 'motion/react';
import { Github, FileText, Mail, Linkedin, Twitter, ArrowDown } from 'lucide-react';
import AIRobot from './AIRobot';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGithubClick = () => {
    window.open('https://github.com/Akshat19G', '_blank');
  };

  const handleResumeClick = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Akshat_Srivastava_Resume.pdf';
    link.click();
  };

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/akshat-srivastava-300455308/', '_blank');
  };

  const handleTwitterClick = () => {
    window.open('https://x.com/Akii0019', '_blank');
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-[60px] px-5 sm:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">

        {/* Left column */}
        <div className="space-y-7">

          {/* Profile image — clean Apple-style portrait */}
          <motion.div
            {...fadeUp(0.1)}
            className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto lg:mx-0"
          >
            <div
              className="relative w-full h-full rounded-full overflow-hidden"
              style={{
                boxShadow: '0 0 0 1px rgba(255,255,255,0.12), 0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              <img
                src="/portfolio_Image.jpeg"
                alt="Akshat Srivastava"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div {...fadeUp(0.15)}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-white/60 border border-white/[0.1] bg-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
              AI Systems Engineer
            </span>
          </motion.div>

          {/* Name + title */}
          <motion.div {...fadeUp(0.2)} className="space-y-2">
            <h1
              className="text-[44px] sm:text-[52px] lg:text-[58px] font-semibold leading-[1.05] tracking-[-0.03em] text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Akshat Srivastava
            </h1>
            <div className="space-y-1">
              <p
                className="text-[20px] sm:text-[22px] font-medium text-white/80 tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Machine Learning Engineer
              </p>
              <p
                className="text-[16px] text-white/40 tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-text)' }}
              >
                AI Systems Builder
              </p>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.28)} className="flex flex-wrap gap-2.5 pt-1">
            {/* Primary CTA */}
            <button
              onClick={() => scrollToSection('projects')}
              className="px-5 py-2.5 text-[13px] font-medium text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Explore Projects
            </button>

            <button
              onClick={handleGithubClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/70 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:text-white/90 transition-all duration-200 active:scale-[0.98]"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </button>

            <button
              onClick={handleLinkedInClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/70 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:text-white/90 transition-all duration-200 active:scale-[0.98]"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedIn
            </button>

            <button
              onClick={handleTwitterClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/70 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:text-white/90 transition-all duration-200 active:scale-[0.98]"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <Twitter className="w-3.5 h-3.5" />
              Twitter
            </button>

            <button
              onClick={handleResumeClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/70 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:text-white/90 transition-all duration-200 active:scale-[0.98]"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <FileText className="w-3.5 h-3.5" />
              Resume
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/70 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:text-white/90 transition-all duration-200 active:scale-[0.98]"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
            </button>
          </motion.div>

          {/* Tech stack pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex items-center flex-wrap gap-2 pt-2"
          >
            {['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn'].map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
                className="text-[11px] text-white/30 font-mono tracking-wide"
              >
                {tech}{i < 3 ? <span className="ml-2 text-white/15">·</span> : null}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right column — AI Robot */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          <AIRobot />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25 hover:text-white/50 transition-colors duration-200"
      >
        <span className="text-[11px] font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
}
