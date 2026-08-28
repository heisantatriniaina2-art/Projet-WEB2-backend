import pg from 'pg';
import type { Exam } from '../model/examModel.js';

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export const findAllExams = async (): Promise<Exam[]> => {
  const result = await pool.query(`
    SELECT
      id,
      title,
      description,
      starts_at AS "startsAt",
      ends_at AS "endsAt",
      course_id AS "courseId",
      created_at AS "createdAt"
    FROM exams;
  `);

  return result.rows;
};

export const findExamById = async (id: number): Promise<Exam | null> => {
  const result = await pool.query(`
    SELECT
      id,
      title,
      description,
      starts_at AS "startsAt",
      ends_at AS "endsAt",
      course_id AS "courseId",
      created_at AS "createdAt"
    FROM exams
    WHERE id = $1;
  `, [id]);

  return result.rows[0] || null;
};

export const createExam = async (
  examData: Omit<Exam, 'id' | 'createdAt'>
): Promise<Exam> => {
  const sql = `
    INSERT INTO exams (
      title,
      description,
      starts_at,
      ends_at,
      course_id
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      title,
      description,
      starts_at AS "startsAt",
      ends_at AS "endsAt",
      course_id AS "courseId",
      created_at AS "createdAt";
  `;

  const values = [
    examData.title,
    examData.description,
    examData.startsAt,
    examData.endsAt,
    examData.courseId
  ];

  const result = await pool.query(sql, values);

  return result.rows[0];
};

export const modifyExam = async (
  id: number,
  examData: Omit<Exam, 'id' | 'createdAt'>
): Promise<Exam | null> => {
  const sql = `
    UPDATE exams
    SET
      title = $1,
      description = $2,
      starts_at = $3,
      ends_at = $4,
      course_id = $5
    WHERE id = $6
    RETURNING
      id,
      title,
      description,
      starts_at AS "startsAt",
      ends_at AS "endsAt",
      course_id AS "courseId",
      created_at AS "createdAt";
  `;

  const values = [
    examData.title,
    examData.description,
    examData.startsAt,
    examData.endsAt,
    examData.courseId,
    id
  ];

  const result = await pool.query(sql, values);

  return result.rows[0] || null;
};

export const countExamAttempts = async (
  examId: number
): Promise<number> => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM attempts WHERE exam_id = $1',
    [examId]
  );

  return parseInt(result.rows[0].count, 10);
};

export const deleteExam = async (
  id: number
): Promise<boolean> => {
  const result = await pool.query(
    'DELETE FROM exams WHERE id = $1',
    [id]
  );

  return (result.rowCount ?? 0) > 0;
};

export const findAllAvailableExams = async (
  studentId: number
) => {
  const query = `
    SELECT
      e.id,
      e.title,
      e.description,
      e.starts_at AS "startsAt",
      e.ends_at AS "endsAt",
      c.name AS "courseName"
    FROM exams e
    JOIN courses c ON e.course_id = c.id
    WHERE NOW() BETWEEN e.starts_at AND e.ends_at
      AND e.id NOT IN (
        SELECT exam_id
        FROM attempts
        WHERE student_id = $1
      );
  `;

  const result = await pool.query(query, [studentId]);

  return result.rows;
};

export const findAvailableExamById = async (
  examId: number
) => {
  const examQuery = `
    SELECT
      id,
      title,
      description,
      starts_at AS "startsAt",
      ends_at AS "endsAt"
    FROM exams
    WHERE id = $1
      AND NOW() BETWEEN starts_at AND ends_at;
  `;

  const examResult = await pool.query(examQuery, [examId]);

  if (examResult.rows.length === 0) {
    return null;
  }

  const questionsQuery = `
    SELECT
      id,
      statement,
      points
    FROM questions
    WHERE exam_id = $1;
  `;

  const questionsResult = await pool.query(
    questionsQuery,
    [examId]
  );

  const questions = [];

  for (const question of questionsResult.rows) {
    const choicesQuery = `
      SELECT
        id,
        label
      FROM choices
      WHERE question_id = $1;
    `;

    const choicesResult = await pool.query(
      choicesQuery,
      [question.id]
    );

    questions.push({
      ...question,
      choices: choicesResult.rows
    });
  }

  return {
    exam: examResult.rows[0],
    questions
  };
};

export const submitAttempt = async (
  examId: number,
  studentId: number,
  answersMap: Record<number, number>
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const questionsQuery = `
      SELECT id, points
      FROM questions
      WHERE exam_id = $1;
    `;

    const questionsResult = await client.query(
      questionsQuery,
      [examId]
    );

    const questions = questionsResult.rows;

    let totalScore = 0;
    const detailedCorrection = [];

    for (const question of questions) {
      const chosenChoiceId =
        answersMap && answersMap[question.id]
          ? Number(answersMap[question.id])
          : null;

      let isCorrect = false;
      let correctChoiceId = null;

      const choicesQuery = `
        SELECT
          id,
          is_correct AS "isCorrect"
        FROM choices
        WHERE question_id = $1;
      `;

      const choicesResult = await client.query(
        choicesQuery,
        [question.id]
      );

      for (const choice of choicesResult.rows) {
        if (choice.isCorrect) {
          correctChoiceId = choice.id;
        }
      }

      if (
        chosenChoiceId &&
        chosenChoiceId === correctChoiceId
      ) {
        isCorrect = true;
        totalScore += Number(question.points);
      }

      detailedCorrection.push({
        questionId: question.id,
        chosenChoiceId,
        correctChoiceId,
        isCorrect
      });
    }

    const insertAttemptQuery = `
      INSERT INTO attempts (
        exam_id,
        student_id,
        score
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        score,
        submitted_at AS "submittedAt";
    `;

    const attemptResult = await client.query(
      insertAttemptQuery,
      [examId, studentId, totalScore]
    );

    const attemptId = attemptResult.rows[0].id;

    for (const item of detailedCorrection) {
      const insertAnswerQuery = `
        INSERT INTO answers (
          attempt_id,
          question_id,
          choice_id
        )
        VALUES ($1, $2, $3);
      `;

      await client.query(
        insertAnswerQuery,
        [
          attemptId,
          item.questionId,
          item.chosenChoiceId
        ]
      );
    }

    await client.query('COMMIT');

    return {
      score: totalScore,
      submittedAt: attemptResult.rows[0].submittedAt,
      correction: detailedCorrection
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const findAllStudentResults = async (
  studentId: number
) => {
  const query = `
    SELECT
      a.id AS "attemptId",
      a.score,
      a.submitted_at AS "submittedAt",
      e.id AS "examId",
      e.title AS "examTitle",
      c.name AS "courseName"
    FROM attempts a
    JOIN exams e ON a.exam_id = e.id
    JOIN courses c ON e.course_id = c.id
    WHERE a.student_id = $1;
  `;

  const result = await pool.query(
    query,
    [studentId]
  );

  return result.rows;
};
