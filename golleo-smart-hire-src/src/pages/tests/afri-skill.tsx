// ─────────────────────────────────────────────────────────────────────────────
//  FRIWOK — AFRI-SKILL : Test de readiness professionnelle
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, Download, Loader2, RefreshCcw,
  TrendingUp, Lightbulb, BookOpen, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AfriTestEngine } from "@/components/afri-test-engine";
import { computeAfriSkill } from "@/lib/afri-scoring";
import {
  AFRI_SKILL_TEST,
  AFRI_SKILL_LEVELS,
  type AfriSkillResult,
  type AfriSkillDimension,
} from "@/data/afri-tests";

type Phase = "intro" | "test" | "computing" | "results";

const HERO_GRADIENT = "linear-gradient(135deg, #0D2B2B 0%, #1a4a3a 60%, #0D2B2B 100%)";

export default function AfriSkillPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<AfriSkillResult | null>(null);

  async function handleComplete(answers: Record<number, number>) {
    setPhase("computing");
    await new Promise((r) => setTimeout(r, 1500));
    const r = computeAfriSkill(answers);
    setResult(r);
    try {
      localStorage.setItem("afri_skill_result", JSON.stringify({ result: r, date: new Date().toISOString() }));
    } catch (_) {}
    setPhase("results");
  }

  if (phase === "intro") return <IntroScreen onStart={() => setPhase("test")} />;
  if (phase === "computing") return <ComputingScreen />;
  if (phase === "results" && result) {
    return <ResultsScreen result={result} onRetake={() => setPhase("intro")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-lg"
          style={{ background: "var(--afri-teal)" }}>💼</div>
        <div>
          <h2 className="font-bold text-foreground">AFRI-SKILL</h2>
          <p className="text-xs text-muted-foreground">Évaluez honnêtement vos compétences</p>
        </div>
      </div>
      <AfriTestEngine test={AFRI_SKILL_TEST} onComplete={handleComplete} />
    </div>
  );
}

// ── Introduction ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  const dims = AFRI_SKILL_TEST.dimensions as AfriSkillDimension[];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: HERO_GRADIENT }}>
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ background: "var(--afri-teal)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(46,184,138,0.15)", border: "1px solid rgba(46,184,138,0.3)" }}>
              💼
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">AFRI-SKILL</h1>
              <p className="text-sm opacity-70">Mesurez votre prêt-à-l'emploi professionnel</p>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed max-w-lg">
            AFRI-SKILL évalue vos 10 compétences transférables essentielles pour trouver
            et garder un emploi. Obtenez un score global, identifiez vos forces et recevez
            des formations recommandées adaptées à votre niveau.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs opacity-70">
            <span>📝 30 questions</span>
            <span>⏱ 6–10 minutes</span>
            <span>📊 10 compétences</span>
            <span>🎯 100% pratique</span>
          </div>
        </div>
      </div>

      {/* Les 10 dimensions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Les 10 compétences évaluées
        </p>
        <div className="grid grid-cols-2 gap-2">
          {dims.map((d) => (
            <div key={d}
              className="flex items-center gap-2 p-2.5 rounded-xl border bg-white text-xs font-medium text-foreground"
              style={{ borderColor: `${AFRI_SKILL_TEST.dimensionColors[d]}30` }}
            >
              <span>{AFRI_SKILL_TEST.dimensionEmojis[d]}</span>
              <span>{AFRI_SKILL_TEST.dimensionLabels[d]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Niveaux */}
      <div className="rounded-2xl border bg-white p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Niveaux AFRI-SKILL
        </p>
        {Object.entries(AFRI_SKILL_LEVELS).map(([level, data]) => (
          <div key={level} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: data.color }} />
            <span className="text-xs font-semibold" style={{ color: data.color }}>{data.badge}</span>
            <span className="text-xs text-muted-foreground">{data.min}–{data.max}%</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform"
        style={{ background: "linear-gradient(135deg, var(--afri-teal), #1a7a60)" }}
      >
        Démarrer AFRI-SKILL <ArrowRight className="w-4 h-4" />
      </button>
      <Link href="/emploi">
        <button className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retour à mon espace emploi
        </button>
      </Link>
    </div>
  );
}

// ── Calcul ────────────────────────────────────────────────────────────────────

function ComputingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-5">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-bounce"
        style={{ background: "linear-gradient(135deg, var(--afri-teal), #1a7a60)" }}>
        💼
      </div>
      <div className="text-center space-y-1">
        <p className="font-bold text-foreground text-lg">Analyse de vos compétences...</p>
        <p className="text-sm text-muted-foreground">Calcul de votre score AFRI-SKILL en cours</p>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: "var(--afri-teal)", animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

// ── Résultats ─────────────────────────────────────────────────────────────────

