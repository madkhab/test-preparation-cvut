import type { Exam } from "../types/exam";

interface Props {
  exam: Exam;
  onExit: () => void;
  onStart: () => void;
}

export function ExamPreview({ exam, onExit, onStart }: Props) {
  return (
    <div className="exam-preview">
      <header className="exam-runner-header">
        <button type="button" className="link-button" onClick={onExit}>
          ← Back to tests
        </button>
        <div className="exam-title-block">
          <h2>
            Overview —{" "}
            {exam.year > 0
              ? `${exam.year} · ${exam.source_test_name}`
              : exam.source_test_name}
          </h2>
          <p className="exam-subtitle">
            {exam.title} · {exam.questions.length} questions
          </p>
        </div>
      </header>

      <ol className="summary-list">
        {exam.questions.map((q) => (
          <li key={q.id} className="summary-item">
            <div className="summary-item-header">
              <span className="summary-id">Q{q.id}</span>
              <span className={`question-type type-${q.type}`}>{q.type}</span>
              {q.points != null && (
                <span className="question-points">{q.points} pts</span>
              )}
            </div>
            <p className="summary-question">{q.question}</p>

            {q.type !== "open" && (
              <ul className="option-list summary-options">
                {Object.entries(q.options).map(([key, label]) => {
                  const isCorrect = q.correct_answers.includes(key);
                  return (
                    <li key={key}>
                      <div className={isCorrect ? "option correct" : "option"}>
                        <span className="option-key">{key})</span>
                        <span className="option-label">{label}</span>
                        {isCorrect && (
                          <span className="option-tags">
                            <span className="option-tag correct">Correct</span>
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {q.type === "open" && (
              <div className="summary-row">
                <span className="feedback-label">Answer:</span>
                <span className="feedback-value">
                  {q.correct_answers.slice().sort().join(", ")}
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="actions">
        <button type="button" className="primary" onClick={onStart}>
          Start test
        </button>
        <button type="button" onClick={onExit}>
          Back to tests
        </button>
      </div>
    </div>
  );
}
