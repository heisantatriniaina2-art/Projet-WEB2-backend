import type { Course } from "../model/courseModel.js";
import { pool } from "../db.js";

export const findAllCourses = async (): Promise<Course[]> => {
  const result = await pool.query(
    "SELECT id, name, description, created_at FROM courses ORDER BY id"
  );

  return result.rows;
};

export const createCourse = async (
  courseData: Omit<Course, "id" | "created_at">
): Promise<Course> => {

  const sql = `
        INSERT INTO courses (name, description)
        VALUES ($1, $2)
        RETURNING id, name, description, created_at
    `;

  const values = [
    courseData.name,
    courseData.description
  ];

  const result = await pool.query(sql, values);

  return result.rows[0];
};

export const modifyCourse = async (
  id: number,
  courseData: Omit<Course, "id" | "created_at">
): Promise<Course | null> => {

  const sql = `
        UPDATE courses
        SET name = $1,
            description = $2
        WHERE id = $3
        RETURNING id, name, description, created_at
    `;

  const values = [
    courseData.name,
    courseData.description,
    id
  ];

  const result = await pool.query(sql, values);

  return result.rows[0] || null;
};

export const deleteCourse = async (
  id: number
): Promise<boolean> => {

  const result = await pool.query(
    "DELETE FROM courses WHERE id = $1",
    [id]
  );

  return (result.rowCount ?? 0) > 0;
};