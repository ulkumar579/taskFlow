const pool = require("../config/db");

const addTask = async (req, res) => {
  const { values } = req.body.data;
  
  return res.status(200).json({
    success: true,
    message: "user already exists",
  });
};

module.exports = { addTask };
