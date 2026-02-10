import { prisma } from "../../../lib/prisma";
import { AssetType } from "@prisma/client";

interface CreateAssetDto {
  key: string;
  url: string;
  contentType: string;
  size: number;
  type: AssetType;
  width?: number;
  height?: number;
  alt?: string;
}

export class AssetService {
  async createAsset(data: CreateAssetDto) {
    return await prisma.asset.create({
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

  async getAssetById(id: string) {
    return await prisma.asset.findUnique({
      where: { id },
    });
  }
}
