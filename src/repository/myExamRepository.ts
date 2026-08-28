import pg from 'pg';

const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export const findMyExams = async (
    studentId: number
) => {
    const result = await pool.query(
        `
    SELECT
      e.id,
      e.title,
      e.description,
      e.starts_at AS "startsAt",
      e.ends_at AS "endsAt",
      c.code AS "courseCode",
      c.name AS "courseName"
    FROM exams e
    JOIN courses c
      ON c.id = e.course_id
    WHERE CURRENT_TIMESTAMP
      BETWEEN e.starts_at AND e.ends_at
      AND NOT EXISTS (
        SELECT 1
        FROM attempts a
        WHERE a.exam_id = e.id
        AND a.student_id = $1
      )
    ORDER BY e.starts_at;
    `,
        [studentId]
    );

    return result.rows;
};

export const findMyExamById = async (
    examId: number,
    studentId: number
) => {
    const examResult = await pool.query(
        `
    SELECT
      e.id,
      e.title,
      e.description,
      e.starts_at AS "startsAt",
      e.ends_at AS "endsAt",
      c.code AS "courseCode",
      c.name AS "courseName"
    FROM exams e
    JOIN courses c
      ON c.id = e.course_id
    WHERE e.id = $1
      AND CURRENT_TIMESTAMP
      BETWEEN e.starts_at AND e.ends_at
      AND NOT EXISTS (
        SELECT 1
        FROM attempts a
        WHERE a.exam_id = e.id
        AND a.student_id = $2
      );
    `,
        [examId, studentId]
    );

    if (examResult.rows.length === 0) {
        return null;
    }

    const questionsResult = await pool.query(
        `
    SELECT
      q.id,
      q.statement,
      q.points
    FROM questions q
    WHERE q.exam_id = $1
    ORDER BY q.id;
    `,
        [examId]
    );

    for (const question of questionsResult.rows) {
        const choicesResult = await pool.query(
            `
      SELECT
        id,
        label
      FROM choices
      WHERE question_id = $1
      ORDER BY id;
      `,
            [question.id]
        );

        question.choices = choicesResult.rows;
    }

    return {
        ...examResult.rows[0],
        questions: questionsResult.rows
    };
};

export const submitExam = async (
    examId: number,
    studentId: number,
    answers: {
        questionId: number;
        choiceId: number;
    }[]
) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const examResult = await client.query(
            `
      SELECT id
      FROM exams
      WHERE id = $1
      AND CURRENT_TIMESTAMP
      BETWEEN starts_at AND ends_at;
      `,
            [examId]
        );

        if (examResult.rows.length === 0) {
            throw new Error('EXAM_NOT_FOUND');
        }

        const existingAttempt = await client.query(
            `
      SELECT id
      FROM attempts
      WHERE exam_id = $1
      AND student_id = $2;
      `,
            [examId, studentId]
        );

        if (existingAttempt.rows.length > 0) {
            throw new Error('ALREADY_SUBMITTED');
        }

        const attemptResult = await client.query(
            `
      INSERT INTO attempts (
        exam_id,
        student_id,
        score
      )
      VALUES ($1, $2, 0)
      RETURNING id;
      `,
            [examId, studentId]
        );

        const attemptId = attemptResult.rows[0].id;

        let score = 0;

        for (const answer of answers) {
            const result = await client.query(
                `
        SELECT
          c.is_correct,
          q.points
        FROM choices c
        JOIN questions q
          ON q.id = c.question_id
        WHERE c.id = $1
          AND q.id = $2
          AND q.exam_id = $3;
        `,
                [
                    answer.choiceId,
                    answer.questionId,
                    examId
                ]
            );

            if (result.rows.length === 0) {
                continue;
            }

            const choice = result.rows[0];

            await client.query(
                `
        INSERT INTO answers (
          attempt_id,
          question_id,
          choice_id
        )
        VALUES ($1, $2, $3);
        `,
                [
                    attemptId,
                    answer.questionId,
                    answer.choiceId
                ]
            );

            if (choice.is_correct) {
                score += Number(choice.points);
            }
        }

        await client.query(
            `
      UPDATE attempts
      SET score = $1
      WHERE id = $2;
      `,
            [score, attemptId]
        );

        await client.query('COMMIT');

        return {
            attemptId,
            examId,
            score
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

export const findMyResults = async (
    studentId: number
) => {
    const result = await pool.query(
        `
    SELECT
      a.id AS "attemptId",
      e.id AS "examId",
      e.title,
      c.code AS "courseCode",
      c.name AS "courseName",
      a.score,
      a.submitted_at AS "submittedAt"
    FROM attempts a
    JOIN exams e
      ON e.id = a.exam_id
    JOIN courses c
      ON c.id = e.course_id
    WHERE a.student_id = $1
    ORDER BY a.submitted_at DESC;
    `,
        [studentId]
    );

    return result.rows;
};