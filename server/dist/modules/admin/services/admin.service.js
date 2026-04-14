"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const prisma_1 = require("../../../lib/prisma");
class AdminService {
    async getAdmin() {
        return prisma_1.prisma.admin.findFirst({
            select: {
                email: true,
                profile: {
                    select: {
                        id: true,
                        fullName: true,
                        title: true,
                        tagline: true,
                        phone: true,
                        address: true,
                        mediaLinks: true,
                        avatarAsset: {
                            select: {
                                url: true
                            }
                        }
                    }
                }
            }
        });
    }
    async getAdminById(id) {
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { id },
            include: {
                profile: {
                    include: {
                        avatarAsset: true,
                    },
                },
            },
        });
        if (!admin)
            return null;
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
    async updateAdminProfile(input) {
        const { adminId, ...profileData } = input;
        if (profileData.avatarAssetId) {
            const asset = await prisma_1.prisma.asset.findUnique({ where: { id: profileData.avatarAssetId } });
            if (!asset) {
                throw new Error("Avatar asset not found");
            }
        }
        await prisma_1.prisma.admin.findUniqueOrThrow({ where: { id: adminId } });
        const profile = await prisma_1.prisma.adminProfile.upsert({
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
        // Transform to include avatarUrl
        return {
            ...profile,
            avatarUrl: profile.avatarAsset?.url ?? null,
        };
    }
}
exports.AdminService = AdminService;
