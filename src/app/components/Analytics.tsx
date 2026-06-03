import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState, useCallback } from 'react';
import {
  Github, GitCommit, Activity,
  AlertCircle, RefreshCw, Code, Flame, ArrowUpRight
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface GitHubUser {
  public_repos: number;
  name: string;
  html_url: string;
}

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: {
    commits?: { message: string; sha: string }[];
    action?: string;
    ref?: string;
    ref_type?: string;
    forkee?: { full_name: string };
  };
  created_at: string;
}

interface GitHubStats {
  user: GitHubUser | null;
  recentEvents: GitHubEvent[];
  streakDays: number;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

// ── Cache ──────────────────────────────────────────────────────────────────────
const CACHE_KEY = 'gh_stats_v2_cache';
const CACHE_TTL = 5 * 60 * 1000;

function getCache(): { data: Partial<GitHubStats>; timestamp: number } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch { return null; }
}

function setCache(data: Partial<GitHubStats>) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* silent */ }
}

// ── Hook ───────────────────────────────────────────────────────────────────────
function useGitHubStats(username: string) {
  const [stats, setStats] = useState<GitHubStats>({
    user: null, recentEvents: [],
    streakDays: 0, loading: true, error: null, lastFetched: null,
  });

  const fetchStats = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCache();
      if (cached?.data) {
        setStats(prev => ({ ...prev, ...cached.data, loading: false }));
        return;
      }
    }
    setStats(prev => ({ ...prev, loading: true, error: null }));
    try {
      const headers: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
      const [userRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`, { headers }),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=30`, { headers }),
      ]);
      if (userRes.status === 403 || eventsRes.status === 403) {
        throw new Error('GitHub API rate limit reached. Showing cached data.');
      }
      if (!userRes.ok) throw new Error(`Failed to fetch user: ${userRes.status}`);
      const user: GitHubUser = await userRes.json();
      const events: GitHubEvent[] = eventsRes.ok ? await eventsRes.json() : [];
      const pushDays = new Set(
        events.filter(e => e.type === 'PushEvent').map(e => new Date(e.created_at).toDateString())
      );
      const streakDays = pushDays.size;
      const newData = {
        user, recentEvents: events.slice(0, 8),
        streakDays, lastFetched: new Date(),
      };
      setCache(newData);
      setStats(prev => ({ ...prev, ...newData, loading: false }));
    } catch (err) {
      setStats(prev => ({
        ...prev, loading: false,
        error: err instanceof Error ? err.message : 'Failed to load GitHub data'
      }));
    }
  }, [username]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  return { stats, refresh: () => fetchStats(true) };
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl overflow-hidden relative ${className}`}>
      <div
        className="absolute inset-0 animate-pulse"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
          animation: 'shimmer 1.8s infinite',
        }}
      />
    </div>
  );
}

// ── Contribution Graph ─────────────────────────────────────────────────────────
function ContributionGraph({ events, loading }: { events: GitHubEvent[]; loading: boolean }) {
  const weeks = 26; // 6 months for a premium hero look
  const activityMap: Record<string, number> = {};
  events.forEach(e => {
    const d = new Date(e.created_at).toDateString();
    activityMap[d] = (activityMap[d] || 0) + 1;
  });

  const grid: { date: Date; count: number }[][] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - weeks * 7 + 1);

  for (let w = 0; w < weeks; w++) {
    const week: { date: Date; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + w * 7 + d);
      week.push({ date, count: activityMap[date.toDateString()] || 0 });
    }
    grid.push(week);
  }

  const cellBg = (c: number) => {
    if (c === 0) return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.06)' };
    if (c === 1) return { bg: 'rgba(52,211,153,0.18)', border: 'rgba(52,211,153,0.22)' };
    if (c <= 3) return { bg: 'rgba(52,211,153,0.38)', border: 'rgba(52,211,153,0.35)' };
    if (c <= 5) return { bg: 'rgba(52,211,153,0.58)', border: 'rgba(52,211,153,0.5)' };
    return { bg: 'rgba(52,211,153,0.82)', border: 'rgba(52,211,153,0.7)' };
  };

  // Month labels
  const monthLabels: { label: string; weekIdx: number }[] = [];
  grid.forEach((week, i) => {
    const firstDay = week[0].date;
    if (firstDay.getDate() <= 7) {
      const label = firstDay.toLocaleString('default', { month: 'short' });
      if (!monthLabels.length || monthLabels[monthLabels.length - 1].label !== label) {
        monthLabels.push({ label, weekIdx: i });
      }
    }
  });

  if (loading) {
    return (
      <div className="w-full">
        <div
          className="overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex gap-[3px] min-w-max">
            {Array.from({ length: weeks }).map((_, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, d) => (
                  <div
                    key={d}
                    className="rounded-sm animate-pulse"
                    style={{
                      width: 'clamp(10px, 1.5vw, 14px)',
                      height: 'clamp(10px, 1.5vw, 14px)',
                      background: 'rgba(255,255,255,0.04)',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Month labels */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex gap-[3px] min-w-max mb-1.5">
          {grid.map((_, w) => {
            const ml = monthLabels.find(m => m.weekIdx === w);
            return (
              <div
                key={w}
                style={{
                  width: 'clamp(10px, 1.5vw, 14px)',
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.3)',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  lineHeight: 1,
                  fontFamily: 'var(--font-text)',
                  letterSpacing: '0.04em',
                }}
              >
                {ml ? ml.label : ''}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] min-w-max">
          {grid.map((week, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {week.map((cell, d) => {
                const { bg, border } = cellBg(cell.count);
                return (
                  <motion.div
                    key={d}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: (w * 7 + d) * 0.0015,
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    title={`${cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${cell.count} event${cell.count !== 1 ? 's' : ''}`}
                    className="rounded-sm cursor-default transition-all duration-150 hover:scale-125"
                    style={{
                      width: 'clamp(10px, 1.5vw, 14px)',
                      height: 'clamp(10px, 1.5vw, 14px)',
                      background: bg,
                      border: `1px solid ${border}`,
                      boxShadow: cell.count > 3 ? `0 0 6px ${bg}` : 'none',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4">
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-text)' }}>Less</span>
          {[
            'rgba(255,255,255,0.04)',
            'rgba(52,211,153,0.18)',
            'rgba(52,211,153,0.38)',
            'rgba(52,211,153,0.58)',
            'rgba(52,211,153,0.82)',
          ].map((bg, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: 11,
                height: 11,
                background: bg,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          ))}
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-text)' }}>More</span>
        </div>
      </div>
    </div>
  );
}

// ── Event helpers ──────────────────────────────────────────────────────────────
function getEventInfo(event: GitHubEvent): {
  title: string;
  detail: string | null;
  icon: React.ReactNode;
  accentColor: string;
  glowColor: string;
} {
  const repo = event.repo.name.split('/')[1];
  switch (event.type) {
    case 'PushEvent': {
      const commitMsg = event.payload.commits?.[0]?.message?.split('\n')[0] || '';
      return {
        title: `Pushed to ${repo}`,
        detail: commitMsg || null,
        icon: <GitCommit className="w-3.5 h-3.5" />,
        accentColor: 'rgba(96,165,250,0.85)',
        glowColor: 'rgba(96,165,250,0.12)',
      };
    }
    case 'CreateEvent':
      return {
        title: `Created ${event.payload.ref_type || 'repo'} in ${repo}`,
        detail: event.payload.ref ? `${event.payload.ref}` : null,
        icon: <Code className="w-3.5 h-3.5" />,
        accentColor: 'rgba(52,211,153,0.85)',
        glowColor: 'rgba(52,211,153,0.12)',
      };
    case 'ForkEvent':
      return {
        title: `Forked ${repo}`,
        detail: event.payload.forkee?.full_name || null,
        icon: <GitCommit className="w-3.5 h-3.5" />,
        accentColor: 'rgba(167,139,250,0.85)',
        glowColor: 'rgba(167,139,250,0.12)',
      };
    default:
      return {
        title: `Activity on ${repo}`,
        detail: null,
        icon: <Activity className="w-3.5 h-3.5" />,
        accentColor: 'rgba(255,255,255,0.35)',
        glowColor: 'rgba(255,255,255,0.05)',
      };
  }
}

function timeAgo(ds: string) {
  const diff = Date.now() - new Date(ds).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

// ── Animated Counter ───────────────────────────────────────────────────────────
function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    if (value === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

// ── Stat Pill Component ─────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sublabel,
  accentColor,
  loading,
  delay,
  isInView,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sublabel: string;
  accentColor: string;
  loading: boolean;
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{ background: `radial-gradient(ellipse at top left, ${accentColor}08 0%, transparent 60%)` }}
        />

        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 relative"
          style={{
            background: `${accentColor}12`,
            border: `1px solid ${accentColor}20`,
          }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>

        {/* Value */}
        <div
          className="text-3xl font-semibold tracking-tight mb-1 tabular-nums"
          style={{
            color: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.03em',
          }}
        >
          {loading ? (
            <Skeleton className="w-14 h-8 inline-block" />
          ) : (
            <AnimatedCounter value={value} />
          )}
        </div>

        {/* Label */}
        <div
          className="text-[13px] font-medium mb-0.5"
          style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-text)' }}
        >
          {label}
        </div>

        {/* Sublabel */}
        <div
          className="text-[11px]"
          style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-text)', letterSpacing: '0.01em' }}
        >
          {sublabel}
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-all duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

// ── Activity Feed ──────────────────────────────────────────────────────────────
function ActivityFeed({
  events,
  loading,
  isInView,
}: {
  events: GitHubEvent[];
  loading: boolean;
  isInView: boolean;
}) {
  return (
    <div className="space-y-1">
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 py-3 px-2">
              <Skeleton className="w-7 h-7 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-3/4 h-3" />
                <Skeleton className="w-1/3 h-2.5" />
              </div>
              <Skeleton className="w-10 h-2.5 flex-shrink-0" />
            </div>
          ))
        : events.length === 0
        ? (
          <div className="py-8 text-center">
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', fontFamily: 'var(--font-text)' }}>
              No recent activity
            </p>
          </div>
        )
        : events.map((event, i) => {
          const { title, detail, icon, accentColor, glowColor } = getEventInfo(event);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -12 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8 + i * 0.055, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-start gap-3 py-2.5 px-3 rounded-xl transition-all duration-200"
              style={{ cursor: 'default' }}
            >
              {/* Hover bg */}
              <div
                className="absolute inset-x-0 inset-y-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: glowColor, position: 'absolute' }}
              />

              {/* Icon dot */}
              <div className="relative flex-shrink-0 mt-0.5">
                {/* Connector line for non-last items */}
                {i < events.length - 1 && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full"
                    style={{
                      width: 1,
                      height: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      marginTop: 4,
                    }}
                  />
                )}
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center relative z-10"
                  style={{
                    background: `${accentColor}12`,
                    border: `1px solid ${accentColor}22`,
                  }}
                >
                  <span style={{ color: accentColor }}>{icon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 relative z-10">
                <p
                  className="text-[13px] leading-snug truncate"
                  style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-text)' }}
                >
                  {title}
                </p>
                {detail && (
                  <p
                    className="text-[11px] mt-0.5 truncate italic"
                    style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-text)' }}
                  >
                    "{detail}"
                  </p>
                )}
              </div>

              {/* Timestamp */}
              <span
                className="flex-shrink-0 relative z-10"
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.22)',
                  fontFamily: 'var(--font-text)',
                  marginTop: 2,
                  letterSpacing: '0.02em',
                }}
              >
                {timeAgo(event.created_at)}
              </span>
            </motion.div>
          );
        })
      }
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Analytics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });
  const { stats, refresh } = useGitHubStats('Akshat19G');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <section
      id="analytics"
      ref={ref}
      className="relative py-28 sm:py-36 px-5 sm:px-8"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 500,
          background: 'radial-gradient(ellipse, rgba(52,211,153,0.025) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(96,165,250,0.02) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-4"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-text)' }}
              >
                Developer Activity
              </p>
              <h2
                className="text-[38px] sm:text-[46px] lg:text-[52px] font-semibold leading-[1.05] mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.035em',
                  color: 'rgba(255,255,255,0.95)',
                }}
              >
                Developer<br />
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>Activity</span>
              </h2>
              <p
                className="text-[15px] leading-relaxed max-w-sm"
                style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-text)' }}
              >
                Real-time activity from my GitHub profile
              </p>
            </div>

            <div className="flex items-center gap-3 mt-2">
              {/* Live indicator */}
              {!stats.loading && !stats.error && (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{
                    background: 'rgba(52,211,153,0.06)',
                    border: '1px solid rgba(52,211,153,0.14)',
                  }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(52,211,153,0.7)', fontFamily: 'var(--font-text)' }}>
                    Live
                  </span>
                </div>
              )}

              {/* Refresh */}
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing || stats.loading}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-text)',
                }}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>

          {/* Error banner */}
          {stats.error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(251,146,60,0.06)',
                border: '1px solid rgba(251,146,60,0.15)',
              }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(251,146,60,0.7)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(251,146,60,0.7)', fontFamily: 'var(--font-text)' }}>
                {stats.error}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* ── Contribution Graph — Hero ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
        >
          <div
            className="relative rounded-3xl p-7 sm:p-9 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07)',
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 30% 0%, rgba(52,211,153,0.04) 0%, transparent 60%)',
              }}
            />

            {/* Header row */}
            <div className="flex items-center justify-between mb-7 relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(52,211,153,0.1)',
                    border: '1px solid rgba(52,211,153,0.18)',
                  }}
                >
                  <Activity className="w-4 h-4" style={{ color: 'rgba(52,211,153,0.8)' }} />
                </div>
                <div>
                  <h3
                    className="text-[15px] font-semibold"
                    style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                  >
                    Contribution Graph
                  </h3>
                  <p
                    className="text-[11px]"
                    style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-text)' }}
                  >
                    Last 26 weeks of activity
                  </p>
                </div>
              </div>

              <a
                href="https://github.com/Akshat19G"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 transition-all duration-200"
                style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', fontFamily: 'var(--font-text)' }}
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline group-hover:text-white/60 transition-colors">Akshat19G</span>
                <ArrowUpRight className="w-3 h-3 group-hover:text-white/60 transition-colors" />
              </a>
            </div>

            {/* The graph */}
            <div className="relative z-10">
              <ContributionGraph events={stats.recentEvents} loading={stats.loading} />
            </div>
          </div>
        </motion.div>

        {/* ── Three Stat Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <StatCard
            icon={<Code className="w-4 h-4" />}
            label="Public Repositories"
            value={stats.user?.public_repos ?? 0}
            sublabel="Open source projects"
            accentColor="rgba(96,165,250,0.85)"
            loading={stats.loading}
            delay={0.25}
            isInView={isInView}
          />
          <StatCard
            icon={<Flame className="w-4 h-4" />}
            label="Active Days"
            value={stats.streakDays}
            sublabel="Days with push activity"
            accentColor="rgba(251,146,60,0.85)"
            loading={stats.loading}
            delay={0.32}
            isInView={isInView}
          />
          <StatCard
            icon={<Activity className="w-4 h-4" />}
            label="Recent Events"
            value={stats.recentEvents.length}
            sublabel="From public event feed"
            accentColor="rgba(52,211,153,0.85)"
            loading={stats.loading}
            delay={0.39}
            isInView={isInView}
          />
        </div>

        {/* ── Activity Feed ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="relative rounded-3xl p-7 sm:p-8 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 70% 0%, rgba(96,165,250,0.03) 0%, transparent 60%)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(96,165,250,0.1)',
                    border: '1px solid rgba(96,165,250,0.18)',
                  }}
                >
                  <GitCommit className="w-4 h-4" style={{ color: 'rgba(96,165,250,0.8)' }} />
                </div>
                <div>
                  <h3
                    className="text-[15px] font-semibold"
                    style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
                  >
                    Recent Activity
                  </h3>
                  <p
                    className="text-[11px]"
                    style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-text)' }}
                  >
                    Latest pushes and events
                  </p>
                </div>
              </div>

              {!stats.loading && stats.recentEvents.length > 0 && (
                <div
                  className="px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.28)',
                    fontFamily: 'var(--font-text)',
                  }}
                >
                  {stats.recentEvents.length} events
                </div>
              )}
            </div>

            {/* Feed */}
            <div className="relative z-10">
              <ActivityFeed
                events={stats.recentEvents}
                loading={stats.loading}
                isInView={isInView}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Footer CTA ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-6"
        >
          <a
            href="https://github.com/Akshat19G"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.45)',
              fontSize: '13px',
              fontFamily: 'var(--font-text)',
            }}
          >
            <Github className="w-4 h-4" />
            <span className="group-hover:text-white/70 transition-colors">View Full GitHub Profile</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
            />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
