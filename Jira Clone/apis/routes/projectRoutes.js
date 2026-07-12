const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getProject, createProject, getProjectById, updateProject, deleteProject } = require("../controller/projectController");
const router = express.Router();

router.get("/getProject",authMiddleware,getProject);
router.post("/createProject",authMiddleware,createProject);
router.get("/getProject/:id",authMiddleware,getProjectById);
router.post("/updateProject/:id",authMiddleware,updateProject);
router.delete("/deleteProject/:id",authMiddleware,deleteProject);

module.exports = router