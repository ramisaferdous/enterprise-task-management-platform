const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  getTasksByProject,
} = require("../controllers/taskController");


router.use(authMiddleware());  

router.get("/", getTasks);
router.get("/project/:projectId", getTasksByProject);
router.post("/", createTask);
router.patch("/:id/status", updateTaskStatus);


module.exports = router;
