import { Router, type Request, type Response} from 'express';
import { createNewStudent, getAllStudents, removeStudent, updateStudent } from '../services/studentService.js';

const router = Router();

router.get('/api/students', async (_req: Request, res: Response) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api/students', async (req: Request, res: Response): Promise<void> => {
  try {
    const newStudent = await createNewStudent(req.body);
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/api/students/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const student = await updateStudent(id, req.body);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error'});
  }
});

router.delete('/api/students/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const studentDisabled = await removeStudent(id);
    if (!studentDisabled) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student successfully deactivated' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error'});
  }
});

export default router;