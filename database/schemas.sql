DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS attempts CASCADE;
DROP TABLE IF EXISTS choices CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(150) NOT NULL,
    last_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check
        CHECK (role IN ('admin', 'student'))
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT exams_dates_check
        CHECK (ends_at > starts_at),
    CONSTRAINT exams_course_fk
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE RESTRICT
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL,
    statement TEXT NOT NULL,
    points NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT questions_points_check
        CHECK (points > 0),
    CONSTRAINT questions_exam_fk
        FOREIGN KEY (exam_id)
        REFERENCES exams(id)
        ON DELETE CASCADE
);

CREATE TABLE choices (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    label TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT choices_question_fk
        FOREIGN KEY (question_id)
        REFERENCES questions(id)
        ON DELETE CASCADE
);

CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    score NUMERIC(10,2) NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT attempts_exam_fk
        FOREIGN KEY (exam_id)
        REFERENCES exams(id)
        ON DELETE RESTRICT,
    CONSTRAINT attempts_student_fk
        FOREIGN KEY (student_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,
    CONSTRAINT attempts_score_check
        CHECK (score >= 0),
    CONSTRAINT unique_student_exam
        UNIQUE (exam_id, student_id)
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    choice_id INTEGER,
    CONSTRAINT answers_attempt_fk
        FOREIGN KEY (attempt_id)
        REFERENCES attempts(id)
        ON DELETE CASCADE,
    CONSTRAINT answers_question_fk
        FOREIGN KEY (question_id)
        REFERENCES questions(id)
        ON DELETE RESTRICT,
    CONSTRAINT answers_choice_fk
        FOREIGN KEY (choice_id)
        REFERENCES choices(id)
        ON DELETE RESTRICT,
    CONSTRAINT unique_attempt_question
        UNIQUE (attempt_id, question_id)
);