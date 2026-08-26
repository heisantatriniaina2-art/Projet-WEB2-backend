import type { Exam } from '../model/examModel.js';
import { createExam, deleteExam, findAllExams, findExamById, modifyExam, countExamAttempts } from '../repository/examRepository.js';

export const getAllExams = async (): Promise<Exam[]> => {
  return await findAllExams();
};

export const getExamById = async (id: number): Promise<Exam | null> => {
  return await findExamById(id);
};

export const createNewExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
  const start = new Date(examData.startTime);
  const end = new Date(examData.endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    throw new Error('INVALID_DATES');
  }

  return await createExam(examData);
};

export const updateExam = async (id: number, examData: Omit<Exam, 'id'>): Promise<Exam | null> => {
  const start = new Date(examData.startTime);
  const end = new Date(examData.endTime);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    throw new Error('INVALID_DATES');
  }

  const attemptsCount = await countExamAttempts(id);
  if (attemptsCount > 0) {
    throw new Error('HAS_ATTEMPTS_CANNOT_MODIFY');
  }

  return await modifyExam(id, examData);
};

export const removeExam = async (id: number): Promise<boolean> => {
  const existingExam = await findExamById(id);
  if (!existingExam) {
    throw new Error('NOT_FOUND');
  }

  const attemptsCount = await countExamAttempts(id);
  if (attemptsCount > 0) {
    throw new Error('HAS_ATTEMPTS_CANNOT_DELETE');
  }

  return await deleteExam(id);
};