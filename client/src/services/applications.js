import { api } from "../lib/api.js";

export const fetchApplications = async () => {
  const response = await api.get("/applications");
  return response.data;
};

export const createApplication = async (payload) => {
  const response = await api.post("/applications", payload);
  return response.data;
};

export const updateApplication = async (id, payload) => {
  const response = await api.put(`/applications/${id}`, payload);
  return response.data;
};

export const deleteApplication = async (id) => {
  await api.delete(`/applications/${id}`);
};

export const updateStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data;
};

export const parseJobDescription = async (jobDescription) => {
  const response = await api.post("/applications/parse", { jobDescription });
  return response.data;
};
