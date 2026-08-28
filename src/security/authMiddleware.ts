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
): void => {
  if (!JWT_SECRET) {
    res.status(500).json({
      message: "JWT_SECRET is not configured",
    });
    return;
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Missing or invalid token format",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET) as any;

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "number" ||
      (decoded.role !== "admin" && decoded.role !== "student") ||
      typeof decoded.isActive !== "boolean"
    ) {
      res.status(401).json({
        message: "Invalid token structure",
      });
      return;
    }

    // RG-11 : Compte désactivé
    if (!decoded.isActive) {
      res.status(403).json({
        message: "Your account has been deactivated",
      });
      return;
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
      isActive: decoded.isActive,
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};