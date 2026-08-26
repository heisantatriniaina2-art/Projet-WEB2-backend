import pg from 'pg';
import bcrypt from 'bcrypt';
import type { User } from '../model/usersModel.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findAllStudents = async (): Promise<User[]> => {
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, password, role, is_active FROM users WHERE role = $1',
    ['student']
  );

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
  const hashedPassword = await bcrypt.hash(studentData.password, 10);

  const sql = `
    INSERT INTO users (first_name, last_name, email, password, role) 
    VALUES ($1, $2, $3, $4, 'student') 
    RETURNING id, first_name, last_name, email, role, is_active`;

  const values = [
    studentData.firstName,
    studentData.lastName,
    studentData.email,
    hashedPassword
  ];

  const result = await pool.query(sql, values);
  const row = result.rows[0];

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    password: '',
    role: row.role,
    isActive: row.is_active
  };
};

export const modifyStudent = async (id: number, studentData: Omit<User, 'id'>): Promise<User | null> => {
  const hashedPassword = await bcrypt.hash(studentData.password, 10);

  const sql = `
    UPDATE users 
    SET first_name = $1, last_name = $2, email = $3, password = $4 
    WHERE id = $5 AND role = 'student'
    RETURNING id, first_name, last_name, email, role, is_active`;

  const values = [
    studentData.firstName,
    studentData.lastName,
    studentData.email,
    hashedPassword,
    id
  ];

  const result = await pool.query(sql, values);
  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    password: '',
    role: row.role,
    isActive: row.is_active
  };
};

export const deleteStudent = async (id: number): Promise<boolean> => {
  const sql = `UPDATE users SET is_active = false WHERE id = $1 AND role = 'student'`;
  const result = await pool.query(sql, [id]);
  return (result.rowCount ?? 0) > 0;
};