import type {
  Request,
  Response,
  NextFunction
} from "express";

import { verifyToken } from "./jwt.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const authorization =
    req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      message: "Token manquant"
    });
    return;
  }

  const [type, token] =
    authorization.split(" ");

  if (type !== "Bearer" || !token) {
    res.status(401).json({
      message: "Format du token invalide"
    });
    return;
  }

  try {

    const payload = verifyToken(token);

    (req as any).user = {
      id: payload.id,
      role: payload.role
    };

    next();

  } catch (error) {

    res.status(401).json({
      message: "Token invalide ou expiré"
    });
  }
};