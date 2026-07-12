import { memo } from "react";
import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";
import ProjectSkeleton from "./ProjectSkeleton";

const ProjectGrid = memo(function ProjectGrid({
  projects,
  loading,
  view,
  dropdown,
  modalOpen,
  setModalOpen,
  name,
  description,
  color,
  members,
  setName,
  setDescription,
  setColor,
  setMembers,
  editingProjectId,
  setEditingProjectId
}) {
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

  if (view === "list") {
    return (
      <div className="flex flex-col gap-3 mb-6">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            delay={i * 60}
            dropdown={dropdown}
            menuId={`proj-${p.id}`}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            name={name}
            description={description}
            color={color}
            members={members}
            setName={setName}
            setDescription={setDescription}
            setColor={setColor}
            setMembers={setMembers}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
      {projects.map((p, i) => (
        <ProjectCard
          key={p.id}
          projectid={p.id}
          project={p}
          delay={i * 80}
          dropdown={dropdown}
          menuId={`proj-${p.id}`}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          name={name}
          description={description}
          color={color}
          members={members}
          setName={setName}
          setDescription={setDescription}
          setColor={setColor}
          setMembers={setMembers}
          editingProjectId={editingProjectId}
          setEditingProjectId={setEditingProjectId}
        />
      ))}
    </div>
  );
});

export default ProjectGrid;
