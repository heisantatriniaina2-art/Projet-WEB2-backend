import 'dotenv/config';
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD défini:', !!process.env.DB_PASSWORD);
import express from 'express';
import cors from 'cors';

import authController from './controllers/authController.js';
import courseController from './controllers/courseController.js';
import examController from './controllers/examController.js';
import questionsController from './controllers/questionsController.js';
import studentController from './controllers/studentController.js';
import myExamController from './controllers/myExamController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'Exam Hub API fonctionne'
  });
});

app.use(authController);
app.use(courseController);
app.use(examController);
app.use(questionsController);
app.use(studentController);
app.use(myExamController);

app.listen(3000, () => {
  console.log('http://localhost:3000');
});