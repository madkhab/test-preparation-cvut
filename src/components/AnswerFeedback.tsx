import type { Question, UserAnswer } from "../types/exam";

interface Props {
  question: Question;
  answer: UserAnswer;
  isCorrect: boolean;
}

function formatUserAnswer(answer: UserAnswer): string {
  switch (answer.type) {
    case "single":
      return answer.value ?? "—";
    case "multiple":
      return answer.value.length > 0 ? answer.value.sort().join(", ") : "—";
    case "open":
      return answer.value.trim().length > 0 ? answer.value : "—";
  }
}

export function AnswerFeedback({ question, answer, isCorrect }: Props) {
  const correct = question.correct_answers.slice().sort().join(", ");
  const given = formatUserAnswer(answer);

  return (
    <div className={`feedback ${isCorrect ? "correct" : "incorrect"}`}>
      <div className="feedback-headline">
        {isCorrect ? "✓ Correct" : "✗ Incorrect"}
      </div>
      <div className="feedback-row">
        <span className="feedback-label">Your answer:</span>
        <span className="feedback-value">{given}</span>
      </div>
      <div className="feedback-row">
        <span className="feedback-label">Correct answer:</span>
        <span className="feedback-value">{correct}</span>
      </div>
      {question.type !== "open" && (
        <ul className="feedback-options">
          {question.correct_answers.map((key) => (
            <li key={key}>
              <strong>{key})</strong> {question.options[key]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
