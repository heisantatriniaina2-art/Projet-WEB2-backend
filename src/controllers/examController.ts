import { Router, type Request, type Response} from 'express';
import { createNewExam } from '../services/examService.js';

const router = Router();

router.post('/api/exams', async (req: Request, res: Response): Promise<void> => {
  try {
    const newExam = await createNewExam(req.body);
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;