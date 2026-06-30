import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { GitCommit, FolderGit2, Flame } from 'lucide-react';

const GH_USER = 'Akshat19G';

type Stats = {
  commits: number | null;
  repos: number | null;
  activeDays: number | null;
};

export default function Analytics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [chartKey] = useState(() => Date.now());
  const [stats, setStats] = useState<Stats>({ commits: null, repos: null, activeDays: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [userRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GH_USER}`),
          fetch(`https://github-contributions-api.deno.dev/${GH_USER}.json`),
        ]);

        const user = userRes.ok ? await userRes.json() : null;
        const contrib = contribRes.ok ? await contribRes.json() : null;

        let activeDays: number | null = null;
        let commits: number | null = null;

        if (contrib?.contributions) {
          const days = (contrib.contributions as Array<Array<{ contributionCount: number }>>)
            .flat();
          activeDays = days.filter((d) => d.contributionCount > 0).length;
          commits = days.reduce((sum, d) => sum + (d.contributionCount || 0), 0);
        }
        if (typeof contrib?.totalContributions === 'number') {
          commits = contrib.totalContributions;
        }

        if (!cancelled) {
          setStats({
            commits,
            repos: typeof user?.public_repos === 'number' ? user.public_repos : null,
            activeDays,
          });
        }
      } catch (err) {
        console.error('GitHub stats fetch failed', err);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    { label: 'Total Commits', value: stats.commits, icon: GitCommit },
    { label: 'Total Repos', value: stats.repos, icon: FolderGit2 },
    { label: 'Active Days', value: stats.activeDays, icon: Flame },
  ];

  return (
    <section id="analytics" ref={ref} className="relative py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-4">
            Developer
          </p>
          <h2
            className="text-[36px] sm:text-[44px] lg:text-[50px] font-semibold tracking-[-0.03em] text-white leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Contribution
            <br />
            <span className="text-white/40">Activity</span>
          </h2>
          <p className="text-[16px] text-white/50 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-text)' }}>
            Live GitHub contribution graph — updated in real time from @{GH_USER}
          </p>
        </motion.div>

        {/* Live stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-2xl border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.025)' }}
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center mb-4">
                <c.icon className="w-4 h-4 text-white/45" />
              </div>
              <div
                className="text-[24px] sm:text-[28px] font-semibold text-white/90 mb-1 tracking-tight tabular-nums"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {c.value === null ? '—' : c.value.toLocaleString()}
              </div>
              <div className="text-[12px] text-white/40" style={{ fontFamily: 'var(--font-text)' }}>
                {c.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contribution graph */}
        <motion.a
          href={`https://github.com/${GH_USER}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="block p-6 sm:p-8 rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300"
          style={{ background: 'rgba(255,255,255,0.025)' }}
        >
          <div className="overflow-x-auto">
            <img
              src={`https://ghchart.rshah.org/3b82f6/${GH_USER}?_=${chartKey}`}
              alt={`${GH_USER} GitHub contributions`}
              loading="lazy"
              className="w-full min-w-[640px] h-auto"
            />
          </div>
        </motion.a>
      </div>
    </section>
  );
}
