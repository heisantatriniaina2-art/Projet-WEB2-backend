import { Router, type Request, type Response } from 'express';
import { getAllCourses, getCourseById, createNewCourse, updateCourse, removeCourse } from '../services/courseService.js';
import { authenticate } from '../security/authMiddleware.js';

const router = Router();

router.get('/api/courses', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/api/courses/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const course = await getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/api/courses', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'name and description are required' });
    }

    const newCourse = await createNewCourse({ name, description });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/api/courses/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'name and description are required' });
    }

    const course = await updateCourse(id, { name, description });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
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
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Course not found' });
    }
    if (error.message === 'HAS_EXAMS_CANNOT_DELETE') {
      return res.status(409).json({ message: 'Conflict: Cannot delete a course that has associated exams' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;