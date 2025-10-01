const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createProject,
  getProjects,
} = require("../controllers/projectController");


router.use(authMiddleware()); 

router.post("/", createProject);
router.get("/", getProjects);

module.exports = router;
