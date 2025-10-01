import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getProjectsApi, createProjectApi } from "../api/projects";
import ProjectForm from "../components/ProjectForm";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: projects = [], isLoading } = useQuery(
    "projects",
    getProjectsApi,
    { staleTime: 10_000 }
  );

  const createMutation = useMutation(createProjectApi, {
    onSuccess: () => qc.invalidateQueries("projects"),
  });

  const onCreate = async (payload) => {
  const created = await createMutation.mutateAsync(payload);
  
  return created;
};
<ProjectForm onCreate={onCreate} creating={createMutation.isLoading} />
  return (
    <div className="container">
     
      <div style={{ margin: "10px 0 18px" }}>
        <h2 style={{ margin: 0 }}>Your Projects</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Projects you own or are a member of.
        </p>
      </div>

     
      {(user?.role === "admin" || user?.role === "manager") && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Create a project</div>
          <ProjectForm onCreate={onCreate} creating={createMutation.isLoading} />
        </div>
      )}

      
      {isLoading ? (
        <div className="card">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="card">No projects yet.</div>
      ) : (
        <div className="grid cols-3">
          {projects.map((p) => (
            <Link
              key={p._id}
              to={`/projects/${p._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="card" style={{ height: "100%" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong style={{ fontSize: 16 }}>{p.title}</strong>
                  <span className="badge">
                    {p.ownerId === user?.id ? "Owner: you" : `Owner: ${p.ownerId}`}
                  </span>
                </div>
                {p.description && (
                  <p className="muted" style={{ margin: "8px 0 0" }}>
                    {p.description}
                  </p>
                )}
                <hr className="sep" />
                <div className="row">
                  <span className="tag">Members: {p.members?.length ?? 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
