import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "exam-hub-secret";

export interface AuthPayload {
  id: number;
  email: string;
  role: "admin" | "student";
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "2h"
  });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}