import type { Exam } from "../types/exam";

interface Props {
  exams: Exam[];
  onSelect: (exam: Exam) => void;
  onRandom: () => void;
}

export function ExamSelector({ exams, onSelect, onRandom }: Props) {
  const sorted = [...exams].sort((a, b) => b.year - a.year);

  return (
    <div className="exam-selector">
      <div className="selector-toolbar">
        <h2>Select a test</h2>
        <button type="button" className="primary" onClick={onRandom}>
          🎲 Random test
        </button>
      </div>
      <p className="selector-hint">
        Random test picks the i-th question randomly across all years for each
        position i.
      </p>
      <ul className="exam-list">
        {sorted.map((exam) => (
          <li key={exam.year}>
            <button
              type="button"
              className="exam-card"
              onClick={() => onSelect(exam)}
            >
              <span className="exam-year">{exam.year}</span>
              <span className="exam-title">{exam.title}</span>
              <span className="exam-meta">
                {exam.source_test_name} · {exam.questions.length} questions
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
