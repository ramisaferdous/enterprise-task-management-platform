import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getProjectsApi } from "../api/projects";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  
  const { data: projects = [], isLoading } = useQuery("projects", getProjectsApi);
  const project = projects.find((p) => p._id === id);

  if (isLoading) {
    return <div className="container"><div className="card">Loading…</div></div>;
  }
  if (!project) {
    return (
      <div className="container">
        <div className="card">Project not found or access denied.</div>
      </div>
    );
  }

  const canEdit =
    user?.role === "admin" ||
    user?.role === "manager" ||
    project.ownerId === user?.id;

  return (
    <div className="container">
    
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <Link to="/projects" className="muted" style={{ marginRight: 8 }}>
              ← Back
            </Link>
            <h2 style={{ display: "inline-block", margin: 0 }}>{project.title}</h2>
          </div>
          <div className="row">
            <span className="badge">
              {project.ownerId === user?.id ? "Owner: you" : `Owner: ${project.ownerId}`}
            </span>
            <span className="badge">Members: {project.members?.length ?? 0}</span>
          </div>
        </div>
        {project.description && (
          <p className="muted" style={{ marginTop: 8 }}>{project.description}</p>
        )}
      </div>

      
      <TaskList projectId={id} canEdit={canEdit} />
    </div>
  );
}
