import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getProjectsApi } from "../api/projects";
import { createTaskApi } from "../api/tasks";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: projects = [] } = useQuery("projects", getProjectsApi);
  const project = projects.find((p) => p._id === id);

  const canEdit =
    user?.role === "admin" || user?.role === "manager" || project?.ownerId === user?.id;

  const [showAdd, setShowAdd] = React.useState(false);
  const [draft, setDraft] = React.useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const createTask = useMutation(createTaskApi, {
    onSuccess: () => qc.invalidateQueries(["tasks", "project", id]),
  });

  const onAdd = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    createTask.mutate(
      { ...draft, projectId: id },
      {
        onSettled: () => {
          setDraft({ title: "", description: "", priority: "medium", dueDate: "" });
          setShowAdd(false);
        },
      }
    );
  };

  if (!project) return <p style={{ padding: 12 }}>Project not found or access denied.</p>;

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>{project.title}</h2>
          {project.description && <p className="muted">{project.description}</p>}
        </div>
        {canEdit && (
          <button className="btn-primary" onClick={() => setShowAdd((s) => !s)}>
            {showAdd ? "Close" : "Add Task"}
          </button>
        )}
      </div>

      {showAdd && canEdit && (
        <form onSubmit={onAdd} className="card" style={{ marginTop: 12 }}>
          <div className="row" style={{ gap: 12 }}>
            {/* Task title input */}
            <div style={{ flex: 1 }}>
              <label className="label">Task Title</label>
              <input
                className="input"
                type="text"
                placeholder="Task Title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                required
              />
            </div>

            {/* Priority dropdown */}
            <div style={{ flex: 1 }}>
              <label className="label">Priority</label>
              <select
                className="select"
                value={draft.priority}
                onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Due date input */}
          <div className="row" style={{ gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label className="label">Due Date</label>
              <input
                className="input"
                type="date"
                value={draft.dueDate}
                onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Description input */}
          <div className="fullCol">
            <label className="label">Description</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Description (optional)"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            />
          </div>

          {/* Submit button */}
          <button className="btn-primary" disabled={createTask.isLoading}>
            {createTask.isLoading ? "Adding..." : "Add Task"}
          </button>
        </form>
      )}

      {/* Task List */}
      <TaskList projectId={id} canEdit={canEdit} />
    </div>
  );
}
