import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Cpu, Brain, Rocket, Code2, Target } from 'lucide-react';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const roadmap = [
    {
      phase: 'Phase 1',
      title: 'Python & Data',
      description: 'Mastered Python programming and data manipulation',
      icon: Code2,
      accent: 'rgba(148,163,184,0.8)',
    },
    {
      phase: 'Phase 2',
      title: 'Machine Learning',
      description: 'Built predictive models using scikit-learn',
      icon: Cpu,
      accent: 'rgba(148,163,184,0.8)',
    },
    {
      phase: 'Phase 3',
      title: 'Deep Learning & GenAI',
      description: 'Explored neural networks and generative AI',
      icon: Brain,
      accent: 'rgba(148,163,184,0.8)',
    },
    {
      phase: 'Phase 4',
      title: 'AI Engineering',
      description: 'Deployed production-ready AI systems',
      icon: Rocket,
      accent: 'rgba(148,163,184,0.8)',
    },
    {
      phase: 'Phase 5',
      title: 'AI Systems Architect',
      description: 'Designing scalable intelligent systems',
      icon: Target,
      accent: 'rgba(148,163,184,0.8)',
    },
  ];

  return (
    <section id="about" ref={ref} className="relative py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-4">
            About Me
          </p>
          <h2
            className="text-[36px] sm:text-[44px] lg:text-[50px] font-semibold tracking-[-0.03em] text-white leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AI Engineering
            <br />
            <span className="text-white/40">Journey</span>
          </h2>
          <p className="text-[16px] text-white/50 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-text)' }}>
            Transforming from a Python enthusiast to an AI systems architect,
            building intelligent solutions that shape the future of technology.
          </p>
        </motion.div>

        {/* Roadmap */}
        <div className="relative">
          {/* Timeline line — desktop only */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.04] via-white/[0.08] to-white/[0.04] hidden lg:block" />

          <div className="space-y-8">
            {roadmap.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div
                    className="group p-5 sm:p-6 rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300"
                    style={{ background: 'rgba(255,255,255,0.025)' }}
                  >
                    <div className={`flex items-center gap-2 mb-3 ${index % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'}`}>
                      <div className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                        <item.icon className="w-3.5 h-3.5 text-white/50" />
                      </div>
                      <span className="text-[11px] font-semibold tracking-wide uppercase text-white/30">
                        {item.phase}
                      </span>
                    </div>
                    <h3
                      className="text-[18px] font-semibold text-white/90 mb-1.5 tracking-[-0.02em]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-white/45 leading-relaxed" style={{ fontFamily: 'var(--font-text)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden lg:flex relative z-20 w-8 h-8 items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 bg-white/20 rounded-full border border-white/30" />
                </div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vision block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div
            className="p-7 sm:p-8 rounded-2xl border border-white/[0.07]"
            style={{ background: 'rgba(255,255,255,0.025)' }}
          >
            <h3
              className="text-[20px] font-semibold text-white/90 mb-3 tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vision
            </h3>
            <p className="text-[15px] text-white/50 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-text)' }}>
              Building the next generation of AI systems that are scalable, intelligent,
              and transformative. From machine learning to production deployment,
              creating solutions that make a real-world impact.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
