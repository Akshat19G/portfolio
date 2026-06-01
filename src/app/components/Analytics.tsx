import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Github, TrendingUp, Star, GitCommit, Code } from 'lucide-react';

export default function Analytics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const githubStats = [
    { label: 'Public Repos', value: '20+', icon: Code },
    { label: 'Total Commits', value: '300+', icon: GitCommit },
    { label: 'Stars Earned', value: '15+', icon: Star },
    { label: 'Active Projects', value: '10+', icon: TrendingUp },
  ];

  return (
    <section id="analytics" ref={ref} className="relative py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-4">
            Analytics
          </p>
          <h2
            className="text-[36px] sm:text-[44px] lg:text-[50px] font-semibold tracking-[-0.03em] text-white leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Developer
            <br />
            <span className="text-white/40">Activity</span>
          </h2>
          <p className="text-[16px] text-white/50 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-text)' }}>
            Tracking progress and contributions on GitHub
          </p>
        </motion.div>

        {/* GitHub Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center gap-2.5 mb-8"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <Github className="w-4 h-4 text-white/50" />
          </div>
          <h3
            className="text-[18px] font-semibold text-white/80 tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            GitHub Statistics
          </h3>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {githubStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div
                className="p-5 rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center mb-4">
                  <stat.icon className="w-4 h-4 text-white/45" />
                </div>
                <div
                  className="text-[28px] font-semibold text-white/90 mb-1 tracking-tight tabular-nums"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </div>
                <div className="text-[12px] text-white/40" style={{ fontFamily: 'var(--font-text)' }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <a
            href="https://github.com/Akshat19G"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/60 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:text-white/85 transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            View Full GitHub Profile
          </a>
        </motion.div>
      </div>
    </section>
  );
}
