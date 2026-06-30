import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Code2, Database, GitBranch, Brain, Layers, Workflow } from 'lucide-react';

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const skills = [
    {
      name: 'Python',
      icon: Code2,
      level: 95,
      description: 'Core language for AI/ML development',
    },
    {
      name: 'Machine Learning',
      icon: Brain,
      level: 90,
      description: 'Building intelligent predictive models',
    },
    {
      name: 'Scikit-learn',
      icon: Layers,
      level: 88,
      description: 'Classical ML algorithms & pipelines',
    },
    {
      name: 'Pandas & NumPy',
      icon: Database,
      level: 92,
      description: 'Data manipulation & analysis',
    },
    {
      name: 'APIs',
      icon: Workflow,
      level: 85,
      description: 'RESTful API development & integration',
    },
    {
      name: 'Git',
      icon: GitBranch,
      level: 87,
      description: 'Version control & collaboration',
    },
  ];

  return (
    <section id="skills" ref={ref} className="relative py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-4">
            Tech Stack
          </p>
          <h2
            className="text-[36px] sm:text-[44px] lg:text-[50px] font-semibold tracking-[-0.03em] text-white leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AI Engineering
            <br />
            <span className="text-white/40">Arsenal</span>
          </h2>
          <p className="text-[16px] text-white/50 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-text)' }}>
            Cutting-edge tools and technologies powering intelligent systems
          </p>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div
                className="p-5 rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <skill.icon className="w-4 h-4 text-white/60" />
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.08 + 0.25 }}
                    className="text-[22px] font-semibold text-white/80 tracking-tight tabular-nums"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {skill.level}%
                  </motion.span>
                </div>

                <h3
                  className="text-[15px] font-semibold text-white/85 mb-1 tracking-[-0.01em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {skill.name}
                </h3>
                <p className="text-[13px] text-white/40 mb-4" style={{ fontFamily: 'var(--font-text)' }}>
                  {skill.description}
                </p>

                {/* Progress bar */}
                <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white/25 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 0.9, delay: index * 0.08 + 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10"
        >
          <p className="text-[14px] text-white/30" style={{ fontFamily: 'var(--font-text)' }}>
            Continuously expanding skillset to build production-ready AI systems
          </p>
        </motion.div>
      </div>
    </section>
  );
}
