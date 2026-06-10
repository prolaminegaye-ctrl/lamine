// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — TestResults Premium
//  Design captivant : vert forêt · or africain · crème · terracotta
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from "recharts";
import {
  CheckCircle2, TrendingUp, Briefcase, BookOpen, ArrowRight,
  RotateCcw, Download, Loader2, Star, Zap, Target,
} from "lucide-react";

type Analysis = Record<string, unknown>;

type Props = {
  testType: string;
  scores: Record<string, number>;
  aiAnalysis: Analysis;
  categoryLabels: Record<string, string>;
  aiMode?: "claude" | "local";
  onRetake?: () => void;
  onNext?: () => void;
};

function str(v: unknown): string { return String(v ?? ""); }
function has(v: unknown): boolean { return Boolean(v); }
function asStrArr(v: unknown): string[] { return Array.isArray(v) ? (v as string[]) : []; }

const TEST_LABELS: Record<string, string> = {
  riasec: "Test RIASEC — Orientation Professionnelle",
  ikigai: "Test IKIGAI — Raison d'Être",
  personality: "Test Personnalité Professionnelle",
  entrepreneur_profile: "Profil Entrepreneur",
  project_maturity: "Maturité de Projet",
  ikigai_entrepreneur: "IKIGAI Entrepreneurial",
};

// Palette GolléO
const GOLLEO = {
  forest: "#1E3A2F",
  green: "#2E7D5B",
  gold: "#C8964E",
  cream: "#F2EDE3",
  terra: "#D6845A",
};

const SCORE_COLORS = [GOLLEO.gold, GOLLEO.green, GOLLEO.terra, "#5BB8E0", "#9B7EC8", "#E85D5D"];

