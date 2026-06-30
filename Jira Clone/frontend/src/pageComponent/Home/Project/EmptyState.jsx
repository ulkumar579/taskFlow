import { FolderOpen, Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      {/* Floating illustration */}
      <div className="empty-float mb-6">
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 scale-150 blur-xl opacity-60" />
          {/* Icon circle */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center shadow-lg">
            <FolderOpen size={40} className="text-indigo-400" strokeWidth={1.5} />
          </div>
          {/* Floating particles */}
          {[
            { color: '#a78bfa', size: 8, top: -8, right: 4 },
            { color: '#60a5fa', size: 6, bottom: 4, left: -4 },
            { color: '#fbbf24', size: 5, top: 10, left: -10 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: p.size, height: p.size,
                background: p.color,
                top: p.top, right: p.right, bottom: p.bottom, left: p.left,
                animation: `float ${3 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        No projects found
      </h3>
      <p className="text-sm text-center max-w-xs mb-6" style={{ color: 'var(--color-muted)' }}>
        We couldn't find any projects matching your filters. Try adjusting your search or create a new project.
      </p>

      <button className="new-project-btn flex items-center gap-2 text-white font-semibold text-sm px-6 py-2.5 rounded-xl">
        <Plus size={16} />
        Create New Project
      </button>
    </div>
  );
}
