import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <section className="hero">
        <h1>Plan projects. Ship work. Stay aligned.</h1>
        <p>Role-based access, project & task tracking, deadlines and dependencies—built for teams.</p>
        <div className="cta">
          <Link to="/register"><button className="btn primary">Get started free</button></Link>
          <Link to="/login"><button className="btn">Sign in</button></Link>
        </div>
      </section>

      <div style={{ height: 18 }} />

      <div className="grid cols-3">
        <div className="card">
          <div className="badge">Projects</div>
          <h3 style={{ marginTop: 10, marginBottom: 4 }}>Create & organize</h3>
          <p className="muted">Group tasks into projects, add members, and track ownership.</p>
        </div>
        <div className="card">
          <div className="badge">Tasks</div>
          <h3 style={{ marginTop: 10, marginBottom: 4 }}>Assign & prioritize</h3>
          <p className="muted">Assignees, priority, due dates and dependencies with status flow.</p>
        </div>
        <div className="card">
          <div className="badge">Visibility</div>
          <h3 style={{ marginTop: 10, marginBottom: 4 }}>Always in the loop</h3>
          <p className="muted">At-a-glance progress and what’s blocked (analytics coming next).</p>
        </div>
      </div>
    </div>
  );
}
