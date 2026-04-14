"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationService = void 0;
const prisma_1 = require("../../../lib/prisma");
const email_1 = require("../../../lib/email");
class RegistrationService {
    /**
     * Xử lý đăng ký tư vấn:
     * 1. Lưu vào database (Report)
     * 2. Gửi email thông báo cho admin
     * 3. Gửi email auto-reply cho khách hàng
     */
    async register(data) {
        // 1. Lưu report vào database
        const report = await prisma_1.prisma.report.create({
            data: {
                fullname: data.fullname,
                email: data.email,
                phonenum: data.phonenum,
                project: data.project || null,
                note: data.note || null,
                status: "NEW",
            },
        });
        // 2. Gửi email thông báo cho admin (luôn gửi, không chờ đợi)
        (0, email_1.sendAdminNotification)(data).catch((error) => {
            console.error("Failed to send admin notification email:", error);
        });
        // 3. Gửi email auto-reply cho khách hàng CHỈ KHI có email (không chờ đợi)
        if (data.email) {
            (0, email_1.sendAutoReply)(data).catch((error) => {
                console.error("Failed to send auto-reply email:", error);
            });
        }
        return report;
    }
    /**
     * Lấy tất cả reports (cho admin)
     */
    async getAllReports() {
        return prisma_1.prisma.report.findMany({
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
    async getReportById(id) {
        return prisma_1.prisma.report.findUnique({
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
    async updateReportStatus(id, status, adminId, adminNote) {
        return prisma_1.prisma.report.update({
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
    async deleteReport(id) {
        return prisma_1.prisma.report.delete({
            where: { id },
        });
    }
    /**
     * Lấy thống kê reports
     */
    async getReportStats() {
        const [total, newCount, contactedCount, completedCount, cancelledCount] = await Promise.all([
            prisma_1.prisma.report.count(),
            prisma_1.prisma.report.count({ where: { status: "NEW" } }),
            prisma_1.prisma.report.count({ where: { status: "CONTACTED" } }),
            prisma_1.prisma.report.count({ where: { status: "COMPLETED" } }),
            prisma_1.prisma.report.count({ where: { status: "CANCELLED" } }),
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
exports.RegistrationService = RegistrationService;
