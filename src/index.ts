import 'dotenv/config';
import express from 'express';
import { authController } from './controllers/authController.js';

const app = express();
app.use(express.json());

app.post('/api/auth/login', authController.login);

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});