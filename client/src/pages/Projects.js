import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getProjectsApi, createProjectApi } from "../api/projects";
import ProjectForm from "../components/ProjectForm";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: projects = [], isLoading } = useQuery("projects", getProjectsApi, { staleTime: 10000 });

  const createMutation = useMutation(createProjectApi, {
    onSuccess: () => qc.invalidateQueries("projects")
  });

  const onCreate = (payload) => createMutation.mutateAsync(payload);

  if (isLoading) return <p>Loading projects…</p>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", padding: "0 12px" }}>
      <h2>Projects</h2>
      {(user?.role === "admin" || user?.role === "manager") && (
        <ProjectForm onCreate={onCreate} creating={createMutation.isLoading} />
      )}
      <div style={{ display:"grid", gap:10 }}>
        {projects.map(p => (
          <Link to={`/projects/${p._id}`} key={p._id} style={{ textDecoration:"none", color:"inherit" }}>
            <div style={{ border:"1px solid #ddd", padding:12, borderRadius:8 }}>
              <strong>{p.title}</strong>
              <div><small>Owner: {p.ownerId}</small></div>
              {p.description && <p style={{ marginTop:6 }}>{p.description}</p>}
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p>No projects yet.</p>}
      </div>
    </div>
  );
}
