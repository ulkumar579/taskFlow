import { useState, useCallback, memo, useEffect, useRef } from 'react';
import {
  Search, SlidersHorizontal, ArrowUpDown, ChevronDown,
  LayoutGrid, List, CalendarDays, X,
} from 'lucide-react';

/* ─── Priority chips ─── */
const CHIPS = [
  { id: 'all',      label: 'All Projects',    dot: null,     dotColor: null },
  { id: 'high',     label: 'High Priority',   dot: true,     dotColor: '#ef4444' },
  { id: 'medium',   label: 'Medium Priority', dot: true,     dotColor: '#f97316' },
  { id: 'low',      label: 'Low Priority',    dot: true,     dotColor: '#22c55e' },
];

const SORT_OPTIONS = ['Recent', 'Name A-Z', 'Progress', 'Due Date', 'Priority'];

const SearchAndFilters = memo(function SearchAndFilters({
  search, onSearch, activeFilter, onFilter, view, onView, sort, onSort,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const sortRef = useRef(null);

  const handleSearch = useCallback((e) => onSearch(e.target.value), [onSearch]);

  useEffect(() => {
    if (!sortOpen) return;

    const handlePointerDown = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sortOpen]);

  const handleSortSelect = useCallback((value) => {
    setSortOpen(false);
    onSort?.(value);
  }, [onSort]);

  return (
    <div style={{ animation: 'fadeUp .6s cubic-bezier(.22,.61,.36,1) .1s both' }}>
      {/* Search + Filter + Sort + View row */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        {/* Search */}
        <div className={`projects-search flex-1 min-w-[200px] flex items-center gap-2 rounded-xl border px-4 h-11 bg-[var(--color-surface)] ${focused ? 'border-indigo-400' : 'border-[var(--color-border)]'} transition-all duration-300`}>
          <Search
            size={15}
            className={`search-icon shrink-0 transition-all duration-200 ${focused ? 'text-indigo-500' : 'text-gray-400'}`}
          />
          <input
            value={search}
            onChange={handleSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search projects by name, client or tag..."
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400 text-[var(--color-text)]"
          />
          {search && (
            <button onClick={() => onSearch('')}>
              <X size={13} className="text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          )}
        </div>

        {/* Filter button */}
        {/* <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 hover:shadow-md" style={{ color: 'var(--color-text)' }}>
          <SlidersHorizontal size={15} className="text-gray-500" />
          Filter
        </button> */}

        {/* Sort */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center gap-2 h-11 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200 hover:shadow-md"
            style={{ color: 'var(--color-text)' }}
          >
            <ArrowUpDown size={15} className="text-gray-500" />
            Sort: {sort}
            <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
          </button>

          {sortOpen && (
            <div
              className="dropdown-menu absolute right-0 top-full mt-2 z-[9999] w-44 rounded-xl border border-[var(--color-border)] shadow-xl py-1.5 overflow-hidden"
              style={{ background: 'var(--color-surface)' }}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSortSelect(opt)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${sort === opt ? 'text-indigo-600 font-medium' : ''}`}
                  style={{ color: sort === opt ? undefined : 'var(--color-text)' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {[
            { id: 'grid',     icon: LayoutGrid },
            { id: 'list',     icon: List },
            { id: 'calendar', icon: CalendarDays },
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onView(id)}
              className={`view-btn w-9 h-9 flex items-center justify-center rounded-lg ${view === id ? 'active' : 'hover:bg-gray-100 dark:hover:bg-white/8'}`}
              title={id.charAt(0).toUpperCase() + id.slice(1)}
            >
              <Icon size={16} className={view === id ? 'text-white' : 'text-gray-500'} />
            </button>
          ))}
        </div>
      </div>

      {/* Priority filter chips */}
      <div className="flex items-center gap-2 flex-wrap mb-6" style={{ animation: 'fadeUp .6s cubic-bezier(.22,.61,.36,1) .2s both' }}>
        {CHIPS.map((chip, i) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => onFilter(chip.id)}
              className={`filter-chip flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${isActive ? 'active' : ''}`}
              style={{
                animationDelay: `${i * 60}ms`,
                background: isActive ? '#6366f1' : 'var(--color-surface)',
                color: isActive ? 'white' : 'var(--color-text)',
                borderColor: isActive ? '#6366f1' : 'var(--color-border)',
                boxShadow: isActive ? '0 4px 16px rgba(99,102,241,.35)' : undefined,
              }}
            >
              {chip.dot && (
                <span className="w-2 h-2 rounded-full" style={{ background: chip.dotColor }} />
              )}
              {chip.icon === 'archive' && (
                <span className="text-gray-400">📁</span>
              )}
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default SearchAndFilters;
