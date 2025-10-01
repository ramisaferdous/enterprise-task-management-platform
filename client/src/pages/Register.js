import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerApi } from "../api/auth";
import { useHistory, Link } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email(),
  password: z.string().min(6, "Min 6 chars"),
  role: z.enum(["employee", "manager", "admin"]).optional(),
});

export default function Register() {
  const history = useHistory();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (v) => {
    try {
      await registerApi(v);
      alert("Registered! Please sign in.");
      history.push("/login");
    } catch (e) {
      alert(e?.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Create your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid">
          <div>
            <label className="label">Name</label>
            <input className="input" {...register("name")} />
            {errors.name && <small style={{ color: "salmon" }}>{errors.name.message}</small>}
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" {...register("email")} />
            {errors.email && <small style={{ color: "salmon" }}>{errors.email.message}</small>}
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" {...register("password")} />
            {errors.password && <small style={{ color: "salmon" }}>{errors.password.message}</small>}
          </div>
          <div>
            <label className="label">Role (optional)</label>
            <select className="select" defaultValue="employee" {...register("role")}>
              <option value="employee">employee</option>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="row">
            <button className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Register"}
            </button>
            <Link to="/login" className="btn ghost">Already have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
