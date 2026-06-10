// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — TestEngine premium
//  Moteur de test, design chaleureux vert forêt + or
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Question, TestDefinition } from "@/data/tests";

const SCALE_OPTIONS = [
  { value: 1, label: "Pas du tout", short: "1" },
  { value: 2, label: "Plutôt non", short: "2" },
  { value: 3, label: "Neutre", short: "3" },
  { value: 4, label: "Plutôt oui", short: "4" },
  { value: 5, label: "Tout à fait", short: "5" },
];

const GOLLEO = {
  forest: "#1E3A2F",
  green: "#2E7D5B",
  gold: "#C8964E",
  cream: "#F2EDE3",
};

type Props = {
  test: TestDefinition;
  onComplete: (answers: Record<number, number>) => void;
  isSubmitting?: boolean;
};

const QUESTIONS_PER_PAGE = 5;

export function TestEngine({ test, onComplete, isSubmitting }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(test.questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = test.questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);
  const answered = Object.keys(answers).length;
  const progress = (answered / test.questions.length) * 100;
  const pageAnswered = pageQuestions.every((q) => answers[q.id] !== undefined);

  function handleAnswer(questionId: number, value: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleNext() {
    if (page < totalPages - 1) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete(answers);
    }
  }

  function handleBack() {
    if (page > 0) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Progression */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium" style={{ color: "rgba(30,58,47,0.55)" }}>
            Page {page + 1} / {totalPages} · {answered}/{test.questions.length} réponses
          </span>
          <span className="font-bold" style={{ color: GOLLEO.gold }}>{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(30,58,47,0.08)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${GOLLEO.gold}, #B07A35)` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {pageQuestions.map((question, idx) => (
          <QuestionCard
            key={question.id}
            question={question}
            questionNumber={page * QUESTIONS_PER_PAGE + idx + 1}
            value={answers[question.id]}
            onChange={(v) => handleAnswer(question.id, v)}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-2">
        {page > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium border-2 transition-all"
            style={{ color: GOLLEO.forest, borderColor: "rgba(30,58,47,0.2)" }}
          >
            <ArrowLeft className="w-4 h-4" /> Précédent
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!pageAnswered || isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={
            pageAnswered && !isSubmitting
              ? {
                  background: `linear-gradient(135deg, ${GOLLEO.gold}, #B07A35)`,
                  boxShadow: "0 4px 16px rgba(200,150,78,0.35)",
                }
              : { background: "rgba(30,58,47,0.15)", color: "rgba(30,58,47,0.35)", cursor: "not-allowed" }
          }
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analyse en cours...
            </>
          ) : page === totalPages - 1 ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Voir mes résultats
            </>
          ) : (
            <>
              Suivant <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {!pageAnswered && !isSubmitting && (
        <p className="text-center text-xs" style={{ color: "rgba(30,58,47,0.4)" }}>
          ↑ Répondez à toutes les questions pour continuer
        </p>
      )}
    </div>
  );
}

function QuestionCard({
  question, questionNumber, value, onChange,
}: {
  question: Question;
  questionNumber: number;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const isAnswered = value !== undefined;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "white",
        border: `1.5px solid ${isAnswered ? "rgba(200,150,78,0.3)" : "rgba(30,58,47,0.07)"}`,
        boxShadow: isAnswered ? "0 4px 16px rgba(200,150,78,0.1)" : "0 2px 8px rgba(30,58,47,0.04)",
      }}
    >
      {/* Barre de progression de la question */}
      <div
        className="h-1 transition-all duration-300"
        style={{
          background: isAnswered
            ? `linear-gradient(90deg, #C8964E, #B07A35)`
            : "rgba(30,58,47,0.06)",
          width: isAnswered ? "100%" : `${(value ?? 0) / 5 * 100}%`,
        }}
      />

      <div className="p-4 sm:p-5">
        {/* Numéro + texte */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: isAnswered ? "#C8964E" : "#1E3A2F" }}
          >
            {questionNumber}
          </div>
          <p className="text-sm font-medium leading-relaxed pt-0.5" style={{ color: "#1E3A2F" }}>
            {question.text}
          </p>
          {isAnswered && (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#C8964E" }} />
          )}
        </div>

        {/* Échelle Likert */}
        <div className="grid grid-cols-5 gap-1.5">
          {SCALE_OPTIONS.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-semibold transition-all duration-150"
                style={{
                  background: selected ? "#C8964E" : "rgba(30,58,47,0.04)",
                  color: selected ? "white" : "rgba(30,58,47,0.55)",
                  border: `1.5px solid ${selected ? "#C8964E" : "transparent"}`,
                  transform: selected ? "scale(1.03)" : "scale(1)",
                  boxShadow: selected ? "0 4px 12px rgba(200,150,78,0.3)" : "none",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    background: selected ? "rgba(255,255,255,0.25)" : "rgba(30,58,47,0.06)",
                    color: selected ? "white" : "rgba(30,58,47,0.65)",
                  }}
                >
                  {opt.value}
                </span>
                <span className="hidden sm:block text-center leading-tight px-0.5">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
