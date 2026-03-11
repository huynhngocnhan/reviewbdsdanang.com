import type { Request, Response } from "express";
import { RegistrationService } from "../services/registration.service";

const registrationService = new RegistrationService();

export class RegistrationController {
  /**
   * API công khai: Khách hàng đăng ký tư vấn
   */
  static async register(req: Request, res: Response) {
    try {
      const { fullname, email, phonenum, project, note } = req.body;

      // Validate required fields (fullname and phonenum are required, email is optional)
      if (!fullname || !phonenum) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ thông tin (họ tên, số điện thoại)",
        });
      }

      // Validate email format only if provided (email is optional)
      if (email && email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            message: "Email không hợp lệ",
          });
        }
      }

      const report = await registrationService.register({
        fullname: fullname.trim(),
        email: email?.trim() || null,
        phonenum: phonenum.trim(),
        project: project?.trim(),
        note: note?.trim(),
      });

      return res.status(201).json({
        message: "Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.",
        report,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      return res.status(500).json({
        message: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
      });
    }
  }

  /**
   * API cho admin: Lấy tất cả reports
   */
  static async getAllReports(req: Request, res: Response) {
    try {
      const reports = await registrationService.getAllReports();
      return res.status(200).json({ reports });
    } catch (error: any) {
      console.error("Get reports error:", error);
      return res.status(500).json({
        message: "Không thể lấy danh sách báo cáo",
      });
    }
  }

  /**
   * API cho admin: Lấy thống kê reports
   */
  static async getReportStats(req: Request, res: Response) {
    try {
      const stats = await registrationService.getReportStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      console.error("Get stats error:", error);
      return res.status(500).json({
        message: "Không thể lấy thống kê",
      });
    }
  }

  /**
   * API cho admin: Lấy chi tiết report
   */
  static async getReportById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const report = await registrationService.getReportById(id);

      if (!report) {
        return res.status(404).json({
          message: "Không tìm thấy báo cáo",
        });
      }

      return res.status(200).json(report);
    } catch (error: any) {
      console.error("Get report error:", error);
      return res.status(500).json({
        message: "Không thể lấy chi tiết báo cáo",
      });
    }
  }

  /**
   * API cho admin: Cập nhật trạng thái report
   */
  static async updateReportStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, adminNote } = req.body;
      const adminId = (req as any).adminId; // Lấy từ auth middleware

      if (!adminId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!["CONTACTED", "COMPLETED", "CANCELLED"].includes(status)) {
        return res.status(400).json({
          message: "Trạng thái không hợp lệ",
        });
      }

      const report = await registrationService.updateReportStatus(
        id,
        status,
        adminId,
        adminNote
      );

      return res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        report,
      });
    } catch (error: any) {
      console.error("Update report error:", error);
      return res.status(500).json({
        message: "Không thể cập nhật trạng thái",
      });
    }
  }

  /**
   * API cho admin: Xóa report
   */
  static async deleteReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await registrationService.deleteReport(id);

      return res.status(200).json({
        message: "Xóa báo cáo thành công",
      });
    } catch (error: any) {
      console.error("Delete report error:", error);
      return res.status(500).json({
        message: "Không thể xóa báo cáo",
      });
    }
  }
}
