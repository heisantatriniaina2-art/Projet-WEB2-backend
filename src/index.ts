import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authController } from './controllers/authController.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Exam Hub API fonctionne !' });
});

app.post('/api/auth/login', authController.login);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Exam Hub API running on http://localhost:${PORT}`);
});