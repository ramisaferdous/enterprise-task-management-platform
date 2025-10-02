import api from "./axios";

export const getTasksApi = async () => (await api.get(`/tasks`)).data;
export const getTasksByProjectidApi = async (projectId) => {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  return data;
};
export const createTaskApi = async (payload) =>
  (await api.post(`/tasks`, payload)).data;
export const updateTaskStatusApi = async ({ id, status }) =>
  (await api.patch(`/tasks/${id}/status`, { status })).data;
