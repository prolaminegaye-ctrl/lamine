import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from "recharts";
import {
  Sparkles, Compass, Target, Brain, Rocket, FlaskConical,
  ArrowRight, CheckCircle2, Clock, TrendingUp, RefreshCw,
  BarChart3, Loader2, Trophy, Zap,
} from "lucide-react";

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

const TEST_META: Record<string, { label: string; icon: typeof Compass; color: string; shortLabel: string }> = {
  riasec:               { label: "AFRI-CODE",                  icon: Compass,      color: "text-blue-500",    shortLabel: "AFRI-CODE" },
  ikigai:               { label: "Test IKIGAI",               icon: Target,       color: "text-indigo-500",  shortLabel: "IKIGAI" },
  personality:          { label: "Personnalité Professionnelle", icon: Brain,      color: "text-violet-500",  shortLabel: "Personnalité" },
  entrepreneur_profile: { label: "Profil Entrepreneur",       icon: Rocket,       color: "text-orange-500",  shortLabel: "Entrepreneur" },
  project_maturity:     { label: "Maturité de Projet",        icon: FlaskConical, color: "text-emerald-500", shortLabel: "Maturité" },
  ikigai_entrepreneur:  { label: "IKIGAI Entrepreneurial",    icon: Target,       color: "text-rose-500",    shortLabel: "IKIGAI Pro" },
};

const TEST_HREFS: Record<string, string> = {
  riasec:               "/emploi/tests/riasec",
  ikigai:               "/emploi/tests/ikigai",
  personality:          "/emploi/tests/personnalite",
  entrepreneur_profile: "/entrepreneur/tests/profil",
  project_maturity:     "/entrepreneur/tests/projet",
  ikigai_entrepreneur:  "/entrepreneur/tests/ikigai",
};

const ALL_EMPLOI_TESTS = ["riasec", "ikigai", "personality"];

type TestResult = {
  id: number;
  testType: string;
  scores: Record<string, number>;
  aiAnalysis: Record<string, unknown>;
  createdAt: string;
};

type EmployabilityReport = {
  scoreEmployabilite?: number;
  niveau?: string;
  tendance?: string;
  dimensionsScore?: Record<string, number>;
  atouts?: string[];
  prioritesAction?: string[];
  testsSuggeres?: string[];
  synthese?: string;
  message?: string;
  prochainEtape?: string;
};

const DIMENSION_LABELS: Record<string, string> = {
  clarteProjet: "Clarté du projet",
  competencesIdentifiees: "Compétences identifiées",
  confianceEnSoi: "Confiance en soi",
  adaptabilite: "Adaptabilité",
  potentielEntrepreneurial: "Potentiel entrepreneurial",
};

function scoreColor(s: number) {
  if (s >= 75) return "text-emerald-500";
  if (s >= 50) return "text-amber-500";
  return "text-red-500";
}

