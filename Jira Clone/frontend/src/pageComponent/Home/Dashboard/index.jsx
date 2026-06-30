import { useState, useEffect } from 'react';
import { CalendarDays, ChevronDown, FolderKanban, CheckSquare, CircleDot, Clock } from 'lucide-react';
import AnalyticsCard from './components/AnalyticsCard';
import ProjectOverview from './components/ProjectOverview';
import RecentActivity from './components/RecentActivity';
import TopProjects from './components/TopProjects';
import TeamProductivity from './components/TeamProductivity';
import TasksByPriority from './components/TasksByPriority';
import AchievementCard from './components/AchievementCard';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import SectionWrapper from './components/SectionWrapper';
import '../../../global.css'
/* ─── Sparkline data sets ─── */
const makeSpline = (seed, len = 12) => {
  const data = [];
  let v = seed;
  for (let i = 0; i < len; i++) {
    v = Math.max(10, Math.min(100, v + (Math.random() - 0.5) * 20));
    data.push({ v: Math.round(v) });
  }
  return data;
};

const analyticsCards = [
  {
    title: 'Total Projects',
    value: 24,
    change: '↑ 12%',
    positive: true,
    icon: FolderKanban,
    iconBg: '#ede9fe',
    iconColor: '#7c3aed',
    cardBg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    borderColor: '#e9d5ff',
    graphColor: '#8b5cf6',
    graphData: makeSpline(50),
  },
  {
    title: 'Tasks Completed',
    value: 128,
    change: '↑ 18%',
    positive: true,
    icon: CheckSquare,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    cardBg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    borderColor: '#bfdbfe',
    graphColor: '#3b82f6',
    graphData: makeSpline(60),
  },
  {
    title: 'In Progress',
    value: 16,
    change: '↓ 4%',
    positive: false,
    icon: CircleDot,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    cardBg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    borderColor: '#bbf7d0',
    graphColor: '#22c55e',
    graphData: makeSpline(40),
  },
  {
    title: 'Pending Tasks',
    value: 42,
    change: '↓ 8%',
    positive: false,
    icon: Clock,
    iconBg: '#ffedd5',
    iconColor: '#ea580c',
    cardBg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    borderColor: '#fed7aa',
    graphColor: '#f97316',
    graphData: makeSpline(55),
  },
];

/* ─── Skeleton card ─── */
function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-7 h-7 rounded-lg" />
      </div>
      <div className="skeleton h-9 w-20 rounded-lg" />
      <div className="skeleton h-3 w-32 rounded" />
      <div className="skeleton h-14 rounded-lg" />
    </div>
  );
}

export default function App() {
  // const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (dark) {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [dark]);

  /* Simulate brief loading state */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* <Navbar dark={dark} onToggleDark={() => setDark((d) => !d)} /> */}

      {/* Main content */}
      <main className="pt-[64px] px-4 md:px-8 lg:px-10 max-w-[1440px] mx-auto pb-16">

        {/* ─── Hero ─── */}
        <SectionWrapper className="mt-8 mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--color-text)' }}
            >
              Welcome back, John! 👋
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>
          <button className="self-start flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm" style={{ color: 'var(--color-text)' }}>
            <CalendarDays size={15} className="text-gray-400" />
            May 20, 2025
            <ChevronDown size={13} className="text-gray-400" />
          </button>
        </SectionWrapper>

        {/* ─── Analytics Cards ─── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : analyticsCards.map((card, i) => (
                <AnalyticsCard key={card.title} {...card} delay={i * 80} />
              ))}
        </section>

        {/* ─── Row 2: Overview | Activity | Top Projects ─── */}
        <SectionWrapper delay={100} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr] gap-5 mb-6">
          <ProjectOverview />
          <RecentActivity />
          <TopProjects />
        </SectionWrapper>

        {/* ─── Row 3: Productivity | Priority | Achievement ─── */}
        <SectionWrapper delay={150} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.6fr_1.2fr_.9fr] gap-5 mb-6">
          <TeamProductivity />
          <TasksByPriority />
          <AchievementCard />
        </SectionWrapper>

        {/* ─── Row 4: Upcoming Deadlines ─── */}
        <SectionWrapper delay={200}>
          <UpcomingDeadlines />
        </SectionWrapper>
      </main>
    </div>
  );
}
