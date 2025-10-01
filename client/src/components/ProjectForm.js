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
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const submit = (d) => {
    const members = d.members
      ? d.members.split(",").map(s => Number(s.trim())).filter(Boolean)
      : [];
    onCreate({ title: d.title, description: d.description || "", members })
      .then(() => reset());
  };

  return (
    <form onSubmit={handleSubmit(submit)} style={{ display:"grid", gap:8, marginBottom:16 }}>
      <input placeholder="Project title" {...register("title")} />
      {errors.title && <small style={{color:"crimson"}}>{errors.title.message}</small>}
      <textarea placeholder="Description (optional)" rows={3} {...register("description")} />
      <input placeholder="Members (user IDs, comma-separated)" {...register("members")} />
      <button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Project"}</button>
    </form>
  );
}
