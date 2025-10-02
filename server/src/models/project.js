// src/models/project.js
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    ownerId: { type: Number, required: true },   // PG user id
    members: [{ type: Number }],                 // PG user ids
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
