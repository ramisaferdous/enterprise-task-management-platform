import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const history = useHistory();

  return (
    <div className="header">
      <div className="header-inner">
        <Link className="brand" to="/">Enterprise Tasks</Link>

        <nav className="nav">
          <Link to="/projects">Projects</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && (
            <>
              <span className="badge">{user.name} · {user.role}</span>
              <button className="btn secondary" style={{ marginLeft: 10 }}
                onClick={() => { logout(); history.push("/"); }}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
