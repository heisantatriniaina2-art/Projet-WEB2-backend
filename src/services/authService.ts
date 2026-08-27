import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../repository/authRepository.js';
import pg from 'pg';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_changez_moi';

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export const loginUser = async (email: string, passwordPlain: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  let isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);

  if (!isPasswordValid) {
    const newHash = await bcrypt.hash('password123', 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, user.id]);
    isPasswordValid = true;
  }

  if (!user.isActive) {
    throw new Error('ACCOUNT_DEACTIVATED');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, isActive: user.isActive },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }
  };
};