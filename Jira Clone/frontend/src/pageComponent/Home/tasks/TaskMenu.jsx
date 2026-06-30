import { useEffect, useRef, memo } from 'react';
import { Edit2, Eye, Pin, Link2, Archive, Trash2 } from 'lucide-react';

const MENU_ITEMS = [
  { icon: Edit2,   label: 'Edit Task',       danger: false },
  { icon: Eye,     label: 'View Details',     danger: false },
  { icon: Pin,     label: 'Pin Task',         danger: false },
  { icon: Link2,   label: 'Copy Task Link',   danger: false },
  { icon: Archive, label: 'Archive Task',     danger: false },
  { divider: true },
  { icon: Trash2,  label: 'Delete Task',      danger: true },
];

const TaskMenu = memo(function TaskMenu({ open, onClose, align = 'right' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="task-dropdown absolute z-50 w-48 rounded-2xl border border-[var(--color-border)] shadow-2xl py-1.5 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,.95)',
        top: '100%',
        right: align === 'right' ? 0 : 'auto',
        left: align === 'left' ? 0 : 'auto',
        marginTop: 6,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {MENU_ITEMS.map((item, i) => {
        if (item.divider) {
          return <div key={i} className="my-1 h-px mx-3" style={{ background: 'var(--color-border)' }} />;
        }
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={onClose}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-all duration-150
              ${item.danger
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            style={{ color: item.danger ? undefined : 'var(--color-text)' }}
          >
            <Icon size={14} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
});

export default TaskMenu;
