import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import {
  X, ClipboardCheck, FileText, Sparkles, Search, ChevronDown,
  Check, AlertCircle, Loader2, Calendar, CalendarDays, CalendarPlus,
  CircleDot,
} from 'lucide-react';
import { useSelector } from 'react-redux';

/* ─── Static data ─── */
const PROJECT_OPTIONS = [
  { id: 1, name: 'UI Design System',  status: 'In Progress', color: '#8b5cf6', bg: '#ede9fe', emoji: '🎨' },
  { id: 2, name: 'Backend Development', status: 'In Progress', color: '#f97316', bg: '#ffedd5', emoji: '⚙️' },
  { id: 3, name: 'Mobile Application',  status: 'Planning',    color: '#22c55e', bg: '#dcfce7', emoji: '📱' },
  { id: 4, name: 'Marketing Website',    status: 'In Progress', color: '#3b82f6', bg: '#dbeafe', emoji: '🌐' },
  { id: 5, name: 'Team Dashboard',      status: 'Review',      color: '#6366f1', bg: '#e0e7ff', emoji: '📊' },
  { id: 6, name: 'API Integration',     status: 'Planning',    color: '#ec4899', bg: '#fce7f3', emoji: '🔌' },
];

const PRIORITIES = [
  { id: 'high',   label: 'High',   color: '#ef4444' },
  { id: 'medium', label: 'Medium', color: '#f97316' },
  { id: 'low',    label: 'Low',    color: '#22c55e' },
];

const LABELS = [
  { id: 'design',       label: 'Design',       emoji: '🎨' },
  { id: 'development',  label: 'Development',  emoji: '💻' },
  { id: 'bug',          label: 'Bug',           emoji: '🐞' },
  { id: 'feature',      label: 'Feature',       emoji: '✨' },
  { id: 'documentation',label: 'Documentation',emoji: '📄' },
  { id: 'review',       label: 'Review',        emoji: '👁' },
  { id: 'testing',      label: 'Testing',        emoji: '🧪' },
];

