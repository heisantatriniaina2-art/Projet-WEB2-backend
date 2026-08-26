import type { Choice } from './choiceModel.js';

export interface Question {
  id: number;
  statement: string;
  points: number;
  examId: number;
  choices: Choice[];
}