import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getProjectsApi, createProjectApi } from "../api/projects";
import ProjectForm from "../components/ProjectForm";
import { useAuth } from "../context/AuthContext";

export default function Projects() {
  const [showForm, setShowForm] = useState(false);  // State to toggle the Add Project form visibility
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: projects = [], isLoading, isError, error } = useQuery(
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

  return (
    <div className="container">
      <div style={{ margin: "10px 0 18px" }}>
        <h2 style={{ margin: 0 }}>Your Projects</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          Projects you own or are a member of.
        </p>
      </div>

      {/* Add Project Button */}
      {(user?.role === "admin" || user?.role === "manager") && (
        <div className="card" style={{ marginBottom: 18 }}>
          <div
            style={{
              marginBottom: 8,
              fontWeight: 600,
              cursor: "pointer",
              color: "#007BFF",
            }}
            onClick={() => setShowForm(!showForm)}  // Toggle the form visibility
          >
            {showForm ? "Close" : "Add Project"}
          </div>
          {showForm && (
            <ProjectForm onCreate={onCreate} creating={createMutation.isLoading} />
          )}
        </div>
      )}

      {/* Loading, Error and Project List Rendering */}
      {isLoading ? (
        <div className="card">Loading projects…</div>
      ) : isError ? (
        <div className="card" style={{ color: "red" }}>
          Error fetching projects: {String(error)}
        </div>
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
