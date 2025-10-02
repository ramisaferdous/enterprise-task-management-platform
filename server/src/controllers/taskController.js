// src/controllers/taskController.js
const Task = require("../models/task");
const Project = require("../models/project");
const AuditLog = require("../models/auditLog");

async function canAccessProject(userId, projectId) {
  const p = await Project.findOne({
    _id: projectId,
    $or: [{ ownerId: Number(userId) }, { members: Number(userId) }],
  });
  return !!p;
}

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
      dependencies = [],
    } = req.body;

    if (!(await canAccessProject(req.user.id, projectId))) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      projectId,
      assignedTo: assignedTo != null ? Number(assignedTo) : undefined,
      priority: priority || "medium",
      dueDate: dueDate || null,
      dependencies,
    });

    await AuditLog.create({
      userId: Number(req.user.id),
      action: "CREATE",
      entity: "Task",
      entityId: task._id.toString(),       // ✅ STRING
      details: { title, projectId: String(projectId), assignedTo },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    await AuditLog.create({
      userId: Number(req.user.id),
      action: "UPDATE_STATUS",
      entity: "Task",
      entityId: task._id.toString(),       // ✅ STRING
      details: { newStatus: status },
    });

    res.json(task);
  } catch (err) {
    console.error("updateTaskStatus error:", err);
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ ownerId: Number(req.user.id) }, { members: Number(req.user.id) }],
    }).select("_id");

    const ids = projects.map((p) => p._id);
    const tasks = await Task.find({ projectId: { $in: ids } }).sort({ updatedAt: -1 });

    await AuditLog.create({
      userId: Number(req.user.id),
      action: "READ",
      entity: "Task",
      details: { count: tasks.length },
    });

    res.json(tasks);
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!(await canAccessProject(req.user.id, projectId))) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const tasks = await Task.find({ projectId }).sort({ updatedAt: -1 });

    await AuditLog.create({
      userId: Number(req.user.id),
      action: "READ",
      entity: "Task",
      entityId: projectId.toString(),       
      details: { projectId: projectId.toString(), count: tasks.length },
    });

    res.json(tasks);
  } catch (err) {
    console.error("getTasksByProject error:", err);
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};