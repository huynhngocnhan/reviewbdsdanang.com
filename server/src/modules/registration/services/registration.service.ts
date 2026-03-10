import { prisma } from "../../../lib/prisma";
import { sendAdminNotification, sendAutoReply } from "../../../lib/email";

interface RegisterData {
  fullname: string;
  email: string;
  phonenum: string;
  project?: string;
  note?: string;
}

export class RegistrationService {
  /**
   * Xử lý đăng ký tư vấn:
   * 1. Lưu vào database (Report)
   * 2. Gửi email thông báo cho admin
   * 3. Gửi email auto-reply cho khách hàng
   */
  async register(data: RegisterData) {
    // 1. Lưu report vào database
    const report = await prisma.report.create({
      data: {
        fullname: data.fullname,
        email: data.email,
        phonenum: data.phonenum,
        project: data.project || null,
        note: data.note || null,
        status: "NEW",
      },
    });

    // 2. Gửi email thông báo cho admin (không chờ đợi)
    sendAdminNotification(data).catch((error) => {
      console.error("Failed to send admin notification email:", error);
    });

    // 3. Gửi email auto-reply cho khách hàng (không chờ đợi)
    sendAutoReply(data).catch((error) => {
      console.error("Failed to send auto-reply email:", error);
    });

    return report;
  }

  /**
   * Lấy tất cả reports (cho admin)
   */
  async getAllReports() {
    return prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        handledByAdmin: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Lấy report theo ID
   */
  async getReportById(id: string) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        handledByAdmin: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Cập nhật trạng thái report (admin xử lý)
   */
  async updateReportStatus(
    id: string,
    status: "CONTACTED" | "COMPLETED" | "CANCELLED",
    adminId: string,
    adminNote?: string
  ) {
    return prisma.report.update({
      where: { id },
      data: {
        status,
        handledByAdminId: adminId,
        adminNote: adminNote || null,
      },
    });
  }

  /**
   * Xóa report
   */
  async deleteReport(id: string) {
    return prisma.report.delete({
      where: { id },
    });
  }

  /**
   * Lấy thống kê reports
   */
  async getReportStats() {
    const [total, newCount, contactedCount, completedCount, cancelledCount] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: "NEW" } }),
      prisma.report.count({ where: { status: "CONTACTED" } }),
      prisma.report.count({ where: { status: "COMPLETED" } }),
      prisma.report.count({ where: { status: "CANCELLED" } }),
    ]);

    return {
      total,
      new: newCount,
      contacted: contactedCount,
      completed: completedCount,
      cancelled: cancelledCount,
    };
  }
}
