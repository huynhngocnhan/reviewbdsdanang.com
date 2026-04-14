"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const routeParams_1 = require("../../../lib/routeParams");
const asset_service_1 = require("../services/asset.service");
const assetService = new asset_service_1.AssetService();
class AssetController {
    static async create(req, res) {
        try {
            const { key, url, contentType, size, type, width, height, alt } = req.body;
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
        }
        catch (error) {
            console.error("Create asset error:", error);
            return res.status(500).json({ message: error.message || "Failed to create asset" });
        }
    }
    static async getById(req, res) {
        try {
            const id = (0, routeParams_1.routeParamString)(req, "id");
            if (!id) {
                return res.status(400).json({ message: "Missing id" });
            }
            const asset = await assetService.getAssetById(id);
            if (!asset) {
                return res.status(404).json({ message: "Asset not found" });
            }
            return res.status(200).json(asset);
        }
        catch (error) {
            console.error("Get asset error:", error);
            return res.status(500).json({ message: error.message || "Failed to get asset" });
        }
    }
}
exports.AssetController = AssetController;
