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
      assignedTo: d.assignedTo ? Number(d.assignedTo) : undefined,
      
      dependencies: d.dependencies
        ? d.dependencies.split(",").map(s => s.trim()).filter(Boolean)
        : [],
    });
    reset();
  };

  if (isLoading) return <p>Loading tasks…</p>;
  if (isError) return <p style={{ color: "crimson" }}>Error: {String(error)}</p>;

  return (
    <div className="grid">
      {canEdit && projectId && (
        <form onSubmit={handleSubmit(onCreate)} className="grid card">
          <h3 style={{ marginTop: 0 }}>Add task</h3>
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="label">Title</label>
              <input className="input" {...register("title", { required: true })} />
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="select" {...register("priority")}>
                <option>low</option><option>medium</option><option>high</option>
              </select>
            </div>
            <div>
              <label className="label">Due date</label>
              <input className="input" type="date" {...register("dueDate")} />
            </div>
            <div>
              <label className="label">Assign to (User ID)</label>
              <input className="input" placeholder="e.g. 1" {...register("assignedTo")} />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="textarea" rows={3} {...register("description")} />
          </div>
          <div>
            <label className="label">Dependencies (Task IDs, comma-separated)</label>
            <input className="input" placeholder="e.g. 64f..., 64a..." {...register("dependencies")} />
          </div>
          <div className="row" style={{ justifyContent:"flex-end" }}>
            <button className="btn primary" type="submit" disabled={createTask.isLoading}>
              {createTask.isLoading ? "Creating…" : "Add Task"}
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 && <div className="card">No tasks yet.</div>}

      {tasks.map((t) => (
        <div key={t._id} className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <strong>{t.title}</strong>
            <small>{new Date(t.updatedAt).toLocaleString()}</small>
          </div>
          {t.description && <p style={{ margin: "6px 0", color:"#cbd5e1" }}>{t.description}</p>}

          <div className="row">
            <span className="tag">Priority: {t.priority}</span>
            {t.assignedTo ? <span className="tag">Assignee: {t.assignedTo}</span> : <span className="tag">Unassigned</span>}
            {t.dueDate && <span className="tag">Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
          </div>

          <hr className="sep" />

          <div className="row" style={{ gap: 8 }}>
            <span className="label" style={{ margin:0 }}>Status</span>
            <select
              className="select"
              style={{ width: 200 }}
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
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}