import { useState } from "react";
import type { Exam, UserAnswer } from "../types/exam";
import {
  buildEmptyAnswer,
  checkAnswer,
  isAnswerFilled,
} from "../utils/answerChecker";
import { shuffleExam } from "../utils/randomExam";
import { QuestionView } from "./QuestionView";
import { AnswerFeedback } from "./AnswerFeedback";
import { ExamSummary, type QuestionResult } from "./ExamSummary";

interface Props {
  exam: Exam;
  onExit: () => void;
}

type Phase = "running" | "summary";

function buildInitialState(exam: Exam): Record<number, QuestionResult> {
  const map: Record<number, QuestionResult> = {};
  for (const q of exam.questions) {
    map[q.id] = {
      answer: buildEmptyAnswer(q.type),
      submitted: false,
      isCorrect: false,
    };
  }
  return map;
}

export function ExamRunner({ exam, onExit }: Props) {
  const [shuffled, setShuffled] = useState<Exam>(() => shuffleExam(exam));
  const [states, setStates] = useState<Record<number, QuestionResult>>(() =>
    buildInitialState(shuffled),
  );
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("running");

  const restart = () => {
    const reshuffled = shuffleExam(exam);
    setShuffled(reshuffled);
    setStates(buildInitialState(reshuffled));
    setIndex(0);
    setPhase("running");
  };

  if (phase === "summary") {
    return (
      <ExamSummary
        exam={shuffled}
        results={states}
        onRestart={restart}
        onExit={onExit}
      />
    );
  }

  const question = shuffled.questions[index];
  const state = states[question.id];
  const isLast = index === shuffled.questions.length - 1;

  const updateAnswer = (answer: UserAnswer) => {
    setStates((prev) => ({
      ...prev,
      [question.id]: { ...prev[question.id], answer },
    }));
  };

  const submit = () => {
    setStates((prev) => {
      const current = prev[question.id];
      return {
        ...prev,
        [question.id]: {
          ...current,
          submitted: true,
          isCorrect: checkAnswer(question, current.answer),
        },
      };
    });
  };

  const goTo = (next: number) => {
    if (next >= 0 && next < exam.questions.length) setIndex(next);
  };

  const score = Object.values(states).filter(
    (s) => s.submitted && s.isCorrect,
  ).length;
  const answeredCount = Object.values(states).filter((s) => s.submitted).length;

  return (
    <div className="exam-runner">
      <header className="exam-runner-header">
        <button type="button" className="link-button" onClick={onExit}>
          ← Back to tests
        </button>
        <div className="exam-title-block">
          <h2>
            {shuffled.year > 0
              ? `${shuffled.year} — ${shuffled.source_test_name}`
              : shuffled.source_test_name}
          </h2>
          <p className="exam-subtitle">{shuffled.title}</p>
        </div>
        <div className="exam-progress">
          <span>
            Question {index + 1} / {shuffled.questions.length}
          </span>
          <span>
            Score: {score} / {answeredCount}
          </span>
        </div>
      </header>

      <main className="exam-runner-body">
        <div className="actions">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
          >
            ← Previous
          </button>

          {!state.submitted ? (
            <>
              <button
                type="button"
                className="primary"
                onClick={submit}
                disabled={!isAnswerFilled(state.answer)}
              >
                Submit answer
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={isLast}
              >
                Skip →
              </button>
            </>
          ) : isLast ? (
            <button
              type="button"
              className="primary"
              onClick={() => setPhase("summary")}
            >
              Finish test →
            </button>
          ) : (
            <button
              type="button"
              className="primary"
              onClick={() => goTo(index + 1)}
            >
              Next question →
            </button>
          )}
        </div>

        <QuestionView
          question={question}
          answer={state.answer}
          locked={state.submitted}
          onChange={updateAnswer}
        />

        {state.submitted && (
          <AnswerFeedback
            question={question}
            answer={state.answer}
            isCorrect={state.isCorrect}
          />
        )}
      </main>
    </div>
  );
}
