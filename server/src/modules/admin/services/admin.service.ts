import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

type UpdateAdminProfileInput = {
  adminId: string;
  fullName: string;
  title: string;
  tagline: string;
  phone: string;
  address: string;
  workHours: string;
  avatarAssetId: string;
  mediaLinks: Prisma.InputJsonValue;
};

export class AdminService {
  async getAdminById(id: string) {
    const admin = await prisma.admin.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            avatarAsset: true,
          },
        },
      },
    });

    if (!admin) return null;

    return {
      ...admin,
      profile: admin.profile
        ? {
            ...admin.profile,
            avatarUrl: admin.profile.avatarAsset?.url ?? null,
          }
        : null,
    };
  }

  async updateAdminProfile(input: UpdateAdminProfileInput) {
    const { adminId, ...profileData } = input;

    if (profileData.avatarAssetId) {
      const asset = await prisma.asset.findUnique({ where: { id: profileData.avatarAssetId } });
      if (!asset) {
        throw new Error("Avatar asset not found");
      }
    }

    await prisma.admin.findUniqueOrThrow({ where: { id: adminId } });

    const profile = await prisma.adminProfile.upsert({
      where: { adminId },
      update: {
        fullName: profileData.fullName,
        title: profileData.title,
        tagline: profileData.tagline,
        phone: profileData.phone,
        address: profileData.address,
        workHours: profileData.workHours,
        avatarAssetId: profileData.avatarAssetId,
        mediaLinks: profileData.mediaLinks,
      },
      create: {
        adminId,
        fullName: profileData.fullName,
        title: profileData.title,
        tagline: profileData.tagline,
        phone: profileData.phone,
        address: profileData.address,
        workHours: profileData.workHours,
        avatarAssetId: profileData.avatarAssetId,
        mediaLinks: profileData.mediaLinks,
      },
      include: {
        avatarAsset: true,
      },
    });

    return profile;
  }
}
