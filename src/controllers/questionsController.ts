import { Router, type Request, type Response } from 'express';
import { getQuestions, createNewQuestion, updateQuestion, removeQuestion, getExamResults } from '../services/questionsService.js';

const router = Router();

router.get('/api/exams/:id/questions', async (req: Request, res: Response) => {
    try {
        const examId = parseInt(req.params.id as string, 10);
        const questions = await getQuestions(examId);
        res.json(questions);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
});

router.post('/api/exams/:id/questions', async (req: Request, res: Response) => {
    try {
        const examId = parseInt(req.params.id as string, 10);
        const newQ = await createNewQuestion(examId, req.body);
        res.status(201).json(newQ);
    } catch (error: any) {
        res.status(error.status || 400).json({ message: error.message || 'Bad request' });
    }
});

router.put('/api/questions/:id', async (req: Request, res: Response) => {
    try {
        const questionId = parseInt(req.params.id as string, 10);
        const updated = await updateQuestion(questionId, req.body);
        if (!updated) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(updated);
    } catch (error: any) {
        res.status(error.status || 400).json({ message: error.message || 'Bad request' });
    }
});

router.delete('/api/questions/:id', async (req: Request, res: Response) => {
    try {
        const questionId = parseInt(req.params.id as string, 10);
        const deleted = await removeQuestion(questionId);
        if (!deleted) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json({ message: 'Question successfully deleted' });
    } catch (error: any) {
        res.status(error.status || 400).json({ message: error.message || 'Bad request' });
    }
});

router.get('/api/exams/:id/results', async (req: Request, res: Response) => {
    try {
        const examId = parseInt(req.params.id as string, 10);
        const results = await getExamResults(examId);
        res.json(results);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message || 'Server error' });
    }
});

export default router;