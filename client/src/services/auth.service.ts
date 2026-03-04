import { api } from "../api/client";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};
