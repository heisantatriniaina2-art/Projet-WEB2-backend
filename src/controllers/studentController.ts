import { Router, type Request, type Response } from 'express';
import { createNewStudent, getAllStudents, removeStudent, modifyStudent } from '../services/studentService.js';
import { authenticate } from '../security/authMiddleware.js';
import { requireAdmin } from '../security/middleware.js';

const router = Router();

router.get('/api/students', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api/students', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, passwordHash} = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Invalid body: firstName, lastName and email are required' });
    }

    const newStudent = await createNewStudent({
      firstName,
      lastName,
      email,
      passwordHash: passwordHash || '',
      role: 'student',
      isActive: true
    });

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api/students/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { firstName, lastName, email, passwordHash } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Invalid body: firstName, lastName and email  are required' });
    }

    const student = await modifyStudent(id, {
      firstName,
      lastName,
      email,
      passwordHash: passwordHash || '',
      role: 'student',
      isActive: true
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/api/students/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    await removeStudent(id);
    res.status(200).json({ message: 'Student successfully desactivated' });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;