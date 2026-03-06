import type { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

export class AdminController {
  static async getAdminById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = await adminService.getAdminById(id);

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      return res.status(200).json(admin);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Failed to get admin by id" });
    }
  }
}