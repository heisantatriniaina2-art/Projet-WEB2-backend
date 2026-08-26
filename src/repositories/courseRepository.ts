import { query } from "../configuration/database.js";

export async function findAllCourses() {
    const result = await query(
        `SELECT
            id,
            code,
            name,
            description
         FROM courses
         ORDER BY id`
    );

    return result.rows;
}

export async function findCourseById(id: number) {
    const result = await query(
        `SELECT
            id,
            code,
            name,
            description
         FROM courses
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

export async function createCourse(
    code: string,
    name: string,
    description: string | null
) {
    const result = await query(
        `INSERT INTO courses
            (code, name, description)
         VALUES ($1, $2, $3)
         RETURNING id, code, name, description`,
        [code, name, description]
    );

    return result.rows[0];
}

export async function updateCourse(
    id: number,
    code: string,
    name: string,
    description: string | null
) {
    const result = await query(
        `UPDATE courses
         SET code = $1,
             name = $2,
             description = $3
         WHERE id = $4
         RETURNING id, code, name, description`,
        [code, name, description, id]
    );

    return result.rows[0] || null;
}

export async function deleteCourse(id: number) {
    const result = await query(
        `DELETE FROM courses
         WHERE id = $1
         RETURNING id`,
        [id]
    );

    return result.rows[0] || null;
}