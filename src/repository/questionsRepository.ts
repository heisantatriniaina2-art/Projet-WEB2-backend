import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_examens'
});

export const checkExamHasAttempts = async (examId: number): Promise<boolean> => {
    const result = await pool.query('SELECT COUNT(*) FROM attempts WHERE exam_id = $1', [examId]);
    return parseInt(result.rows[0].count, 10) > 0;
};

export const findQuestionsByExam = async (examId: number) => {
    const qResult = await pool.query('SELECT id, statement, points FROM questions WHERE exam_id = $1', [examId]);
    
    const questions = [];
    for (const q of qResult.rows) {
        const cResult = await pool.query('SELECT id, text, is_correct FROM choices WHERE question_id = $1', [q.id]);
        questions.push({
            id: q.id,
            statement: q.statement,
            points: q.points,
            choices: cResult.rows.map(c => ({
                id: c.id,
                text: c.text,
                isCorrect: c.is_correct
            }))
        });
    }
    return questions;
};

export const createQuestion = async (examId: number, data: { statement: string; points?: number; choices: { text: string; isCorrect: boolean }[] }) => {
    const qSql = `INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING id, statement, points`;
    const qRes = await pool.query(qSql, [examId, data.statement, data.points ?? 1]);
    const questionId = qRes.rows[0].id;

    const choicesToReturn = [];
    for (const choice of data.choices) {
        const cSql = `INSERT INTO choices (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING id, text, is_correct`;
        const cRes = await pool.query(cSql, [questionId, choice.text, choice.isCorrect]);
        choicesToReturn.push({
            id: cRes.rows[0].id,
            text: cRes.rows[0].text,
            isCorrect: cRes.rows[0].is_correct
        });
    }

    return {
        id: questionId,
        statement: qRes.rows[0].statement,
        points: qRes.rows[0].points,
        choices: choicesToReturn
    };
};

export const modifyQuestion = async (questionId: number, data: { statement: string; points?: number; choices: { text: string; isCorrect: boolean }[] }) => {
    const qSql = `UPDATE questions SET statement = $1, points = $2 WHERE id = $3 RETURNING id, statement, points, exam_id`;
    const qRes = await pool.query(qSql, [data.statement, data.points ?? 1, questionId]);
    
    if (qRes.rows.length === 0) return null;

    await pool.query('DELETE FROM choices WHERE question_id = $1', [questionId]);
    
    const choicesToReturn = [];
    for (const choice of data.choices) {
        const cSql = `INSERT INTO choices (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING id, text, is_correct`;
        const cRes = await pool.query(cSql, [questionId, choice.text, choice.isCorrect]);
        choicesToReturn.push({
            id: cRes.rows[0].id,
            text: cRes.rows[0].text,
            isCorrect: cRes.rows[0].is_correct
        });
    }

    return {
        id: questionId,
        statement: qRes.rows[0].statement,
        points: qRes.rows[0].points,
        examId: qRes.rows[0].exam_id,
        choices: choicesToReturn
    };
};

export const deleteQuestion = async (questionId: number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM questions WHERE id = $1', [questionId]);
    return (result.rowCount ?? 0) > 0;
};

export const findExamIdByQuestion = async (questionId: number): Promise<number | null> => {
    const res = await pool.query('SELECT exam_id FROM questions WHERE id = $1', [questionId]);
    return res.rows.length > 0 ? res.rows[0].exam_id : null;
};

export const findExamResults = async (examId: number) => {
    const sql = `
        SELECT 
            u.id AS student_id, 
            u.first_name AS "firstName", 
            u.last_name AS "lastName", 
            u.email, 
            a.score, 
            a.submitted_at AS "submittedAt"
        FROM attempts a
        JOIN users u ON a.student_id = u.id
        WHERE a.exam_id = $1
    `;
    const result = await pool.query(sql, [examId]);
    return result.rows;
};

