import type { Exam } from '../model/examModel.js';
import { createExam, deleteExam, findAllExams, modifyExam } from '../repository/examRepository.js';

export const getAllExams = async (): Promise<Exam[]> =>  {
  return await findAllExams();
}

export const createNewExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
  return await createExam(examData);
}

export const updateExam = async (id: number, examData: Omit<Exam, 'id'>): Promise<Exam | null> => {
  return await modifyExam(id, examData);
}

export const removeExam = async (id: number): Promise<boolean> => {
  return await deleteExam(id);
}