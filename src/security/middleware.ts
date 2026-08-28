import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authMiddleware";

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const user = req.user;

    if (!user) {
        res.status(401).json({
            message: "User didn't authentifi"
        });
        return;
    }

    if (user.role !== "admin") {
        res.status(403).json({
            message: "Access reserved for administrator"
        });
        return;
    }

    next();
};

export const requireStudent = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const user = req.user;

    if (!user) {
        res.status(401).json({
            message: "User didn't  authenticate"
        });
        return;
    }

    next();
};