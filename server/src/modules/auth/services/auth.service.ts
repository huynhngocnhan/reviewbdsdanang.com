import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export class AuthService {
  async register(data: { email: string; passwordHash: string; fullName: string }) {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    
    return await prisma.admin.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            fullName: data.fullName,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async login(email: string, passwordHash: string) {
    const admin = await prisma.admin.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!admin || !(await bcrypt.compare(passwordHash, admin.passwordHash))) {
      throw new Error("Invalid email or password");
    }

    const tokens = this.generateTokens(admin.id);
    await this.updateRefreshToken(admin.id, tokens.refreshToken);

    return { admin, ...tokens };
  }

  generateTokens(adminId: string) {
    const accessToken = jwt.sign({ adminId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ adminId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(adminId: string, refreshToken: string) {
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.adminRefreshToken.create({
      data: {
        adminId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async refreshTokens(refreshToken: string) {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { adminId: string };
    const admin = await prisma.admin.findUnique({ where: { id: decoded.adminId } });

    if (!admin) throw new Error("Admin not found");

    const tokens = this.generateTokens(admin.id);
    await this.updateRefreshToken(admin.id, tokens.refreshToken);

    return tokens;
  }
}
