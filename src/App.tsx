import { useState } from "react";
import type { Exam } from "./types/exam";
import { useExamData } from "./hooks/useExamData";
import { ExamSelector } from "./components/ExamSelector";
import { ExamRunner } from "./components/ExamRunner";
import { ExamPreview } from "./components/ExamPreview";
import { buildRandomExam } from "./utils/randomExam";
import "./App.css";

export default function App() {
  const data = useExamData();
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [previewExam, setPreviewExam] = useState<Exam | null>(null);

  const showHeader = !activeExam && !previewExam;

  return (
    <div className="app">
      {showHeader && (
        <header className="app-header">
          <h1>{data.title}</h1>
          <p>{data.description}</p>
        </header>
      )}

      <section className="app-body">
        {activeExam ? (
          <ExamRunner
            exam={activeExam}
            onExit={() => setActiveExam(null)}
          />
        ) : previewExam ? (
          <ExamPreview
            exam={previewExam}
            onExit={() => setPreviewExam(null)}
            onStart={() => {
              setActiveExam(previewExam);
              setPreviewExam(null);
            }}
          />
        ) : (
          <ExamSelector
            exams={data.exams}
            onSelect={setActiveExam}
            onPreview={setPreviewExam}
            onRandom={() => setActiveExam(buildRandomExam(data.exams))}
          />
        )}
      </section>
    </div>
  );
}
