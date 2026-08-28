import { Router, type Response } from 'express';
import { authenticate, type AuthRequest } from '../security/authMiddleware.js';
import {
    getMyExams,
    getMyExamById,
    submitMyExam,
    getMyResults
} from '../services/myExamService';

const router = Router();

router.get(
    '/api/my/exams',
    authenticate,
    async (req: AuthRequest, res: Response) => {
        try {
            if (req.user?.role !== 'student') {
                return res.status(403).json({
                    message: 'Student access only'
                });
            }

            const exams = await getMyExams(req.user.id);

            return res.json(exams);
        } catch (error) {
            console.error('GET MY EXAMS ERROR:', error);

            return res.status(500).json({
                message: 'Server error'
            });
        }
    }
);

router.get(
    '/api/my/exams/:id',
    authenticate,
    async (req: AuthRequest, res: Response) => {
        try {
            if (req.user?.role !== 'student') {
                return res.status(403).json({
                    message: 'Student access only'
                });
            }

            const examId = Number(req.params.id);

            if (Number.isNaN(examId)) {
                return res.status(400).json({
                    message: 'Invalid exam ID'
                });
            }

            const exam = await getMyExamById(
                examId,
                req.user.id
            );

            if (!exam) {
                return res.status(404).json({
                    message: 'Exam not found'
                });
            }

            return res.json(exam);
        } catch (error) {
            console.error('GET MY EXAM ERROR:', error);

            return res.status(500).json({
                message: 'Server error'
            });
        }
    }
);

router.post(
    '/api/my/exams/:id/submit',
    authenticate,
    async (req: AuthRequest, res: Response) => {
        try {
            if (req.user?.role !== 'student') {
                return res.status(403).json({
                    message: 'Student access only'
                });
            }

            const examId = Number(req.params.id);

            if (Number.isNaN(examId)) {
                return res.status(400).json({
                    message: 'Invalid exam ID'
                });
            }

            const { answers } = req.body;

            if (!Array.isArray(answers)) {
                return res.status(400).json({
                    message: 'answers must be an array'
                });
            }

            const result = await submitMyExam(
                examId,
                req.user.id,
                answers
            );

            return res.status(201).json(result);
        } catch (error: any) {
            console.error('SUBMIT EXAM ERROR:', error);

            if (error.message === 'EXAM_NOT_FOUND') {
                return res.status(404).json({
                    message: 'Exam not found'
                });
            }

            if (error.message === 'ALREADY_SUBMITTED') {
                return res.status(409).json({
                    message: 'Exam already submitted'
                });
            }

            return res.status(500).json({
                message: 'Server error'
            });
        }
    }
);

router.get(
    '/api/my/results',
    authenticate,
    async (req: AuthRequest, res: Response) => {
        try {
            if (req.user?.role !== 'student') {
                return res.status(403).json({
                    message: 'Student access only'
                });
            }

            const results = await getMyResults(req.user.id);

            return res.json(results);
        } catch (error) {
            console.error('GET MY RESULTS ERROR:', error);

            return res.status(500).json({
                message: 'Server error'
            });
        }
    }
);

export default router;