"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const adminService = new admin_service_1.AdminService();
class AdminController {
    static async getAdminById(req, res) {
        try {
            const id = req.params.id;
            const admin = await adminService.getAdminById(id);
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            return res.status(200).json(admin);
        }
        catch (error) {
            return res.status(500).json({ message: error.message || "Failed to get admin by id" });
        }
    }
    static async getAdmin(req, res) {
        try {
            const admin = await adminService.getAdmin();
            if (!admin) {
                return res.status(404).json({
                    message: "Admin not found!"
                });
            }
            return res.status(200).json({
                admin
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            const adminId = req.params.id;
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
            const invalidField = requiredStringFields.find(({ value }) => typeof value !== "string" || value.trim().length === 0);
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
        }
        catch (error) {
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
exports.AdminController = AdminController;
