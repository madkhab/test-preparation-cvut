import rawData from "../data/exams.json";
import type { ExamData, Exam } from "../types/exam";

const data = rawData as ExamData;

export function useExamData(): ExamData {
  return data;
}

export function findExamByYear(year: number): Exam | undefined {
  return data.exams.find((e) => e.year === year);
}
