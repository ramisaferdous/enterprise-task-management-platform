const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTaskStatus, getTasksByProject } = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware(), createTask);
router.get("/", authMiddleware(), getTasks);
router.patch("/:id/status", authMiddleware(), updateTaskStatus);
router.get("/project/:projectId", authMiddleware(), getTasksByProject);

module.exports = router;