import type { Question, UserAnswer } from "../types/exam";

interface Props {
  question: Question;
  answer: UserAnswer;
  locked: boolean;
  onChange: (answer: UserAnswer) => void;
}

export function QuestionView({ question, answer, locked, onChange }: Props) {
  const optionEntries = Object.entries(question.options);
  const correctSet = new Set(question.correct_answers);

  const toggleMultiple = (key: string) => {
    if (answer.type !== "multiple") return;
    const set = new Set(answer.value);
    if (set.has(key)) set.delete(key);
    else set.add(key);
    onChange({ type: "multiple", value: Array.from(set) });
  };

  const optionClass = (key: string): string => {
    if (!locked) return "option";
    return correctSet.has(key) ? "option correct" : "option";
  };

  return (
    <div className="question">
      <div className="question-header">
        <span className="question-id">#{question.id}</span>
        {question.points != null && (
          <span className="question-points">{question.points} pts</span>
        )}
        <span className={`question-type type-${question.type}`}>
          {question.type}
        </span>
      </div>
      <p className="question-text">{question.question}</p>

      {question.type === "single" && answer.type === "single" && (
        <ul className="option-list">
          {optionEntries.map(([key, label]) => (
            <li key={key}>
              <label className={optionClass(key)}>
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  value={key}
                  disabled={locked}
                  checked={answer.value === key}
                  onChange={() => onChange({ type: "single", value: key })}
                />
                <span className="option-key">{key})</span>
                <span className="option-label">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {question.type === "multiple" && answer.type === "multiple" && (
        <ul className="option-list">
          {optionEntries.map(([key, label]) => (
            <li key={key}>
              <label className={optionClass(key)}>
                <input
                  type="checkbox"
                  value={key}
                  disabled={locked}
                  checked={answer.value.includes(key)}
                  onChange={() => toggleMultiple(key)}
                />
                <span className="option-key">{key})</span>
                <span className="option-label">{label}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {question.type === "open" && answer.type === "open" && (
        <input
          className="open-input"
          type="text"
          disabled={locked}
          value={answer.value}
          placeholder="Your answer..."
          onChange={(e) => onChange({ type: "open", value: e.target.value })}
        />
      )}
    </div>
  );
}
