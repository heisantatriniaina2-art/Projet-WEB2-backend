import type { Exam } from '../model/examModel.js';
import { createExam, findAll, modifyExam } from '../repository/examRepository.js';

export const createNewExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
  return await createExam(examData);
}

export const getAllExams = async (): Promise<Exam[]> =>  {
  return await findAll();
}

export const updateExam = async (id: number, examData: Omit<Exam, 'id'>): Promise<Exam | null> => {
  return await modifyExam(id, examData);
}