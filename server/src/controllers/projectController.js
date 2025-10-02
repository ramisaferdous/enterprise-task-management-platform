const Project = require("../models/project");
const Task = require("../models/task")
const AuditLog = require('../models/auditLog');


exports.createProject = async (req, res) => {
  try {
    const { title, description, members,firstTask } = req.body;

    const project = new Project({
      title,
      description,
      ownerId: req.user.id,
      members: Array.isArray(members) ? members : [],
    });

    await project.save();

    
    await AuditLog.create({
      userId: req.user.id,
      action: 'CREATE',
      entity: 'Project',
      entityId: String(project._id),
      details: { title, description } 
    });

    if (firstTask && firstTask.title) {
      const t = await Task.create({
        title: firstTask.title,
        description: firstTask.description || "",
        projectId: project._id,
        priority: firstTask.priority || "medium",
        dueDate: firstTask.dueDate || null,
      });

      await AuditLog.create({
        userId: req.user.id,
        action: "CREATE",
        entity: "Task",
        entityId: String(t._id),         // <—
        details: { title: t.title, projectId: String(project._id) },
      });
    }

    res.status(201).json(project);
  } catch (err) {
    console.error("createProject error:", err);
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
