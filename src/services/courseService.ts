import type { Course } from '../model/courseModel.js';
import { createCourse, deleteCourse, findAllCourses, findCourseById, modifyCourse, countExamsByCourseId } from '../repository/courseRepository.js';

export const getAllCourses = async (): Promise<Course[]> => {
  return await findAllCourses();
};

export const getCourseById = async (id: number): Promise<Course | null> => {
  return await findCourseById(id);
};

export const createNewCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  return await createCourse(courseData);
};

export const updateCourse = async (id: number, courseData: Omit<Course, 'id'>): Promise<Course | null> => {
  const existingCourse = await findCourseById(id);
  if (!existingCourse) {
    return null;
  }
  return await modifyCourse(id, courseData);
};

export const removeCourse = async (id: number): Promise<boolean> => {
  const existingCourse = await findCourseById(id);
  if (!existingCourse) {
    throw new Error('NOT_FOUND');
  }
  
  const examCount = await countExamsByCourseId(id);
  if (examCount > 0) {
    throw new Error('HAS_EXAMS_CANNOT_DELETE');
  }

  return await deleteCourse(id);
};