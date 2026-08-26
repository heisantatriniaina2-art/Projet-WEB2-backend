import {
  findAllExams,
  findExamById,
  createExam,
  updateExam,
  deleteExam
} from "../repositories/examRepository.js";


// Récupérer tous les examens
export async function getExams() {
  return findAllExams();
}


// Récupérer un examen
export async function getExam(id: number) {
  return findExamById(id);
}


// Créer un examen
export async function addExam(
  courseId: number,
  title: string,
  description: string | null,
  startAt: string,
  endAt: string
) {
  return createExam(
    courseId,
    title,
    description,
    startAt,
    endAt
  );
}


// Modifier un examen
export async function editExam(
  id: number,
  courseId: number,
  title: string,
  description: string | null,
  startAt: string,
  endAt: string
) {
  return updateExam(
    id,
    courseId,
    title,
    description,
    startAt,
    endAt
  );
}


// Supprimer un examen
export async function removeExam(id: number) {
  return deleteExam(id);
}