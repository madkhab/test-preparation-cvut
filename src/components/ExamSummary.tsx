import type { Exam, UserAnswer } from "../types/exam";

export interface QuestionResult {
  answer: UserAnswer;
  submitted: boolean;
  isCorrect: boolean;
}

interface Props {
  exam: Exam;
  results: Record<number, QuestionResult>;
  onRestart: () => void;
  onExit: () => void;
}

function formatUserAnswer(answer: UserAnswer): string {
  switch (answer.type) {
    case "single":
      return answer.value ?? "—";
    case "multiple":
      return answer.value.length > 0 ? answer.value.slice().sort().join(", ") : "—";
    case "open":
      return answer.value.trim().length > 0 ? answer.value : "—";
  }
}

export function ExamSummary({ exam, results, onRestart, onExit }: Props) {
  const total = exam.questions.length;
  const answered = exam.questions.filter((q) => results[q.id].submitted).length;
  const correct = exam.questions.filter(
    (q) => results[q.id].submitted && results[q.id].isCorrect,
  ).length;

  const maxPoints = exam.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
  const earnedPoints = exam.questions.reduce(
    (sum, q) =>
      sum +
      (results[q.id].submitted && results[q.id].isCorrect ? q.points ?? 0 : 0),
    0,
  );

  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="exam-summary">
      <header className="exam-runner-header">
        <button type="button" className="link-button" onClick={onExit}>
          ← Back to tests
        </button>
        <div className="exam-title-block">
          <h2>
            Results —{" "}
            {exam.year > 0
              ? `${exam.year} · ${exam.source_test_name}`
              : exam.source_test_name}
          </h2>
          <p className="exam-subtitle">{exam.title}</p>
        </div>
      </header>

      <section className="summary-score">
        <div className="score-card">
          <span className="score-label">Score</span>
          <span className="score-value">
            {correct} / {total}
          </span>
          <span className="score-percent">{percent}%</span>
        </div>
        <div className="score-card">
          <span className="score-label">Answered</span>
          <span className="score-value">
            {answered} / {total}
          </span>
        </div>
        {maxPoints > 0 && (
          <div className="score-card">
            <span className="score-label">Points</span>
            <span className="score-value">
              {earnedPoints} / {maxPoints}
            </span>
          </div>
        )}
      </section>

      <ol className="summary-list">
        {exam.questions.map((q) => {
          const r = results[q.id];
          const status = !r.submitted
            ? "skipped"
            : r.isCorrect
              ? "correct"
              : "incorrect";

          return (
            <li key={q.id} className={`summary-item ${status}`}>
              <div className="summary-item-header">
                <span className="summary-marker">
                  {status === "correct" && "✓"}
                  {status === "incorrect" && "✗"}
                  {status === "skipped" && "—"}
                </span>
                <span className="summary-id">Q{q.id}</span>
                <span className={`question-type type-${q.type}`}>{q.type}</span>
                {q.points != null && (
                  <span className="question-points">{q.points} pts</span>
                )}
              </div>
              <p className="summary-question">{q.question}</p>
              <div className="summary-row">
                <span className="feedback-label">Your answer:</span>
                <span className="feedback-value">
                  {r.submitted ? formatUserAnswer(r.answer) : "not answered"}
                </span>
              </div>
              <div className="summary-row">
                <span className="feedback-label">Correct answer:</span>
                <span className="feedback-value">
                  {q.correct_answers.slice().sort().join(", ")}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="actions">
        <button type="button" className="primary" onClick={onRestart}>
          Retry test
        </button>
        <button type="button" onClick={onExit}>
          Back to tests
        </button>
      </div>
    </div>
  );
}
