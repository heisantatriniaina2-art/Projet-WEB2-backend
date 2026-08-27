import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authController from './controllers/authController.js';
import courseController from './controllers/courseController.js';
import examController from './controllers/examController.js';
import questionsController from './controllers/questionsController.js';
import studentController from './controllers/studentController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(authController);
app.use(courseController);
app.use(examController);
app.use(questionsController);
app.use(studentController);

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000');
});