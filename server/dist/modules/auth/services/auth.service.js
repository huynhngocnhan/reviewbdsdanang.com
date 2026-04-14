"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../../lib/prisma");
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
class AuthService {
    async register(data) {
        const hashedPassword = await bcrypt_1.default.hash(data.passwordHash, 10);
        return await prisma_1.prisma.admin.create({
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
    async login(email, passwordHash) {
        const admin = await prisma_1.prisma.admin.findUnique({
            where: { email },
            include: { profile: true },
        });
        if (!admin || !(await bcrypt_1.default.compare(passwordHash, admin.passwordHash))) {
            throw new Error("Invalid email or password");
        }
        const tokens = this.generateTokens(admin.id);
        await this.updateRefreshToken(admin.id, tokens.refreshToken);
        return { admin, ...tokens };
    }
    generateTokens(adminId) {
        const accessToken = jsonwebtoken_1.default.sign({ adminId }, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
        const refreshToken = jsonwebtoken_1.default.sign({ adminId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(adminId, refreshToken) {
        const tokenHash = await bcrypt_1.default.hash(refreshToken, 10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await prisma_1.prisma.adminRefreshToken.create({
            data: {
                adminId,
                tokenHash,
                expiresAt,
            },
        });
    }
    async refreshTokens(refreshToken) {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const admin = await prisma_1.prisma.admin.findUnique({ where: { id: decoded.adminId } });
        if (!admin)
            throw new Error("Admin not found");
        const tokens = this.generateTokens(admin.id);
        await this.updateRefreshToken(admin.id, tokens.refreshToken);
        return tokens;
    }
    async logout(refreshToken) {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        await prisma_1.prisma.adminRefreshToken.deleteMany({
            where: { adminId: decoded.adminId },
        });
        return { message: "Logout successful" };
    }
}
exports.AuthService = AuthService;
