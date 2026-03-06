import { prisma } from "../../../lib/prisma";

export class AdminService {
  async getAdminById(id: string) {
    return await prisma.admin.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }
}