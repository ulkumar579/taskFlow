import { useState } from "react";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

const StatusColumn = ({ column, tasks, draggingId, onDragStart, onDrop }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault(); // required to allow drop
    setIsOver(true);
  };

  const handleDragLeave = (e) => {
    // only fire when leaving the column itself, not child elements
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(column.id);
  };

  return (
    <div className="w-72 flex-shrink-0 flex flex-col">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-widest">{column.title}</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col gap-5 p-3 rounded-2xl min-h-40 border-2 transition-all duration-200 min-w-[22vw] ${
          isOver
            ? `${column.bg} border-dashed ${column.border} scale-[1.02]`
            : "border-transparent"
        }`}
      >
        {/* Tasks */}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            isDragging={draggingId === task.id}
          />
        ))}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className={`flex-1 min-h-24 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${
            isOver ? `${column.border} ${column.bg}` : "border-gray-200"
          }`}>
            <p className="text-xs text-gray-400">Drop task here</p>
          </div>
        )}

        {/* Add Task */}
        <button className="w-full mt-1 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition flex items-center justify-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Task
        </button>
      </div>
    </div>
  );
}

export default StatusColumn