function ResultsScreen({ result, onRetake }: { result: AfriSkillResult; onRetake: () => void }) {
  const [exporting, setExporting] = useState(false);
  const levelData = AFRI_SKILL_LEVELS[result.level];
  const dims = AFRI_SKILL_TEST.dimensions as AfriSkillDimension[];

  // Trier les dimensions : forces en premier
  const sortedDims = [...dims].sort(
    (a, b) => result.dimensionScores[b] - result.dimensionScores[a]
  );

  async function exportPDF() {
    setExporting(true);
    try {
      const el = document.getElementById("afri-skill-results");
      if (!el) return;
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth() - 20;
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, w, Math.min(h, pdf.internal.pageSize.getHeight() - 20));
      pdf.save(`AFRI-SKILL-${result.level}.pdf`);
    } finally { setExporting(false); }
  }

  return (
    <div id="afri-skill-results" className="space-y-5 max-w-2xl mx-auto">

      {/* Hero score global */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: HERO_GRADIENT }}>
        <div className="absolute right-4 top-4 w-32 h-32 rounded-full blur-2xl opacity-20"
          style={{ background: levelData.color }} />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest opacity-60 mb-4">Votre score AFRI-SKILL</div>

          {/* Jauge circulaire SVG */}
          <div className="flex items-center gap-6 mb-4">
            <ScoreGauge score={result.globalScore} color={levelData.color} />
            <div>
              <div className="text-3xl font-extrabold">{result.globalScore}<span className="text-xl opacity-60">/100</span></div>
              <div className="text-lg font-bold mt-1" style={{ color: levelData.color }}>
                {levelData.badge}
              </div>
            </div>
          </div>

          <p className="text-sm opacity-80 leading-relaxed">{result.levelDescription}</p>
        </div>
      </div>

      {/* Scores par dimension */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: "var(--afri-teal)" }} />
          Détail des 10 compétences
        </h3>
        {sortedDims.map((dim) => {
          const score = result.dimensionScores[dim];
          const color = AFRI_SKILL_TEST.dimensionColors[dim];
          const label = AFRI_SKILL_TEST.dimensionLabels[dim];
          const emoji = AFRI_SKILL_TEST.dimensionEmojis[dim];
          const isStrength = result.strengths.includes(dim);
          const isWeak = result.toImprove.includes(dim);
          return (
            <div key={dim} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span>{emoji}</span>
                  <span className="font-medium text-foreground">{label}</span>
                  {isStrength && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: `${color}20`, color }}>Force</span>
                  )}
                  {isWeak && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700">À renforcer</span>
                  )}
                </div>
                <span className="font-bold" style={{ color }}>{score}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Forces et Axes de progrès */}
      <div className="grid sm:grid-cols-2 gap-3">
        {/* Forces */}
        {result.strengths.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-emerald-800 flex items-center gap-2">
              <Star className="w-4 h-4" /> Vos forces
            </h3>
            {result.strengths.map((d) => (
              <div key={d} className="flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                {AFRI_SKILL_TEST.dimensionLabels[d]} — {result.dimensionScores[d]}%
              </div>
            ))}
          </div>
        )}

        {/* À améliorer */}
        {result.toImprove.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-amber-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> À renforcer
            </h3>
            {result.toImprove.map((d) => (
              <div key={d} className="flex items-center gap-2 text-xs text-amber-700">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                {AFRI_SKILL_TEST.dimensionLabels[d]} — {result.dimensionScores[d]}%
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommandations */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Lightbulb className="w-4 h-4" style={{ color: "var(--afri-gold)" }} />
          Recommandations personnalisées
        </h3>
        <div className="space-y-2">
          {result.recommendations.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground p-2.5 rounded-xl bg-muted/30">
              <span className="shrink-0 font-bold" style={{ color: "var(--afri-amber)" }}>{i + 1}.</span>
              {r}
            </div>
          ))}
        </div>
      </div>

      {/* Formations courtes recommandées */}
      {result.shortCourses.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-500" />
            Formations courtes recommandées
          </h3>
          <div className="space-y-2">
            {result.shortCourses.map((c, i) => (
              <div key={i}
                className="flex items-center justify-between p-3 rounded-xl border bg-emerald-50 border-emerald-100">
                <div>
                  <p className="text-xs font-semibold text-foreground">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground">{c.platform} · {c.duration}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prochaines étapes */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" style={{ color: "var(--afri-teal)" }} />
          Vos prochaines étapes
        </h3>
        <div className="space-y-2">
          {result.nextSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                style={{ background: "var(--afri-teal)" }}>{i + 1}</div>
              <span className="text-foreground">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Exporter PDF
        </button>
        <Link href="/emploi/simulateur" className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-bold shadow-lg hover:scale-[1.01] transition-transform"
            style={{ background: "linear-gradient(135deg, var(--afri-amber), var(--afri-gold))" }}>
            Simuler un entretien <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
      <button onClick={onRetake}
        className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <RefreshCcw className="w-3.5 h-3.5" /> Recommencer le test
      </button>
    </div>
  );
}

// ── Composant Jauge SVG ───────────────────────────────────────────────────────

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 36;
  const C = 2 * Math.PI * r;
  const offset = C - (score / 100) * C;
  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
        <circle
          cx="44" cy="44" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold text-white">{score}</span>
      </div>
    </div>
  );
}
