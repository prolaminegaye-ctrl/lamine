// ─────────────────────────────────────────────────────────────────────────────
//  FRIWOK — AFRI-CODE : Test d'orientation professionnel africain
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, CheckCircle2, Download, Loader2, RefreshCcw,
  Star, MapPin, Briefcase, BookOpen, Zap, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AfriTestEngine } from "@/components/afri-test-engine";
import { computeAfriCode } from "@/lib/afri-scoring";
import {
  AFRI_CODE_TEST,
  AFRI_CODE_PROFILES,
  type AfriCodeResult,
  type AfriCodeProfile,
} from "@/data/afri-tests";

type Phase = "intro" | "test" | "computing" | "results";

// ── Couleurs chaudes sidebar ──────────────────────────────────────────────────
const HERO_GRADIENT = "linear-gradient(135deg, #0D2B2B 0%, #1a4a3a 60%, #0D2B2B 100%)";

export default function AfriCodePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<AfriCodeResult | null>(null);

  async function handleComplete(answers: Record<number, number>) {
    setPhase("computing");
    // Simulation d'un léger délai pour l'effet "calcul en cours"
    await new Promise((r) => setTimeout(r, 1500));
    const r = computeAfriCode(answers);
    setResult(r);
    // Sauvegarder en localStorage pour le dashboard
    try {
      localStorage.setItem("afri_code_result", JSON.stringify({ result: r, date: new Date().toISOString() }));
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
          style={{ background: "var(--afri-amber)" }}>🧭</div>
        <div>
          <h2 className="font-bold text-foreground">AFRI-CODE</h2>
          <p className="text-xs text-muted-foreground">Répondez selon votre ressenti authentique</p>
        </div>
      </div>
      <AfriTestEngine test={AFRI_CODE_TEST} onComplete={handleComplete} />
    </div>
  );
}

