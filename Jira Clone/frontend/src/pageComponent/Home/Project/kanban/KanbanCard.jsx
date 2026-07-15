import { memo, useMemo } from "react";
import { CalendarDays, MessageSquare, Paperclip, Tag } from "lucide-react";
import { useSelector } from "react-redux";

const PRIORITY_STYLES = {
  high: { bg: "rgba(239,68,68,.10)", text: "#ef4444", dot: "#ef4444" },
  medium: { bg: "rgba(249,115,22,.10)", text: "#f97316", dot: "#f97316" },
  low: { bg: "rgba(34,197,94,.10)", text: "#22c55e", dot: "#22c55e" },
};

const DUE_STYLES = {
  today: "var(--color-warning)",
  overdue: "var(--color-error)",
  future: "var(--color-muted)",
  completed: "var(--color-success)",
};

function KanbanCard({ task, onDragStart, onDragEnd, isDragging }) {
  const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.low;
  const dueColor = DUE_STYLES[task.dueState] || "var(--color-muted)";
  const membersStore = useSelector((state) => state.member.items);
  const avatars = useMemo(() => {
    if (!Array.isArray(task.assigned_to)) return [];
    return task.assigned_to.map((memberId) => {
      const member = membersStore?.find((m) => m.id === memberId);
      return member ? member.avatar : userLogo;
    });
  }, [membersStore, task.assigned_to]);
  console.log(avatars);
  

  return (
    <div
      className={`kanban-card ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
    >
      {/* Priority bar */}
      <div className="kanban-card-priority" style={{ background: ps.dot }} />

      <div className="kanban-card-body">
        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="kanban-tags">
            {task.tags.map((tag) => (
              <span key={tag} className="kanban-tag">
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h4 className="kanban-card-title">{task.name}</h4>

        {/* Description */}
        <p className="kanban-card-desc">{task.description}</p>

        {/* Footer */}
        <div className="kanban-card-footer">
          <div className="kanban-card-meta">
            <div
              className="kanban-priority-chip"
              style={{ background: ps.bg, color: ps.text }}
            >
              <span
                className="kanban-priority-dot"
                style={{ background: ps.dot }}
              />
              {task.priority}
            </div>
            <span className="kanban-due" style={{ color: dueColor }}>
              <CalendarDays size={11} />
              {task.dueDateLabel}
            </span>
          </div>

          <div className="kanban-card-right">
            {task.comments > 0 && (
              <span className="kanban-stat" title="Comments">
                <MessageSquare size={11} />
                {task.comments}
              </span>
            )}
            {task.attachments > 0 && (
              <span className="kanban-stat" title="Attachments">
                <Paperclip size={11} />
                {task.attachments}
              </span>
            )}
            <div className="kanban-avatars">
              {avatars?.slice(0, 2).map(
                (
                  src,
                  i, //Uncaught TypeError: Cannot read properties of undefined (reading 'slice')
                ) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="kanban-avatar"
                    style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 2 - i }}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(KanbanCard);
