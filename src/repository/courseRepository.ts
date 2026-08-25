import type { Course } from "../model/courseModel.js";
import { pool } from "../db";

export const findAllCourses = async (): Promise<Course[]> => {
    const result = await pool.query(
        "SELECT id, code, name, description FROM courses ORDER BY id"
    );

    return result.rows;
};

export const createCourse = async (
    courseData: Omit<Course, "id">
): Promise<Course> => {
    const sql = `
        INSERT INTO courses (code, name, description)
        VALUES ($1, $2, $3)
        RETURNING id, code, name, description
    `;

    const values = [
        courseData.name,
        courseData.description
    ];

    const result = await pool.query(sql, values);

    return result.rows[0];
};

export const modifyCourse = async (
    id: number,
    courseData: Omit<Course, "id">
): Promise<Course | null> => {
    const sql = `
        UPDATE courses
        SET code = $1,
            name = $2,
            description = $3
        WHERE id = $4
        RETURNING id, code, name, description
    `;

    const values = [
        courseData.name,
        courseData.description,
        id
    ];

    const result = await pool.query(sql, values);

    return result.rows[0] || null;
};

export const deleteCourse = async (id: number): Promise<boolean> => {
    const result = await pool.query(
        "DELETE FROM courses WHERE id = $1",
        [id]
    );

    return (result.rowCount ?? 0) > 0;
};