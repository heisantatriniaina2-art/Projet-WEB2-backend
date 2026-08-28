import { Router, type Request, type Response } from 'express';
import { loginUser } from '../services/authService.js';

const router = Router();

router.post(
  '/api/auth/login',
  async (req: Request, res: Response) => {
    console.log('===== LOGIN RECU =====');
    console.log('BODY :', req.body);

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      console.log('EMAIL :', email);
      console.log('LOGIN EN COURS...');

      const result = await loginUser(email, password);

      console.log('LOGIN REUSSI');

      return res.status(200).json(result);

    } catch (error) {
      console.error('');
      console.error(error);

      return res.status(500).json({
        message: 'Server Error',
        error: error instanceof Error
          ? error.message
          : String(error)
      });
    }
  }
);

export default router;