const TEAM_MEMBERS = [
  { id: 1, name: 'Sarah Johnson', role: 'Product Designer',  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
  { id: 2, name: 'Mike Smith',    role: 'Frontend Engineer', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
  { id: 3, name: 'David Lee',     role: 'Backend Engineer',  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
  { id: 4, name: 'Emma Wilson',   role: 'QA Engineer',       avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
  { id: 5, name: 'Alex Chen',     role: 'DevOps Engineer',   avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
  { id: 6, name: 'Lisa Brown',    role: 'Project Manager',   avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
  { id: 7, name: 'Tom Harris',    role: 'UX Researcher',     avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
  { id: 8, name: 'Nina Patel',    role: 'Mobile Developer',  avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1' },
];

/* ═══════════════════════════════════════════════
   Shared: HighlightedText
═══════════════════════════════════════════════ */
function HighlightedText({ text, query }) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="highlight-match">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ═══════════════════════════════════════════════
   ModalHeader
═══════════════════════════════════════════════ */
const ModalHeader = memo(function ModalHeader({ onClose }) {
  return (
    <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-6">
      <div className="modal-header-deco" style={{ background: 'radial-gradient(circle at top right, rgba(139,92,246,.08), transparent 70%)' }} />
      <div className="flex items-start gap-4 relative z-10">
        <div className="modal-icon">
          <ClipboardCheck size={32} className="text-white" strokeWidth={2.2} />
          <Sparkles size={14} className="absolute -top-1.5 -right-1.5 text-yellow-300" fill="#fde047" style={{ animation: 'sparkleFloat 3s ease-in-out infinite' }} />
        </div>
        <div className="pt-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Add New Task</h2>
          <p className="mt-1 text-sm text-gray-500">Create a task and keep your project on track.</p>
        </div>
      </div>
      <button className="modal-close relative z-10" onClick={onClose} aria-label="Close modal">
        <X size={18} className="text-gray-500" />
      </button>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   TaskTitleInput
═══════════════════════════════════════════════ */
const TaskTitleInput = memo(function TaskTitleInput({ value, onChange, error }) {
  const count = value.length;
  return (
    <div>
      <label className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Task Title <span className="text-red-400">*</span></span>
        <span className={`text-xs tabular-nums ${count > 90 ? 'text-orange-500' : 'text-gray-400'}`}>{count} / 100</span>
      </label>
      <div className={`modal-input-wrap flex items-center gap-3 px-4 h-14 ${error ? 'error-state' : ''}`}>
        <FileText size={18} className="text-gray-400 shrink-0" />
        <input className="modal-input h-full" value={value} onChange={(e) => onChange(e.target.value.slice(0, 100))} placeholder="Enter task title..." aria-label="Task title" />
      </div>
      {error && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500" style={{ animation: 'slideUp .2s ease both' }}><AlertCircle size={13} /> {error}</p>}
    </div>
  );
});

/* ═══════════════════════════════════════════════
   DescriptionInput
═══════════════════════════════════════════════ */
const DescriptionInput = memo(function DescriptionInput({ value, onChange }) {
  const taRef = useRef(null);
  const count = value.length;
  const autoResize = useCallback(() => {
    const ta = taRef.current; if (!ta) return;
    ta.style.height = 'auto'; ta.style.height = `${Math.max(150, ta.scrollHeight)}px`;
  }, []);
  useEffect(() => { autoResize(); }, [value, autoResize]);
  return (
    <div>
      <label className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Description</span>
        <span className={`text-xs tabular-nums ${count > 450 ? 'text-orange-500' : 'text-gray-400'}`}>{count} / 500</span>
      </label>
      <div className="modal-input-wrap flex gap-3 px-4 py-3.5">
        <FileText size={18} className="text-gray-400 shrink-0 mt-0.5" />
        <textarea ref={taRef} className="modal-textarea" value={value} onChange={(e) => onChange(e.target.value.slice(0, 500))} onInput={autoResize} placeholder="Add a detailed description of the task..." aria-label="Task description" />
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   ProjectSelect (searchable single-select)
═══════════════════════════════════════════════ */
const ProjectSelect = memo(function ProjectSelect({ selected, onSelect, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref = useRef(null);
  const searchRef = useRef(null);
  const { items: projects } = useSelector((state) => state.projects);
  

  const filtered = useMemo(
    () => projects.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  useEffect(() => { setActiveIdx(filtered.length > 0 ? 0 : -1); }, [filtered.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler, true);
    return () => document.removeEventListener('mousedown', handler, true);
  }, [open]);
  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 50); }, [open]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((p) => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIdx]) { onSelect(filtered[activeIdx]); setOpen(false); setQuery(''); } }
  }, [open, filtered, activeIdx, onSelect]);

  const sel = selected ? projects.find((p) => p.id === selected.id) : null;

  return (
    <div ref={ref} className="relative w-full" onKeyDown={handleKey}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Project <span className="text-red-400">*</span></label>
      <button type="button" className={`modal-input-wrap w-full flex items-center gap-3 px-4 h-14 text-left ${error ? 'error-state' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {sel ? (
          <>
            <div className="project-color-dot" style={{ background: sel.bg }}>{sel.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{sel.name}</p>
              <p className="text-xs text-gray-400">{sel.status}</p>
            </div>
          </>
        ) : (
          <>
            <Search size={18} className="text-gray-400 shrink-0" />
            <span className="flex-1 text-sm text-gray-400">Select a project...</span>
          </>
        )}
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {error && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle size={13} /> {error}</p>}

      {open && (
        <div className="member-dropdown">
          <div className="flex items-center gap-2.5 px-4 h-12 border-b border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input ref={searchRef} className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" placeholder="Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="max-h-64 overflow-y-auto py-1.5" style={{ scrollbarWidth: 'thin' }}>
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No projects found</div>
            ) : (
              filtered.map((p, i) => {
                const isSel = selected?.id === p.id;
                const isActive = i === activeIdx;
                return (
                  <div key={p.id} className={`project-select-row ${isSel ? 'selected' : ''} ${isActive ? 'bg-violet-50' : ''}`} onClick={() => { onSelect(p); setOpen(false); setQuery(''); }} onMouseEnter={() => setActiveIdx(i)}>
                    <div className="project-color-dot" style={{ background: p.bg }}>{p.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate"><HighlightedText text={p.name} query={query} /></p>
                      <p className="text-xs text-gray-400">{p.status}</p>
                    </div>
                    {isSel && <Check size={16} className="text-violet-600 shrink-0" strokeWidth={2.5} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════
   DatePicker (shortcuts + native date input)
═══════════════════════════════════════════════ */
const DatePicker = memo(function DatePicker({ selected, onSelect }) {
  const today = useMemo(() => { const d = new Date(); return d.toISOString().split('T')[0]; }, []);
  const tomorrow = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; }, []);
  const nextWeek = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0]; }, []);

  const fmt = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const shortcuts = [
    { label: 'Today',      value: today,     icon: CalendarDays },
    { label: 'Tomorrow',   value: tomorrow,  icon: CalendarPlus },
    { label: 'Next Week',  value: nextWeek,  icon: Calendar },
  ];

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {shortcuts.map((s) => {
          const isActive = selected === s.value;
          return (
            <button key={s.label} type="button" className={`date-shortcut flex items-center gap-1.5 ${isActive ? 'active' : ''}`} onClick={() => onSelect(isActive ? '' : s.value)}>
              <s.icon size={14} /> {s.label}
            </button>
          );
        })}
      </div>
      <div className="modal-input-wrap flex items-center gap-3 px-4 h-14">
        <Calendar size={18} className="text-gray-400 shrink-0" />
        <input type="date" className="modal-input h-full" value={selected} onChange={(e) => onSelect(e.target.value)} aria-label="Due date" />
        {selected && (
          <span className="text-xs text-violet-600 font-medium shrink-0">{fmt(selected)}</span>
        )}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   PrioritySelect
═══════════════════════════════════════════════ */
const PrioritySelect = memo(function PrioritySelect({ selected, onSelect, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler, true);
    return () => document.removeEventListener('mousedown', handler, true);
  }, [open]);

  const sel = PRIORITIES.find((p) => p.id === selected);

  return (
    <div ref={ref} className="relative w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Priority <span className="text-red-400">*</span></label>
      <button type="button" className={`modal-input-wrap w-full flex items-center gap-3 px-4 h-14 text-left ${error ? 'error-state' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {sel ? (
          <>
            <span className="priority-dot" style={{ background: sel.color }} />
            <span className="flex-1 text-sm font-medium text-gray-800">{sel.label}</span>
          </>
        ) : (
          <>
            <CircleDot size={18} className="text-gray-400 shrink-0" />
            <span className="flex-1 text-sm text-gray-400">Select priority...</span>
          </>
        )}
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {error && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><AlertCircle size={13} /> {error}</p>}

      {open && (
        <div className="member-dropdown">
          <div className="py-1.5">
            {PRIORITIES.map((p) => {
              const isSel = selected === p.id;
              return (
                <div key={p.id} className="priority-option mx-1.5" onClick={() => { onSelect(p.id); setOpen(false); }}>
                  <span className="priority-dot" style={{ background: p.color }} />
                  <span className={`flex-1 text-sm ${isSel ? 'font-semibold text-violet-700' : 'text-gray-700'}`}>{p.label}</span>
                  {isSel && <Check size={16} className="text-violet-600 shrink-0" strokeWidth={2.5} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════
   AssigneeMultiSelect
═══════════════════════════════════════════════ */
const AssigneeMultiSelect = memo(function AssigneeMultiSelect({ selected, onToggle, onClearAll }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref = useRef(null);
  const searchRef = useRef(null);

  const filtered = useMemo(
    () => TEAM_MEMBERS.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) || m.role.toLowerCase().includes(query.toLowerCase())),
    [query]
  );
  useEffect(() => { setActiveIdx(filtered.length > 0 ? 0 : -1); }, [filtered.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler, true);
    return () => document.removeEventListener('mousedown', handler, true);
  }, [open]);
  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 50); }, [open]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((p) => Math.min(p + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((p) => Math.max(p - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[activeIdx]) onToggle(filtered[activeIdx]); }
    else if (e.key === 'Backspace' && query === '' && selected.length > 0) onToggle(selected[selected.length - 1]);
  }, [open, filtered, activeIdx, query, selected, onToggle]);

  return (
    <div ref={ref} className="relative w-full" onKeyDown={handleKey}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
      <button type="button" className="modal-input-wrap w-full flex items-center gap-3 px-4 h-14 text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Search size={18} className="text-gray-400 shrink-0" />
        <span className={`flex-1 text-sm ${selected.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
          {selected.length > 0 ? `${selected.length} assignee${selected.length > 1 ? 's' : ''} selected` : 'Search and select team members'}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="member-dropdown">
          <div className="flex items-center gap-2.5 px-4 h-12 border-b border-gray-100">
            <Search size={16} className="text-gray-400" />
            <input ref={searchRef} className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" placeholder="Search members..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="max-h-64 overflow-y-auto py-1.5" style={{ scrollbarWidth: 'thin' }}>
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No members found</div>
            ) : (
              filtered.map((m, i) => {
                const isSel = selected.some((s) => s.id === m.id);
                const isActive = i === activeIdx;
                return (
                  <div key={m.id} className={`member-row ${isSel ? 'selected' : ''} ${isActive ? 'bg-violet-50' : ''}`} onClick={() => onToggle(m)} onMouseEnter={() => setActiveIdx(i)}>
                    <img src={m.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate"><HighlightedText text={m.name} query={query} /></p>
                      <p className="text-xs text-gray-400 truncate">{m.role}</p>
                    </div>
                    <div className={`member-checkbox ${isSel ? 'checked' : ''}`}>
                      {isSel && <svg className="check-svg" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {selected.map((m) => (
              <div key={m.id} className="member-chip">
                <img src={m.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-sm font-medium text-violet-700">{m.name}</span>
                <button type="button" className="chip-remove" onClick={() => onToggle(m)} aria-label={`Remove ${m.name}`}>
                  <X size={12} className="text-violet-500" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors shrink-0" onClick={onClearAll}>Clear All</button>
        </div>
      )}
    </div>
  );
});

/* ═══════════════════════════════════════════════
   LabelSelector
═══════════════════════════════════════════════ */
const LabelSelector = memo(function LabelSelector({ selected, onToggle }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Labels</label>
      <div className="flex flex-wrap gap-2">
        {LABELS.map((l) => {
          const isSel = selected.includes(l.id);
          return (
            <button key={l.id} type="button" className={`label-chip ${isSel ? 'selected' : ''}`} onClick={() => onToggle(l.id)} aria-pressed={isSel}>
              <span>{l.emoji}</span>
              <span>{l.label}</span>
              <span className="label-check flex items-center">
                <Check size={13} strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   FooterButtons
═══════════════════════════════════════════════ */
const FooterButtons = memo(function FooterButtons({ onCancel, onCreate, loading, disabled }) {
  const btnRef = useRef(null);
  const handleClick = (e) => {
    if (disabled || loading) return;
    const btn = btnRef.current; if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const d = Math.max(rect.width, rect.height);
    ripple.className = 'btn-ripple';
    ripple.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    onCreate();
  };
  return (
    <div className="flex items-center justify-end gap-3 px-8 py-6 border-t border-gray-100">
      <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
      <button ref={btnRef} type="button" className="create-btn" onClick={handleClick} disabled={disabled || loading}>
        <span className="btn-shine" />
        {loading ? (<><Loader2 size={18} className="animate-spin" /> Creating Task...</>) : (<><Sparkles size={16} /> Create Task</>)}
      </button>
    </div>
  );
});

/* ═══════════════════════════════════════════════
   AddTaskModal (main)
═══════════════════════════════════════════════ */
export default function AddTaskModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [labels, setLabels] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const handleEsc = (e) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = ''; };
  }, [open]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setTitle(''); setDescription(''); setProject(null); setDueDate('');
      setPriority(''); setAssignees([]); setLabels([]); setErrors({}); setLoading(false);
      onClose();
      triggerRef.current?.focus();
    }, 240);
  }, [onClose]);

  const toggleAssignee = useCallback((m) => {
    setAssignees((prev) => prev.some((s) => s.id === m.id) ? prev.filter((s) => s.id !== m.id) : [...prev, m]);
  }, []);

  const toggleLabel = useCallback((id) => {
    setLabels((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);
  }, []);

  const handleCreate = useCallback(() => {
    const errs = {};
    if (title.trim().length < 3) errs.title = 'Task title must be at least 3 characters';
    if (!project) errs.project = 'Please select a project';
    if (!priority) errs.priority = 'Please select a priority';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCreate?.({ title: title.trim(), description: description.trim(), project, dueDate, priority, assignees, labels });
      handleClose();
    }, 1200);
  }, [title, description, project, dueDate, priority, assignees, labels, onCreate, handleClose]);

  if (!open) return null;

  return (
    <div className={`modal-overlay ${closing ? 'closing' : ''}`} onMouseDown={handleClose}>
      <div className={`modal-panel modal-panel--task ${closing ? 'closing' : ''}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="add-task-title">
        <ModalHeader onClose={handleClose} />

        <div className="px-8 pb-2 flex flex-col gap-5">
          <TaskTitleInput value={title} onChange={setTitle} error={errors.title} />
          <DescriptionInput value={description} onChange={setDescription} />

          <div>
            <ProjectSelect selected={project} onSelect={setProject} error={errors.project} />
          </div>

            <DatePicker selected={dueDate} onSelect={setDueDate} />
          <div className="form-grid">
            <PrioritySelect selected={priority} onSelect={setPriority} error={errors.priority} />
            <div>
              <AssigneeMultiSelect selected={assignees} onToggle={toggleAssignee} onClearAll={() => setAssignees([])} />
            </div>
          </div>

          <LabelSelector selected={labels} onToggle={toggleLabel} />
        </div>

        <FooterButtons onCancel={handleClose} onCreate={handleCreate} loading={loading} disabled={title.trim().length < 3 || !project || !priority} />
      </div>
    </div>
  );
}
