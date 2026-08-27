import { findQuestionsByExamId, createQuestionWithChoices, updateQuestionWithChoices, removeQuestion, findExamResults } from '../repository/questionsRepository.js';

export const getQuestionsService = async (examId: number) => {
  return await findQuestionsByExamId(examId);
};

export const createQuestionService = async (examId: number, data: any) => {
  return await createQuestionWithChoices(examId, data);
};

export const updateQuestionService = async (questionId: number, data: any) => {
  return await updateQuestionWithChoices(questionId, data);
};

export const removeQuestionService = async (questionId: number) => {
  return await removeQuestion(questionId);
};

export const getExamResultsService = async (examId: number) => {
  return await findExamResults(examId);
};