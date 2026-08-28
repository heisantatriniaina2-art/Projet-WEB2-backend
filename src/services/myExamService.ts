import {
    findMyExams,
    findMyExamById,
    submitExam,
    findMyResults
} from '../repository/myExamRepository';

export const getMyExams = async (studentId: number) => {
    return await findMyExams(studentId);
};

export const getMyExamById = async (
    examId: number,
    studentId: number
) => {
    return await findMyExamById(examId, studentId);
};

export const submitMyExam = async (
    examId: number,
    studentId: number,
    answers: {
        questionId: number;
        choiceId: number;
    }[]
) => {
    return await submitExam(
        examId,
        studentId,
        answers
    );
};

export const getMyResults = async (
    studentId: number
) => {
    return await findMyResults(studentId);
};