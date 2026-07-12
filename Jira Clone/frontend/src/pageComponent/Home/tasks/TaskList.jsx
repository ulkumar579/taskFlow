import { memo, useCallback } from 'react';
import {
  MessageSquare, Paperclip, Clock, MoreHorizontal,
  Monitor, Code2, FileText, Rocket, BookOpen, Layers, Smartphone,
} from 'lucide-react';
import TaskRow from './TaskRow';
import TaskSkeleton from './TaskSkeleton';
import TaskEmptyState from './TaskEmptyState';
import TaskCheckbox from './TaskCheckbox';
import ProjectBadge from './ProjectBadge';
import StatusBadge from './StatusBadge';
import TaskMenu from './TaskMenu';
import { PRIORITY_CONFIG } from './tasksData';

const ICON_MAP = { Monitor, Code2, FileText, Rocket, BookOpen, Layers, Smartphone };

function AvatarGroup({ avatars, extra }) {
  return (
    <div className="task-avatar-group">
      {avatars.map((src, i) => (
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

function DueDate({ label, state }) {
  const colors = {
    overdue: { main: '#ef4444', sub: '#fca5a5' },
    today: { main: '#f97316', sub: '#fdba74' },
    future: { main: '#6b7280', sub: '#9ca3af' },
    completed: { main: '#22c55e', sub: '#86efac' },
  };
  const c = colors[state] || colors.future;

  return (
    <div className="flex flex-col items-start min-w-[80px]">
      <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>May 24, 2025</span>
      <span
        className={`text-[11px] font-semibold ${state === 'overdue' ? 'overdue-pulse' : ''}`}
        style={{ color: c.main }}
      >
        {label}
      </span>
    </div>
  );
}

function TaskCard({ task, delay = 0, onToggle, dropdown, menuId }) {
  const pc = PRIORITY_CONFIG[task.priority];
  const IconComp = ICON_MAP[task.lucideIcon] || Monitor;
  const menuOpen = dropdown.isOpen(menuId);

  const handleToggle = useCallback((checked) => onToggle(task.id, checked), [task.id, onToggle]);

  return (
    <div
      className={`task-card task-enter rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm ${task.completed ? 'completed' : ''} ${menuOpen ? 'menu-open' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* <div className="task-priority-strip" style={{ width: '3px', borderRadius: '999px', height: '44px', background: pc.strip }} /> */}
          <TaskCheckbox checked={task.completed} onChange={handleToggle} />
        </div>
        <div className="relative shrink-0">
          <button
            className="task-menu-btn w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
            onClick={(e) => { e.stopPropagation(); dropdown.toggle(menuId); }}
          >
            <MoreHorizontal size={15} style={{ color: 'var(--color-muted)' }} />
          </button>
          <TaskMenu open={menuOpen} onClose={dropdown.close} />
        </div>
      </div>

      <div className="mt-3 flex items-start gap-3">
        <div
          className="task-icon-wrap w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: task.iconBg }}
        >
          <IconComp size={18} style={{ color: task.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-snug ${task.completed ? 'task-title-strike opacity-60' : ''}`} style={{ color: 'var(--color-text)' }}>
            {task.name}
          </p>
          <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-muted)' }}>
            {task.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <ProjectBadge label={task.project} color={task.projectColor} bg={task.projectBg} />
        <StatusBadge status={task.status} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <DueDate label={task.dueDateLabel} state={task.dueDateState} />
        <AvatarGroup avatars={task.avatars} extra={task.extra} />
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: 'var(--color-muted)' }}>
        <div className="flex items-center gap-1">
          <MessageSquare size={13} />
          <span>{task.comments}</span>
        </div>
        <div className="flex items-center gap-1">
          <Paperclip size={13} />
          <span>{task.attachments}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={13} />
          <span>{task.estimate}</span>
        </div>
      </div>
    </div>
  );
}

const TaskList = memo(function TaskList({ tasks, loading, onToggle, dropdown, view = 'list' }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <TaskEmptyState />;
  }

  if (view === 'board') {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" style={{ position: 'relative', zIndex: 1 }}>
        {tasks.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            delay={i * 70}
            onToggle={onToggle}
            dropdown={dropdown}
            menuId={`task-${task.id}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" style={{ position: 'relative', zIndex: 1 }}>
      {tasks.map((task, i) => (
        <TaskRow
          key={task.id}
          task={task}
          delay={i * 70}
          onToggle={onToggle}
          dropdown={dropdown}
          menuId={`task-${task.id}`}
        />
      ))}
    </div>
  );
});

export default TaskList;
