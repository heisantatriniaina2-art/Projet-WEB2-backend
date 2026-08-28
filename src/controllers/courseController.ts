import { Router, type Request, type Response } from 'express';
import { createCourse, getAllCourses, removeCourse, modifyCourse } from '../services/courseService.js';
import { authenticate } from '../security/authMiddleware.js';

const router = Router();

router.get('/api/courses', authenticate, async (_req: Request, res: Response) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/api/courses', authenticate, async (req: Request, res: Response) => {
  try {
    const { code, name, description } = req.body;
    if (!code || !name || !description) {
      return res.status(400).json({ message: 'Invalid body: code, name, and description are required' });
    }

    const newCourse = await createCourse({ code, name, description });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api/courses/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { code, name, description, createdAt } = req.body;
    if (!code || !name || !description) {
      return res.status(400).json({ message: 'Invalid body: code, name, and description are required' });
    }

    const course = await modifyCourse(id, { code, name, description, createdAt });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/api/courses/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    await removeCourse(id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    if (error.message === 'HAS_EXAMS_CANNOT_DELETE') {
      return res.status(409).json({ message: 'Conflict: Cannot delete a course that has associated exams' });
    }
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;