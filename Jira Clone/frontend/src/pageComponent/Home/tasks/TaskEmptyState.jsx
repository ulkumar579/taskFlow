import { CheckSquare, Plus } from 'lucide-react';

export default function TaskEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="empty-float mb-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 scale-150 blur-xl opacity-50" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center shadow-lg">
            <CheckSquare size={40} className="text-indigo-400" strokeWidth={1.5} />
          </div>
          {[
            { color: '#a78bfa', size: 7, top: -6,  right: 8 },
            { color: '#34d399', size: 5, bottom: 2, left: -2 },
            { color: '#fbbf24', size: 6, top: 8,   left: -12 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.size, height: p.size,
                background: p.color,
                top: p.top, right: p.right, bottom: p.bottom, left: p.left,
                animation: `float ${3 + i * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        No tasks found
      </h3>
      <p className="text-sm text-center max-w-xs mb-6" style={{ color: 'var(--color-muted)' }}>
        Nothing matches your current filters. Try adjusting your search or create a new task to get started.
      </p>

      <button className="new-project-btn flex items-center gap-2 text-white font-semibold text-sm px-6 py-2.5 rounded-xl">
        <Plus size={16} />
        Create Task
      </button>
    </div>
  );
}
