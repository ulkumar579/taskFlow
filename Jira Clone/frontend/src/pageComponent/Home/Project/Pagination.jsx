import { memo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = memo(function Pagination({ current, total, onChange }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  const visiblePages = () => {
    if (total <= 7) return pages;
    if (current <= 4) return [...pages.slice(0, 5), 'ellipsis', total];
    if (current >= total - 3) return [1, 'ellipsis', ...pages.slice(total - 5)];
    return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-4" style={{ animation: 'fadeUp .6s cubic-bezier(.22,.61,.36,1) .3s both' }}>
      {/* Prev */}
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="page-btn w-9 h-9 flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color: 'var(--color-text)' }}
      >
        <ChevronLeft size={15} />
      </button>

      {/* Page numbers */}
      {visiblePages().map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center" style={{ color: 'var(--color-muted)' }}>
            <MoreHorizontal size={15} />
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`page-btn w-9 h-9 flex items-center justify-center text-sm font-medium border ${
              current === p
                ? 'active border-transparent'
                : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-indigo-300'
            }`}
            style={{ color: current === p ? 'white' : 'var(--color-text)' }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="page-btn w-9 h-9 flex items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ color: 'var(--color-text)' }}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
});

export default Pagination;
