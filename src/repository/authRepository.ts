import type { User } from "../model/usersModel";
import { pool } from "../db";
export const authRepository = {
    findUserByEmail: async (email: string): Promise<User | null> => {
        const sql = `
              SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                password_hash AS "password",
                role,
                is_active AS "isActive"
            FROM users
            WHERE email = $1
        `;

        const result = await pool.query(sql, [email]);

        return result.rows[0] || null;
    }
};