function niveauColor(n: string) {
  if (n === "Expert" || n === "Confirmé") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (n === "Intermédiaire") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  return "bg-amber-500/10 text-amber-600 border-amber-500/20";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function getTopScores(scores: Record<string, number>): { label: string; value: number }[] {
  return Object.entries(scores)
    .map(([k, v]) => ({ label: k, value: Math.round(v) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
}

export default function TableauDeBord() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [report, setReport] = useState<EmployabilityReport | null>(null);
  const [loadingResults, setLoadingResults] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("sht_session") ?? "";
    setSessionToken(token);
    if (!token) { setLoadingResults(false); return; }
    fetchResults(token);
  }, []);

  async function fetchResults(token: string) {
    setLoadingResults(true);
    try {
      const res = await fetch(`${BASE}/api/dashboard/emploi?sessionToken=${encodeURIComponent(token)}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoadingResults(false);
    }
  }

  async function computeScore() {
    if (!sessionToken || results.length === 0) return;
    setLoadingReport(true);
    try {
      const res = await fetch(`${BASE}/api/dashboard/emploi/employability-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken }),
      });
      if (!res.ok) throw new Error();
      setReport(await res.json());
    } catch {
      setReport({ scoreEmployabilite: 0, synthese: "Erreur lors du calcul." });
    } finally {
      setLoadingReport(false);
    }
  }

  const completedTypes = new Set(results.map((r) => r.testType));
  const completedEmploiTests = ALL_EMPLOI_TESTS.filter((t) => completedTypes.has(t));
  const progression = Math.round((completedEmploiTests.length / ALL_EMPLOI_TESTS.length) * 100);

  // Build combined radar from all test scores
  const allScoreKeys = new Set<string>();
  results.forEach((r) => Object.keys(r.scores ?? {}).forEach((k) => allScoreKeys.add(k)));
  const combinedRadar = Array.from(allScoreKeys).slice(0, 8).map((k) => {
    const vals = results.map((r) => r.scores?.[k]).filter((v) => v != null) as number[];
    const avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
    return { subject: k.slice(0, 12), value: avg };
  });

  if (loadingResults) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Chargement de votre tableau de bord...</p>
      </div>
    );
  }

  if (!sessionToken) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <Brain className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-lg font-bold">Aucune session détectée</h2>
        <p className="text-sm text-muted-foreground">Passez un test pour initialiser votre session et voir votre tableau de bord.</p>
        <Link href="/emploi/tests/riasec">
          <Button className="mt-2">
            Commencer le test <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">Tableau de bord</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {results.length === 0
              ? "Aucun test complété — commencez votre parcours"
              : `${results.length} test${results.length > 1 ? "s" : ""} complété${results.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchResults(sessionToken)}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Progression parcours */}
      <Card>
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Progression du parcours emploi</span>
            </div>
            <span className="text-sm font-bold text-primary">{completedEmploiTests.length}/{ALL_EMPLOI_TESTS.length} tests</span>
          </div>
          <Progress value={progression} className="h-2 mb-4" />
          <div className="grid grid-cols-3 gap-3">
            {ALL_EMPLOI_TESTS.map((type) => {
              const meta = TEST_META[type];
              const done = completedTypes.has(type);
              const Icon = meta.icon;
              return (
                <div
                  key={type}
                  className={`flex items-center gap-2 rounded-lg p-3 border transition-all ${
                    done ? "bg-primary/5 border-primary/20" : "bg-muted/20 border-transparent"
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{meta.shortLabel}</p>
                    {done
                      ? <p className="text-xs text-emerald-500">Complété</p>
                      : (
                        <Link href={TEST_HREFS[type]}>
                          <span className="text-xs text-primary hover:underline cursor-pointer">Démarrer</span>
                        </Link>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {results.length === 0 ? (
        /* Empty state */
        <Card className="border-dashed">
          <CardContent className="py-14 text-center space-y-4">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <p className="font-semibold">Aucun test complété</p>
              <p className="text-sm text-muted-foreground mt-1">Commencez par AFRI-CODE pour découvrir votre profil professionnel.</p>
            </div>
            <Link href="/emploi/tests/riasec">
              <Button size="sm">
                Démarrer AFRI-CODE <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Score employabilité */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="py-6">
              {!report ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Trophy className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Score d'employabilité IA</p>
                      <p className="text-sm text-muted-foreground">Analyse croisée de vos {results.length} test{results.length > 1 ? "s" : ""} par GPT-4o</p>
                    </div>
                  </div>
                  <Button onClick={computeScore} disabled={loadingReport}>
                    {loadingReport ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyse en cours...</>
                    ) : (
                      <><Sparkles className="h-4 w-4 mr-2" />Calculer mon score</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Score + niveau */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center flex-shrink-0">
                      <div className={`text-6xl font-bold ${scoreColor(report.scoreEmployabilite ?? 0)}`}>
                        {report.scoreEmployabilite ?? "—"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">/ 100</div>
                      {report.niveau && (
                        <Badge className={`mt-2 text-xs border ${niveauColor(report.niveau)}`}>
                          {report.niveau}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      {report.message && (
                        <div className="flex items-start gap-2 mb-3">
                          <Zap className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-foreground italic">"{report.message}"</p>
                        </div>
                      )}
                      {report.synthese && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{report.synthese}</p>
                      )}
                    </div>
                  </div>

                  {/* Dimensions */}
                  {report.dimensionsScore && Object.keys(report.dimensionsScore).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(report.dimensionsScore).map(([k, v]) => (
                        <div key={k}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{DIMENSION_LABELS[k] ?? k}</span>
                            <span className={`font-bold ${scoreColor(v)}`}>{v}/100</span>
                          </div>
                          <Progress value={v} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {(report.atouts ?? []).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 mb-1.5">Atouts identifiés</p>
                        <div className="space-y-1">
                          {(report.atouts ?? []).map((a, i) => (
                            <div key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                              <span className="text-emerald-500 flex-shrink-0">•</span>{a}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(report.prioritesAction ?? []).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1.5">Priorités d'action</p>
                        <div className="space-y-1">
                          {(report.prioritesAction ?? []).map((p, i) => (
                            <div key={i} className="flex gap-1.5 text-xs text-muted-foreground">
                              <span className="text-primary flex-shrink-0">{i + 1}.</span>{p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {report.prochainEtape && (
                      <div className="bg-primary/5 rounded-lg p-3">
                        <p className="text-xs font-semibold text-primary mb-1">Prochaine étape</p>
                        <p className="text-xs text-muted-foreground">{report.prochainEtape}</p>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" onClick={computeScore} disabled={loadingReport}>
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                    Recalculer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Radar combiné + Historique */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {combinedRadar.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Radar global — tous tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={combinedRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                      <Radar name="Score" dataKey="value" stroke="hsl(239 84% 67%)" fill="hsl(239 84% 67%)" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Historique des tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {results.map((r) => {
                  const meta = TEST_META[r.testType] ?? { label: r.testType, icon: Brain, color: "text-primary", shortLabel: r.testType };
                  const Icon = meta.icon;
                  const topScores = getTopScores(r.scores ?? {});
                  const href = TEST_HREFS[r.testType];
                  return (
                    <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color.replace("text-", "bg-").replace("-500", "-500/10")}`}>
                        <Icon className={`h-4 w-4 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{meta.label}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatDate(r.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {topScores.map(({ label, value }) => (
                            <Badge key={label} variant="outline" className="text-xs px-1.5 py-0">
                              {label}: {value}
                            </Badge>
                          ))}
                        </div>
                        {Boolean(r.aiAnalysis?.summary) && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {String(r.aiAnalysis.summary).slice(0, 100)}...
                          </p>
                        )}
                      </div>
                      {href && (
                        <Link href={href}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Recommandations */}
          {report?.testsSuggeres && report.testsSuggeres.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Tests et bilans recommandés pour progresser
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {report.testsSuggeres.map((t, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Outils complémentaires */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Continuer votre parcours</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { href: "/emploi/bilan", label: "Bilan de compétences" },
                { href: "/emploi/vae", label: "Évaluation VAE" },
                { href: "/emploi/cv-analyse", label: "Analyse de CV" },
                { href: "/emploi/simulateur", label: "Simulateur entretien" },
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="bg-card border rounded-xl p-3 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <span className="text-xs font-medium">{link.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
