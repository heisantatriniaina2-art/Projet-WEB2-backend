import type { Exam } from '../model/examModel.js';
import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findAll = async (): Promise<Exam[]> => {
    const result = await pool.query('SELECT * FROM exam');
    
    return result.rows as Exam[];
};

export const createExam = async (examData: Omit<Exam, 'id'>): Promise<Exam> => {
    const sql = `INSERT INTO exam (title, start_time, end_time) VALUES ($1, $2, $3) RETURNING id`;
    const values = [
        examData.title,
        examData.startTime,
        examData.endTime
    ];

    const result = await pool.query(sql, values);

    return {
        id: result.rows[0].id,
        ...examData
    };
};