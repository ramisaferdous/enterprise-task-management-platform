// src/controllers/projectController.js
const Project = require("../models/project");
const Task = require("../models/task");
const AuditLog = require("../models/auditLog");

exports.createProject = async (req, res) => {
  try {
    const { title, description, members, firstTask } = req.body;

    const project = await Project.create({
      title,
      description,
      ownerId: Number(req.user.id),
      members: Array.isArray(members) ? members : [],
    });

    const projIdStr = project._id.toString();

    await AuditLog.create({
      userId: Number(req.user.id),
      action: "CREATE",
      entity: "Project",
      entityId: projIdStr,                  // ✅ STRING ONLY
      details: { title, description },
    });

    // optional first task
    if (firstTask?.title) {
      const t = await Task.create({
        title: firstTask.title,
        description: firstTask.description || "",
        projectId: project._id,
        priority: firstTask.priority || "medium",
        dueDate: firstTask.dueDate || null,
      });

      await AuditLog.create({
        userId: Number(req.user.id),
        action: "CREATE",
        entity: "Task",
        entityId: t._id.toString(),         // ✅ STRING ONLY
        details: { title: t.title, projectId: projIdStr },
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
      $or: [{ ownerId: Number(req.user.id) }, { members: Number(req.user.id) }],
    }).sort({ updatedAt: -1 });

    await AuditLog.create({
      userId: Number(req.user.id),
      action: "READ",
      entity: "Project",
      details: { count: projects.length },
    });

    res.json(projects);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ msg: "Error fetching projects", error: err.message });
  }
};
