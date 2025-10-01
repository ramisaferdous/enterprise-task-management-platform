// client/src/api/auth.js
import api from "./axios";

// tiny JWT decoder (no extra deps)
function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export const loginApi = async ({ email, password }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });

    // must at least have token
    if (!data?.token) {
      throw new Error("Invalid credentials");
    }

    // prefer server-provided user, else synthesize from JWT
    let user = data.user;
    if (!user) {
      const payload = decodeJwt(data.token);
      if (!payload) throw new Error("Invalid credentials");
      // your server signs: { id, role }
      user = { id: payload.id, role: payload.role, email }; // email from form
    }

    return { token: data.token, user };
  } catch (err) {
    throw new Error(err?.response?.data?.msg || "Invalid credentials");
  }
};

export const registerApi = async ({ name, email, password, role }) => {
  const { data } = await api.post("/auth/register", { name, email, password, role });
  return data;
};
