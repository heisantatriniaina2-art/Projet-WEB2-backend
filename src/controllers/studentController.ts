import { Router, type Request, type Response } from 'express';
import { createNewStudent, getAllStudents, getStudentById, removeStudent, updateStudent } from '../services/studentService.js';
import { authenticate } from '../security/authMiddleware.js';

const router = Router();

router.get('/api/students', authenticate, async (_req: Request, res: Response) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/api/students/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const student = await getStudentById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api/students', authenticate, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Invalid body: firstName, lastName, email and password are required' });
    }

    const newStudent = await createNewStudent({
      firstName,
      lastName,
      email,
      password,
      role: 'student',
      isActive: true
    });

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api/students/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Invalid body: firstName, lastName, email and password are required' });
    }

    const student = await updateStudent(id, {
      firstName,
      lastName,
      email,
      password,
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

router.delete('/api/students/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    await removeStudent(id);
    res.status(200).json({ message: 'Student successfully deactivated' });
  } catch (error: any) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;