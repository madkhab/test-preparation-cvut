export type QuestionType = "single" | "multiple" | "open";

export type OptionKey = string;

export type QuestionOptions = Record<OptionKey, string>;

export interface Question {
  id: number;
  points: number | null;
  question: string;
  type: QuestionType;
  options: QuestionOptions;
  correct_answers: string[];
}

export interface Exam {
  year: number;
  title: string;
  source_test_name: string;
  note?: string;
  questions: Question[];
}

export interface ExamData {
  title: string;
  description: string;
  exams: Exam[];
}

export type UserAnswer =
  | { type: "single"; value: OptionKey | null }
  | { type: "multiple"; value: OptionKey[] }
  | { type: "open"; value: string };

export interface AnswerResult {
  isCorrect: boolean;
  userAnswer: UserAnswer;
  correctAnswers: string[];
}
