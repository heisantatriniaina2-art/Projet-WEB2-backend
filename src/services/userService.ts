import {
  getStudents,
  createStudent,
  updateStudent,
  updateStudentPassword,
  disableStudent
} from "../repositories/userRepository.js";


// Récupérer tous les étudiants
export async function getAllStudents() {
  return await getStudents();
}


// Créer un étudiant
export async function createNewStudent(
  firstName: string,
  lastName: string,
  email: string,
  passwordHash: string
) {
  return await createStudent(
    firstName,
    lastName,
    email,
    passwordHash
  );
}


// Modifier un étudiant
export async function updateStudentService(
  id: number,
  firstName: string,
  lastName: string,
  email: string
) {
  return await updateStudent(
    id,
    firstName,
    lastName,
    email
  );
}


// Réinitialiser le mot de passe
export async function resetStudentPassword(
  id: number,
  passwordHash: string
) {
  return await updateStudentPassword(
    id,
    passwordHash
  );
}


// Désactiver un étudiant
export async function removeStudent(
  id: number
) {
  return await disableStudent(id);
}