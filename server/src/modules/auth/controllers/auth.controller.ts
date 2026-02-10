import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, fullName } = req.body as {
        email?: string;
        password?: string;
        fullName?: string;
      };

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
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Register failed" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as {
        email?: string;
        password?: string;
      };

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
    } catch (error: any) {
      return res.status(401).json({ message: error.message || "Login failed" });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body as { refreshToken?: string };
      if (!refreshToken) {
        return res.status(400).json({ message: "Missing refreshToken" });
      }

      const tokens = await authService.refreshTokens(refreshToken);
      return res.status(200).json(tokens);
    } catch (error: any) {
      return res
        .status(401)
        .json({ message: error.message || "Refresh token failed" });
    }
  }
}
