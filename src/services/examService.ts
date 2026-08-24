import type { Exam } from '../model/examModel.js';
import { createExam } from '../repository/examRepository.js';

export const createNewExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
  return await createExam(examData);
}