import { Router, type Request, type Response} from 'express';
import { createNewExam, getAllExams, updateExam } from '../services/examService.js';
import { authenticate } from '../security/authMiddleware.js';

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

router.put('/api/exams/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const exam = await updateExam(id, req.body);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error'});
  }
});

export default router;