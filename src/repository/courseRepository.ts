import pg from 'pg';
import type { Course } from '../model/courseModel.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findAllCourses = async (): Promise<Course[]> => {
const result = await pool.query('SELECT id, name, description FROM course');

    return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description
    }));
};


export const createCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    const sql = `INSERT INTO course (name, description) VALUES ($1, $2) RETURNING id`;
    const values = [
        courseData.name,
        courseData.description
    ];

    const result = await pool.query(sql, values);

    return {
        id: result.rows[0].id,
        ...courseData
    };
};


export const modifyCourse = async (id: number, courseData: Omit<Course, 'id'>): Promise<Course | null> => {
    const sql = `
    UPDATE course 
    SET name = $1, description = $2 
    WHERE id = $3 
    RETURNING id, name, description`;
    const values = [
        courseData.name,
        courseData.description,
        id
    ];

    const result = await pool.query(sql, values);

    return result.rows[0];
};

export const deleteCourse = async (id: number): Promise<boolean> => {
    const result = await pool.query(`DELETE FROM course WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
};