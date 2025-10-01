import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getProjectsApi } from "../api/projects";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  
  const { data: projects = [] } = useQuery("projects", getProjectsApi);
  const project = projects.find(p => p._id === id);

  if (!project) return <p style={{ padding: 12 }}>Project not found or access denied.</p>;

  const canEdit = user?.role === "admin" || user?.role === "manager" || project.ownerId === user?.id;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 12px" }}>
      <h2>{project.title}</h2>
      {project.description && <p>{project.description}</p>}
      <TaskList projectId={id} canEdit={canEdit} />
    </div>
  );
}
