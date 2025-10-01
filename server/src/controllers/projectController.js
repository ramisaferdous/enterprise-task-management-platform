const Project = require("../models/project");
const AuditLog = require('../models/auditLog');


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

    
    await AuditLog.create({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'Project',
      entityId: project._id,
      details: { title, description } 
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: "Error creating project", error: err.message });
  }
};


exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ ownerId: req.user.id }, { members: req.user.id }],
    }).sort({ updatedAt: -1 });
    
    await AuditLog.create({
      userId: req.user.id,
      action: "READ",
      entity: "Project",
      details: { count: projects.length },
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects", error: err.message });
  }
};
