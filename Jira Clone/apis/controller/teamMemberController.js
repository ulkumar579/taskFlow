const pool = require("../config/db");

let avatarForMember = [
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1",
  "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg",
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1"
]
const getTeamMembers = async (req, res) => {
  const teamMember = await pool.query("select id, name, email from teamMember");
  const resultSet = (teamMember.rows || []).map((member, index) => ({
    ...member,
    avatar: avatarForMember[index % avatarForMember.length],
  }));

  return res.status(200).json({
    success: true,
    data: {
      metadata: teamMember?.fields,
      resultset: resultSet,
      rowCount: resultSet.length,
    },
  });
};

module.exports = { getTeamMembers };
