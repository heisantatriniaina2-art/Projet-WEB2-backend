import { Router, type Request, type Response } from 'express';
import { createNewExam, getAllExams, getExamById, removeExam, updateExam } from '../services/examService.js';
import { authenticate } from '../security/authMiddleware.js';

const router = Router();

router.get('/api/exams', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const exams = await getAllExams();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/api/exams/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const exam = await getExamById(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/api/exams', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, startTime, endTime, courseId } = req.body;

    if (!title || !startTime || !endTime || !courseId) {
      return res.status(400).json({ message: 'title, startTime, endTime and courseId are required' });
    }

    const newExam = await createNewExam({ title, startTime, endTime, courseId });
    res.status(201).json(newExam);
  } catch (error: any) {
    if (error.message === 'INVALID_DATES') {
      return res.status(400).json({ message: 'startTime must be earlier than endTime' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/api/exams/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { title, startTime, endTime, courseId } = req.body;
    if (!title || !startTime || !endTime || !courseId) {
      return res.status(400).json({ message: 'title, startTime, endTime and courseId are required' });
    }

    const updatedExam = await updateExam(id, { title, startTime, endTime, courseId });
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(updatedExam);
  } catch (error: any) {
    if (error.message === 'INVALID_DATES') {
      return res.status(400).json({ message: 'startTime must be earlier than endTime' });
    }
    if (error.message === 'HAS_ATTEMPTS_CANNOT_MODIFY') {
      return res.status(409).json({ message: 'Conflict: Cannot modify an exam that already has attempts' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/api/exams/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    await removeExam(id);
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (error.message === 'HAS_ATTEMPTS_CANNOT_DELETE') {
      return res.status(409).json({ message: 'Conflict: Cannot delete an exam that already has attempts' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;