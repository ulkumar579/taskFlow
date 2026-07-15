import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Layers, Code2, Smartphone, Globe, BarChart3, Plug,
  CalendarDays, Users, MoreHorizontal, Plus, Filter, Search,
  CheckCircle2, CircleDot, CircleDashed, Circle, TrendingUp,
} from 'lucide-react';
import { PROJECTS, PROJECT_TASKS } from './projects';
import KanbanColumn from './kanban/KanbanColumn';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskStatus } from '@/store/slice/taskSlice';
import api from '@/utils/api';

const ICON_MAP = { Layers, Code2, Smartphone, Globe, BarChart3, Plug };

const COLUMNS = [
  { id: 'todo',        title: 'To Do',       color: '#6b7280' },
  { id: 'in-progress', title: 'In Progress', color: '#3b82f6' },
  { id: 'review',      title: 'Review',      color: '#8b5cf6' },
  { id: 'completed',   title: 'Completed',   color: '#22c55e' },
];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectStored = useSelector((state)=>state.projects.items)
  const tasksStored = useSelector((state) => state.tasks.items);
  const project = useMemo(() => projectStored.find((p) => p.id === id), [id]);

  const initialTasks = useMemo(
    () => {
        return tasksStored.filter((t)=>t.project_id === id)
    },
    [id]
  );

  const [tasks, setTasks] = useState(initialTasks);
  const [draggingId, setDraggingId] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const dispatch = useDispatch();
  /* Reset state when project changes */
  useEffect(() => {
    // setTasks(PROJECT_TASKS[Number(id)] ? [...PROJECT_TASKS[Number(id)]] : []);
    setDraggingId(null);
    setSearch('');
    setActiveFilter('all');
  }, [id]);

  const handleDragStart = useCallback((e, taskId) => {
    setDraggingId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(taskId));
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
  }, []);

  const handleDrop = useCallback(
    async (columnId) => {
      if (draggingId === null) return;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === draggingId ? { ...task, status: columnId } : task
        )
      );

      try{
        const res = await api.put(`/task/${draggingId}`, {
          status: columnId,
          taskId: draggingId
        });
        if(res.status === 200){
          dispatch(updateTaskStatus({ taskId: draggingId, status: columnId }));
          toast.success('Task updated successfully');
        }
        else{
          toast.error('Failed to update task');
        }
      }
      catch(error){
        console.error(error);
      }
      setDraggingId(null);
    },
    [draggingId]
  );

  /* Derived stats */
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, todo, progress };
  }, [tasks]);

  /* Filter tasks */
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === 'all' || t.priority === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, activeFilter]);

  const tasksByColumn = useMemo(() => {
    const map = {};
    for (const col of COLUMNS) {
      map[col.id] = filteredTasks.filter((t) => t.status === col.id);
    }
    return map;
  }, [filteredTasks]);

  if (!project) {
    return (
      <main className="pt-[80px] px-6 max-w-3xl mx-auto">
        <div className="text-center py-20">
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Project not found</p>
          <Link to="/projects" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const IconComp = ICON_MAP[project.lucideIcon] || Layers;

  return (
    <main className="pt-[80px] pb-12 max-w-[1440px] mx-auto px-4 md:px-8">
      {/* Breadcrumb / back */}
      <div className="mb-5 flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft size={15} />
          Projects
        </button>
        <span>/</span>
        <span style={{ color: 'var(--color-text)' }} className="font-medium">{project.name}</span>
      </div>

      {/* Project header */}
      <div
        className="project-detail-header"
        style={{ '--project-color': project.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Icon */}
          <div
            className="project-detail-icon"
            style={{ background: project.iconBg }}
          >
            <IconComp size={28} style={{ color: project.iconColor }} />
          </div>

          {/* Title + description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
                {project.name}
              </h1>
              <span
                className="project-detail-priority-badge"
                style={{
                  background: `${project.borderColor}18`,
                  color: project.borderColor,
                }}
              >
                {project.priority} priority
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              {project.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs" style={{ color: 'var(--color-muted)' }}>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                Due {project.dueDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={13} />
                {project.members} members
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={13} />
                {project.category}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="project-detail-btn">
              <MoreHorizontal size={15} />
            </button>
            <button className="project-detail-btn-primary">
              <Plus size={15} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="project-detail-stats">
          <div className="project-detail-stat">
            <div className="project-detail-stat-icon" style={{ background: 'rgba(107,114,128,.10)', color: '#6b7280' }}>
              <Circle size={15} />
            </div>
            <div>
              <p className="project-detail-stat-value">{stats.todo}</p>
              <p className="project-detail-stat-label">To Do</p>
            </div>
          </div>
          <div className="project-detail-stat">
            <div className="project-detail-stat-icon" style={{ background: 'rgba(59,130,246,.10)', color: '#3b82f6' }}>
              <CircleDot size={15} />
            </div>
            <div>
              <p className="project-detail-stat-value">{stats.inProgress}</p>
              <p className="project-detail-stat-label">In Progress</p>
            </div>
          </div>
          <div className="project-detail-stat">
            <div className="project-detail-stat-icon" style={{ background: 'rgba(34,197,94,.10)', color: '#22c55e' }}>
              <CheckCircle2 size={15} />
            </div>
            <div>
              <p className="project-detail-stat-value">{stats.done}</p>
              <p className="project-detail-stat-label">Completed</p>
            </div>
          </div>
          <div className="project-detail-stat">
            <div className="project-detail-stat-icon" style={{ background: `${project.borderColor}15`, color: project.borderColor }}>
              <TrendingUp size={15} />
            </div>
            <div>
              <p className="project-detail-stat-value">{stats.progress}%</p>
              <p className="project-detail-stat-label">Progress</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="project-detail-progress">
          <div className="project-detail-progress-track">
            <div
              className="project-detail-progress-fill"
              style={{ width: `${stats.progress}%`, background: project.borderColor }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="kanban-toolbar">
        <div className="kanban-toolbar-left">
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
            Kanban Board
          </h2>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Drag cards between columns to update status
          </span>
        </div>

        <div className="kanban-toolbar-right">
          {/* Search */}
          <div className="kanban-search">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 text-xs bg-transparent outline-none text-[var(--color-text)]"
            />
          </div>

          {/* Priority filter */}
          <div className="kanban-filters">
            {['all', 'high', 'medium', 'low'].map((f) => (
              <button
                key={f}
                className={`kanban-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasksByColumn[col.id] || []}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggingId={draggingId}
          />
        ))}
      </div>
    </main>
  );
}
