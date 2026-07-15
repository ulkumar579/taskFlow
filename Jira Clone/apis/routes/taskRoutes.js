const express = require("express");
const authMiddleware = require("../middleware/auth");
const { createTask, fetchTasks, updateTaskStatus } = require("../controller/taskController");
const router = express.Router();

router.post("/createTask", authMiddleware, createTask);
router.get("/fetchTasks", authMiddleware, fetchTasks);
router.put("/:id", authMiddleware, updateTaskStatus);
module.exports = router