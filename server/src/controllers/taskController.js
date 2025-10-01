const mongoose = require("mongoose");
const Task = require("../models/task");
const Project = require("../models/project");
const AuditLog = require("../models/auditLog"); // keep if you have it

const { isValidObjectId, Types } = mongoose;

async function canAccessProject(userId, projectId) {
  if (!isValidObjectId(projectId)) return false;

 
  return !!(await Project.findOne({
    _id: projectId,
    $or: [{ ownerId: userId }, { members: userId }],
  }).select("_id"));
}


exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate, dependencies } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ msg: "title and projectId are required" });
    }
    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ msg: "Invalid projectId" });
    }
    const allowed = await canAccessProject(req.user.id, projectId);
    if (!allowed) return res.status(403).json({ msg: "Forbidden" });

    const task = new Task({
      title: String(title).trim(),
      description: description || "",
      projectId: projectId,                          // valid ObjectId string
      assignedTo: assignedTo ? Number(assignedTo) : undefined,
      priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      dependencies: Array.isArray(dependencies)
        ? dependencies.filter(isValidObjectId).map((id) => Types.ObjectId(id))
        : [],
    });

    await task.save();

    try {
      await AuditLog.create({
        userId: req.user.id,
        action: "CREATE",
        entity: "Task",
        entityId: task._id,
        details: { title: task.title, projectId: task.projectId, assignedTo: task.assignedTo },
      });
    } catch (_) { }

    res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};


exports.getTasks = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ ownerId: req.user.id }, { members: req.user.id }],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } })
      .sort({ updatedAt: -1 });

    try {
      await AuditLog.create({
        userId: req.user.id,
        action: "READ",
        entity: "Task",
        details: { count: tasks.length },
      });
    } catch (_) {  }

    res.json(tasks);
  } catch (err) {
    console.error("getTasks error:", err);
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};


exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid task id" });
    }
    if (!["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    
    const allowed = await canAccessProject(req.user.id, task.projectId);
    if (!allowed) return res.status(403).json({ msg: "Forbidden" });

    task.status = status;
    await task.save();

    try {
      await AuditLog.create({
        userId: req.user.id,
        action: "UPDATE_STATUS",
        entity: "Task",
        entityId: task._id,
        details: { newStatus: status },
      });
    } catch (_) { /* optional */ }

    res.json(task);
  } catch (err) {
    console.error("updateTaskStatus error:", err);
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
};


exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ msg: "Invalid projectId" });
    }
    const allowed = await canAccessProject(req.user.id, projectId);
    if (!allowed) return res.status(403).json({ msg: "Forbidden" });

    const tasks = await Task.find({ projectId }).sort({ updatedAt: -1 });

    try {
      await AuditLog.create({
        userId: req.user.id,
        action: "READ",
        entity: "Task",
        details: { projectId, count: tasks.length },
      });
    } catch (_) { }

    res.json(tasks);
  } catch (err) {
    console.error("getTasksByProject error:", err);
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};
