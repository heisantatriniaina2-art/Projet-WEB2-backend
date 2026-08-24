import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { authController } from './controllers/authController.js';


const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/auth/login', authController.login);

app.listen(3000, () => {
  console.log('http://localhost:3000');
});