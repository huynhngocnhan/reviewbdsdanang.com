"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const upload_service_1 = require("../services/upload.service");
const uploadService = new upload_service_1.UploadService();
class UploadController {
    static async getPresignedUrl(req, res) {
        try {
            const { fileName, contentType, folder } = req.body;
            if (!fileName || !contentType) {
                return res.status(400).json({
                    message: "Missing required fields: fileName, contentType",
                });
            }
            const result = await uploadService.generatePresignedUrl(fileName, contentType, folder);
            return res.status(200).json(result);
        }
        catch (error) {
            console.error("Presigned URL error:", error);
            return res.status(500).json({ message: error.message || "Failed to generate URL" });
        }
    }
}
exports.UploadController = UploadController;
