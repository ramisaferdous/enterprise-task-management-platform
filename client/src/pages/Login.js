import { useForm } from "react-hook-form";
import { loginApi } from "../api/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const history = useHistory();

  const onSubmit = async (v) => {
    try {
      const data = await loginApi({ email: v.email.trim().toLowerCase(), password: v.password });
      login(data);              // saves token + user
      history.push("/projects");
    } catch (e) {
      alert(e.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: true })} placeholder="Email" type="email" autoComplete="email" />
      <input {...register("password", { required: true })} placeholder="Password" type="password" autoComplete="current-password" />
      <button type="submit">Login</button>
    </form>
  );
}
