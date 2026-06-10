// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Test Maturité de Projet  (useTestFlow — état unique)
// ─────────────────────────────────────────────────────────────────────────────

import { useTestFlow } from "@/hooks/use-test-flow";
import { TestEngine } from "@/components/test-engine";
import { TestResults } from "@/components/test-results";
import { PROJECT_TEST } from "@/data/tests";
import { FlaskConical, Sparkles, ArrowLeft, AlertCircle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const G = { forest: "#1E3A2F", green: "#2E7D5B", gold: "#C8964E", terra: "#D6845A" };

export default function ProjetTest() {
  const { state, startTest, retake, handleAnswers } = useTestFlow(PROJECT_TEST, "project_maturity");

  if (state.phase === "intro") return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${G.green} 0%, ${G.forest} 100%)` }}>
        <div className="p-8" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C8964E' stroke-width='0.5' opacity='0.12'%3E%3Cpath d='M20 4 L36 20 L20 36 L4 20 Z'/%3E%3Cpath d='M20 10 L30 20 L20 30 L10 20 Z'/%3E%3C/g%3E%3C/svg%3E")` }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,150,78,0.2)", border: "1.5px solid rgba(200,150,78,0.4)" }}>
              <FlaskConical className="h-7 w-7" style={{ color: G.gold }} />
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full mb-1 inline-block" style={{ background: "rgba(200,150,78,0.2)", color: G.gold }}>Maturité entrepreneuriale</span>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{PROJECT_TEST.title}</h2>
              <p className="text-sm mt-1 text-white/70">{PROJECT_TEST.subtitle}</p>
            </div>
          </div>
          <p className="text-sm mt-5 leading-relaxed text-white/75">
            Ce test évalue le degré de préparation de votre projet entrepreneurial selon 6 dimensions clés.
            À l'issue, obtenez un score de maturité global, une identification des risques prioritaires,
            et une roadmap personnalisée pour les 12 prochains mois.
          </p>
          <div className="flex gap-6 mt-5 pt-5 border-t border-white/12">
            {[{ v: "24", l: "questions" }, { v: "8–10", l: "minutes" }, { v: "6", l: "dimensions" }].map(({ v, l }) => (
              <div key={l}><div className="text-lg font-bold" style={{ color: G.gold }}>{v}</div><div className="text-xs text-white/55">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(PROJECT_TEST.categoryLabels).map(([key, label]) => (
          <div key={key} className="rounded-xl p-4" style={{ background: "white", border: "1px solid rgba(46,125,91,0.15)", boxShadow: "0 2px 8px rgba(30,58,47,0.04)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: "rgba(46,125,91,0.08)" }}>
              <BarChart3 className="h-4 w-4" style={{ color: G.green }} />
            </div>
            <div className="text-sm font-semibold" style={{ color: G.forest }}>{label}</div>
          </div>
        ))}
      </div>

      <button onClick={startTest} data-testid="start-test" className="w-full h-12 rounded-xl text-white font-bold text-sm golleo-btn-primary">
        <Sparkles className="inline h-4 w-4 mr-2" />Évaluer la maturité de mon projet
      </button>
      <Link href="/entrepreneur"><Button variant="ghost" className="w-full text-sm" style={{ color: G.forest }}><ArrowLeft className="h-4 w-4 mr-1" />Retour à mon espace</Button></Link>
    </div>
  );

  if (state.phase === "computing") return (
    <div className="flex flex-col items-center justify-center py-24 space-y-5 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${G.green}, ${G.forest})` }}>
          <FlaskConical className="h-8 w-8 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ background: G.green }} />
      </div>
      <div className="text-center">
        <p className="font-bold text-lg" style={{ color: G.forest, fontFamily: "'Playfair Display', serif" }}>Analyse du projet en cours…</p>
        <p className="text-sm mt-1" style={{ color: "rgba(30,58,47,0.6)" }}>Évaluation de votre préparation et génération de votre roadmap</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: G.gold, animationDelay: `${i * 0.15}s` }} />)}
      </div>
    </div>
  );

  if (state.phase === "error") return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2 text-sm p-4 rounded-xl" style={{ background: "rgba(220,60,60,0.08)", color: "#dc3c3c", border: "1px solid rgba(220,60,60,0.2)" }}>
        <AlertCircle className="h-5 w-5 flex-shrink-0" /><div><b>Erreur :</b> {state.message}</div>
      </div>
      <button onClick={retake} className="w-full h-11 rounded-xl text-white font-bold text-sm golleo-btn-primary">Réessayer</button>
    </div>
  );

  if (state.phase === "results") return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${G.green}, ${G.forest})` }}>
          <FlaskConical className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold" style={{ color: G.forest }}>Résultats — Maturité de Projet</h2>
          <p className="text-xs" style={{ color: "rgba(30,58,47,0.6)" }}>Niveau de préparation et roadmap personnalisée</p>
        </div>
      </div>
      <TestResults testType="project_maturity" scores={state.scores}
        aiMode={"aiMode" in state ? state.aiMode : undefined} aiAnalysis={state.analysis} categoryLabels={PROJECT_TEST.categoryLabels} onRetake={retake} />
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${G.green}, ${G.forest})` }}>
          <FlaskConical className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold" style={{ color: G.forest }}>{PROJECT_TEST.title}</h2>
          <p className="text-xs" style={{ color: "rgba(30,58,47,0.6)" }}>Répondez en pensant à votre projet concret</p>
        </div>
      </div>
      <TestEngine test={PROJECT_TEST} onComplete={handleAnswers} isSubmitting={false} />
    </div>
  );
}
