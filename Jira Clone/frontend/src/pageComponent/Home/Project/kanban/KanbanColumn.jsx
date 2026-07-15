import { memo, useState, useRef } from 'react';
import KanbanCard from './KanbanCard';

function KanbanColumn({ column, tasks, onDrop, onDragStart, onDragEnd, draggingId }) {
  const [isOver, setIsOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setIsOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsOver(false);
    onDrop(column.id);
  };

  return (
    <div
      className={`kanban-column ${isOver ? 'drag-over' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="kanban-column-header">
        <div className="kanban-column-title-wrap">
          <span className="kanban-column-dot" style={{ background: column.color }} />
          <h3 className="kanban-column-title">{column.title}</h3>
          <span className="kanban-column-count">{tasks.length}</span>
        </div>
        <button className="kanban-column-add" aria-label="Add task">+</button>
      </div>

      {/* Column body */}
      <div className="kanban-column-body" data-empty={tasks.length === 0}>
        {tasks.length === 0 ? (
          <div className="kanban-empty">
            <p>Drop tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggingId === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default memo(KanbanColumn);
