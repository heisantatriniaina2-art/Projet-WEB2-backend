import type { User } from '../model/usersModel.js';
import { createStudent, desactiveStudent, findAllStudents, updateStudent } from '../repository/studentRepository.js';

export const getAllStudents = async (): Promise<Omit<User, 'passwordHash'>[]> => {
  return await findAllStudents();
};

export const createNewStudent = async (studentData: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { passwordHash: string }): Promise<Omit<User, 'passwordHash'>> => {
  return await createStudent(studentData);
};

export const modifyStudent = async (id: number, studentData: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { passwordHash: string }): Promise<Omit<User, 'passwordHash'> | null>=> {
  return await updateStudent(id, studentData);
};

export const removeStudent = async (id: number): Promise<boolean> => {
  const isDesactivated = await desactiveStudent(id);
  if (!isDesactivated) {
    throw new Error('NOT_FOUND');
  }
  return true;
};