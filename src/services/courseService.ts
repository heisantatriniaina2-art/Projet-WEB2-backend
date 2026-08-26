import {
  findAllCourses,
  findCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from "../repositories/courseRepository.js";

export async function getCourses() {
  return findAllCourses();
}

export async function getCourse(id: number) {
  return findCourseById(id);
}

export async function addCourse(
  code: string,
  name: string,
  description: string | null
) {
  return createCourse(code, name, description);
}

export async function editCourse(
  id: number,
  code: string,
  name: string,
  description: string | null
) {
  return updateCourse(
    id,
    code,
    name,
    description
  );
}

export async function removeCourse(id: number) {
  return deleteCourse(id);
}