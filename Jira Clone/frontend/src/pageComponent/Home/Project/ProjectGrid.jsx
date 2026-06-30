import { memo } from 'react';
import ProjectCard from './ProjectCard';
import EmptyState from './EmptyState';
import ProjectSkeleton from './ProjectSkeleton';

const ProjectGrid = memo(function ProjectGrid({ projects, loading, view }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return <EmptyState />;
  }

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-3 mb-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} delay={i * 60} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
      {projects.map((p, i) => (
        <ProjectCard key={p.id} project={p} delay={i * 80} />
      ))}
    </div>
  );
});

export default ProjectGrid;
