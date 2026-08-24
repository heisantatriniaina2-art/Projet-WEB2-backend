import type { Exam } from '../model/examModel.js';
import pg from 'pg';

const pool = new pg.Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'gestion_examens'
});

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