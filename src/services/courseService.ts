import type { Course } from '../model/courseModel.js';
import { createNewCourse, deleteCourse, findAllCourses, updateCourse, countExamsByCourseId } from '../repository/courseRepository.js';

export const getAllCourses = async (): Promise<Course[]> => {
  return await findAllCourses();
};

export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  return await createNewCourse(courseData);
};

export const modifyCourse = async (id: number, courseData: Omit<Course, 'id'>): Promise<Course | null> => {
  return await updateCourse(id, courseData);
};

export const removeCourse = async (id: number): Promise<boolean> => {
  const examCount = await countExamsByCourseId(id);
  if (examCount > 0) {
    throw new Error('HAS_EXAMS_CANNOT_DELETE');
  }

  const isDeleted = await deleteCourse(id);
  if (!isDeleted) {
    throw new Error('NOT_FOUND');
  }

  return true;
};