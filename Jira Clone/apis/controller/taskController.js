const pool = require("../config/db");

function getDueLabel(dueDateString) {
  const dueDate = new Date(dueDateString);
  const today = new Date();

  // 1. Reset both dates to midnight (00:00:00) in the local timezone
  // This ensures we compare full calendar days rather than exact 24-hour timestamps
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dueDate);
  targetDate.setHours(0, 0, 0, 0);

  // 2. Calculate the difference in days
  const diffTime = targetDate - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  // 3. Use Intl.RelativeTimeFormat for automatic, localized formatting
  // 'auto' turns -1, 0, 1 into "yesterday", "today", "tomorrow"
  // 'always' would force "in 1 day", "in 0 days", "1 day ago"
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  return rtf.format(diffDays, 'day');
}

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
    project_id: project?.id,
    projectColor,
    projectBg,
    dueDate: dueDate ?? "",
    dueDateLabel: getDueLabel(dueDate),
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
    tags: task?.labels || [],
    assigned_to: task.assigned_to || []
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

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const result = await pool.query(`UPDATE tasks SET status = $1 WHERE id = $2 Returning *`  , [status, taskId]);
    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: result.rows[0],
    });
  }
  catch (err) {
    console.error("Update task status error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { createTask, fetchTasks, updateTaskStatus };
