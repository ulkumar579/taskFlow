import { useState, useRef, useEffect, memo } from 'react';
import {
  MoreHorizontal, CalendarDays, Layers, Code2, Smartphone,
  Globe, BarChart3, Plug, Eye, Edit2, Trash2, Archive,
} from 'lucide-react';
import { PRIORITY_COLORS } from './projects';

const ICON_MAP = { Layers, Code2, Smartphone, Globe, BarChart3, Plug };

/* ─── Animated progress ─── */
function ProjectProgress({ value, color }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setWidth(value), 120); io.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="proj-progress-track">
      <div
        className="proj-progress-fill"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}

/* ─── Avatar stack ─── */
function AvatarStack({ avatars, extra }) {
  return (
    <div className="avatar-stack flex items-center">
      {avatars.slice(0, 3).map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-[#1e1e2e]"
          style={{ marginLeft: i === 0 ? 0 : -10, zIndex: avatars.length - i, position: 'relative' }}
        />
      ))}
      {extra > 0 && (
        <div
          className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#1e1e2e] bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-300"
          style={{ marginLeft: -10, position: 'relative', zIndex: 0 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

/* ─── Dropdown menu ─── */
function CardMenu({ open, onClose }) {
  const items = [
    { icon: Eye,     label: 'View Details' },
    { icon: Edit2,   label: 'Edit Project' },
    { icon: Archive, label: 'Archive' },
    { icon: Trash2,  label: 'Delete', danger: true },
  ];

  if (!open) return null;

  return (
    <div
      className="dropdown-menu absolute top-10 right-0 z-50 w-44 rounded-xl border border-[var(--color-border)] shadow-xl py-1.5 overflow-hidden"
      style={{ background: 'var(--color-surface)' }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(({ icon: Icon, label, danger }) => (
        <button
          key={label}
          className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left transition-colors ${danger ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
          style={{ color: danger ? undefined : 'var(--color-text)' }}
          onClick={onClose}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─── Decorative shapes ─── */
function Deco({ className, style }) {
  return <div className={`card-deco ${className}`} style={style} />;
}

const ProjectCard = memo(function ProjectCard({ project, delay = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pc = PRIORITY_COLORS[project.priority];
  const IconComp = ICON_MAP[project.lucideIcon] || Layers;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className="project-card card-enter"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Priority strip left */}
      <div className="priority-strip" style={{ background: project.borderColor }} />

      {/* Gradient top border */}
      <div
        className="card-gradient-border"
        style={{ background: `linear-gradient(90deg, ${project.borderColor}, ${project.progressColor}88)` }}
      />

      {/* Decorative dots */}
      <Deco
        className="w-12 h-12 rounded-full opacity-10"
        style={{ background: project.iconColor, right: 24, top: 100, animationDelay: '0s' }}
      />
      <Deco
        className="w-6 h-6 rounded rotate-45 opacity-15"
        style={{ background: project.progressColor, right: 60, top: 130 }}
      />

      <div className="p-5 pl-7">
        {/* Priority + menu */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className="priority-dot w-2 h-2 rounded-full shrink-0"
              style={{ background: pc.dot }}
            />
            <span className="text-[11px] font-semibold" style={{ color: pc.dot }}>
              {pc.label}
            </span>
          </div>
          <div ref={menuRef} className="relative">
            <button
              className="card-menu-btn w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            >
              <MoreHorizontal size={15} style={{ color: 'var(--color-muted)' }} />
            </button>
            <CardMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
          </div>
        </div>

        {/* Icon + Name */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className="project-icon-wrap w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: project.iconBg }}
          >
            <IconComp size={22} style={{ color: project.iconColor }} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-bold text-[15px] leading-tight truncate" style={{ color: 'var(--color-text)' }}>
              {project.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--color-muted)' }}>
          {project.description}
        </p>

        {/* Avatars + Progress % */}
        <div className="flex items-center justify-between mb-2">
          <AvatarStack avatars={project.avatars} extra={project.extra} />
          <span className="text-sm font-bold" style={{ color: project.progressColor }}>
            {project.progress}%
          </span>
        </div>

        {/* Progress bar */}
        <ProjectProgress value={project.progress} color={project.progressColor} />

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} style={{ color: 'var(--color-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Due: {project.dueDate}
            </span>
          </div>
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: project.categoryBg, color: project.categoryColor }}
          >
            {project.category}
          </span>
        </div>
      </div>
    </div>
  );
});

export default ProjectCard;
