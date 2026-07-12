const pool = require("../config/db");

/* ── Color → cosmetic metadata (same idea as the frontend utility) ── */
const COLOR_META = {
  "#7c3aed": { lucideIcon: "Layers", emoji: "🎨", category: "Design" },
  "#3b82f6": { lucideIcon: "BarChart3", emoji: "📊", category: "Analytics" },
  "#22c55e": { lucideIcon: "Smartphone", emoji: "📱", category: "Mobile" },
  "#f97316": { lucideIcon: "Code2", emoji: "⚙️", category: "Development" },
  "#ec4899": { lucideIcon: "Layers", emoji: "🎨", category: "Design" },
  "#ef4444": { lucideIcon: "Globe", emoji: "🌐", category: "Marketing" },
  "#1f2937": { lucideIcon: "Plug", emoji: "🔌", category: "Integration" },
  "#14b8a6": { lucideIcon: "Smartphone", emoji: "📱", category: "Mobile" },
};
const FALLBACK = { lucideIcon: "Layers", emoji: "📁", category: "Project" };

/* ── hex → lighter shade for gradient backgrounds ── */
function mixWithWhite(hex, ratio) {
  const h = hex.replace("#", "");
  const n = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const mr = Math.round(r + (255 - r) * ratio);
  const mg = Math.round(g + (255 - g) * ratio);
  const mb = Math.round(b + (255 - b) * ratio);
  return `rgb(${mr}, ${mg}, ${mb})`;
}

function normalizeMemberIds(members) {
  if (!Array.isArray(members)) return [];

  return members
    .map((member) => {
      if (typeof member === "number" || typeof member === "string")
        return member;
      if (member && typeof member === "object") {
        return member.id ?? member.memberId ?? member.member_id ?? null;
      }
      return null;
    })
    .filter(
      (memberId) =>
        memberId !== null && memberId !== undefined && memberId !== "",
    );
}

/* ── Build the full card JSON from a raw project row + its tasks ── */
function buildProjectCard(project, tasks) {
  const color = project.color || "#7c3aed";
  const meta = COLOR_META[color] || FALLBACK;

  /* progress: completed / total */
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  /* priority: highest among tasks */
  const rank = { high: 3, medium: 2, low: 1 };
  const priority = tasks.length
    ? tasks.reduce(
        (top, t) => (rank[t.priority] > rank[top] ? t.priority : top),
        "low",
      )
    : "medium";

  /* due date: earliest non-completed task */
  const upcoming = tasks
    .filter((t) => t.status !== "completed" && t.due_date)
    .map((t) => t.due_date)
    .sort()[0];
  const dueDate = upcoming
    ? new Date(upcoming).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";

  /* members → selected member IDs + extra count */
  const memberIds = normalizeMemberIds(project.members || []);
  const avatars = memberIds.slice(0, 3);
  const extra = Math.max(0, memberIds.length - 3);

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    color,
    priority,
    progress,
    dueDate,
    category: meta.category,
    categoryColor: color,
    categoryBg: mixWithWhite(color, 0.88),
    icon: meta.emoji,
    iconBg: `linear-gradient(135deg, ${mixWithWhite(color, 0.92)}, ${mixWithWhite(color, 0.82)})`,
    iconColor: color,
    borderColor: color,
    progressColor: color,
    avatars,
    extra,
    lucideIcon: meta.lucideIcon,
  };
}

/* ──────────────────────────────────────────────────────────── */

const getProject = async (req, res) => {
  try {
    /* 1. Fetch all projects */
    const projectsRes = await pool.query("SELECT * FROM projects");
    const projects = projectsRes.rows;

    /* 2. Fetch all tasks for those projects in one query */
    const projectIds = projects.map((p) => p.id);
    let tasksByProject = {};
    if (projectIds.length > 0) {
      const tasksRes = await pool.query(
        "SELECT project_id, title, status, priority, due_date FROM tasks WHERE project_id = ANY($1)",
        [projectIds],
      );
      tasksByProject = tasksRes.rows.reduce((acc, t) => {
        if (!acc[t.project_id]) acc[t.project_id] = [];
        acc[t.project_id].push(t);
        return acc;
      }, {});
    }

    /* 3. Derive the full card JSON for each project */
    const resultset = projects.map((p) =>
      buildProjectCard(p, tasksByProject[p.id] || []),
    );

    return res.status(200).json({
      message: "Successful",
      data: {
        metadata: projectsRes.fields,
        resultset,
        rowCount: projectsRes.rowCount,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* ──────────────────────────────────────────────────────────── */

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const projectRes = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id],
    );
    if (projectRes.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const tasksRes = await pool.query(
      "SELECT title, status, priority, due_date FROM tasks WHERE project_id = $1",
      [id],
    );

    const card = buildProjectCard(projectRes.rows[0], tasksRes.rows);

    return res.status(200).json({ success: true, data: card });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* ──────────────────────────────────────────────────────────── */

const createProject = async (req, res) => {
  try {
    const { name, description, color, memberIds } = req.body;
    const ownerId = req.user.userId;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        missing_fields: ["name", "description"],
      });
    }

    const project = await pool.query(
      "INSERT INTO projects (name, description, color, members, owner_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, color, members, owner_id",
      [name, description, color, memberIds || [], ownerId],
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, memberIds } = req.body;

    const projectRes = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id],
    );
    if (projectRes.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const updatedProject = await pool.query(
      "UPDATE projects SET name = $1, description = $2, color = $3, members = $4 WHERE id = $5 RETURNING *",
      [name, description, color, memberIds || [], id],
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const projectRes = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id],
    );
    if (projectRes.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    await pool.query("DELETE FROM projects WHERE id = $1", [id]);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getProject,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
