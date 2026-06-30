const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getProject, createProject, getProjectById } = require("../controller/projectController");
const router = express.Router();

router.get("/getProject",authMiddleware,getProject);
router.post("/createProject",authMiddleware,createProject);
router.get("/getProject/:id",authMiddleware,getProjectById);

module.exports = router