import api from "./axios";

export const getTasksApi = async (projectId) => {
  const { data } = await api.get(`/tasks`);
  return data;
};

export const createTaskApi = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data;
};

export const updateTaskStatusApi = async ({ id, status, projectId }) => {
  const { data } = await api.patch(`/tasks/${id}/status`, { status, projectId });
  return data;
};

export const getTasksByProjectidApi = async (projectId) => {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  return data;
};