import type { Question, UserAnswer } from "../types/exam";

const normalize = (s: string): string =>
  s.trim().toLowerCase().replace(/\s+/g, " ");

export function buildEmptyAnswer(type: Question["type"]): UserAnswer {
  switch (type) {
    case "single":
      return { type: "single", value: null };
    case "multiple":
      return { type: "multiple", value: [] };
    case "open":
      return { type: "open", value: "" };
  }
}

export function isAnswerFilled(answer: UserAnswer): boolean {
  switch (answer.type) {
    case "single":
      return answer.value !== null;
    case "multiple":
      return answer.value.length > 0;
    case "open":
      return answer.value.trim().length > 0;
  }
}

export function checkAnswer(
  question: Question,
  answer: UserAnswer,
): boolean {
  const correct = question.correct_answers;

  if (question.type === "single" && answer.type === "single") {
    return answer.value !== null && correct.includes(answer.value);
  }

  if (question.type === "multiple" && answer.type === "multiple") {
    if (answer.value.length !== correct.length) return false;
    const picked = new Set(answer.value);
    return correct.every((c) => picked.has(c));
  }

  if (question.type === "open" && answer.type === "open") {
    const given = normalize(answer.value);
    return correct.some((c) => normalize(c) === given);
  }

  return false;
}
