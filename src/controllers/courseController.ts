import { Router, type Request, type Response} from 'express';
import { findAllCourses, createNewCourse, updateCourse, removeCourse } from '../services/courseService.js';



const router = Router();

router.get('/api/courses', async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await findAllCourses();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/api/courses', async (req: Request, res: Response): Promise<void> => {
  try {
    const newCourse = await createNewCourse(req.body);
    res.status(201).json(newCourse );
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/api/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const course = await updateCourse(id, req.body);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error'});
  }
});

router.delete('/api/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const courseDeleted = await removeCourse(id);
    if (!courseDeleted) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json();
  } catch (error) {
    res.status(500).json({ message: 'Server Error'});
  }
});

export default router;