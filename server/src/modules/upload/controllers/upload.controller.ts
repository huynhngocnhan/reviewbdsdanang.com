import type { Request, Response } from "express";
import { UploadService } from "../services/upload.service";

const uploadService = new UploadService();

export class UploadController {
  static async getPresignedUrl(req: Request, res: Response) {
    try {
      const { fileName, contentType, folder } = req.body as {
        fileName?: string;
        contentType?: string;
        folder?: string;
      };

      if (!fileName || !contentType) {
        return res.status(400).json({
          message: "Missing required fields: fileName, contentType",
        });
      }

      const result = await uploadService.generatePresignedUrl(
        fileName,
        contentType,
        folder
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Presigned URL error:", error);
      return res.status(500).json({ message: error.message || "Failed to generate URL" });
    }
  }
}
