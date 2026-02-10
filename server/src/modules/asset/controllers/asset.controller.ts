import type { Request, Response } from "express";
import { AssetService } from "../services/asset.service";
import { AssetType } from "@prisma/client";

const assetService = new AssetService();

export class AssetController {
  static async create(req: Request, res: Response) {
    try {
      const { key, url, contentType, size, type, width, height, alt } = req.body as {
        key?: string;
        url?: string;
        contentType?: string;
        size?: number;
        type?: AssetType;
        width?: number;
        height?: number;
        alt?: string;
      };

      if (!key || !url || !contentType || !size || !type) {
        return res.status(400).json({
          message: "Missing required fields: key, url, contentType, size, type",
        });
      }

      const asset = await assetService.createAsset({
        key,
        url,
        contentType,
        size,
        type,
        width,
        height,
        alt,
      });

      return res.status(201).json(asset);
    } catch (error: any) {
      console.error("Create asset error:", error);
      return res.status(500).json({ message: error.message || "Failed to create asset" });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const asset = await assetService.getAssetById(id);

      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }

      return res.status(200).json(asset);
    } catch (error: any) {
      console.error("Get asset error:", error);
      return res.status(500).json({ message: error.message || "Failed to get asset" });
    }
  }
}
