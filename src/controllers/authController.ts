import type { Request, Response } from "express";
import { loginUser } from "../services/authService.js";

export const authController = {

  login: async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          message: "Email et mot de passe obligatoires"
        });
        return;
      }

      const result = await loginUser(
        email,
        password
      );

      res.status(200).json(result);

    } catch (error: any) {

      console.error("Erreur de connexion :", error);

      const status = error.status || 401;
      const message =
        error.message ||
        "Email ou mot de passe incorrect";

      res.status(status).json({
        message
      });
    }
  }
};