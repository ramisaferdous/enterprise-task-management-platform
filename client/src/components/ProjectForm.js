import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  description: z.string().optional(),
  members: z.string().optional(),            // comma separated numbers

  // optional first task fields
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
  } = useForm({ resolver: zodResolver(schema) });

  const submit = async (d) => {
    const members = d.members
      ? d.members
          .split(",")
          .map((s) => Number(s.trim()))
          .filter(Boolean)
      : [];

    const payload = {
      title: d.title,
      description: d.description || "",
      members,
      // optional “first task” payload (your controller can ignore if title is empty)
      firstTask: d.taskTitle
        ? {
            title: d.taskTitle,
            description: d.taskDescription || "",
            priority: d.taskPriority || "medium",
            dueDate: d.taskDue || null,
          }
        : undefined,
    };

    await onCreate(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="card formGrid">
      <h3 className="sectionTitle">Create a project</h3>

      {/* Project basics */}
      <div className="grid twoCol">
        <div>
          <label className="label">Project title</label>
          <input className="input" {...register("title")} />
          {errors.title && (
            <small className="err">{errors.title.message}</small>
          )}
        </div>

        <div>
          <label className="label">Members (user IDs, comma-separated)</label>
          <input
            className="input"
            placeholder="e.g. 1, 2"
            {...register("members")}
          />
        </div>

        <div className="fullCol">
          <label className="label">Description (optional)</label>
          <textarea
            className="textarea"
            rows={3}
            placeholder="What is this project about?"
            {...register("description")}
          />
        </div>
      </div>

      <hr className="sep" />

      {/* Optional first task */}
      <div className="sectionTitle">
        Optional: add your first task{" "}
        <small className="muted">(created right after the project)</small>
      </div>

      <div className="grid twoCol">
        <div>
          <label className="label">Task title</label>
          <input className="input" {...register("taskTitle")} />
        </div>

        <div className="row" style={{ gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label className="label">Priority</label>
            <select className="select" defaultValue="medium" {...register("taskPriority")}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Due date</label>
            <input className="input" type="date" {...register("taskDue")} />
          </div>
        </div>

        <div className="fullCol">
          <label className="label">Task description</label>
          <textarea className="textarea" rows={3} {...register("taskDescription")} />
        </div>
      </div>

      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn primary" type="submit" disabled={creating}>
          {creating ? "Creating…" : "Create Project"}
        </button>
      </div>
    </form>
  );
}
