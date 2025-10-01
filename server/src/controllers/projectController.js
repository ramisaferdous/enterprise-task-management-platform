const Project = require("../models/project");


exports.createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    const project = new Project({
      title,
      description,
      ownerId: req.user.id,
      members: members || [],
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error creating project", error: err.message });
  }
};


exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ ownerId: req.user.id }, { members: req.user.id }],
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects", error: err.message });
  }
};
