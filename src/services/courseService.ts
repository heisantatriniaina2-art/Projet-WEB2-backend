import type { Course } from '../model/courseModel.js';
import {createCourse, deleteCourse, modifyCourse } from '../repository/courseRepository.js';

export const findAllCourses = async (): Promise<Course[]> =>  {
  return await findAllCourses();
}

export const createNewCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  return await createCourse(courseData);
}

export const updateCourse = async (id: number, courseData: Omit<Course, 'id'>): Promise<Course | null> => {
  return await modifyCourse(id, courseData);
}

export const removeCourse = async (id: number): Promise<boolean> => {
  return await deleteCourse(id);
}