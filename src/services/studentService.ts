import type { User } from '../model/usersModel.js';
import { createStudent, deleteStudent, findAllStudents, findStudentById, modifyStudent } from '../repository/studentRepository.js';

export const getAllStudents = async (): Promise<User[]> => {
  return await findAllStudents();
};

export const getStudentById = async (id: number): Promise<User | null> => {
  return await findStudentById(id);
};

export const createNewStudent = async (studentData: Omit<User, 'id'>): Promise<User> => {
  return await createStudent(studentData);
};

export const updateStudent = async (id: number, studentData: Omit<User, 'id'>): Promise<User | null> => {
  const existingStudent = await findStudentById(id);
  if (!existingStudent) {
    return null;
  }
  return await modifyStudent(id, studentData);
};

export const removeStudent = async (id: number): Promise<boolean> => {
  const existingStudent = await findStudentById(id);
  if (!existingStudent) {
    throw new Error('NOT_FOUND');
  }

  return await deleteStudent(id);
};