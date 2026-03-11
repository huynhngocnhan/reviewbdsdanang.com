import { api } from "../api/client";

export type ReportStatus = "NEW" | "CONTACTED" | "COMPLETED" | "CANCELLED";

export interface Report {
  id: string;
  fullname: string;
  email: string;
  phonenum: string;
  project: string | null;
  note: string | null;
  status: ReportStatus;
  handledByAdminId: string | null;
  handledByAdmin: {
    id: string;
    email: string;
    profile: {
      fullName: string | null;
    };
  } | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ReportStats = {
  total: number;
  new: number;
  contacted: number;
  completed: number;
  cancelled: number;
};

export const registrationService = {
  /**
   * Lấy tất cả reports (cho admin)
   */
  async getAllReports(): Promise<Report[]> {
    const response = await api.get<{ reports: Report[] }>("/registrations");
    return response.data.reports;
  },

  /**
   * Lấy thống kê reports
   */
  async getStats(): Promise<ReportStats> {
    const response = await api.get<ReportStats>("/registrations/stats");
    return response.data;
  },

  /**
   * Lấy chi tiết report
   */
  async getReportById(id: string): Promise<Report> {
    const response = await api.get<Report>(`/registrations/${id}`);
    return response.data;
  },

  /**
   * Cập nhật trạng thái report
   */
  async updateStatus(
    id: string,
    status: "CONTACTED" | "COMPLETED" | "CANCELLED",
    adminNote?: string
  ): Promise<Report> {
    const response = await api.patch<{ report: Report }>(`/registrations/${id}/status`, {
      status,
      adminNote,
    });
    return response.data.report;
  },

  /**
   * Xóa report
   */
  async deleteReport(id: string): Promise<void> {
    await api.delete(`/registrations/${id}`);
  },
};
