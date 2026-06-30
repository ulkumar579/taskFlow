import { memo } from 'react';

const TABS = [
  { id: 'all',         label: 'All Tasks',   dot: null,      dotColor: null },
  { id: 'todo',        label: 'To Do',       dot: true,      dotColor: '#9ca3af' },
  { id: 'in-progress', label: 'In Progress', dot: true,      dotColor: '#3b82f6' },
  { id: 'review',      label: 'Review',      dot: true,      dotColor: '#8b5cf6' },
  { id: 'completed',   label: 'Completed',   dot: true,      dotColor: '#22c55e' },
];

const StatusTabs = memo(function StatusTabs({ active, counts, onChange }) {
  return (
    <div
      className="flex items-center gap-1 border-b border-[var(--color-border)] mb-5 overflow-x-auto pb-0 scrollbar-hide"
      style={{ animation: 'fadeIn .5s ease .2s both' }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`status-tab flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 -mb-px
              ${isActive
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300'
              } ${isActive ? 'active' : ''}`}
          >
            {tab.dot && (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: tab.dotColor }}
              />
            )}
            {tab.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums transition-colors duration-200
                ${isActive
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                  : 'bg-gray-100 text-gray-500 dark:bg-white/8 dark:text-gray-400'
                }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
});

export default StatusTabs;
