import { memo } from 'react';

const ProjectBadge = memo(function ProjectBadge({ label, color, bg }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 hover:shadow-md hover:scale-105 cursor-default"
      style={{ background: bg, color, border: `1px solid ${color}22` }}
    >
      {label}
    </span>
  );
});

export default ProjectBadge;
