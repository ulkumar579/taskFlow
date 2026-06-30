const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getTeamMembers } = require("../controller/teamMemberController");
const router = express.Router();

router.get("/getMember",authMiddleware,getTeamMembers);

module.exports = router