import { pool } from "../configuration/database.js";


// Récupérer tous les examens
export async function findAllExams() {
    const result = await pool.query(`
        SELECT
            id,
            course_id,
            title,
            description,
            starts_at,
            ends_at
        FROM exams
        ORDER BY id
    `);

    return result.rows.map((row) => ({
        id: row.id,
        course_id: row.course_id,
        title: row.title,
        description: row.description,
        start_at: row.starts_at,
        end_at: row.ends_at
    }));
}


// Récupérer un examen par ID
export async function findExamById(id: number) {
    const result = await pool.query(
        `
        SELECT
            id,
            course_id,
            title,
            description,
            starts_at,
            ends_at
        FROM exams
        WHERE id = $1
        `,
        [id]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return {
        id: row.id,
        course_id: row.course_id,
        title: row.title,
        description: row.description,
        start_at: row.starts_at,
        end_at: row.ends_at
    };
}


// Créer un examen
export async function createExam(
    courseId: number,
    title: string,
    description: string | null,
    startAt: string,
    endAt: string
) {
    const result = await pool.query(
        `
        INSERT INTO exams
        (
            course_id,
            title,
            description,
            starts_at,
            ends_at
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            course_id,
            title,
            description,
            starts_at,
            ends_at
        `,
        [
            courseId,
            title,
            description,
            startAt,
            endAt
        ]
    );

    const row = result.rows[0];

    return {
        id: row.id,
        course_id: row.course_id,
        title: row.title,
        description: row.description,
        start_at: row.starts_at,
        end_at: row.ends_at
    };
}


// Modifier un examen
export async function updateExam(
    id: number,
    courseId: number,
    title: string,
    description: string | null,
    startAt: string,
    endAt: string
) {
    const result = await pool.query(
        `
        UPDATE exams
        SET
            course_id = $1,
            title = $2,
            description = $3,
            starts_at = $4,
            ends_at = $5
        WHERE id = $6
        RETURNING
            id,
            course_id,
            title,
            description,
            starts_at,
            ends_at
        `,
        [
            courseId,
            title,
            description,
            startAt,
            endAt,
            id
        ]
    );

    const row = result.rows[0];

    if (!row) {
        return null;
    }

    return {
        id: row.id,
        course_id: row.course_id,
        title: row.title,
        description: row.description,
        start_at: row.starts_at,
        end_at: row.ends_at
    };
}


// Supprimer un examen
export async function deleteExam(id: number) {
    const result = await pool.query(
        `
        DELETE FROM exams
        WHERE id = $1
        RETURNING id
        `,
        [id]
    );

    return result.rows[0] || null;
}