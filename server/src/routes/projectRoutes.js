const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { createProject, getProjects } = require("../controllers/projectController");

router.use(auth());

router.post("/", createProject);
router.get("/", getProjects);

module.exports = router;
