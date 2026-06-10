// ─────────────────────────────────────────────────────────────────────────────
//  FRIWOK — AfriTestEngine
//  Moteur de test mobile-first, une question à la fois
//  Utilisé par AFRI-CODE et AFRI-SKILL
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AfriQuestion, AfriTestDefinition } from "@/data/afri-tests";

type Props = {
  test: AfriTestDefinition;
  onComplete: (answers: Record<number, number>) => void;
  isSubmitting?: boolean;
};

const QUESTIONS_PER_PAGE = 5; // mobile-friendly

export function AfriTestEngine({ test, onComplete, isSubmitting }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(test.questions.length / QUESTIONS_PER_PAGE);
  const pageQuestions = test.questions.slice(
    page * QUESTIONS_PER_PAGE,
    (page + 1) * QUESTIONS_PER_PAGE
  );
  const totalAnswered = Object.keys(answers).length;
  const progress = Math.round((totalAnswered / test.questions.length) * 100);
  const pageComplete = pageQuestions.every((q) => answers[q.id] !== undefined);
  const isLastPage = page === totalPages - 1;

  function handleAnswer(id: number, value: number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function next() {
    if (isLastPage) {
      onComplete(answers);
    } else {
      setPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function back() {
    if (page > 0) {
      setPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ── Barre de progression ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {page + 1} / {totalPages} · {totalAnswered}/{test.questions.length} réponses
          </span>
          <span className="font-semibold" style={{ color: "var(--afri-amber)" }}>
            {progress}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--afri-amber), var(--afri-gold))",
            }}
          />
        </div>
      </div>

      {/* ── Questions ── */}
      <div className="space-y-4">
        {pageQuestions.map((q, idx) => (
          <AfriQuestionCard
            key={q.id}
            question={q}
            number={page * QUESTIONS_PER_PAGE + idx + 1}
            value={answers[q.id]}
            onChange={(v) => handleAnswer(q.id, v)}
            dimensionLabel={test.dimensionLabels[q.dimension]}
            dimensionEmoji={test.dimensionEmojis[q.dimension]}
            dimensionColor={test.dimensionColors[q.dimension]}
          />
        ))}
      </div>

      {/* ── Navigation ── */}
      <div className="flex gap-3 pt-2">
        {page > 0 && (
          <button
            onClick={back}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Précédent
          </button>
        )}
        <button
          onClick={next}
          disabled={!pageComplete || isSubmitting}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all",
            pageComplete && !isSubmitting
              ? "shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              : "opacity-50 cursor-not-allowed"
          )}
          style={
            pageComplete
              ? { background: "linear-gradient(135deg, var(--afri-amber), var(--afri-gold))" }
              : { background: "var(--afri-amber)", opacity: 0.4 }
          }
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Calcul en cours...
            </>
          ) : isLastPage ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Voir mes résultats
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {!pageComplete && (
        <p className="text-center text-xs text-muted-foreground">
          ↑ Répondez à toutes les questions pour continuer
        </p>
      )}
    </div>
  );
}

// ── Carte question individuelle ───────────────────────────────────────────────

type QuestionCardProps = {
  question: AfriQuestion;
  number: number;
  value: number | undefined;
  onChange: (v: number) => void;
  dimensionLabel: string;
  dimensionEmoji: string;
  dimensionColor: string;
};

function AfriQuestionCard({
  question, number, value, onChange,
  dimensionLabel, dimensionEmoji, dimensionColor,
}: QuestionCardProps) {
  return (
    <div
      className="rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-200"
      style={{ borderColor: value !== undefined ? `${dimensionColor}40` : undefined }}
    >
      {/* Trait couleur dimension */}
      <div className="h-1 w-full" style={{ background: dimensionColor }} />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Numéro + dimension */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: dimensionColor }}
            >
              {number}
            </span>
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {question.text}
            </p>
          </div>
          {value !== undefined && (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: dimensionColor }} />
          )}
        </div>

        {/* Echelle Likert */}
        {question.options && (
          <LikertScale
            options={question.options}
            value={value}
            onChange={onChange}
            color={dimensionColor}
          />
        )}

        {/* Badge dimension */}
        <div className="flex justify-end">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${dimensionColor}15`, color: dimensionColor }}
          >
            {dimensionEmoji} {dimensionLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Échelle Likert ────────────────────────────────────────────────────────────

type LikertProps = {
  options: { value: number; label: string }[];
  value: number | undefined;
  onChange: (v: number) => void;
  color: string;
};

function LikertScale({ options, value, onChange, color }: LikertProps) {
  return (
    <div className="space-y-2">
      {/* Mobile : colonnes */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:gap-2">
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex sm:flex-col items-center sm:justify-center gap-2 sm:gap-1",
                "flex-1 px-3 sm:px-2 py-2 rounded-xl text-xs font-medium border-2 transition-all duration-150",
                selected
                  ? "text-white shadow-md scale-[1.02]"
                  : "bg-muted/40 border-transparent text-muted-foreground hover:bg-muted hover:border-muted"
              )}
              style={
                selected
                  ? { background: color, borderColor: color }
                  : {}
              }
            >
              {/* Score circle (desktop only) */}
              <span
                className={cn(
                  "hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold shrink-0",
                  selected ? "bg-white/20 text-white" : "bg-background"
                )}
              >
                {opt.value}
              </span>
              {/* Label (mobile: inline, desktop: below) */}
              <span className="text-left sm:text-center leading-tight">{opt.label}</span>
              {/* Mobile: chiffre à droite */}
              <span
                className={cn(
                  "sm:hidden ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  selected ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
                )}
              >
                {opt.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
