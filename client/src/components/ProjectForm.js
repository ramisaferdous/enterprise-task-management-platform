import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskApi } from "../api/tasks";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  description: z.string().optional(),
  members: z.string().optional(),

  taskTitle: z.string().optional(),
  taskDescription: z.string().optional(),
  taskPriority: z.enum(["low", "medium", "high"]).optional(),
  taskDue: z.string().optional(),
});

export default function ProjectForm({ onCreate, creating }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ resolver: zodResolver(schema) });

  const hasFirstTask =
    !!watch("taskTitle") ||
    !!watch("taskDescription") ||
    !!watch("taskPriority") ||
    !!watch("taskDue");

  const submit = async (d) => {
    const members = d.members
      ? d.members.split(",").map((s) => Number(s.trim())).filter(Boolean)
      : [];

    const project = await onCreate({
      title: d.title.trim(),
      description: (d.description || "").trim(),
      members,
    });

    if (project?._id && hasFirstTask && d.taskTitle) {
      await createTaskApi({
        title: d.taskTitle.trim(),
        description: (d.taskDescription || "").trim(),
        projectId: project._id,
        priority: d.taskPriority || "medium",
        dueDate: d.taskDue || null,
      });
    }

    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="card">
      <h3 style={{ marginTop: 0 }}>Create a project</h3>

      <input placeholder="Project title" {...register("title")} />
      {errors.title && <small className="err">{errors.title.message}</small>}

      <textarea placeholder="Description (optional)" rows={3} {...register("description")} />

      <input placeholder="Members (user IDs, comma-separated)" {...register("members")} />

      <hr />

      <div className="row" style={{ alignItems: "center" }}>
        <h4 style={{ margin: 0 }}>Optional: add your first task</h4>
        <span className="muted" style={{ marginLeft: 8 }}>(will be created after the project)</span>
      </div>

      <input placeholder="Task title" {...register("taskTitle")} />
      <textarea placeholder="Task description" rows={2} {...register("taskDescription")} />

      <div className="row">
        <select {...register("taskPriority")}>
          <option value="">Priority (default: medium)</option>
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>
        <input type="date" {...register("taskDue")} />
      </div>

      <button type="submit" disabled={creating} className="btn-primary">
        {creating ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}
