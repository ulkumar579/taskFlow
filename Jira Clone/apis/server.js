const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const memberRoutes = require("./routes/teamMemberRoutes");

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ JSON middleware
app.use(express.json());

console.log("DB USER:", process.env.DB_USER);
console.log("DB PASSWORD:", process.env.DB_PASSWORD);

// ✅ Health check (Postgres test)
// app.get("/health", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json({ time: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/members", memberRoutes);

// ✅ Start server (NO mongoose)
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
