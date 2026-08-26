CREATE TYPE user_role AS ENUM ('admin', 'student');

CREATE TABLE users(
    id SERIAL primary key,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(50),
    role user_role  NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE courses(
    id SERIAL primary key,
    name VARCHAR(50),
    description TEXT
);

CREATE TABLE exam(
    id SERIAL primary key,
    title VARCHAR(50),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    course_id INT NOT NULL,
    CONSTRAINT fk_course_exam FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE questions(
    id SERIAL primary key,
    exam_id INT NOT NULL,
    CONSTRAINT fk_exam_questions FOREIGN KEY (exam_id) REFERENCES exam(id),
    points INT NOT NULL
);

CREATE TABLE choices(
    id SERIAL primary key,
    question_id INT NOT NULL,
    CONSTRAINT fk_choices_question FOREIGN KEY(question_id) REFERENCES questions(id),
    is_correct BOOLEAN
);

CREATE TABLE attempts(
    id SERIAL primary key,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    CONSTRAINT fk_attempts_exam FOREIGN KEY(exam_id) REFERENCES exam(id),
    CONSTRAINT fk_attempts_student FOREIGN KEY(student_id) REFERENCES users(id),
    score INT,
    submitted_at TIMESTAMPTZ
);

CREATE TABLE answers(
    id SERIAL primary key,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    choice_id INT NOT NULL,
    CONSTRAINT fk_attempts_answers FOREIGN KEY(attempt_id) REFERENCES attempts(id),
    CONSTRAINT fk_questions_answers FOREIGN KEY(question_id) REFERENCES questions(id),
    CONSTRAINT fk_choice_answers FOREIGN KEY(choice_id) REFERENCES choices(id)
);