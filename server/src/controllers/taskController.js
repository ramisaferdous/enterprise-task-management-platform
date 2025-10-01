const Task = require("../models/task");
const AuditLog = require("../models/auditLog");

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      priority,
      dueDate,
    });

    await task.save();

   
    await AuditLog.create({
      userId: req.user.id,
      action: "CREATE",
      entity: "Task",
      entityId: task._id,
      details: { title, projectId, assignedTo },
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

   
    await AuditLog.create({
      userId: req.user.id,
      action: "READ",
      entity: "Task",
      details: { count: tasks.length },
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

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    
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
    const tasks = await Task.find({ projectId });


    await AuditLog.create({
      userId: req.user.id,
      action: "READ",
      entity: "Task",
      details: { projectId, count: tasks.length },
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};
