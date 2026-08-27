import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gestion_examens'
});

export const findQuestionsByExamId = async (examId: number) => {
  const qRes = await pool.query('SELECT id, statement, points FROM questions WHERE exam_id = $1;', [examId]);
  const questions = [];
  for (const q of qRes.rows) {
    const cRes = await pool.query('SELECT id, label, is_correct AS "isCorrect" FROM choices WHERE question_id = $1;', [q.id]);
    questions.push({ ...q, choices: cRes.rows });
  }
  return questions;
};

export const createQuestionWithChoices = async (examId: number, data: { statement: string; points: number; choices: { label: string; isCorrect: boolean }[] }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const qIns = await client.query(
      'INSERT INTO questions (exam_id, statement, points) VALUES ($1, $2, $3) RETURNING id, statement, points;',
      [examId, data.statement, data.points]
    );
    const question = qIns.rows[0];

    const choices = [];
    for (const c of data.choices) {
      const cIns = await client.query(
        'INSERT INTO choices (question_id, label, is_correct) VALUES ($1, $2, $3) RETURNING id, label, is_correct AS "isCorrect";',
        [question.id, c.label, c.isCorrect]
      );
      choices.push(cIns.rows[0]);
    }

    await client.query('COMMIT');
    return { ...question, choices };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateQuestionWithChoices = async (questionId: number, data: { statement: string; points: number; choices: { id?: number; label: string; isCorrect: boolean }[] }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const qUpd = await client.query(
      'UPDATE questions SET statement = $1, points = $2 WHERE id = $3 RETURNING id, statement, points;',
      [data.statement, data.points, questionId]
    );
    if (qUpd.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    const question = qUpd.rows[0];

    await client.query('DELETE FROM choices WHERE question_id = $1;', [questionId]);

    const choices = [];
    for (const c of data.choices) {
      const cIns = await client.query(
        'INSERT INTO choices (question_id, label, is_correct) VALUES ($1, $2, $3) RETURNING id, label, is_correct AS "isCorrect";',
        [questionId, c.label, c.isCorrect]
      );
      choices.push(cIns.rows[0]);
    }

    await client.query('COMMIT');
    return { ...question, choices };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const removeQuestion = async (questionId: number) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM choices WHERE question_id = $1;', [questionId]);
    const res = await client.query('DELETE FROM questions WHERE id = $1 RETURNING id;', [questionId]);
    
    if (res.rows.length === 0) {
      await client.query('ROLLBACK');
      return false;
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findExamResults = async (examId: number) => {
  const attemptsResult = await pool.query(`
    SELECT a.id AS "attemptId", a.score, a.submitted_at AS "submittedAt",
           u.id AS "studentId", u.first_name AS "firstName", u.last_name AS "lastName", u.email
    FROM attempts a
    JOIN users u ON a.student_id = u.id
    WHERE a.exam_id = $1;
  `, [examId]);

  const statsResult = await pool.query(`
    SELECT AVG(score) AS average, COUNT(*) AS "totalAttempts"
    FROM attempts WHERE exam_id = $1;
  `, [examId]);

  return {
    averageScore: statsResult.rows[0].average ? Number(statsResult.rows[0].average) : 0,
    totalAttempts: Number(statsResult.rows[0].totalAttempts),
    attempts: attemptsResult.rows
  };
};