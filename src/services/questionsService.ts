import { findQuestionsByExam, createQuestion, modifyQuestion, deleteQuestion, checkExamHasAttempts, findExamIdByQuestion, findExamResults } from '../repository/questionsRepository.js';

export const getQuestions = async (examId: number) => {
    return await findQuestionsByExam(examId);
};

export const createNewQuestion = async (examId: number, data: any) => {
    const hasAttempts = await checkExamHasAttempts(examId);
    if (hasAttempts) {
        throw { status: 409, message: 'Cannot modify questions: exam already has attempts' };
    }
    validateChoices(data.choices);
    return await createQuestion(examId, data);
};

export const updateQuestion = async (questionId: number, data: any) => {
    const examId = await findExamIdByQuestion(questionId);
    if (!examId) throw { status: 404, message: 'Question not found' };

    const hasAttempts = await checkExamHasAttempts(examId);
    if (hasAttempts) {
        throw { status: 409, message: 'Cannot modify questions: exam already has attempts ' };
    }
    validateChoices(data.choices);
    return await modifyQuestion(questionId, data);
};

export const removeQuestion = async (questionId: number): Promise<boolean> => {
    const examId = await findExamIdByQuestion(questionId);
    if (!examId) throw { status: 404, message: 'Question not found' };

    const hasAttempts = await checkExamHasAttempts(examId);
    if (hasAttempts) {
        throw { status: 409, message: 'Cannot delete questions: exam already has attempts' };
    }
    return await deleteQuestion(questionId);
};

export const getExamResults = async (examId: number) => {
    return await findExamResults(examId);
};

function validateChoices(choices: { text: string; isCorrect: boolean }[]) {
    if (!choices || choices.length < 2 || choices.length > 6) {
        throw { status: 400, message: 'A question must have between 2 and 6 choices' };
    }
    const correctChoices = choices.filter(c => c.isCorrect);
    if (correctChoices.length !== 1) {
        throw { status: 400, message: 'A question must have exactly one correct choice' };
    }
}