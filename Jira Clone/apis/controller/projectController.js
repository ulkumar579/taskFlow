const pool = require("../config/db");

const getProject = async (req, res) => {
  const project = await pool.query(
    "select id,name,description,color,visibility,COALESCE(members, ARRAY[]::TEXT[]) AS members,color,status,extraMembers,totaltasks,progress  from  projects",
  );
  return res.status(200).json({
    message: "Successfull",
    data: {
      metadata: project?.fields,
      resultset: project.rows,
      rowCount: project.rowCount,
    },
  });
};

const createProject = async (req, res) => {
  try {
    const { name, description, color, memberIds } = req.body;
    const ownerId = req.user.userId;
    if (
      name === "" ||
      name === undefined ||
      description === "" ||
      description === undefined
    ) {
      return res.status(400).json({
        sucess: false,
        missing_fields: ["name", "description"],
      });
    }
    const project = await pool.query(
      "insert into projects (name, description, color, members,owner_id) values ($1, $2, $3, $4, $5) returning id, name, description, color, members,owner_id",
      [name, description, color, memberIds, ownerId],
    );
    return res.status(200).json({
      success: true,
      message: "Project created successfully",
      data: project.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProjectMembers = async (req, res) => {
  const project = await pool.query(
    "select id,name,description,color,visibility,COALESCE(members, ARRAY[]::TEXT[]) AS members,color,status,extraMembers,totaltasks,progress  from  projects",
  );
  return res.status(200).json({
    message: "Successfull",
    data: {
      metadata: project?.fields,
      resultset: project.rows,
      rowCount: project.rowCount,
    },
  });
};

module.exports = { getProject, createProject };
