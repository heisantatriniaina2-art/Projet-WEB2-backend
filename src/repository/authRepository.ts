import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    `SELECT id, first_name AS "firstName", last_name AS "lastName", email, password_hash AS "passwordHash", role, is_active AS "isActive" 
     FROM users WHERE email = $1;`,
    [email]
  );
  return result.rows[0] || null;
};