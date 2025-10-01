import api from "./axios";

export const loginApi = async ({ email, password }) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    if (!data?.token || !data?.user) throw new Error("Invalid credentials");
    return data;
  } catch (err) {
    throw new Error(err?.response?.data?.msg || "Invalid credentials");
  }
};
