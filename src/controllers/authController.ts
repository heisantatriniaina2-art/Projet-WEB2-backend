import type { Request, Response } from 'express';
import { authService } from '../services/authService.js';

export const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || 'Erreur serveur';
      
      res.status(status).json({ message });
    }
  }
};