// server/src/controllers/taskController.js
const mongoose = require("mongoose");
const Task = require("../models/task");
const Project = require("../models/project");
const AuditLog = require("../models/auditLog");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(String(id));

async function canAccessProject(userId, projectId) {
  if (!isValidObjectId(projectId)) return false;

  const project = await Project.findOne({
    _id: projectId,
    $or: [{ ownerId: Number(userId) }, { members: Number(userId) }],
  }).select("_id");

  return !!project;
}

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ msg: "title and projectId are required" });
    }
    if (!(await canAccessProject(req.user.id, projectId))) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const task = new Task({
      title: title.trim(),
      description: (description || "").trim(),
      projectId,
      assignedTo: assignedTo != null ? Number(assignedTo) : undefined,
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    await task.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "CREATE",
      entity: "Task",
      entityId: task._id,
      details: { title: task.title, projectId, assignedTo: task.assignedTo },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ ownerId: Number(req.user.id) }, { members: Number(req.user.id) }],
    }).select("_id");

    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } })
      .sort({ updatedAt: -1 });

    await AuditLog.create({
      userId: req.user.id,
      action: "READ",
      entity: "Task",
      details: { scope: "allAccessible", count: tasks.length },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["todo", "in-progress", "done"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const ok = await canAccessProject(req.user.id, task.projectId);
    if (!ok) return res.status(403).json({ msg: "Forbidden" });

    task.status = status;
    await task.save();

    await AuditLog.create({
      userId: req.user.id,
      action: "UPDATE_STATUS",
      entity: "Task",
      entityId: task._id,
      details: { newStatus: status },
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidObjectId(projectId)) {
      return res.status(400).json({ msg: "Invalid project id" });
    }
    if (!(await canAccessProject(req.user.id, projectId))) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const tasks = await Task.find({ projectId }).sort({ updatedAt: -1 });

    await AuditLog.create({
      userId: req.user.id,
      action: "READ",
      entity: "Task",
      details: { scope: "byProject", projectId, count: tasks.length },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};
