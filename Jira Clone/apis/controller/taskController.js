const pool = require("../config/db");

const normalizeTaskForClient = (task) => {
  const project = task.project && typeof task.project === "object" ? task.project : null;
  const projectName = project?.name || task.project_name || "Project";
  const projectColor = project?.color || "#8b5cf6";
  const projectBg = project?.bg || "#f5f3ff";
  const iconBg = project?.iconBg || "#fce7f3";
  const iconColor = project?.iconColor || "#ec4899";
  const lucideIcon = project?.lucideIcon || "Monitor";

  const dueDate = task.due_date || task.dueDate || "";
  const normalizedStatus = (task.status || "active").toLowerCase();
  const status = ["active", "todo", "to-do", "pending"].includes(normalizedStatus)
    ? "todo"
    : normalizedStatus === "in_progress" || normalizedStatus === "in-progress"
      ? "in-progress"
      : normalizedStatus === "review" || normalizedStatus === "pending_review"
        ? "review"
        : normalizedStatus === "completed" || normalizedStatus === "done"
          ? "completed"
          : "todo";

  const dueDateState = status === "completed"
    ? "completed"
    : !dueDate
      ? "future"
      : (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const due = new Date(dueDate);
          due.setHours(0, 0, 0, 0);
          if (due < today) return "overdue";
          if (due.getTime() === today.getTime()) return "today";
          return "future";
        })();

  return {
    id: task.id,
    name: task.title || task.name || "Untitled task",
    description: task.description || "No description provided",
    priority: task.priority || "medium",
    status,
    project: projectName,
    projectColor,
    projectBg,
    dueDate: dueDate ?? "",
    dueDateLabel:
      status === "completed"
        ? "Completed"
        : dueDateState === "overdue"
          ? "Overdue"
          : dueDateState === "today"
            ? "Today"
            : dueDate
              ? "Scheduled"
              : "No due date",
    dueDateState,
    comments: task.comments || 0,
    attachments: task.attachments || 0,
    estimate: task.estimate || "0h",
    completed: status === "completed",
    lucideIcon,
    iconBg,
    iconColor,
    avatars: task.avatars || [],
    extra: task.extra || 0,
  };
};

// controllers/taskController.js
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      dueDate,
      priority,
      assigneeIds,
      labels,
    } = req.body;
    const createdBy = req.user.userId; // from JWT token

    // ── Validation ──
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!project?.id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // ── Insert task ──
    const result = await pool.query(
      `INSERT INTO tasks 
        (project_id, created_by, title, description, due_date, priority,assigned_to, labels,project)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7,$8,$9)
       RETURNING *`,
      [
        project.id, // $1 → project_id (uuid)
        createdBy, // $2 → created_by (from token)
        title.trim(), // $3 → title
        description?.trim() || null, // $4 → description (optional)
        dueDate || null, // $5 → due_date (optional)
        priority || "medium", // $6 → priority (default medium)
        assigneeIds || null, // $7 → assigned_to (first assignee)
        labels || [],
        project, // $8 → labels (text array)
      ],
    );

    const createdTask = normalizeTaskForClient(result?.rows[0]);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: createdTask,
    });
  } catch (err) {
    console.error("Add task error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchTasks = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM tasks`);
    const tasks = (result?.rows || []).map((task) => normalizeTaskForClient(task));

    return res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (err) {
    console.error("Fetch tasks error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createTask, fetchTasks };
