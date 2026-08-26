import { pool } from "../configuration/database.js";

export async function findUserByEmail(email: string) {
    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
}

export async function getStudents() {
    const result = await pool.query(
        `
        SELECT
            id,
            first_name,
            last_name,
            email,
            is_active,
            created_at
        FROM users
        WHERE role = 'student'
        ORDER BY id
        `
    );

    return result.rows;
}

export async function createStudent(
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string
) {
    const result = await pool.query(
        `
        INSERT INTO users
        (
            first_name,
            last_name,
            email,
            password_hash,
            role,
            is_active
        )
        VALUES ($1, $2, $3, $4, 'student', TRUE)
        RETURNING
            id,
            first_name,
            last_name,
            email,
            role,
            is_active
        `,
        [
            firstName,
            lastName,
            email,
            passwordHash
        ]
    );

    return result.rows[0];
}

export async function findStudentById(id: number) {
    const result = await pool.query(
        `
        SELECT
            id,
            first_name,
            last_name,
            email,
            is_active
        FROM users
        WHERE id = $1
        AND role = 'student'
        `,
        [id]
    );

    return result.rows[0] || null;
}

export async function updateStudent(
    id: number,
    firstName: string,
    lastName: string,
    email: string
) {
    const result = await pool.query(
        `
        UPDATE users
        SET
            first_name = $1,
            last_name = $2,
            email = $3
        WHERE id = $4
        AND role = 'student'
        RETURNING
            id,
            first_name,
            last_name,
            email,
            is_active
        `,
        [
            firstName,
            lastName,
            email,
            id
        ]
    );

    return result.rows[0] || null;
}

export async function updateStudentPassword(
    id: number,
    passwordHash: string
) {
    const result = await pool.query(
        `
        UPDATE users
        SET password_hash = $1
        WHERE id = $2
        AND role = 'student'
        RETURNING id
        `,
        [passwordHash, id]
    );

    return result.rows[0] || null;
}

export async function disableStudent(id: number) {
    const result = await pool.query(
        `
        UPDATE users
        SET is_active = FALSE
        WHERE id = $1
        AND role = 'student'
        RETURNING
            id,
            first_name,
            last_name,
            email,
            is_active
        `,
        [id]
    );

    return result.rows[0] || null;
}