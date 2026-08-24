import { Router, type Request, type Response} from 'express';
import { createNewExam, getAllExams } from '../services/examService.js';

const router = Router();

router.get('/api/exams', async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await getAllExams();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.post('/api/exams', async (req: Request, res: Response): Promise<void> => {
  try {
    const newExam = await createNewExam(req.body);
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;