"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    static async register(req, res) {
        try {
            const { email, password, fullName } = req.body;
            if (!email || !password || !fullName) {
                return res.status(400).json({
                    message: "Missing required fields: email, password, fullName",
                });
            }
            const admin = await authService.register({
                email,
                passwordHash: password,
                fullName,
            });
            return res.status(201).json({
                message: "Admin registered successfully",
                admin,
            });
        }
        catch (error) {
            return res.status(500).json({ message: error.message || "Register failed" });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields: email, password" });
            }
            const result = await authService.login(email, password);
            return res.status(200).json({
                message: "Login successful",
                admin: result.admin,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            });
        }
        catch (error) {
            return res.status(401).json({ message: error.message || "Login failed" });
        }
    }
    static async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: "Missing refreshToken" });
            }
            const tokens = await authService.refreshTokens(refreshToken);
            return res.status(200).json(tokens);
        }
        catch (error) {
            return res
                .status(401)
                .json({ message: error.message || "Refresh token failed" });
        }
    }
    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: "Missing refreshToken" });
            }
            const result = await authService.logout(refreshToken);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ message: error.message || "Logout failed" });
        }
    }
}
exports.AuthController = AuthController;
