import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export default function Login() {
  const history = useHistory();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (v) => {
    try {
      const data = await loginApi(v);
      login(data);
      history.push("/projects");
    } catch (e) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert(e.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Sign in</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid">
          <div>
            <label className="label">Email</label>
            <input className="input" {...register("email")} />
            {errors.email && <small style={{ color:"salmon" }}>{errors.email.message}</small>}
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" {...register("password")} />
            {errors.password && <small style={{ color:"salmon" }}>{errors.password.message}</small>}
          </div>
          <div className="row">
            <button className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
            <Link to="/register" className="btn ghost">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
