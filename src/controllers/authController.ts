import { Router, type Request, type Response } from 'express';
import { loginUser } from '../services/authService.js';

const router = Router();

router.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginUser(email, password);
    return res.json(result);
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (error.message === 'ACCOUNT_DEACTIVATED') {
        return res.status(403).json({ message: 'Your account has been desactivated' });
      }
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;