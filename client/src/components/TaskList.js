// src/components/TaskList.js
import React from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getTasksByProjectidApi,
  getTasksApi,
  updateTaskStatusApi,
  createTaskApi,
} from "../api/tasks";
import { useForm } from "react-hook-form";

const statuses = ["todo", "in-progress", "done"];

export default function TaskList({ projectId, canEdit }) {
  const qc = useQueryClient();

  
  const keyFor = (pid) => (pid ? ["tasks", "project", pid] : ["tasks", "all"]);
  const fetcher = () =>
    projectId ? getTasksByProjectidApi(projectId) : getTasksApi();

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery(keyFor(projectId), fetcher, { staleTime: 10 * 1000 });

 
  const updateStatus = useMutation(updateTaskStatusApi, {
    onMutate: async (vars) => {
      const k = keyFor(vars.projectId);
      await qc.cancelQueries(k);
      const prev = qc.getQueryData(k);

      qc.setQueryData(k, (old = []) =>
        old.map((t) => (t._id === vars.id ? { ...t, status: vars.status } : t))
      );

      return { prev, k };
    },
    onError: (_err, vars, ctx) => {
      if (ctx?.prev && ctx?.k) qc.setQueryData(ctx.k, ctx.prev);
    },
    onSettled: (_data, _err, vars, ctx) => {
      if (ctx?.k) qc.invalidateQueries(ctx.k);
    },
  });

  
  const { register, handleSubmit, reset } = useForm();
  const createTask = useMutation(createTaskApi, {
    onSuccess: () => qc.invalidateQueries(keyFor(projectId)),
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
  if (isError) return <p style={{ color: "crimson" }}>Error: {String(error)}</p>;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {canEdit && projectId && (
        <form onSubmit={handleSubmit(onCreate)} style={{ display: "grid", gap: 8 }}>
          <input placeholder="Task title" {...register("title", { required: true })} />
          <textarea placeholder="Description" rows={2} {...register("description")} />
          <select {...register("priority")}>
            <option>low</option>
            <option>medium</option>
            <option>high</option>
          </select>
          <input type="date" {...register("dueDate")} />
          <button type="submit" disabled={createTask.isLoading}>
            {createTask.isLoading ? "Creating…" : "Add Task"}
          </button>
        </form>
      )}

      {tasks.length === 0 && <p>No tasks yet.</p>}

      {tasks.map((t) => (
        <div key={t._id} style={{ border: "1px solid #ddd", padding: 10, borderRadius: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{t.title}</strong>
            <small>{new Date(t.updatedAt).toLocaleString()}</small>
          </div>
          {t.description && <p style={{ margin: "6px 0" }}>{t.description}</p>}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>
              Priority: <b>{t.priority}</b>
            </span>
            <span>Status: </span>
            <select
              value={t.status}
              disabled={!canEdit || updateStatus.isLoading}
              onChange={(e) =>
                updateStatus.mutate({
                  id: t._id,
                  status: e.target.value,
                  projectId,
                })
              }
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
