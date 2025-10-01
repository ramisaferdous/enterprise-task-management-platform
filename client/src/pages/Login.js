import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export default function Login() {
  const history = useHistory();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (v) => {
    const data = await loginApi(v);
    login(data); 
    history.push("/projects");
  };

  return (
    <div style={{ maxWidth: 380, margin: "40px auto" }}>
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display:"grid", gap:10 }}>
        <input placeholder="Email" {...register("email")} />
        {errors.email && <small style={{color:"crimson"}}>{errors.email.message}</small>}
        <input placeholder="Password" type="password" {...register("password")} />
        {errors.password && <small style={{color:"crimson"}}>{errors.password.message}</small>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
