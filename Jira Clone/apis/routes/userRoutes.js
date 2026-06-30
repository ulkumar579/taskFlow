const express = require("express");
const router = express.Router();
const { createUser, userVo } = require("../controller/userController");
const { login, googleLogin } = require("../controller/authController");
const authMiddleware = require("../middleware/auth");
const { addTask } = require("../controller/taskController");

router.post("/createUser", createUser);

router.post("/login", login);

router.post("/googleLogin", googleLogin);

router.get("/userVo", authMiddleware, userVo);

module.exports = router;
