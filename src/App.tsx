import { useState } from "react";
import type { Exam } from "./types/exam";
import { useExamData } from "./hooks/useExamData";
import { ExamSelector } from "./components/ExamSelector";
import { ExamRunner } from "./components/ExamRunner";
import { buildRandomExam } from "./utils/randomExam";
import "./App.css";

export default function App() {
  const data = useExamData();
  const [activeExam, setActiveExam] = useState<Exam | null>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>{data.title}</h1>
        <p>{data.description}</p>
      </header>

      <section className="app-body">
        {activeExam ? (
          <ExamRunner
            exam={activeExam}
            onExit={() => setActiveExam(null)}
          />
        ) : (
          <ExamSelector
            exams={data.exams}
            onSelect={setActiveExam}
            onRandom={() => setActiveExam(buildRandomExam(data.exams))}
          />
        )}
      </section>
    </div>
  );
}
