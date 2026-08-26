import type { Exam } from '../model/examModel.js';
import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findAllExams = async (): Promise<Exam[]> => {
  const result = await pool.query('SELECT id, title, start_time, end_time, course_id FROM exam');
  
  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    startTime: row.start_time,
    endTime: row.end_time,
    courseId: row.course_id
  }));
};

export const findExamById = async (id: number): Promise<Exam | null> => {
  const result = await pool.query(
    'SELECT id, title, start_time, end_time, course_id FROM exam WHERE id = $1', 
    [id]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    startTime: row.start_time,
    endTime: row.end_time,
    courseId: row.course_id
  };
};

export const createExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
  const sql = `
    INSERT INTO exam (title, start_time, end_time, course_id) 
    VALUES ($1, $2, $3, $4) 
    RETURNING id, title, start_time, end_time, course_id`;
  
  const values = [
    examData.title,
    examData.startTime,
    examData.endTime,
    examData.courseId
  ];

  const result = await pool.query(sql, values);
  const row = result.rows[0];

  return {
    id: row.id,
    title: row.title,
    startTime: row.start_time,
    endTime: row.end_time,
    courseId: row.course_id
  };
};

export const modifyExam = async (id: number, examData: Omit<Exam, 'id'>): Promise<Exam | null> => {
  const sql = `
    UPDATE exam 
    SET title = $1, start_time = $2, end_time = $3, course_id = $4
    WHERE id = $5 
    RETURNING id, title, start_time, end_time, course_id`;

  const values = [
    examData.title,
    examData.startTime,
    examData.endTime,
    examData.courseId,
    id
  ];

  const result = await pool.query(sql, values);
  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    title: row.title,
    startTime: row.start_time,
    endTime: row.end_time,
    courseId: row.course_id
  };
};

export const countExamAttempts = async (examId: number): Promise<number> => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM attempts WHERE exam_id = $1', 
    [examId]
  );
  return parseInt(result.rows[0].count, 10);
};

export const deleteExam = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM exam WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};