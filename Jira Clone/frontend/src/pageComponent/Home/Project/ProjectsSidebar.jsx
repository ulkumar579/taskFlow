import { useState, useEffect, memo } from 'react';
import {
  CheckSquare2, ChevronRight, Clock, RefreshCw, CheckCircle2,
  Activity, Star,
} from 'lucide-react';
import AnimatedCounter from '../Dashboard/components/AnimatedCounter';

/* ═══════════════════════════════ MY TASKS ═══════════════════════════════ */

const TASKS = [
  { label: 'Pending',     count: 12, icon: Clock,         color: '#f97316', bgColor: '#fff7ed', progressColor: '#f97316', progress: 65 },
  { label: 'In Progress', count: 6,  icon: RefreshCw,     color: '#3b82f6', bgColor: '#eff6ff', progressColor: '#3b82f6', progress: 45 },
  { label: 'Completed',   count: 8,  icon: CheckCircle2,  color: '#22c55e', bgColor: '#f0fdf4', progressColor: '#22c55e', progress: 80 },
];

function TaskProgress({ color, progress }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(progress), 300); return () => clearTimeout(t); }, [progress]);
  return (
    <div className="h-1 w-full bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden mt-1">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: color, transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }} />
    </div>
  );
}

function MyTasksWidget() {
  return (
    <div className="card p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <CheckSquare2 size={15} className="text-indigo-600" />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>My Tasks</h3>
        </div>
        <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5 transition-colors">
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {TASKS.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.label} className="task-row flex items-center gap-3 p-2.5 -mx-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: t.bgColor }}
              >
                <Icon size={16} style={{ color: t.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{t.label}</span>
                  <span className="text-base font-extrabold tabular-nums" style={{ color: t.color }}>
                    <AnimatedCounter end={t.count} duration={900} />
                  </span>
                </div>
                <TaskProgress color={t.progressColor} progress={t.progress} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════ RECENT ACTIVITY ═══════════════════════════════ */

const ACTIVITY = [
  {
    user: 'Sarah',
    action: 'completed',
    target: 'Design System',
    targetColor: '#8b5cf6',
    time: '2 min ago',
    dotColor: '#6366f1',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
  },
  {
    user: 'Mike',
    action: 'updated',
    target: 'Landing Page',
    targetColor: '#3b82f6',
    time: '15 min ago',
    dotColor: '#3b82f6',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
  },
  {
    user: 'Emma',
    action: 'created',
    target: 'User Research',
    targetColor: '#22c55e',
    time: '1 hour ago',
    dotColor: '#22c55e',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
  },
  {
    user: 'John',
    action: 'commented on',
    target: 'Mobile App',
    targetColor: '#f97316',
    time: '2 hours ago',
    dotColor: '#f97316',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1',
  },
];

function RecentActivityWidget() {
  return (
    <div className="card p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
            <Activity size={15} className="text-violet-600" />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Recent Activity</h3>
        </div>
        <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5 transition-colors">
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-[15px] top-4 w-px"
          style={{ background: 'var(--color-border)', height: 'calc(100% - 16px)' }}
        />

        <div className="flex flex-col gap-1">
          {ACTIVITY.map((a, i) => (
            <div
              key={i}
              className="activity-item flex items-start gap-3 p-2 rounded-lg"
              style={{ animation: `fadeUp .5s cubic-bezier(.22,.61,.36,1) ${i * 80}ms both` }}
            >
              <div className="relative shrink-0 z-10">
                <img
                  src={a.avatar}
                  alt={a.user}
                  className="activity-avatar w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[#1e1e2e]"
                />
                <span
                  className="timeline-dot absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1e1e2e]"
                  style={{ background: a.dotColor }}
                />
              </div>
              <div>
                <p className="text-xs leading-snug" style={{ color: 'var(--color-text)' }}>
                  <span className="font-semibold">{a.user}</span>{' '}
                  <span style={{ color: 'var(--color-muted)' }}>{a.action}</span>{' '}
                  <span className="font-semibold" style={{ color: a.targetColor }}>{a.target}</span>
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ TEAM WORKLOAD ═══════════════════════════════ */

const TEAM = [
  { name: 'Sarah',  progress: 80, color: '#ef4444',  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1' },
  { name: 'Mike',   progress: 60, color: '#f97316',  avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1' },
  { name: 'John',   progress: 40, color: '#3b82f6',  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1' },
  { name: 'Emma',   progress: 20, color: '#22c55e',  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=1' },
];

function WorkloadProgress({ color, progress, delay }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(progress), 300 + delay); return () => clearTimeout(t); }, [progress, delay]);
  return (
    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: `${color}20` }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${w}%`, background: color, transitionTimingFunction: 'cubic-bezier(.22,.61,.36,1)' }} />
    </div>
  );
}

function TeamWorkloadWidget() {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
            <Star size={15} className="text-amber-500" />
          </div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Team Workload</h3>
        </div>
        <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5 transition-colors">
          View all <ChevronRight size={12} />
        </button>
      </div>

      {/* Avatar row */}
      <div className="flex justify-between mb-4">
        {TEAM.map((m) => (
          <div key={m.name} className="workload-member flex flex-col items-center gap-1.5 cursor-pointer group">
            <img
              src={m.avatar}
              alt={m.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-[#1e1e2e] shadow-sm group-hover:shadow-md transition-all duration-200"
            />
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="flex flex-col gap-3">
        {TEAM.map((m, i) => (
          <div key={m.name} className="workload-member cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{m.name}</span>
              <span className="text-xs font-bold" style={{ color: m.color }}>{m.progress}%</span>
            </div>
            <WorkloadProgress color={m.color} progress={m.progress} delay={i * 100} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════ COMBINED SIDEBAR ═══════════════════════════════ */

const ProjectsSidebar = memo(function ProjectsSidebar({ total, perPage, currentPage }) {
  return (
    <div className="sidebar-slide w-full xl:w-[280px] shrink-0">
      <MyTasksWidget />
      <RecentActivityWidget />
      <TeamWorkloadWidget />

      {/* Showing count */}
      <p className="text-xs text-center mt-4" style={{ color: 'var(--color-muted)' }}>
        Showing {Math.min((currentPage - 1) * perPage + 1, total)}–{Math.min(currentPage * perPage, total)} of {total} projects
      </p>
    </div>
  );
});

export default ProjectsSidebar;
