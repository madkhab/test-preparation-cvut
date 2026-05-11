import type { Exam, Question } from "../types/exam";

const pick = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export function buildRandomExam(exams: Exam[]): Exam {
  const maxLength = exams.reduce(
    (max, e) => Math.max(max, e.questions.length),
    0,
  );

  const questions: Question[] = [];
  const sources: number[] = [];

  for (let i = 0; i < maxLength; i++) {
    const candidates = exams
      .map((e) => ({ exam: e, q: e.questions[i] }))
      .filter((c) => c.q !== undefined);
    if (candidates.length === 0) break;

    const chosen = pick(candidates);
    questions.push({ ...chosen.q, id: i + 1 });
    sources.push(chosen.exam.year);
  }

  return {
    year: 0,
    title: `Náhodný test — ${questions.length} otázek z ${new Set(sources).size} ročníků`,
    source_test_name: "Random",
    note: `Pro každou pozici i vybrána náhodná i-tá otázka napříč všemi testy.`,
    questions,
  };
}
