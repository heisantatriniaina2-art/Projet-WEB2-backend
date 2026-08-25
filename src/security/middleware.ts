import type { Request, Response, NextFunction } from "express";

export const requireAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const user = (req as any).user;

    if (!user) {
        res.status(401).json({
            message: "Utilisateur non authentifié"
        });
        return;
    }

    if (user.role !== "admin") {
        res.status(403).json({
            message: "Accès réservé à l'administrateur"
        });
        return;
    }

    next();
};

export const requireStudent = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const user = (req as any).user;

    if (!user) {
        res.status(401).json({
            message: "Utilisateur non authentifié"
        });
        return;
    }

    if (user.role !== "student") {
        res.status(403).json({
            message: "Accès réservé à l'étudiant"
        });
        return;
    }

    next();
};