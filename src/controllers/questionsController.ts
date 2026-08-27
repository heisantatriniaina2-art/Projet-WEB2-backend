import { Router, type Response } from 'express';
import { authenticate, type AuthRequest } from '../security/authMiddleware.js';
import { getQuestionsService, createQuestionService, updateQuestionService, removeQuestionService, getExamResultsService } from '../services/questionsService.js';

const router = Router();

router.get('/api/exams/:id/questions', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const examId = Number(req.params.id);
    const questions = await getQuestionsService(examId);
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api/exams/:id/questions', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access reserved for administrators' });
  }
  try {
    const examId = Number(req.params.id);
    const newQuestion = await createQuestionService(examId, req.body);
    return res.status(201).json(newQuestion);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api/questions/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access reserved for administrators' });
  }
  try {
    const questionId = Number(req.params.id);
    const updated = await updateQuestionService(questionId, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/api/questions/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access reserved for administrators' });
  }
  try {
    const questionId = Number(req.params.id);
    const deleted = await removeQuestionService(questionId);
    if (!deleted) {
      return res.status(404).json({ message: 'Question not found' });
    }
    return res.status(200).json({ message: 'Question successfully deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/api/exams/:id/results', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access reserved for administrators' });
  }
  try {
    const examId = Number(req.params.id);
    const results = await getExamResultsService(examId);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;