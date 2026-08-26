import type { Request, Response } from "express";
import {
  getExams,
  getExam,
  addExam,
  editExam,
  removeExam
} from "../services/examService.js";
export async function getExamsController(
  req: Request,
  res: Response
) {
  try {
    const exams = await getExams();

    res.json(exams);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

export async function getExamController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const exam = await getExam(id);

    if (!exam) {
      res.status(404).json({
        message: "Examen introuvable"
      });
      return;
    }

    res.json(exam);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

export async function createExamController(
  req: Request,
  res: Response
) {
  try {
    const {
      course_id,
      title,
      description,
      starts_at,
      ends_at
    } = req.body;

    if (
      !course_id ||
      !title ||
      !starts_at ||
      !ends_at
    ) {
      res.status(400).json({
        message: "Champs obligatoires manquants"
      });
      return;
    }

    const exam = await addExam(
      Number(course_id),
      title,
      description || null,
      starts_at,
      ends_at
    );

    res.status(201).json(exam);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de créer l'examen"
    });
  }
}

export async function updateExamController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const {
      course_id,
      title,
      description,
      starts_at,
      ends_at
    } = req.body;

    const exam = await editExam(
      id,
      Number(course_id),
      title,
      description || null,
      starts_at,
      ends_at
    );

    if (!exam) {
      res.status(404).json({
        message: "Examen introuvable"
      });
      return;
    }

    res.json(exam);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

export async function deleteExamController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const exam = await removeExam(id);

    if (!exam) {
      res.status(404).json({
        message: "Examen introuvable"
      });
      return;
    }

    res.json({
      message: "Examen supprimé"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de supprimer l'examen"
    });
  }
}