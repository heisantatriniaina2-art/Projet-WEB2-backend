import pg from 'pg';
import bcrypt from 'bcrypt';
import type { User } from '../model/usersModel.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST ,
  port: Number(process.env.DB_PORT) ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME 
});

export const findAllStudents = async (): Promise<Omit<User, 'passwordHash'>[]> => {
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, role, is_active FROM users WHERE role = $1',
    ['student']
  );

  return result.rows.map(row => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at
  }));
};

export const createStudent = async (studentData: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { passwordHash: string }): Promise<Omit<User, 'passwordHash'>> => {
  const hashedPassword = await bcrypt.hash(studentData.passwordHash, 10);

  const sql = `
    INSERT INTO users (first_name, last_name, email, password_hash, role, is_active) 
    VALUES ($1, $2, $3, $4, 'student', true) 
    RETURNING id, first_name, last_name, email, role, is_active, created_at`;

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
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at
  };
};

export const updateStudent = async (id: number, studentData: Omit<User, 'id' | 'createdAt' | 'passwordHash'> & { passwordHash: string }): Promise<Omit<User, 'passwordHash'> | null> => {
  const hashedPassword = await bcrypt.hash(studentData.passwordHash, 10);       

  const sql = `
    UPDATE users 
    SET first_name = $1, last_name = $2, email = $3, password_hash = $4 
    WHERE id = $5 AND role = 'student'
    RETURNING id, first_name, last_name, email, password_hash, role, is_active`;

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
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at
  };
};

export const desactiveStudent = async (id: number): Promise<boolean> => {
  const sql = `UPDATE users SET is_active = false WHERE id = $1 AND role = 'student'`;
  const result = await pool.query(sql, [id]);
  return (result.rowCount ?? 0) > 0;
};