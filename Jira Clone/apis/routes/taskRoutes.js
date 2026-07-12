const express = require("express");
const authMiddleware = require("../middleware/auth");
const { createTask } = require("../controller/taskController");
const router = express.Router();

router.post("/createTask", authMiddleware, createTask);

module.exports = router