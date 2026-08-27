import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "admin" | "student";
    isActive: boolean;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!JWT_SECRET) {
    return res.status(500).json({
      message: "JWT_SECRET does not configured",
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Missing token",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalide token format",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Missing token",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "number" ||
      (decoded.role !== "admin" && decoded.role !== "student") ||
      typeof decoded.isActive !== "boolean"
    ) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    if (!decoded.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated",
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      isActive: decoded.isActive,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};