export function TestResults({ testType, scores, aiAnalysis, categoryLabels, aiMode, onRetake, onNext }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  async function exportPDF() {
    if (!containerRef.current) return;
    setExporting(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);
      const canvas = await html2canvas(containerRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#F9F6F0",
        logging: false,
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const imgW = pageW - margin * 2;
      const imgH = (canvas.height * imgW) / canvas.width;

      let yPos = margin;
      let remaining = imgH;
      let srcY = 0;
      const pageContentH = pageH - margin * 2;

      while (remaining > 0) {
        const slice = Math.min(remaining, pageContentH);
        const sliceRatio = slice / imgH;
        const srcSliceH = canvas.height * sliceRatio;
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = srcSliceH;
        const ctx = sliceCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#F9F6F0";
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(canvas, 0, srcY, canvas.width, srcSliceH, 0, 0, canvas.width, srcSliceH);
        }
        pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, yPos, imgW, slice);
        srcY += srcSliceH;
        remaining -= slice;
        if (remaining > 0) { pdf.addPage(); yPos = margin; }
      }

      const label = TEST_LABELS[testType] ?? "Résultats GolléO";
      const date = new Date().toLocaleDateString("fr-FR");
      pdf.save(`GolleoO_${testType}_${date}.pdf`);
    } catch (e) {
      console.error("PDF export error", e);
    } finally {
      setExporting(false);
    }
  }

  const radarData = Object.entries(scores).map(([key, value]) => ({
    subject: categoryLabels[key] ?? key,
    value: Math.round(value),
  }));
  const barData = [...Object.entries(scores)]
    .sort(([, a], [, b]) => b - a)
    .map(([key, value], i) => ({
      key,
      subject: categoryLabels[key] ?? key,
      value: Math.round(value),
      color: SCORE_COLORS[i % SCORE_COLORS.length],
    }));

  const globalScore = has(aiAnalysis.globalScore) ? Number(aiAnalysis.globalScore) : null;
  const strengths = asStrArr(aiAnalysis.strengths ?? aiAnalysis.topSkills);
  const devAxes = asStrArr(aiAnalysis.developmentAxes ?? aiAnalysis.developmentAreas ?? aiAnalysis.vigilancePoints ?? aiAnalysis.weaknesses);
  const careers = asStrArr(aiAnalysis.careers);
  const formations = asStrArr(aiAnalysis.formations ?? aiAnalysis.recommendedSectors ?? aiAnalysis.sectors);
  const steps = asStrArr(aiAnalysis.nextSteps ?? aiAnalysis.developmentPlan ?? aiAnalysis.actionPlan ?? aiAnalysis.recommendations).slice(0, 4);

  const topProfiles = Array.isArray(aiAnalysis.topProfiles)
    ? (aiAnalysis.topProfiles as Array<{ type: string; label: string; score: number; description: string }>)
    : [];

  const roadmap = aiAnalysis.roadmap && typeof aiAnalysis.roadmap === "object"
    ? (aiAnalysis.roadmap as Record<string, string>) : null;

  return (
    <div ref={containerRef} className="space-y-5 max-w-3xl mx-auto animate-slide-up">

      {/* ── Bandeau résumé hero ── */}
      {has(aiAnalysis.summary) && (
        <div
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: GOLLEO.forest }}
        >
          {/* Motif africain */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23C8964E' stroke-width='0.8'%3E%3Cpath d='M20 4 L36 20 L20 36 L4 20 Z'/%3E%3Cpath d='M20 11 L29 20 L20 29 L11 20 Z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative">
            {/* Badge IA mode */}
            <div className="flex justify-end mb-3">
              {aiMode === "claude" ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(46,125,91,0.35)", color: "#7FFFC4", border: "1px solid rgba(46,125,91,0.5)" }}>
                  <Zap className="w-3 h-3" />Claude IA active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(200,150,78,0.15)", color: "rgba(200,150,78,0.7)", border: "1px solid rgba(200,150,78,0.25)" }}>
                  Analyse locale
                </span>
              )}
            </div>
            {/* Score global */}
            {globalScore !== null && (
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center"
                  style={{ background: "rgba(200,150,78,0.2)", border: "2px solid rgba(200,150,78,0.4)" }}
                >
                  <span className="text-2xl font-black" style={{ color: GOLLEO.gold }}>{globalScore}</span>
                  <span className="text-[10px] font-medium" style={{ color: "rgba(200,150,78,0.7)" }}>/100</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgba(242,237,227,0.5)" }}>
                    {TEST_LABELS[testType] ?? "Résultats"}
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5"
                        style={{
                          color: GOLLEO.gold,
                          fill: i < Math.round((globalScore / 100) * 5) ? GOLLEO.gold : "transparent",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(242,237,227,0.85)" }}>
              {str(aiAnalysis.summary)}
            </p>
          </div>
        </div>
      )}

      {/* ── Scores — radar + barres ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", border: "1px solid rgba(30,58,47,0.08)", boxShadow: "0 2px 16px rgba(30,58,47,0.05)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLLEO.forest }}>
            Radar des dimensions
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(30,58,47,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "rgba(30,58,47,0.6)" }} />
              <Radar
                name="Score"
                dataKey="value"
                stroke={GOLLEO.gold}
                fill={GOLLEO.gold}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Barres */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", border: "1px solid rgba(30,58,47,0.08)", boxShadow: "0 2px 16px rgba(30,58,47,0.05)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: GOLLEO.forest }}>
            Scores par dimension
          </p>
          <div className="space-y-3">
            {barData.slice(0, 6).map(({ subject, value, color }) => (
              <div key={subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium" style={{ color: "rgba(30,58,47,0.7)" }}>{subject}</span>
                  <span className="text-xs font-bold" style={{ color }}>{value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(30,58,47,0.07)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Profils dominants (RIASEC) ── */}
      {topProfiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {topProfiles.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{
                background: i === 0 ? GOLLEO.forest : "white",
                border: `1px solid ${i === 0 ? "transparent" : "rgba(30,58,47,0.08)"}`,
                boxShadow: "0 2px 12px rgba(30,58,47,0.06)",
              }}
            >
              {i === 0 && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ background: "rgba(200,150,78,0.2)", color: GOLLEO.gold }}
                >
                  Dominant
                </span>
              )}
              <div className="text-xl font-bold mb-0.5" style={{ color: i === 0 ? GOLLEO.gold : GOLLEO.forest }}>
                {p.label ?? p.type}
              </div>
              <div className="text-sm font-black mb-2" style={{ color: i === 0 ? "rgba(242,237,227,0.9)" : GOLLEO.green }}>
                {p.score}/100
              </div>
              <p className="text-xs leading-relaxed" style={{ color: i === 0 ? "rgba(242,237,227,0.6)" : "rgba(30,58,47,0.55)" }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Points forts & Axes de développement ── */}
      {(strengths.length > 0 || devAxes.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(46,125,91,0.05)", border: "1px solid rgba(46,125,91,0.15)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(46,125,91,0.15)" }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: GOLLEO.green }} />
                </div>
                <p className="text-sm font-bold" style={{ color: GOLLEO.forest }}>Points forts</p>
              </div>
              <div className="space-y-2">
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white"
                      style={{ background: GOLLEO.green }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm" style={{ color: "rgba(30,58,47,0.75)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {devAxes.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(200,150,78,0.05)", border: "1px solid rgba(200,150,78,0.18)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(200,150,78,0.15)" }}
                >
                  <TrendingUp className="w-4 h-4" style={{ color: GOLLEO.gold }} />
                </div>
                <p className="text-sm font-bold" style={{ color: GOLLEO.forest }}>
                  {testType === "project_maturity" ? "Axes d'amélioration" : "Développement"}
                </p>
              </div>
              <div className="space-y-2">
                {devAxes.map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white"
                      style={{ background: GOLLEO.gold }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm" style={{ color: "rgba(30,58,47,0.75)" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Métiers recommandés ── */}
      {careers.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", border: "1px solid rgba(30,58,47,0.08)", boxShadow: "0 2px 12px rgba(30,58,47,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(214,132,90,0.15)" }}
            >
              <Briefcase className="w-4 h-4" style={{ color: GOLLEO.terra }} />
            </div>
            <p className="text-sm font-bold" style={{ color: GOLLEO.forest }}>Métiers recommandés</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {careers.map((c, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: `${GOLLEO.terra}12`,
                  color: GOLLEO.terra,
                  border: `1px solid ${GOLLEO.terra}25`,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Formations & Étapes ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formations.length > 0 && (
          <div
            className="rounded-2xl p-5"
            style={{ background: "white", border: "1px solid rgba(30,58,47,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(91,184,224,0.15)" }}
              >
                <BookOpen className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-sm font-bold" style={{ color: GOLLEO.forest }}>Formations recommandées</p>
            </div>
            <div className="space-y-2">
              {formations.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "rgba(30,58,47,0.65)" }}>
                  <span className="shrink-0 mt-0.5" style={{ color: GOLLEO.gold }}>→</span>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div
            className="rounded-2xl p-5"
            style={{ background: GOLLEO.forest }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(200,150,78,0.2)" }}
              >
                <Zap className="w-4 h-4" style={{ color: GOLLEO.gold }} />
              </div>
              <p className="text-sm font-bold" style={{ color: "rgba(242,237,227,0.9)" }}>Prochaines étapes</p>
            </div>
            <div className="space-y-2.5">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                    style={{ background: "rgba(200,150,78,0.25)", color: GOLLEO.gold }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs leading-relaxed" style={{ color: "rgba(242,237,227,0.7)" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Roadmap ── */}
      {roadmap && (
        <div
          className="rounded-2xl p-5"
          style={{ background: "white", border: "1px solid rgba(30,58,47,0.08)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" style={{ color: GOLLEO.forest }} />
            <p className="text-sm font-bold" style={{ color: GOLLEO.forest }}>Roadmap sur 12 mois</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(roadmap).map(([quarter, desc], i) => (
              <div
                key={quarter}
                className="rounded-xl p-3"
                style={{ background: "rgba(30,58,47,0.04)", border: "1px solid rgba(30,58,47,0.06)" }}
              >
                <div
                  className="text-xs font-black uppercase mb-1"
                  style={{ color: SCORE_COLORS[i % SCORE_COLORS.length] }}
                >
                  {quarter}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(30,58,47,0.6)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex flex-wrap gap-3 pt-2">
        {onRetake && (
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all hover:bg-[#1E3A2F]/5"
            style={{ color: GOLLEO.forest, borderColor: "rgba(30,58,47,0.2)" }}
          >
            <RotateCcw className="w-4 h-4" />
            Refaire le test
          </button>
        )}
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all hover:bg-[#1E3A2F]/5"
          style={{ color: GOLLEO.forest, borderColor: "rgba(30,58,47,0.2)" }}
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? "Export en cours..." : "Télécharger le rapport"}
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${GOLLEO.gold}, #B07A35)`,
              boxShadow: "0 4px 16px rgba(200,150,78,0.35)",
            }}
          >
            Test suivant <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
