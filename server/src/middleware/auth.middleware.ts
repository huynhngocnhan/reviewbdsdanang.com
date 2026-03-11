import express, { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";

export interface AuthRequest extends Request {
  adminId?: string;
}

// Main auth middleware function
const authMiddlewareFn = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { adminId: string };

    req.adminId = decoded.adminId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};

// Export both names for compatibility
export const authMiddleware = authMiddlewareFn;
export const authenticate = authMiddlewareFn;
