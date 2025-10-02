const router = require("express").Router();
const auth = require("../middlewares/authMiddleware"); // this exports a function
const {
  createTask,
  getTasks,
  updateTaskStatus,
  getTasksByProject,
} = require("../controllers/taskController");

// protect everything under /api/tasks
router.use(auth());

router.post("/", createTask);
router.get("/", getTasks);
router.get("/project/:projectId", getTasksByProject);
router.patch("/:id/status", updateTaskStatus);

module.exports = router;
