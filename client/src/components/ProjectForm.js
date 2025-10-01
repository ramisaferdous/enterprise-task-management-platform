import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(2, "Title required"),
  description: z.string().optional(),
  members: z.string().optional(), // comma separated numbers
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
    await onCreate({
      title: d.title,
      description: d.description || "",
      members,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid" style={{ gap: 10 }}>
      <div>
        <label className="label">Project title</label>
        <input className="input" placeholder="Project title" {...register("title")} />
        {errors.title && (
          <small style={{ color: "crimson" }}>{errors.title.message}</small>
        )}
      </div>

      <div>
        <label className="label">Description (optional)</label>
        <textarea
          className="textarea"
          rows={3}
          placeholder="What is this project about?"
          {...register("description")}
        />
      </div>

      <div>
        <label className="label">Members (user IDs, comma-separated)</label>
        <input
          className="input"
          placeholder="e.g. 2, 4, 8"
          {...register("members")}
        />
      </div>

      <div>
        <button className="btn primary" type="submit" disabled={creating}>
          {creating ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
}
