// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Test IKIGAI Entrepreneurial  (useTestFlow — état unique)
// ─────────────────────────────────────────────────────────────────────────────

import { useTestFlow } from "@/hooks/use-test-flow";
import { TestEngine } from "@/components/test-engine";
import { TestResults } from "@/components/test-results";
import { IKIGAI_TEST } from "@/data/tests";
import { Target, Sparkles, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const G = { forest: "#1E3A2F", green: "#2E7D5B", gold: "#C8964E", terra: "#D6845A" };

export default function IkigaiEntrepreneurTest() {
  const { state, startTest, retake, handleAnswers } = useTestFlow(IKIGAI_TEST, "ikigai", "entrepreneur");

  if (state.phase === "intro") return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <div className="rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${G.gold} 0%, ${G.green} 100%)` }}>
        <div className="p-8" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231E3A2F' stroke-width='0.5' opacity='0.1'%3E%3Cpath d='M20 4 L36 20 L20 36 L4 20 Z'/%3E%3Cpath d='M20 10 L30 20 L20 30 L10 20 Z'/%3E%3C/g%3E%3C/svg%3E")` }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.35)" }}>
              <Target className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full mb-1 inline-block" style={{ background: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.95)" }}>Espace Entrepreneur</span>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>IKIGAI Entrepreneurial</h2>
              <p className="text-sm mt-1 text-white/75">Trouvez votre terrain d'activité entrepreneuriale idéal</p>
            </div>
          </div>
          <p className="text-sm mt-5 leading-relaxed text-white/80">
            Version entrepreneuriale du test IKIGAI — orientée vers la découverte de votre activité business idéale,
            vos passions monétisables et les modèles d'entreprise qui correspondent à votre profil.
            L'analyse IA vous propose des idées de business alignées avec votre personnalité.
          </p>
          <div className="flex gap-6 mt-5 pt-5 border-t border-white/20">
            {[{ v: "20", l: "questions" }, { v: "8–12", l: "minutes" }, { v: "4", l: "dimensions" }].map(({ v, l }) => (
              <div key={l}><div className="text-lg font-bold text-white">{v}</div><div className="text-xs text-white/60">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Passions monétisables", desc: "Activités que vous aimez", emoji: "❤️" },
          { label: "Talents business", desc: "Compétences valorisables", emoji: "⭐" },
          { label: "Besoins du marché", desc: "Problèmes à résoudre", emoji: "🌍" },
          { label: "Potentiel économique", desc: "Modèles viables", emoji: "💡" },
        ].map(q => (
          <div key={q.label} className="rounded-xl p-4" style={{ background: "white", border: "1px solid rgba(200,150,78,0.18)", boxShadow: "0 2px 8px rgba(30,58,47,0.04)" }}>
            <div className="text-xl mb-2">{q.emoji}</div>
            <div className="text-sm font-semibold" style={{ color: G.forest }}>{q.label}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(30,58,47,0.5)" }}>{q.desc}</div>
          </div>
        ))}
      </div>

      <button onClick={startTest} data-testid="start-test" className="w-full h-12 rounded-xl text-white font-bold text-sm golleo-btn-primary">
        <Sparkles className="inline h-4 w-4 mr-2" />Commencer l'IKIGAI Entrepreneurial
      </button>
      <Link href="/entrepreneur"><Button variant="ghost" className="w-full text-sm" style={{ color: G.forest }}><ArrowLeft className="h-4 w-4 mr-1" />Retour à mon espace</Button></Link>
    </div>
  );

  if (state.phase === "computing") return (
    <div className="flex flex-col items-center justify-center py-24 space-y-5 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.green})` }}>
          <Target className="h-8 w-8 text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ background: G.gold }} />
      </div>
      <div className="text-center">
        <p className="font-bold text-lg" style={{ color: G.forest, fontFamily: "'Playfair Display', serif" }}>Analyse entrepreneuriale en cours…</p>
        <p className="text-sm mt-1" style={{ color: "rgba(30,58,47,0.6)" }}>Identification de vos activités et modèles business alignés</p>
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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.green})` }}>
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold" style={{ color: G.forest }}>Résultats — IKIGAI Entrepreneurial</h2>
          <p className="text-xs" style={{ color: "rgba(30,58,47,0.6)" }}>Votre terrain d'activité entrepreneuriale idéal</p>
        </div>
      </div>
      <TestResults testType="ikigai" scores={state.scores}
        aiMode={"aiMode" in state ? state.aiMode : undefined} aiAnalysis={state.analysis} categoryLabels={IKIGAI_TEST.categoryLabels} onRetake={retake} onNext={() => { window.location.href = "/entrepreneur/tests/profil"; }} />
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${G.gold}, ${G.green})` }}>
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-bold" style={{ color: G.forest }}>IKIGAI Entrepreneurial</h2>
          <p className="text-xs" style={{ color: "rgba(30,58,47,0.6)" }}>Répondez en pensant à votre projet entrepreneurial</p>
        </div>
      </div>
      <TestEngine test={IKIGAI_TEST} onComplete={handleAnswers} isSubmitting={false} />
    </div>
  );
}
