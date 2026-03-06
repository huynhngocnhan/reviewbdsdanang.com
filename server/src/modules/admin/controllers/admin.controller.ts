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

  static async updateProfile(req: Request, res: Response) {
    try {
      const adminId = req.params.id as string;
      const { fullName, title, tagline, phone, address, workHours, avatarAssetId, mediaLinks } = req.body ?? {};

      const requiredStringFields = [
        { key: "fullName", value: fullName },
        { key: "title", value: title },
        { key: "tagline", value: tagline },
        { key: "phone", value: phone },
        { key: "address", value: address },
        { key: "workHours", value: workHours },
        { key: "avatarAssetId", value: avatarAssetId },
      ];

      const invalidField = requiredStringFields.find(
        ({ value }) => typeof value !== "string" || value.trim().length === 0,
      );

      if (invalidField) {
        return res.status(400).json({ message: `${invalidField.key} is required and cannot be empty` });
      }

      if (!Array.isArray(mediaLinks) || mediaLinks.length === 0) {
        return res.status(400).json({ message: "mediaLinks is required and cannot be empty" });
      }

      const profile = await adminService.updateAdminProfile({
        adminId,
        fullName: fullName.trim(),
        title: title.trim(),
        tagline: tagline.trim(),
        phone: phone.trim(),
        address: address.trim(),
        workHours: workHours.trim(),
        avatarAssetId: avatarAssetId.trim(),
        mediaLinks,
      });

      return res.status(200).json({ message: "Profile updated successfully", profile });
    } catch (error: any) {
      if (error?.message === "No Admin found") {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (error?.message === "Avatar asset not found") {
        return res.status(400).json({ message: "Avatar asset not found" });
      }

      return res.status(500).json({ message: error.message || "Failed to update admin profile" });
    }
  }
}
