import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getProjectTasksApi, updateTaskStatusApi, createTaskApi } from "../api/tasks";
import { useForm } from "react-hook-form";

const statuses = ["todo", "in-progress", "done"];

export default function TaskList({ projectId, canEdit }) {
  const qc = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery(
    ["tasks", projectId],
    () => getProjectTasksApi(projectId),
    { staleTime: 10 * 1000 }
  );

  const mutation = useMutation(updateTaskStatusApi, {
   
    onMutate: async ({ id, status, projectId }) => {
      await qc.cancelQueries(["tasks", projectId]);
      const prev = qc.getQueryData(["tasks", projectId]);
      qc.setQueryData(["tasks", projectId], (old = []) =>
        old.map(t => (t._id === id ? { ...t, status } : t))
      );
      return { prev };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["tasks", vars.projectId], ctx.prev);
    },
    onSettled: (_data, _err, vars) => {
      qc.invalidateQueries(["tasks", vars.projectId]);
    },
  });

  const { register, handleSubmit, reset } = useForm();
  const createTask = useMutation(createTaskApi, {
    onSuccess: () => qc.invalidateQueries(["tasks", projectId]),
  });

  const onCreate = (d) => {
    createTask.mutate({
      title: d.title,
      description: d.description || "",
      projectId,
      priority: d.priority || "medium",
      dueDate: d.dueDate || null,
    });
    reset();
  };

  if (isLoading) return <p>Loading tasks…</p>;

  return (
    <div style={{ display:"grid", gap:12 }}>
      {canEdit && (
        <form onSubmit={handleSubmit(onCreate)} style={{ display:"grid", gap:8 }}>
          <input placeholder="Task title" {...register("title", { required: true })} />
          <textarea placeholder="Description" rows={2} {...register("description")} />
          <select {...register("priority")}>
            <option>low</option><option>medium</option><option>high</option>
          </select>
          <input type="date" {...register("dueDate")} />
          <button type="submit" disabled={createTask.isLoading}>
            {createTask.isLoading ? "Creating…" : "Add Task"}
          </button>
        </form>
      )}

      {tasks.length === 0 && <p>No tasks yet.</p>}
      {tasks.map(t => (
        <div key={t._id} style={{ border:"1px solid #ddd", padding:10, borderRadius:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <strong>{t.title}</strong>
            <small>{new Date(t.updatedAt).toLocaleString()}</small>
          </div>
          {t.description && <p style={{ margin:"6px 0" }}>{t.description}</p>}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span>Priority: <b>{t.priority}</b></span>
            <span>Status: </span>
            <select
              value={t.status}
              disabled={!canEdit || mutation.isLoading}
              onChange={(e) => mutation.mutate({ id: t._id, status: e.target.value, projectId })}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
