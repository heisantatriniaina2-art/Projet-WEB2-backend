import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key_change_in_production";

export interface JwtPayload {
  id: number;
  role: "admin" | "student";
  isActive: boolean;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "2h"
  });
};