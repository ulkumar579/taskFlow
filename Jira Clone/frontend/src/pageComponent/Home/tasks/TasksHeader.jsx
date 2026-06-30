import { useEffect, useState, memo } from 'react';
import { Plus, Sparkles } from 'lucide-react';

const TasksHeader = memo(function TasksHeader({ onAddTask }) {
  const [sparklePos, setSparklePos] = useState({ x: '25%', y: '30%' });

  useEffect(() => {
    let id;
    const move = () => {
      setSparklePos({ x: `${10 + Math.random() * 80}%`, y: `${10 + Math.random() * 80}%` });
      id = setTimeout(move, 6000 + Math.random() * 2000);
    };
    id = setTimeout(move, 6000);
    return () => clearTimeout(id);
  }, []);

  return (
    <div
      className="tasks-header-anim flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
          Tasks
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--color-muted)' }}>
          Manage and organize your team&apos;s work efficiently. 🚀
        </p>
      </div>

      <button
        onClick={onAddTask}
        className="add-task-btn new-project-btn self-start flex items-center gap-2 text-white font-semibold text-sm px-5 py-2.5 rounded-xl"
      >
        <span
          className="sparkle-dot"
          style={{ width: 5, height: 5, top: sparklePos.y, left: sparklePos.x }}
        />
        <Plus size={17} />
        Add Task
        <Sparkles size={13} fill="rgba(255,255,255,.65)" className="text-white/65" />
      </button>
    </div>
  );
});

export default TasksHeader;
