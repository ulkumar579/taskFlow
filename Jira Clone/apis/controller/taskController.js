const pool = require("../config/db");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description = "",
      project,
      dueDate,
      priority = "medium",
      assigneeIds,
      assignees,
      labels = [],
      status = "todo",
    } = req.body;

    const createdBy = req.user?.userId || null;

    const projectValue =
      typeof project === "object" && project !== null
        ? project.id ?? project.projectId ?? project.project_id ?? project._id ?? null
        : project ?? null;

    const normalizedAssigneeIds = Array.isArray(assigneeIds)
      ? assigneeIds.filter(Boolean)
      : Array.isArray(assignees)
        ? assignees
            .map((item) => (typeof item === "object" ? item?.id ?? null : item))
            .filter(Boolean)
        : assignees
          ? [assignees]
          : [];

    const assignedToValue = normalizedAssigneeIds[0] ?? null;
    const normalizedLabels = Array.isArray(labels)
      ? labels
      : [labels].filter(Boolean);

    if (!title || !projectValue) {
      return res.status(400).json({
        success: false,
        missing_fields: [
          ...(title ? [] : ["title"]),
          ...(projectValue ? [] : ["projectId"]),
        ],
      });
    }

    let task;
    try {
      task = await pool.query(
        `INSERT INTO tasks (
          title,
          description,
          project,
          due_date,
          priority,
          assigned_to,
          labels,
          status,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, title, description, project, due_date, priority, assigned_to, labels, status, created_by`,
        [
          title,
          description,
          projectValue,
          dueDate || null,
          priority,
          assignedToValue,
          normalizedLabels,
          status,
          createdBy,
        ],
      );
    } catch (err) {
      if (String(err.message).includes('column "project"')) {
        task = await pool.query(
          `INSERT INTO tasks (
            title,
            description,
            project_id,
            due_date,
            priority,
            assigned_to,
            labels,
            status,
            created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id, title, description, project_id, due_date, priority, assigned_to, labels, status, created_by`,
          [
            title,
            description,
            projectValue,
            dueDate || null,
            priority,
            assignedToValue,
            normalizedLabels,
            status,
            createdBy,
          ],
        );
      } else {
        throw err;
      }
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = { createTask };
