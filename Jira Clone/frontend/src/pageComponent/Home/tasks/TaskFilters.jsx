import { useState, memo, useCallback } from 'react';
import {
  Search, Flag, CircleDot, User, CalendarDays, ArrowUpDown,
  ChevronDown, X, LayoutList, LayoutGrid, CalendarRange,
} from 'lucide-react';

/* ─── Filter button with dropdown ─── */
function FilterBtn({ icon: Icon, label, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-10 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-indigo-300 hover:shadow-sm whitespace-nowrap"
        style={{ color: 'var(--color-text)' }}
      >
        <Icon size={14} className={value ? 'text-indigo-500' : 'text-gray-400'} />
        <span className={value ? 'text-indigo-600 font-semibold' : ''}>{value || label}</span>
        <ChevronDown
          size={12}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="filter-dropdown absolute top-12 left-0 z-50 w-40 rounded-xl border border-[var(--color-border)] shadow-xl py-1.5 overflow-hidden"
          style={{ background: 'rgba(255,255,255,.96)' }}
        >
          {value && (
            <button
              onClick={() => { onChange(''); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${value === opt ? 'text-indigo-600 font-semibold' : ''}`}
              style={{ color: value === opt ? undefined : 'var(--color-text)' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── View toggle ─── */
function ViewToggle({ view, onView }) {
  const views = [
    { id: 'list',     icon: LayoutList,   title: 'List' },
    { id: 'board',    icon: LayoutGrid,   title: 'Board' },
    { id: 'calendar', icon: CalendarRange, title: 'Calendar' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shrink-0">
      {views.map(({ id, icon: Icon, title }) => (
        <button
          key={id}
          onClick={() => onView(id)}
          title={title}
          className={`view-btn w-9 h-8 flex items-center justify-center rounded-lg transition-all duration-200 ${view === id ? 'active' : 'hover:bg-gray-100 dark:hover:bg-white/8'}`}
        >
          <Icon size={15} className={view === id ? 'text-white' : 'text-gray-500'} />
        </button>
      ))}
    </div>
  );
}

const TaskFilters = memo(function TaskFilters({
  search, onSearch, filters, onFilter, sort, onSort, view, onView,
}) {
  const [focused, setFocused] = useState(false);

  const handleSearch = useCallback((e) => onSearch(e.target.value), [onSearch]);

  const SORT_OPTIONS = ['Newest', 'Oldest', 'Priority', 'Due Date', 'Alphabetical'];
  const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
  const STATUS_OPTIONS = ['To Do', 'In Progress', 'Review', 'Completed'];
  const ASSIGNEE_OPTIONS = ['John', 'Sarah', 'Mike', 'Emma'];

  return (
    <div style={{ animation: 'fadeUp .6s cubic-bezier(.22,.61,.36,1) .1s both' }}>
      <div className="flex flex-wrap gap-3 items-center mb-5">
        {/* Search */}
        <div
          className={`tasks-search flex-1 min-w-[180px] flex items-center gap-2.5 rounded-xl border bg-[var(--color-surface)] px-4 h-10 ${focused ? 'border-indigo-400' : 'border-[var(--color-border)]'}`}
        >
          <Search
            size={14}
            className={`task-search-icon shrink-0 ${focused ? 'text-indigo-500' : 'text-gray-400'}`}
          />
          <input
            value={search}
            onChange={handleSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search tasks..."
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400 text-[var(--color-text)]"
          />
          {search && (
            <button onClick={() => onSearch('')}>
              <X size={13} className="text-gray-400 hover:text-gray-600 transition-colors" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <FilterBtn
          icon={Flag}
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={filters.priority}
          onChange={(v) => onFilter('priority', v)}
        />
        <FilterBtn
          icon={CircleDot}
          label="Status"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(v) => onFilter('status', v)}
        />
        <FilterBtn
          icon={User}
          label="Assignee"
          options={ASSIGNEE_OPTIONS}
          value={filters.assignee}
          onChange={(v) => onFilter('assignee', v)}
        />
        <FilterBtn
          icon={CalendarDays}
          label="Due Date"
          options={['Today', 'This Week', 'This Month', 'Overdue']}
          value={filters.dueDate}
          onChange={(v) => onFilter('dueDate', v)}
        />

        {/* Sort */}
        <FilterBtn
          icon={ArrowUpDown}
          label={`Sort: ${sort}`}
          options={SORT_OPTIONS}
          value={sort !== 'Newest' ? sort : ''}
          onChange={(v) => onSort(v || 'Newest')}
        />

        {/* View toggle */}
        <ViewToggle view={view} onView={onView} />
      </div>
    </div>
  );
});

export default TaskFilters;
