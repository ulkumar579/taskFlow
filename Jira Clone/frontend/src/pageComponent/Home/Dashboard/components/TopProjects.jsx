import { ChevronRight, FolderKanban, Globe, Megaphone, Shield, Plug } from 'lucide-react';
import AnimatedProgress from './AnimatedProgress';

const projects = [
  { name: 'TaskFlow Redesign',     progress: 90, color: '#6366f1', icon: FolderKanban, iconBg: '#ede9fe', iconColor: '#7c3aed' },
  { name: 'Mobile App Development',progress: 75, color: '#3b82f6', icon: Globe,        iconBg: '#dbeafe', iconColor: '#2563eb' },
  { name: 'Marketing Website',     progress: 60, color: '#f97316', icon: Megaphone,    iconBg: '#ffedd5', iconColor: '#ea580c' },
  { name: 'Design System',         progress: 45, color: '#22c55e', icon: Shield,       iconBg: '#dcfce7', iconColor: '#16a34a' },
  { name: 'API Integration',       progress: 30, color: '#f43f5e', icon: Plug,         iconBg: '#ffe4e6', iconColor: '#e11d48' },
];

export default function TopProjects() {
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
          Top Projects
        </h2>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-0.5">
          View all <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {projects.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className="project-row flex items-center gap-3 p-3 cursor-pointer"
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: p.iconBg }}
              >
                <Icon size={16} style={{ color: p.iconColor }} />
              </div>

              {/* Name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                    {p.name}
                  </span>
                  <span className="text-xs font-semibold ml-2 shrink-0" style={{ color: 'var(--color-muted)' }}>
                    {p.progress}%
                  </span>
                </div>
                <AnimatedProgress value={p.progress} color={p.color} delay={i * 80} />
              </div>

              {/* Arrow */}
              <ChevronRight size={15} className="project-arrow shrink-0 text-gray-400" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
