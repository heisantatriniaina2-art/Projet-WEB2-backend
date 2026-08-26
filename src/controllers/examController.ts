import { Router, type Request, type Response } from 'express';
import { createNewExam, getAllExams, getExamById, removeExam, updateExam } from '../services/examService.js';
import { authenticate } from '../security/authMiddleware.js';

const router = Router();

router.get('/api/exams', authenticate, async (_req: Request, res: Response) => {
  try {
    const exams = await getAllExams();
    return res.json(exams);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
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
    
    return res.json(exam);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/api/exams', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, startsAt, endsAt, courseId } = req.body;

    if (!title || !startsAt || !endsAt || !courseId) {
      return res.status(400).json({ message: 'title, startsAt, endsAt and courseId are required' });
    }

    const newExam = await createNewExam({ title, startsAt, endsAt, courseId });
    return res.status(201).json(newExam);
  } catch (error: any) {
    if (error.message === 'INVALID_DATES') {
      return res.status(400).json({ message: 'startsAt must be earlier than endsAt' });
    }
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/api/exams/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { title, startsAt, endsAt, courseId } = req.body;
    if (!title || !startsAt || !endsAt || !courseId) {
      return res.status(400).json({ message: 'title, startsAt, endsAt and courseId are required' });
    }

    const updatedExam = await updateExam(id, { title, startsAt, endsAt, courseId });
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    return res.json(updatedExam);
  } catch (error: any) {
    if (error.message === 'INVALID_DATES') {
      return res.status(400).json({ message: 'startsAt must be earlier than endsAt' });
    }
    if (error.message === 'HAS_ATTEMPTS_CANNOT_MODIFY') {
      return res.status(409).json({ message: 'Conflict: Cannot modify an exam that already has attempts' });
    }
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.delete('/api/exams/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    await removeExam(id);
    return res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Exam not found' });
    }
    if (error.message === 'HAS_ATTEMPTS_CANNOT_DELETE') {
      return res.status(409).json({ message: 'Conflict: Cannot delete an exam that already has attempts' });
    }
    return res.status(500).json({ message: 'Server Error' });
  }
});

export default router;