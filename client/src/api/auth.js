import api from "./axios";

export const loginApi = async (payload) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data; 
  } catch (err) {
   
    const msg = err?.response?.data?.msg || "Login failed";
    throw new Error(msg);
  }
};
