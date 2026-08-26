import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  getStudents,
  createStudent,
  updateStudent,
  updateStudentPassword,
  disableStudent
} from "../repositories/userRepository.js";

// ===============================
// GET /api/students
// ===============================

export async function listStudents(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const students = await getStudents();

    res.status(200).json(students);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des étudiants :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur"
    });
  }
}


// ===============================
// POST /api/students
// ===============================

export async function createStudentController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Le nom, l'email et le mot de passe sont obligatoires"
      });
      return;
    }

    /*
     * Le frontend envoie :
     *
     * name: "Jean Dupont"
     *
     * Mais PostgreSQL possède :
     *
     * first_name
     * last_name
     */

    const parts = name.trim().split(/\s+/);

    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const student = await createStudent(
      firstName,
      lastName,
      email,
      passwordHash
    );

    res.status(201).json(student);

  } catch (error) {
    console.error(
      "Erreur lors de la création de l'étudiant :",
      error
    );

    res.status(500).json({
      message: "Impossible de créer l'étudiant"
    });
  }
}


// ===============================
// PUT /api/students/:id
// ===============================

export async function updateStudentController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({
        message: "Le nom et l'email sont obligatoires"
      });
      return;
    }

    const parts = name.trim().split(/\s+/);

    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "";

    const student = await updateStudent(
      id,
      firstName,
      lastName,
      email
    );

    if (!student) {
      res.status(404).json({
        message: "Étudiant introuvable"
      });
      return;
    }

    res.status(200).json(student);

  } catch (error) {
    console.error(
      "Erreur lors de la modification de l'étudiant :",
      error
    );

    res.status(500).json({
      message: "Impossible de modifier l'étudiant"
    });
  }
}


// ===============================
// POST /api/students/:id/reset-password
// ===============================

export async function resetStudentPasswordController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        message: "Le nouveau mot de passe est obligatoire"
      });
      return;
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const student = await updateStudentPassword(
      id,
      passwordHash
    );

    if (!student) {
      res.status(404).json({
        message: "Étudiant introuvable"
      });
      return;
    }

    res.status(200).json({
      message: "Mot de passe réinitialisé"
    });

  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );

    res.status(500).json({
      message: "Impossible de réinitialiser le mot de passe"
    });
  }
}


// ===============================
// PATCH /api/students/:id/disable
// ===============================

export async function disableStudentController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const student = await disableStudent(id);

    if (!student) {
      res.status(404).json({
        message: "Étudiant introuvable"
      });
      return;
    }

    res.status(200).json({
      message: "Étudiant désactivé"
    });

  } catch (error) {
    console.error(
      "Erreur lors de la désactivation de l'étudiant :",
      error
    );

    res.status(500).json({
      message: "Impossible de désactiver l'étudiant"
    });
  }
}