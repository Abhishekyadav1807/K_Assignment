import { api } from "../lib/api.js";

export const register = async (email, password) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};
