import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "admin" | "student";
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
      message: "JWT_SECRET non configuré"
    });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token manquant"
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Format du token invalide"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token manquant"
    });
  }

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "number" ||
      (decoded.role !== "admin" && decoded.role !== "student")
    ) {
      return res.status(401).json({
        message: "Token invalide"
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Token invalide ou expiré"
    });
  }
};