import type { User } from '../model/usersModel.js';
import { createStudent, deleteStudent, findAllStudents, modifyStudent } from '../repository/studentRepository.js';

export const getAllStudents = async (): Promise<User[]> => {
  return await findAllStudents();
};

export const createNewStudent = async (studentData: Omit<User, 'id'>): Promise<User> => {
  return await createStudent(studentData);
};

export const updateStudent = async (id: number, studentData: Omit<User, 'id'>): Promise<User | null> => {
  return await modifyStudent(id, studentData);
};

export const removeStudent = async (id: number): Promise<boolean> => {
  const isDeleted = await deleteStudent(id);
  if (!isDeleted) {
    throw new Error('NOT_FOUND');
  }
  return true;
};