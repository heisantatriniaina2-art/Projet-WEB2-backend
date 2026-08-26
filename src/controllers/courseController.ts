import type { Request, Response } from "express";

import {
  getCourses,
  getCourse,
  addCourse,
  editCourse,
  removeCourse
} from "../services/courseService.js";

export async function getCoursesController(
  req: Request,
  res: Response
) {
  try {
    const courses = await getCourses();

    res.json(courses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

export async function getCourseController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const course = await getCourse(id);

    if (!course) {
      res.status(404).json({
        message: "Cours introuvable"
      });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

export async function createCourseController(
  req: Request,
  res: Response
) {
  try {
    const {
      code,
      name,
      description
    } = req.body;

    if (!code || !name) {
      res.status(400).json({
        message: "Code et nom obligatoires"
      });
      return;
    }

    const course = await addCourse(
      code,
      name,
      description || null
    );

    res.status(201).json(course);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de créer le cours"
    });
  }
}

export async function updateCourseController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const {
      code,
      name,
      description
    } = req.body;

    const course = await editCourse(
      id,
      code,
      name,
      description || null
    );

    if (!course) {
      res.status(404).json({
        message: "Cours introuvable"
      });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
}

export async function deleteCourseController(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    const course = await removeCourse(id);

    if (!course) {
      res.status(404).json({
        message: "Cours introuvable"
      });
      return;
    }

    res.json({
      message: "Cours supprimé"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de supprimer le cours"
    });
  }
}