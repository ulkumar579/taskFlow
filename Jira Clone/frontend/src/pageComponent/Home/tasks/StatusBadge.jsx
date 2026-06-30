import { memo } from 'react';
import { Circle, CircleDot, CircleDashed, CheckCircle2 } from 'lucide-react';
import { STATUS_CONFIG } from './tasksData';

const ICONS = { Circle, CircleDot, CircleDashed, CheckCircle2 };

const StatusBadge = memo(function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
  const Icon = ICONS[cfg.icon] || Circle;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 hover:scale-105 cursor-default"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
});

export default StatusBadge;
