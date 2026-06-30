const pool = require("../config/db");

const getTeamMembers = async (req, res) => {
  const teamMember = await pool.query("select id, name, email from teamMember");
  console.log(teamMember);
  return res.status(200).json({
    success: true,
    data: {
      metadata: teamMember?.fields,
      resultset: teamMember.rows,
      rowCount: teamMember.rowCount,
    },
  });
};

module.exports = { getTeamMembers };
