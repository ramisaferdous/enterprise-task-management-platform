import api from "./axios";

export const createProjectApi = async (payload) => {
  const { data } = await api.post("/projects", payload);
  return data;
};

export const getProjectsApi = async () => {
  const { data } = await api.get("/projects");
  return data; 
};
