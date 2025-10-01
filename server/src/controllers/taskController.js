const Task = require("../models/task");


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
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error creating task", error: err.message });
  }
};


exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Error updating task", error: err.message });
  }
};


exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks", error: err.message });
  }
};
