import pg from 'pg';
import type { Exam } from '../model/examModel.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findAllExams = async (): Promise<Exam[]> => {
  const result = await pool.query(`SELECT id, title, starts_at AS "startsAt", ends_at AS "endsAt", course_id AS "courseId", created_at AS "createdAt" FROM exams;`);
  return result.rows;
};

export const findExamById = async (id: number): Promise<Exam | null> => {
  const result = await pool.query(`SELECT id, title, starts_at AS "startsAt", ends_at AS "endsAt", course_id AS "courseId", created_at AS "createdAt" FROM exams WHERE id = $1;`, [id]);
  return result.rows[0] || null;
};

export const createExam = async (examData: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam> => {
  const sql = `
    INSERT INTO exams (title, starts_at, ends_at, course_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, starts_at AS "startsAt", ends_at AS "endsAt", course_id AS "courseId", created_at AS "createdAt";
  `;
  const values = [examData.title, examData.startsAt, examData.endsAt, examData.courseId];
  const result = await pool.query(sql, values);
  return result.rows[0];
};

export const modifyExam = async (id: number, examData: Omit<Exam, 'id' | 'createdAt'>): Promise<Exam | null> => {
  const sql = `
    UPDATE exams
    SET title = $1, starts_at = $2, ends_at = $3, course_id = $4
    WHERE id = $5
    RETURNING id, title, starts_at AS "startsAt", ends_at AS "endsAt", course_id AS "courseId", created_at AS "createdAt";
  `;
  const values = [examData.title, examData.startsAt, examData.endsAt, examData.courseId, id];
  const result = await pool.query(sql, values);
  return result.rows[0] || null;
};

export const countExamAttempts = async (examId: number): Promise<number> => {
  const result = await pool.query('SELECT COUNT(*) FROM attempts WHERE exam_id = $1', [examId]);
  return parseInt(result.rows[0].count, 10);
};

export const deleteExam = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM exams WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};