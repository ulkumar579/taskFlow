import { memo } from 'react';
import TaskRow from './TaskRow';
import TaskSkeleton from './TaskSkeleton';
import TaskEmptyState from './TaskEmptyState';

const TaskList = memo(function TaskList({ tasks, loading, onToggle }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <TaskEmptyState />;
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task, i) => (
        <TaskRow
          key={task.id}
          task={task}
          delay={i * 70}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
});

export default TaskList;
