import type { Choice } from './choiceModel.js';
export interface Question {
  id: number;
  examId: number;
  statement: string;
  points: number;
  createdAt?: Date;
}