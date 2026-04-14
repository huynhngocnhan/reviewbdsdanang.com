"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const prisma_1 = require("../../../lib/prisma");
class AssetService {
    async createAsset(data) {
        return await prisma_1.prisma.asset.create({
            data: {
                key: data.key,
                url: data.url,
                contentType: data.contentType,
                size: data.size,
                type: data.type,
                width: data.width,
                height: data.height,
                alt: data.alt,
            },
        });
    }
    async getAssetById(id) {
        return await prisma_1.prisma.asset.findUnique({
            where: { id },
        });
    }
}
exports.AssetService = AssetService;
