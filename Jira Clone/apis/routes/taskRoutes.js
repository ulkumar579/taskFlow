const express = require("express");
const authMiddleware = require("../middleware/auth");
const { addTask } = require("../controller/taskController");
const router = express.Router();

router.post("/addTask",authMiddleware,addTask);

module.exports = router