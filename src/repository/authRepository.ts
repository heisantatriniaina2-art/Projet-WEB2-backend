import 'dotenv/config';
import type { User } from "../model/usersModel";
import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gestion_examens'
});

export const authRepository = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        const sql = `
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                password AS "password",
                role,
                is_active AS "isActive"
            FROM users
            WHERE email = $1
        `;

        const result = await pool.query(sql, [email]);

        return result.rows[0] || null;
    }
};