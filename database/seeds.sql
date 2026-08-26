INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role,
    is_active
)
VALUES (
    'Administrateur',
    'Admin',
    'admin@examhub.local',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llCkq6pFJ0Q6d8Q6vQZ2',
    'admin',
    TRUE
);

INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role,
    is_active
)
VALUES
(
    'Jean',
    'Dupont',
    'jean@examhub.local',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llCkq6pFJ0Q6d8Q6vQZ2',
    'student',
    TRUE
),
(
    'Marie',
    'Martin',
    'marie@examhub.local',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llCkq6pFJ0Q6d8Q6vQZ2',
    'student',
    TRUE
);

INSERT INTO courses (code, name, description)
VALUES
(
    'PROG2',
    'Programmation 2',
    'Cours de programmation avancée'
),
(
    'WEB1',
    'Développement Web',
    'Introduction au développement web'
);

INSERT INTO exams (
    course_id,
    title,
    description,
    starts_at,
    ends_at
)
VALUES
(
    1,
    'Examen Programmation 2',
    'Examen de programmation',
    '2026-08-01 08:00:00',
    '2026-12-31 23:59:59'
),
(
    2,
    'Examen Développement Web',
    'Examen de développement web',
    '2026-08-01 08:00:00',
    '2026-12-31 23:59:59'
);

INSERT INTO questions (exam_id, statement, points)
VALUES
(
    1,
    'Quel langage est utilisé avec Node.js ?',
    2
),
(
    1,
    'Quelle commande permet d''initialiser un projet Node.js ?',
    2
),
(
    2,
    'Que signifie HTML ?',
    2
);

INSERT INTO choices (question_id, label, is_correct)
VALUES
(1, 'JavaScript', TRUE),
(1, 'Python', FALSE),
(1, 'Java', FALSE),
(1, 'C++', FALSE),

(2, 'npm init', TRUE),
(2, 'npm start-project', FALSE),
(2, 'node create', FALSE),
(2, 'npm new', FALSE),

(3, 'HyperText Markup Language', TRUE),
(3, 'HighText Machine Language', FALSE),
(3, 'HyperTransfer Markup Language', FALSE),
(3, 'Home Tool Markup Language', FALSE);