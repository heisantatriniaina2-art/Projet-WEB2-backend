import { Router, type Request, type Response } from 'express';
import {
  createNewExam,
  getAllExams,
  getExamById,
  removeExam,
  updateExam,
  getAvailableExamsService,
  getAvailableExamByIdService,
  submitExamAttemptService,
  getStudentResultsService
} from '../services/examService.js';

import { authenticate } from '../security/authMiddleware.js';
import { requireAdmin, requireStudent } from '../security/middleware.js';

const router = Router();


router.get('/api/exams', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const exams = await getAllExams();
    return res.json(exams);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/api/exams/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
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


router.post('/api/exams', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      startsAt,
      endsAt,
      courseId
    } = req.body;

    if (!title || !description || !startsAt || !endsAt || !courseId) {
      return res.status(400).json({
        message: 'title, description, startsAt, endsAt and courseId are required'
      });
    }

    const newExam = await createNewExam({
      title,
      description,
      startsAt,
      endsAt,
      courseId
    });

    return res.status(201).json(newExam);

  } catch (error: any) {

    if (error.message === 'INVALID_DATES') {
      return res.status(400).json({
        message: 'startsAt must be earlier than endsAt'
      });
    }

    console.error('CREATE EXAM ERROR:', error);

    return res.status(500).json({
      message: 'Server Error'
    });
  }
});


router.put('/api/exams/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        message: 'Invalid ID format'
      });
    }

    const {
      title,
      description,
      startsAt,
      endsAt,
      courseId
    } = req.body;

    if (!title || !description || !startsAt || !endsAt || !courseId) {
      return res.status(400).json({
        message: 'title, description, startsAt, endsAt and courseId are required'
      });
    }

    const updatedExam = await updateExam(id, {
      title,
      description,
      startsAt,
      endsAt,
      courseId
    });

    if (!updatedExam) {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    return res.json(updatedExam);

  } catch (error: any) {

    if (error.message === 'INVALID_DATES') {
      return res.status(400).json({
        message: 'startsAt must be earlier than endsAt'
      });
    }

    if (error.message === 'HAS_ATTEMPTS_CANNOT_MODIFY') {
      return res.status(409).json({
        message: 'Conflict: Cannot modify an exam that already has attempts'
      });
    }

    console.error('UPDATE EXAM ERROR:', error);

    return res.status(500).json({
      message: 'Server Error'
    });
  }
});

router.delete('/api/exams/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        message: 'Invalid ID format'
      });
    }

    await removeExam(id);

    return res.status(200).json({
      message: 'Exam deleted successfully'
    });

  } catch (error: any) {

    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({
        message: 'Exam not found'
      });
    }

    if (error.message === 'HAS_ATTEMPTS_CANNOT_DELETE') {
      return res.status(409).json({
        message: 'Conflict: Cannot delete an exam that already has attempts'
      });
    }

    console.error('DELETE EXAM ERROR:', error);

    return res.status(500).json({
      message: 'Server Error'
    });
  }
});


router.get('/api/my/exams', authenticate, requireStudent, async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;

    const exams = await getAvailableExamsService(studentId);

    return res.json(exams);

  } catch (error) {

    console.error('GET AVAILABLE EXAMS ERROR:', error);

    return res.status(500).json({
      message: 'Server error'
    });
  }
});


router.get('/api/my/exams/:id', authenticate, requireStudent, async (req: Request, res: Response) => {
  try {
    const examId = parseInt(req.params.id as string, 10);

    if (isNaN(examId)) {
      return res.status(400).json({
        message: 'Invalid ID format'
      });
    }

    const examData = await getAvailableExamByIdService(examId);

    if (!examData) {
      return res.status(404).json({
        message: 'Exam not found or not available'
      });
    }

    return res.json(examData);

  } catch (error) {

    console.error('GET EXAM ERROR:', error);

    return res.status(500).json({
      message: 'Server error'
    });
  }
});

router.post('/api/my/exams/:id/submit', authenticate, requireStudent, async (req: Request, res: Response) => {
  try {
    const examId = parseInt(req.params.id as string, 10);

    if (isNaN(examId)) {
      return res.status(400).json({
        message: 'Invalid ID format'
      });
    }

    const studentId = (req as any).user.id;
    const answersMap = req.body.answers;

    const result = await submitExamAttemptService(
      examId,
      studentId,
      answersMap
    );

    return res.status(201).json(result);

  } catch (error) {

    console.error('SUBMIT EXAM ERROR:', error);

    return res.status(500).json({
      message: 'Server error'
    });
  }
});

router.get('/api/my/results', authenticate, requireStudent, async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;

    const results = await getStudentResultsService(studentId);

    return res.json(results);

  } catch (error) {

    console.error('GET RESULTS ERROR:', error);

    return res.status(500).json({
      message: 'Server error'
    });
  }
});


export default router;