const bcrypt = require("bcryptjs");
const pool = require("../config/db");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await pool.query("select id from users where email=$1", [
      email,
    ]);
    console.log(user);

    if (user.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: "user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await pool.query(
      "insert into users (email,password_hash,full_name) values ($1,$2,$3) returning id, email, full_name, created_at",
      [email, hashedPassword, name],
    );

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      data: createUser.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

const userVo = async (req, res) => {
  const  {id,email,full_name,created_at,role} = pool.query("")
};

module.exports = { createUser, userVo };
