import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const history = useHistory();

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #eee", display:"flex", justifyContent:"space-between" }}>
      <Link to="/projects" style={{ textDecoration: "none" }}>
        <strong>Enterprise Tasks</strong>
      </Link>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: 12 }}>
              {(user.name || user.email || `User #${user.id}`)} ({user.role})
            </span>
            <button onClick={() => { logout(); history.push("/login"); }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}