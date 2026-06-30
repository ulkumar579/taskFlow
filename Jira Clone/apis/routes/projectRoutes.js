const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getProject, createProject } = require("../controller/projectController");
const router = express.Router();

router.get("/getProject",authMiddleware,getProject);
router.post("/createProject",authMiddleware,createProject);

module.exports = router