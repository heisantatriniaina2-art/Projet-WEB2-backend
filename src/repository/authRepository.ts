import type { User } from '../model/usersModel.js';
import bcrypt from 'bcrypt';
import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '', // Récupère le mot de passe depuis le .env
  database: process.env.DB_NAME || 'gestion_examens'
});


export const authRepository = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        const sql = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await pool.query(sql, values);
        return result.rows[0] || null;
    },

    comparePasswords: async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    }
}