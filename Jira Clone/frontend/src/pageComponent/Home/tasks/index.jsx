import { useState, useEffect, useMemo, useCallback } from "react";
import TasksHeader from "../tasks/TasksHeader";
import TaskFilters from "../tasks/TaskFilters";
import StatusTabs from "../tasks/StatusTabs";
import TaskList from "../tasks/TaskList";
import Pagination from "../project/Pagination";
import { useDropdown } from "../hooks/useDropdown";
import { TASKS } from "./tasksData";
import AddTaskModal from "./AddTaskModal";
import api from "@/utils/api";

const PER_PAGE = 4;

export default function TasksPage() {
  const [tasks, setTasks] = useState(TASKS);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    assignee: "",
    dueDate: "",
  });
  const [sort, setSort] = useState("Newest");
  const [view, setView] = useState("list");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const dropdown = useDropdown();

  const createTask = async (data) => {
    const res = await api
      .post("/task/createTask", data)
      .then((res) => {
        console.log("Task created:", res.data);
        setTasks((prev) => [...prev, res.data]);
      })
      .catch((err) => {
        console.error("Error creating task:", err);
      });

  };

  /* Simulate load */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  /* Reset page when filters change */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeTab, filters, sort]);

  /* Toggle task completion */
  const handleToggle = useCallback((id, checked) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: checked,
              status: checked
                ? "completed"
                : t.status === "completed"
                  ? "todo"
                  : t.status,
              dueDateLabel: checked
                ? "Completed"
                : t.dueDateState !== "completed"
                  ? t.dueDateLabel
                  : "Completed",
              dueDateState: checked
                ? "completed"
                : t.dueDateState === "completed"
                  ? "future"
                  : t.dueDateState,
            }
          : t,
      ),
    );
  }, []);

  const handleFilter = useCallback((key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  /* Status map for filtering */
  const STATUS_MAP = {
    "To Do": "todo",
    "In Progress": "in-progress",
    Review: "review",
    Completed: "completed",
  };
  const PRIORITY_MAP = { High: "high", Medium: "medium", Low: "low" };

  /* Filtered tasks */
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const q = debouncedSearch.toLowerCase();
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.project.toLowerCase().includes(q);
      const matchTab = activeTab === "all" || t.status === activeTab;
      const matchPriority =
        !filters.priority || t.priority === PRIORITY_MAP[filters.priority];
      const matchStatus =
        !filters.status || t.status === STATUS_MAP[filters.status];
      const matchAssignee = !filters.assignee; /* simplified */
      const matchDue =
        !filters.dueDate ||
        (filters.dueDate === "Today" && t.dueDateState === "today") ||
        (filters.dueDate === "Overdue" && t.dueDateState === "overdue");
      return (
        matchSearch &&
        matchTab &&
        matchPriority &&
        matchStatus &&
        matchAssignee &&
        matchDue
      );
    });
  }, [tasks, debouncedSearch, activeTab, filters]);

  /* Status counts */
  const counts = useMemo(
    () => ({
      all: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      "in-progress": tasks.filter((t) => t.status === "in-progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks],
  );

  /* Sorted */
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "Alphabetical")
      arr.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "Priority") {
      const pOrder = { high: 0, medium: 1, low: 2 };
      arr.sort((a, b) => pOrder[a.priority] - pOrder[b.priority]);
    } else if (sort === "Due Date")
      arr.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return arr;
  }, [filtered, sort]);

  /* Paginated */
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paged = useMemo(
    () => sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [sorted, page],
  );

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* Background blobs */}
      <div
        className="page-blob w-[480px] h-[480px]"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,.07), transparent)",
          top: "5%",
          right: "-12%",
        }}
      />
      <div
        className="page-blob w-[360px] h-[360px]"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,.05), transparent)",
          bottom: "15%",
          left: "-10%",
          animationDelay: "4s",
        }}
      />

      <main className="relative z-10 pt-[80px] px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto pb-16">
        {/* Header */}
        <TasksHeader onAddTask={() => setTaskModalOpen(true)} />

        {/* Filters row */}
        <TaskFilters
          search={search}
          onSearch={setSearch}
          filters={filters}
          onFilter={handleFilter}
          sort={sort}
          onSort={setSort}
          view={view}
          onView={setView}
          dropdown={dropdown}
        />

        {/* Status tabs */}
        <StatusTabs
          active={activeTab}
          counts={counts}
          onChange={setActiveTab}
        />

        {/* Task list */}
        <TaskList
          tasks={paged}
          loading={loading}
          onToggle={handleToggle}
          dropdown={dropdown}
          view={view}
        />

        <AddTaskModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          onCreate={(data) => createTask(data)}
        />

        {/* Pagination + count */}
        {!loading && sorted.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <Pagination current={page} total={totalPages} onChange={setPage} />
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Showing {Math.min((page - 1) * PER_PAGE + 1, sorted.length)}–
              {Math.min(page * PER_PAGE, sorted.length)} of {sorted.length}{" "}
              tasks
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
