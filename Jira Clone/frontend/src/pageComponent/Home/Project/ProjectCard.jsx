import { useState, useRef, useEffect, memo, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  MoreHorizontal,
  CalendarDays,
  Layers,
  Code2,
  Smartphone,
  Globe,
  BarChart3,
  Plug,
  Eye,
  Edit2,
  Trash2,
  Archive,
  AlertTriangle,
  X,
} from "lucide-react";
import { PRIORITY_COLORS } from "./projects";
import userLogo from "../../../assets/user.gif";
import { useDispatch, useSelector } from "react-redux";
import { setCreateProjectMode, setProjects } from "@/store/slice/projectSlice";
import api from "@/utils/api";
const ICON_MAP = { Layers, Code2, Smartphone, Globe, BarChart3, Plug };

/* ─── Animated progress ─── */
function ProjectProgress({ value, color }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setWidth(value), 120);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="proj-progress-track">
      <div
        className="proj-progress-fill"
        style={{ width: `${width}%`, background: color }}
      />
    </div>
  );
}

/* ─── Avatar stack ─── */
function AvatarStack({ avatars, extra }) {
  return (
    <div className="avatar-stack flex items-center">
      {avatars.slice(0, 3).map((src, i) => (
        <img
          key={i}
          src={src || userLogo}
          alt=""
          className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-[#1e1e2e]"
          style={{
            marginLeft: i === 0 ? 0 : -10,
            zIndex: avatars.length - i,
            position: "relative",
          }}
        />
      ))}
      {extra > 0 && (
        <div
          className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#1e1e2e] bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-300"
          style={{ marginLeft: -10, position: "relative", zIndex: 0 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}

function ConfirmDeleteModal({
  open,
  title,
  message,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay z-60" onMouseDown={onClose}>
      <div
        className="modal-panel confirmBox z-60 max-w-md overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
      >
        <div className="relative px-8 pt-8 pb-6">
          <div
            className="modal-header-deco"
            style={{
              background:
                "radial-gradient(circle at top right, rgba(239,68,68,.10), transparent 70%)",
            }}
          />
          <div className="flex items-center gap-4 relative z-20">
            <div
              className="modal-icon"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                boxShadow: "0 8px 24px rgba(239,68,68,.28)",
              }}
            >
              <AlertTriangle
                size={20}
                className="text-white"
                strokeWidth={2.2}
              />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h2
                id="delete-project-title"
                className="text-md font-bold tracking-tight text-gray-900"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">{message}</p>
            </div>
            <button
              className="modal-close relative z-20"
              onClick={onClose}
              aria-label="Close confirm dialog"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-600 shadow-sm">
            This action will permanently remove the project and its current
            board state.
          </div>
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="create-btn"
              onClick={onConfirm}
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                boxShadow: "0 8px 24px rgba(239,68,68,.24)",
              }}
            >
              {loading ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Dropdown menu ─── */
function CardMenu({
  projectid,
  open,
  onClose,
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
  setEditingProjectId,
  onRequestDelete,
}) {
  const projectStore = useSelector((state) => state.projects.items);
  const memberStore = useSelector((state) => state.items);
  const dispatch = useDispatch();
  const handleEditProject = (projectid) => {
    setModalOpen(true);
    setEditingProjectId(projectid);
    const project = projectStore.find((p) => p.id === projectid);
    const membersBySelectedMemberInProject = project?.avatars?.map(
      (memberId) => {
        const member = memberStore.find((m) => m.id === memberId);
        return member ? member : null;
      },
    );

    dispatch(setCreateProjectMode("edit"));
    console.log(
      "membersBySelectedMemberInProject",
      membersBySelectedMemberInProject,
    );
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setColor(project.color || "#7c3aed");
      setMembers(membersBySelectedMemberInProject || []);
    } else {
      setName("");
      setDescription("");
      setColor("#7c3aed");
      setMembers([]);
    }
  };
  const items = [
    { icon: Edit2, label: "Edit Project", onClick: handleEditProject },
    {
      icon: Trash2,
      label: "Delete",
      danger: true,
      onClick: onRequestDelete,
    },
  ];

  const runCallbackFunctionOfOnclick = (projectid, fn) => {
    fn && typeof fn === "function" && fn(projectid);
  };

  if (!open) return null;

  return (
    <div
      className="dropdown-menu absolute top-6 right-0 z-50 w-44 rounded-xl border border-(--color-border) shadow-xl py-1.5 overflow-hidden"
      style={{ background: "var(--color-surface)" }}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(({ icon: Icon, label, danger, onClick = () => {} }) => (
        <button
          key={label}
          className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left cursor-pointer transition-colors ${danger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
          style={{ color: danger ? undefined : "var(--color-text)" }}
          onClick={() => {
            runCallbackFunctionOfOnclick(projectid, onClick);
            onClose();
          }}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─── Decorative shapes ─── */
function Deco({ className, style }) {
  return <div className={`card-deco ${className}`} style={style} />;
}

const ProjectCard = memo(function ProjectCard({
  key,
  projectid,
  project,
  delay = 0,
  dropdown,
  menuId,
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
  setEditingProjectId,
}) {
  const pc = PRIORITY_COLORS[project.priority];
  const IconComp = ICON_MAP[project.lucideIcon] || Layers;
  const menuOpen = dropdown.isOpen(menuId);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteProjectId, setPendingDeleteProjectId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const dispatch = useDispatch();
  const projectStore = useSelector((state) => state.projects.items);
  const membersStore = useSelector((state) => state.member.items);
  const avatars = useMemo(() => {
    if (!Array.isArray(project.avatars)) return [];
    return project.avatars.map((memberId) => {
      const member = membersStore?.find((m) => m.id === memberId);
      return member ? member.avatar : userLogo;
    });
  }, [membersStore, project.avatars]);

  const handleDeleteRequest = (id) => {
    setPendingDeleteProjectId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setPendingDeleteProjectId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteProjectId) return;
    setDeleting(true);
    try {
      const res = await api.delete(
        `/project/deleteProject/${pendingDeleteProjectId}`,
      );
      if (res.status === 200) {
        dispatch(
          setProjects(
            projectStore.filter((p) => p.id !== pendingDeleteProjectId),
          ),
        );
      }
    } catch (err) {
      console.error("Error deleting project:", err);
    } finally {
      setDeleting(false);
      handleDeleteCancel();
    }
  };

  return (
    <div
      className={`project-card card-enter ${menuOpen ? "menu-open" : ""}`}
      style={{
        animationDelay: `${delay}ms`,
        "--card-accent-color": project.borderColor,
        "--card-border-color": `${project.borderColor}40`,
        "--card-shadow-color": `${project.borderColor}30`,
      }}
    >
      {/* Decorative dots */}
      <Deco
        className="w-12 h-12 rounded-full opacity-10"
        style={{
          background: project.iconColor,
          right: 24,
          top: 100,
          animationDelay: "0s",
        }}
      />
      <Deco
        className="w-6 h-6 rounded rotate-45 opacity-15"
        style={{ background: project.progressColor, right: 60, top: 130 }}
      />

      <div className="p-5 pl-7">
        {/* Priority + menu */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className="priority-dot w-2 h-2 rounded-full shrink-0"
              style={{ background: pc.dot }}
            />
            <span
              className="text-[11px] font-semibold"
              style={{ color: pc.dot }}
            >
              {pc.label}
            </span>
          </div>
          <div className="relative" ref={dropdown.containerRef}>
            <button
              className="card-menu-btn w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                dropdown.toggle(menuId);
              }}
            >
              <MoreHorizontal
                size={15}
                style={{ color: "var(--color-muted)" }}
              />
            </button>
            <CardMenu
              projectid={projectid}
              open={menuOpen}
              onClose={dropdown.close}
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
              onRequestDelete={handleDeleteRequest}
            />
          </div>
        </div>

        {/* Icon + Name */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className="project-icon-wrap w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ background: project.iconBg }}
          >
            <IconComp size={22} style={{ color: project.iconColor }} />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3
              className="font-bold text-[15px] leading-tight truncate"
              style={{ color: "var(--color-text)" }}
            >
              {project.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed mb-4 line-clamp-2"
          style={{ color: "var(--color-muted)" }}
        >
          {project.description}
        </p>

        {/* Avatars + Progress % */}
        <div className="flex items-center justify-between mb-2">
          <AvatarStack avatars={avatars} extra={project.extra} />
          <span
            className="text-sm font-bold"
            style={{ color: project.progressColor }}
          >
            {project.progress}%
          </span>
        </div>

        {/* Progress bar */}
        <ProjectProgress
          value={project.progress}
          color={project.progressColor}
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} style={{ color: "var(--color-muted)" }} />
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>
              Due: {project.dueDate}
            </span>
          </div>
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: project.categoryBg,
              color: project.categoryColor,
            }}
          >
            {project.category}
          </span>
        </div>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <ConfirmDeleteModal
            open={deleteConfirmOpen}
            title="Are you sure you want to delete this project?"
            message={``}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            loading={deleting}
          />,
          document.body,
        )}
    </div>
  );
});

export default ProjectCard;
