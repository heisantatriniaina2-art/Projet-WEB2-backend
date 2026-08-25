import type { Request, Response } from "express";

import {
  findAllCourses,
  createCourse,
  modifyCourse,
  deleteCourse
} from "../services/courseService.js";

export const courseController = {

  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await findAllCourses();

      res.status(200).json(courses);
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Erreur serveur"
      });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description } = req.body;

      const course = await createCourse({
        name,
        description
      });

      res.status(201).json(course);
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Erreur serveur"
      });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { name, description } = req.body;

      const course = await modifyCourse(id, {
        name,
        description
      });

      if (!course) {
        res.status(404).json({
          message: "Cours introuvable"
        });
        return;
      }

      res.status(200).json(course);
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Erreur serveur"
      });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);

      const deleted = await deleteCourse(id);

      if (!deleted) {
        res.status(404).json({
          message: "Cours introuvable"
        });
        return;
      }

      res.status(200).json({
        message: "Cours supprimé avec succès"
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        message: error.message || "Erreur serveur"
      });
    }
  }
};