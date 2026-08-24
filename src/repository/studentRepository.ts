import pg from 'pg';
import type { User } from '../model/usersModel.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findAllStudents = async (): Promise<User[]> => {
    const result = await pool.query('SELECT id, first_name, last_name, email, password, role, is_active FROM users WHERE role = $1', ['student']);

    return result.rows.map(row => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        password: row.password,
        role: row.role,
        isActive: row.is_active
    }));
};

export const createStudent = async (studentData: Omit<User, 'id'>): Promise<User> => {
    const sql = `INSERT INTO user (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const values = [
        studentData.firstName,
        studentData.lastName,
        studentData.email,
        studentData.password,
        studentData.role
    ];

    const result = await pool.query(sql, values);

    return {
        id: result.rows[0].id,
        ...studentData
    };
};


export const modifyStudent = async (id: number, studentData: Omit<User, 'id'>): Promise<User | null> => {
    const sql = `
    UPDATE user 
    SET first_name = $1, last_name = $2, email = $3, password = $4 
    WHERE id = $5 
    RETURNING id, first_name, last_name, email, password`;
    const values = [
        studentData.firstName,
        studentData.lastName,
        studentData.email,
        studentData.password,
        id
    ];

    const result = await pool.query(sql, values);

    return result.rows[0];
};

export const deleteStudent = async (id: number): Promise<boolean> => {
    const sql = `UPDATE users SET is_active = false WHERE id = $1 AND role = 'student'`;
    const result = await pool.query(sql, [id]);
    return (result.rowCount ?? 0) > 0;
};