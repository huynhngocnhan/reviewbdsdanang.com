import { api } from "../api/client";

export const adminService = {
  async getAdminById(id: string) {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  },
};