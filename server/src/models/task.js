// src/models/task.js
const { Schema, model, Types } = require("mongoose");

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    projectId: { type: Types.ObjectId, ref: "Project", required: true },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: Date,
    assignedTo: Number,                            // PG user id
    dependencies: [{ type: Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

module.exports = model("Task", TaskSchema);
