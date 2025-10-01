const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  getTasksByProject,
} = require("../controllers/taskController");


router.use(authMiddleware());  

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id/status", updateTaskStatus);
router.get("/project/:projectId", getTasksByProject);

module.exports = router;