// ── Écran d'introduction ──────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  const profiles = Object.values(AFRI_CODE_PROFILES);
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: HERO_GRADIENT }}
      >
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--afri-gold)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(245,194,62,0.15)", border: "1px solid rgba(245,194,62,0.3)" }}>
              🧭
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">AFRI-CODE</h1>
              <p className="text-sm opacity-70">Votre boussole professionnelle africaine</p>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed max-w-lg">
            En 30 questions, découvrez votre profil d'orientation parmi 6 archétypes contextualisés
            pour le marché du travail africain, avec vos métiers recommandés, formations adaptées
            et environnements favorables.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs opacity-70">
            <span>📝 30 questions</span>
            <span>⏱ 8–12 minutes</span>
            <span>🎯 6 profils</span>
            <span>🌍 Contexte africain</span>
          </div>
        </div>
      </div>

      {/* Les 6 profils */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Les 6 profils AFRI-CODE
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {profiles.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border p-3.5 bg-white hover:shadow-sm transition-shadow"
              style={{ borderColor: `${p.color}30` }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{p.emoji}</span>
                <span className="text-xs font-bold" style={{ color: p.color }}>{p.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">{p.tagline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-2xl border bg-amber-50 border-amber-200 p-4">
        <p className="text-sm font-semibold text-amber-800 mb-2">💡 Conseils pour répondre</p>
        <ul className="space-y-1 text-xs text-amber-700">
          <li>✓ Répondez selon votre ressenti naturel, pas selon ce qu'on attend de vous</li>
          <li>✓ Il n'y a pas de bonne ou mauvaise réponse</li>
          <li>✓ Pensez à votre vie quotidienne, pas seulement à votre expérience professionnelle</li>
          <li>✓ Répondez rapidement — votre première intuition est souvent la meilleure</li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform"
        style={{ background: "linear-gradient(135deg, var(--afri-amber), var(--afri-gold))" }}
      >
        Démarrer AFRI-CODE <ArrowRight className="w-4 h-4" />
      </button>
      <Link href="/emploi">
        <button className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retour à mon espace emploi
        </button>
      </Link>
    </div>
  );
}

// ── Écran de calcul ───────────────────────────────────────────────────────────

function ComputingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-5">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl animate-bounce"
        style={{ background: "linear-gradient(135deg, var(--afri-amber), var(--afri-gold))" }}
      >
        🧭
      </div>
      <div className="text-center space-y-1">
        <p className="font-bold text-foreground text-lg">Analyse de votre profil...</p>
        <p className="text-sm text-muted-foreground">Identification de votre AFRI-CODE en cours</p>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full animate-bounce"
            style={{ background: "var(--afri-amber)", animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}

// ── Écran de résultats ────────────────────────────────────────────────────────

function ResultsScreen({
  result, onRetake,
}: {
  result: AfriCodeResult;
  onRetake: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const primary = result.profileDetails;
  const secondary = result.secondaryDetails;

  const sortedDims = Object.entries(result.scores)
    .sort(([, a], [, b]) => b - a);

  async function exportPDF() {
    setExporting(true);
    try {
      const el = document.getElementById("afri-code-results");
      if (!el) return;
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const canvas = await html2canvas(el, { scale: 1.5, useCORS: true, backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth() - 20;
      const h = (canvas.height * w) / canvas.width;
      let y = 10;
      let remaining = h;
      const pageH = pdf.internal.pageSize.getHeight() - 20;
      while (remaining > 0) {
        const sliceH = Math.min(remaining, pageH);
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = (sliceH / h) * canvas.height;
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, ((h - remaining) / h) * canvas.height, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height);
        if (h - remaining > 0) { pdf.addPage(); y = 10; }
        pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", 10, y, w, sliceH);
        remaining -= pageH;
      }
      pdf.save(`AFRI-CODE-${primary.name}.pdf`);
    } finally { setExporting(false); }
  }

  return (
    <div id="afri-code-results" className="space-y-5 max-w-2xl mx-auto">

      {/* Hero résultat */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: HERO_GRADIENT }}
      >
        <div className="absolute right-4 top-4 w-32 h-32 rounded-full blur-2xl opacity-20"
          style={{ background: primary.color }} />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest opacity-60 mb-3">Votre AFRI-CODE</div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{ background: `${primary.color}30`, border: `2px solid ${primary.color}60` }}>
              {primary.emoji}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">{primary.name}</h2>
              <p className="text-sm opacity-75 mt-0.5">{primary.tagline}</p>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed">{primary.description}</p>

          {/* Profil secondaire */}
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <span className="text-lg">{secondary.emoji}</span>
            <div>
              <span className="text-xs font-semibold opacity-70">Profil secondaire : </span>
              <span className="text-xs font-bold" style={{ color: secondary.color }}>{secondary.name}</span>
              <span className="text-xs opacity-60 ml-1">— {secondary.tagline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scores par dimension */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4" style={{ color: "var(--afri-amber)" }} />
          Scores par dimension
        </h3>
        {sortedDims.map(([dim, score]) => {
          const label = AFRI_CODE_TEST.dimensionLabels[dim];
          const emoji = AFRI_CODE_TEST.dimensionEmojis[dim];
          const color = AFRI_CODE_TEST.dimensionColors[dim];
          return (
            <div key={dim} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{emoji} {label}</span>
                <span className="font-bold" style={{ color }}>{score}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Points forts */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          Vos points forts
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.recommendations.strengths.map((s, i) => (
            <span key={i}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: `${primary.color}15`, color: primary.color }}>
              ✓ {s}
            </span>
          ))}
        </div>
      </div>

      {/* Métiers recommandés */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4" style={{ color: "var(--afri-teal)" }} />
          Métiers recommandés
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {result.recommendations.careers.map((c, i) => (
            <div key={i}
              className="flex items-center gap-2 text-xs p-2.5 rounded-xl border bg-muted/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--afri-teal)" }} />
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Environnements favorables */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" style={{ color: secondary.color }} />
          Environnements qui vous correspondent
        </h3>
        <div className="flex flex-wrap gap-2">
          {result.recommendations.environments.map((e, i) => (
            <span key={i}
              className="text-xs px-3 py-1.5 rounded-full border font-medium"
              style={{ borderColor: `${secondary.color}40`, color: secondary.color }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Formations recommandées */}
      <div className="bg-white rounded-2xl border p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-500" />
          Formations adaptées
        </h3>
        <div className="space-y-2">
          {result.recommendations.formations.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5 shrink-0 text-violet-500">→</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Détail profils (accordion) */}
      {[primary, secondary].map((prof) => (
        <div key={prof.name} className="bg-white rounded-2xl border overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
            onClick={() => setExpanded(expanded === prof.name ? null : prof.name)}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{prof.emoji}</span>
              <div>
                <span className="font-bold text-sm" style={{ color: prof.color }}>{prof.name}</span>
                <p className="text-xs text-muted-foreground">{prof.tagline}</p>
              </div>
            </div>
            {expanded === prof.name
              ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
              : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {expanded === prof.name && (
            <div className="px-4 pb-4 space-y-3 border-t bg-muted/10">
              <p className="text-xs text-muted-foreground leading-relaxed pt-3">{prof.description}</p>
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Métiers :</p>
                <div className="flex flex-wrap gap-1.5">
                  {prof.careers.map((c, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Formations :</p>
                <div className="flex flex-wrap gap-1.5">
                  {prof.formations.map((f, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

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
        <Link href="/emploi/tests/afri-skill" className="flex-1">
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-bold shadow-lg hover:scale-[1.01] transition-transform"
            style={{ background: "linear-gradient(135deg, var(--afri-teal), #1a7a60)" }}>
            Passer AFRI-SKILL <ArrowRight className="w-4 h-4" />
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
