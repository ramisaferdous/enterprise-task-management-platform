import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <div className="grid" style={{ gap: 24 }}>
        <section className="card" style={{ textAlign: "center", padding: 40 }}>
          <h1 style={{ margin: 0, fontSize: 36 }}>Enterprise Task Manager</h1>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>
            Organize projects, assign tasks, track progress and deadlines.
          </p>
          <div className="row" style={{ justifyContent: "center", marginTop: 18 }}>
            <Link to="/register"><button className="btn primary">Get started</button></Link>
            <Link to="/login"><button className="btn ghost">Sign in</button></Link>
          </div>
          <div style={{ marginTop: 16, color: "#94a3b8", fontSize: 13 }}>
            Role-based access · SQL for users & audit · NoSQL for projects & tasks
          </div>
        </section>

        <div className="grid cols-3">
          <div className="card">
            <div className="badge">Projects</div>
            <h3 style={{ marginTop: 8 }}>Plan & track work</h3>
            <p className="muted">Create projects, add members, view progress at a glance.</p>
          </div>
          <div className="card">
            <div className="badge">Tasks</div>
            <h3 style={{ marginTop: 8 }}>Assign & prioritize</h3>
            <p className="muted">Owners, priority, due dates and dependencies with status flow.</p>
          </div>
          <div className="card">
            <div className="badge">Analytics</div>
            <h3 style={{ marginTop: 8 }}>See trends</h3>
            <p className="muted">Progress over time and completion metrics (coming next).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
