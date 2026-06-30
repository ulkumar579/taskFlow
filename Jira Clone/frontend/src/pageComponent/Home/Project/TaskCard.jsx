import { Calendar, User } from "lucide-react";

const PRIORITY_STYLE = {
  urgent: "border-l-4 border-red-500",
  high:   "border-l-4 border-orange-400",
  medium: "border-l-4 border-indigo-400",
  low:    "border-l-4 border-gray-300",
};

const TaskCard = ({ task, onDragStart, isDragging }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-150 min-w-[20vw] ${PRIORITY_STYLE[task.priority]} ${
        isDragging ? "opacity-40 scale-95" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div className="p-4">
        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="text-sm font-medium text-gray-900 leading-snug">{task.title}</h4>
          <User className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </div>

        {/* Labels */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.labels.map((l, i) => (
            <span key={i} className={`text-xs px-2 py-0.5 rounded-md font-medium ${l.color}`}>
              {l.text}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{task.dueDate}</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            task.priority === "urgent" ? "bg-red-100 text-red-600"     :
            task.priority === "high"   ? "bg-orange-100 text-orange-600" :
            task.priority === "medium" ? "bg-blue-100 text-blue-600"   :
                                         "bg-gray-100 text-gray-500"
          }`}>
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;