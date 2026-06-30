import { useState } from "react";
import StatusColumn from "./StatusColumn";
import { Search } from "lucide-react";

const INITIAL_TASKS = [
  {
    id: "1",
    title: "Create wireframes for homepage",
    status: "todo",
    priority: "medium",
    dueDate: "Jan 20",
    labels: [
      { text: "Design", color: "bg-purple-100 text-purple-700" },
      { text: "UI/UX", color: "bg-orange-100 text-orange-700" },
    ],
  },
  {
    id: "2",
    title: "Research competitor websites",
    status: "todo",
    priority: "low",
    dueDate: "Jan 22",
    labels: [{ text: "Design", color: "bg-purple-100 text-purple-700" }],
  },
  {
    id: "3",
    title: "Define color palette and typography",
    status: "todo",
    priority: "medium",
    dueDate: "Jan 23",
    labels: [{ text: "Design", color: "bg-purple-100 text-purple-700" }],
  },
  {
    id: "4",
    title: "Create site navigation structure",
    status: "todo",
    priority: "high",
    dueDate: "Jan 25",
    labels: [{ text: "UI/UX", color: "bg-orange-100 text-orange-700" }],
  },
  {
    id: "5",
    title: "Develop responsive navigation menu",
    status: "in_progress",
    priority: "high",
    dueDate: "Jan 19",
    labels: [
      { text: "Development", color: "bg-blue-100 text-blue-700" },
      { text: "Feature", color: "bg-green-100 text-green-700" },
    ],
  },
  {
    id: "6",
    title: "Implement hero section animations",
    status: "in_progress",
    priority: "medium",
    dueDate: "Jan 21",
    labels: [{ text: "Development", color: "bg-blue-100 text-blue-700" }],
  },
  {
    id: "7",
    title: "Set up backend API endpoints",
    status: "in_progress",
    priority: "high",
    dueDate: "Jan 24",
    labels: [{ text: "Backend", color: "bg-cyan-100 text-cyan-700" }],
  },
  {
    id: "8",
    title: "Review footer component design",
    status: "review",
    priority: "medium",
    dueDate: "Jan 18",
    labels: [{ text: "Design", color: "bg-purple-100 text-purple-700" }],
  },
  {
    id: "9",
    title: "Test contact form validation",
    status: "review",
    priority: "urgent",
    dueDate: "Jan 19",
    labels: [{ text: "Bug", color: "bg-red-100 text-red-700" }],
  },
  {
    id: "10",
    title: "Initial project setup",
    status: "done",
    priority: "high",
    dueDate: "Jan 10",
    labels: [{ text: "Development", color: "bg-blue-100 text-blue-700" }],
  },
  {
    id: "11",
    title: "Brand guidelines documentation",
    status: "done",
    priority: "medium",
    dueDate: "Jan 12",
    labels: [{ text: "Design", color: "bg-purple-100 text-purple-700" }],
  },
];

const COLUMNS = [
  { id: "todo",        title: "TO DO",       dot: "bg-yellow-400", bg: "bg-yellow-50",  border: "border-yellow-300" },
  { id: "in_progress", title: "IN PROGRESS", dot: "bg-blue-400",   bg: "bg-blue-50",    border: "border-blue-300"   },
  { id: "review",      title: "REVIEW",      dot: "bg-pink-400",   bg: "bg-pink-50",    border: "border-pink-300"   },
  { id: "done",        title: "DONE",        dot: "bg-green-400",  bg: "bg-green-50",   border: "border-green-300"  },
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [draggingId, setDraggingId] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Drag Start: remember which task ──
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(taskId);
  };

  // ── Drop: update task metadata ──
  const handleDrop = (targetColumnId) => {
    if (!draggingId) return;

    setTasks((prev) => {
      const task = prev.find((t) => t.id === draggingId);
      if (!task || task.status === targetColumnId) return prev;

      // Show toast
      const colTitle = COLUMNS.find((c) => c.id === targetColumnId)?.title;
      setToast({ title: task.title, to: colTitle });
      setTimeout(() => setToast(null), 3000);

      // ── Update metadata ──
      return prev.map((t) =>
        t.id === draggingId
          ? {
              ...t,
              status: targetColumnId, // new column
              movedFrom: t.status, // previous column (audit)
              movedAt: new Date().toISOString(), // timestamp
            }
          : t,
      );
    });

    setDraggingId(null);
  };

  const handleDragEnd = () => setDraggingId(null);

  const donePct = Math.round(
    (tasks.filter((t) => t.status === "done").length / tasks.length) * 100,
  );

  return (
    <div onDragEnd={handleDragEnd}>
      {/* Stats Bar */}
      <div className="flex items-center gap-8 px-8 py-4 bg-white border-b border-gray-100">
        <div className="relative w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search tasks..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-10 ml-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {tasks.length}
            </div>
            <div className="text-xs text-gray-500">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{donePct}%</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">4</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-38 p-8 overflow-x-auto bg-gray-50 min-h-screen">
        {COLUMNS.map((col) => (
          <StatusColumn
            key={col.id}
            column={col}
            tasks={tasks.filter((t) => t.status === col.id)}
            draggingId={draggingId}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span>
            <span className="font-semibold">"{toast.title}"</span>
            {" → "}
            <span className="text-green-400 font-semibold">{toast.to}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
