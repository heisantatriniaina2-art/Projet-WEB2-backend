import type { Choice } from './choiceModel.js';
export interface Question {
  id: number;
  points: number;
  examId: number;
  choices: Choice[];
}