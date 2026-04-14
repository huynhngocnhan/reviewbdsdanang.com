"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
// Main auth middleware function
const authMiddlewareFn = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "No token provided",
            });
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        req.adminId = decoded.adminId;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired token",
        });
    }
};
// Export both names for compatibility
exports.authMiddleware = authMiddlewareFn;
exports.authenticate = authMiddlewareFn;
