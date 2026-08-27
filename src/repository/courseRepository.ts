import pg from 'pg';
import type { Course } from '../model/courseModel.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST ,
  port: Number(process.env.DB_PORT) ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME 
});

export const findAllCourses = async (): Promise<Course[]> => {
  const result = await pool.query('SELECT id, code, name, description, created_at AS "createdAt" FROM courses ORDER BY id ASC');
  return result.rows;
};

export const createNewCourse = async (courseData: Omit<Course, 'id' | 'createdAt'>): Promise<Course> => {
  const query = `
    INSERT INTO courses (code, name, description)
    VALUES ($1, $2, $3)
    RETURNING id, code, name, description, created_at AS "createdAt";
  `;
  const values = [courseData.code, courseData.name, courseData.description || null];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateCourse = async (id: number, courseData: Omit<Course, 'id' | 'createdAt'>): Promise<Course | null> => {
  const sql = `
    UPDATE courses
    SET code = $1, name = $2, description = $3
    WHERE id = $4
    RETURNING id, code, name, description, created_at AS "createdAt";`;
  const values = [courseData.code, courseData.name, courseData.description || null, id];
  const result = await pool.query(sql, values);
  return result.rows[0] || null;
};

export const countExamsByCourseId = async (courseId: number): Promise<number> => {
  const result = await pool.query('SELECT COUNT(*) FROM exams WHERE course_id = $1', [courseId]);
  return parseInt(result.rows[0].count, 10);
};

export const deleteCourse = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};