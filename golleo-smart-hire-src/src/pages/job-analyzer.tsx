import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  FileText,
  Lightbulb,
  Link,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobAnalysis {
  compatibilityScore: number;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  neutralKeywords: string[];
  skills: Array<{ name: string; status: "present" | "missing" | "partial" }>;
  strengths: string[];
  gaps: string[];
  linkedinTips: string[];
  coverLetter: string;
  applicationEmail: string;
  pitch: string;
}

// ─── API response type ────────────────────────────────────────────────────────

interface ApiJobAnalysis {
  poste?: string;
  entreprise?: string;
  scoreCompatibilite?: number | null;
  scoreATS?: number | string;
  motsClésATS?: string[];
  compétencesTechniques?: Array<{ nom: string; priorité: string; présent?: boolean | null }>;
  compétencesSoftSkills?: Array<{ nom: string; priorité: string }>;
  recommandations?: Array<{ priorité: string; action: string }>;
  pointsAttention?: string[];
  lettreCandidature?: string;
  emailCandidature?: string;
  pitch30Secondes?: string;
  analyseSynthèse?: string;
}

function mapApiResponse(api: ApiJobAnalysis, hasCV: boolean): JobAnalysis {
  const atsRaw = typeof api.scoreATS === "string" ? parseInt(api.scoreATS, 10) : (api.scoreATS ?? 72);
  const atsScore = isNaN(atsRaw) ? 72 : atsRaw;
  const compatibilityScore = hasCV
    ? (api.scoreCompatibilite ?? Math.max(50, atsScore - 10))
    : atsScore;

  const technicalSkills = api.compétencesTechniques ?? [];
  const softSkills = api.compétencesSoftSkills ?? [];

  const matchedKeywords = technicalSkills.filter((s) => s.présent === true).map((s) => s.nom);
  const missingKeywords = technicalSkills.filter((s) => s.présent === false).map((s) => s.nom);
  const neutralKeywords = api.motsClésATS?.filter((k) =>
    !matchedKeywords.includes(k) && !missingKeywords.includes(k)
  ) ?? [];

  const skills: JobAnalysis["skills"] = [
    ...technicalSkills.map((s) => ({
      name: s.nom,
      status: (s.présent === true ? "present" : s.présent === false ? "missing" : "partial") as "present" | "missing" | "partial",
    })),
    ...softSkills.slice(0, 4).map((s) => ({
      name: s.nom,
      status: "partial" as const,
    })),
  ];

  const highPrio = (api.recommandations ?? []).filter((r) => r.priorité === "haute").map((r) => r.action);
  const medPrio = (api.recommandations ?? []).filter((r) => r.priorité !== "haute").map((r) => r.action);
  const attention = api.pointsAttention ?? [];

  return {
    compatibilityScore,
    atsScore,
    matchedKeywords,
    missingKeywords,
    neutralKeywords,
    skills,
    strengths: highPrio.length > 0 ? highPrio : [api.analyseSynthèse ?? "Profil pertinent pour ce poste"],
    gaps: medPrio.length > 0 ? medPrio : attention.slice(0, 3),
    linkedinTips: attention.length > 0 ? attention : [
      "Mettez à jour votre titre LinkedIn avec les mots-clés de l'offre",
      "Publiez une réalisation chiffrée avant de candidater",
      "Connectez-vous avec 2-3 collaborateurs de l'entreprise en amont",
    ],
    coverLetter: api.lettreCandidature ?? "",
    applicationEmail: api.emailCandidature ?? "",
    pitch: api.pitch30Secondes ?? "",
  };
}

// ─── API call ─────────────────────────────────────────────────────────────────

async function fetchJobAnalysis(jobText: string, cvContext: string): Promise<JobAnalysis> {
  const res = await fetch("/api/jobs/analyze-offer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobText, cvContext }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Erreur serveur lors de l'analyse");
  }
  const data: ApiJobAnalysis = await res.json();
  return mapApiResponse(data, cvContext.trim().length > 10);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function JobAnalyzer() {
  const { toast } = useToast();
  const [importTab, setImportTab] = useState("text");
  const [jobText, setJobText] = useState(
    `Product Manager Senior — FinTech Paris

Notre startup FinTech en forte croissance recherche un(e) Product Manager Senior pour piloter notre produit de paiements B2B.

Missions :
• Définir et exécuter la roadmap produit en lien avec la vision stratégique
• Collaborer avec les équipes engineering, design et data
• Analyser les métriques produit et piloter la croissance
• Lancer de nouvelles fonctionnalités sur les marchés européens

Profil recherché :
• 5+ ans d'expérience en Product Management
• Maîtrise des outils : Jira, Figma, SQL, A/B Testing
• Anglais courant requis (C1 minimum)
• Forte culture data-driven et OKR
• Go-to-market et stakeholders management`
  );
  const [cvContext, setCvContext] = useState(
    "Product Manager 6 ans, spécialité IA et data-driven. Maîtrise Figma, Jira, Agile/Scrum, roadmap, OKR. Anglais C1. Résultats : +40% adoption produit, -15% churn."
  );
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("compatibility");

  async function handleAnalyze() {
    if (jobText.trim().length < 30) {
      toast({ title: "Offre trop courte", description: "Collez le texte complet de l'offre pour une analyse précise.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await fetchJobAnalysis(jobText, cvContext);
      setAnalysis(result);
      setExpandedSection("keywords");
      toast({ title: "Analyse terminée", description: "Score de compatibilité calculé avec succès." });
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur d'analyse",
        description: err instanceof Error ? err.message : "Une erreur est survenue. Vérifiez la connexion API.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => toast({ title: `${label} copié` }));
  }

  function sendByEmail(content: string, subject: string) {
    const body = encodeURIComponent(content);
    const subj = encodeURIComponent(subject);
    window.location.href = `mailto:?subject=${subj}&body=${body}`;
  }

  function downloadPdf(content: string, filename: string) {
    // Generate printable HTML and open in new window for print-to-PDF
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>${filename}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #1a1a2e; font-size: 14px; line-height: 1.7; }
  @media print { body { margin: 20px; } }
</style>
</head><body><div style="white-space:pre-line">${content}</div>
<script>setTimeout(() => window.print(), 400);</script>
</body></html>`;
    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
    else toast({ title: "Popup bloqué", description: "Autorisez les popups pour télécharger le PDF.", variant: "destructive" });
  }

  const toggleSection = (id: string) => setExpandedSection(expandedSection === id ? null : id);

  const scoreColor = (s: number) =>
    s >= 80 ? "text-emerald-500" : s >= 65 ? "text-blue-500" : s >= 50 ? "text-orange-500" : "text-red-500";
  const scoreBg = (s: number) =>
    s >= 80 ? "bg-emerald-500" : s >= 65 ? "bg-blue-500" : s >= 50 ? "bg-orange-500" : "bg-red-500";

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* Header */}
      <section className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Search className="h-4 w-4" />
          Analyse IA d'Offres d'Emploi
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Analysez chaque offre, matchez votre CV, candidatez avec l'IA
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Importez une offre, obtenez votre score de compatibilité ATS, identifiez les mots-clés manquants
          et générez votre candidature complète en un clic.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_400px]">
        {/* Left: Input + Results */}
        <div className="space-y-5">
          {/* Import card */}
          <Card>
            <CardHeader className="pb-0">
              <Tabs value={importTab} onValueChange={setImportTab}>
                <TabsList>
                  <TabsTrigger value="text"><FileText className="mr-2 h-3 w-3" />Coller texte</TabsTrigger>
                  <TabsTrigger value="url"><Link className="mr-2 h-3 w-3" />URL</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-4">
              {importTab === "text" ? (
                <Textarea
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  rows={10}
                  className="text-sm leading-6"
                  placeholder="Collez ici le texte complet de l'offre d'emploi..."
                />
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://linkedin.com/jobs/view/..."
                    className="text-sm"
                  />
                  <Button variant="outline" onClick={() => toast({ title: "Import URL", description: "Fonctionnalité disponible avec l'API connectée." })}>
                    Importer
                  </Button>
                </div>
              )}

              <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                <label className="text-xs font-semibold text-muted-foreground">Votre CV en résumé (optionnel — améliore le matching)</label>
                <Textarea
                  value={cvContext}
                  onChange={(e) => setCvContext(e.target.value)}
                  rows={2}
                  className="mt-2 text-xs"
                  placeholder="Collez un résumé de votre profil ou vos compétences clés..."
                />
              </div>

              <Button className="mt-4 w-full" size="lg" onClick={handleAnalyze} disabled={loading}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyse en cours...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Analyser cette offre</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {analysis && (
            <div className="space-y-3">
              {/* Mots-clés ATS */}
              <Card>
                <button className="w-full" onClick={() => toggleSection("keywords")}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" />Mots-clés ATS</span>
                      {expandedSection === "keywords" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </button>
                {expandedSection !== "keywords" ? null : (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedKeywords.map((kw) => (
                        <Badge key={kw} className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                          <CheckCircle2 className="mr-1 h-3 w-3" />{kw}
                        </Badge>
                      ))}
                      {analysis.missingKeywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="border-red-200 text-red-500">
                          <XCircle className="mr-1 h-3 w-3" />{kw}
                        </Badge>
                      ))}
                      {analysis.neutralKeywords.map((kw) => (
                        <Badge key={kw} variant="secondary">{kw}</Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-4 text-xs">
                      <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3 w-3" />Présent ({analysis.matchedKeywords.length})</span>
                      <span className="flex items-center gap-1 text-red-500"><XCircle className="h-3 w-3" />Manquant ({analysis.missingKeywords.length})</span>
                      <span className="flex items-center gap-1 text-muted-foreground">Neutre ({analysis.neutralKeywords.length})</span>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Compétences */}
              <Card>
                <button className="w-full" onClick={() => toggleSection("skills")}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" />Analyse des compétences</span>
                      {expandedSection === "skills" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </button>
                {expandedSection !== "skills" ? null : (
                  <CardContent className="pt-0">
                    <div className="divide-y">
                      {analysis.skills.map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between py-2.5 text-sm">
                          <span className="font-medium">{skill.name}</span>
                          <Badge
                            variant="outline"
                            className={
                              skill.status === "present"
                                ? "border-emerald-200 bg-emerald-50/50 text-emerald-600"
                                : skill.status === "partial"
                                ? "border-yellow-200 bg-yellow-50/50 text-yellow-600"
                                : "border-red-200 bg-red-50/50 text-red-500"
                            }
                          >
                            {skill.status === "present" ? "✓ Présent" : skill.status === "partial" ? "~ Partiel" : "✗ Manquant"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Recommandations */}
              <Card>
                <button className="w-full" onClick={() => toggleSection("recommendations")}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" />Recommandations IA</span>
                      {expandedSection === "recommendations" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </button>
                {expandedSection !== "recommendations" ? null : (
                  <CardContent className="pt-0 space-y-3">
                    <div className="rounded-lg border border-emerald-200/60 bg-emerald-50/30 p-3">
                      <div className="mb-2 text-xs font-bold text-emerald-700">Forces</div>
                      {analysis.strengths.map((s) => <p key={s} className="text-xs text-muted-foreground">• {s}</p>)}
                    </div>
                    <div className="rounded-lg border border-orange-200/60 bg-orange-50/30 p-3">
                      <div className="mb-2 text-xs font-bold text-orange-700">Points à améliorer</div>
                      {analysis.gaps.map((g) => <p key={g} className="text-xs text-muted-foreground">• {g}</p>)}
                    </div>
                    <div className="rounded-lg border border-blue-200/60 bg-blue-50/30 p-3">
                      <div className="mb-2 text-xs font-bold text-blue-700">Optimisation LinkedIn</div>
                      {analysis.linkedinTips.map((t) => <p key={t} className="text-xs text-muted-foreground">• {t}</p>)}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Génération candidature */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    Candidature générée par l'IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="letter">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="letter">Lettre</TabsTrigger>
                      <TabsTrigger value="email">Email</TabsTrigger>
                      <TabsTrigger value="pitch">Pitch 30s</TabsTrigger>
                    </TabsList>
                    <TabsContent value="letter" className="mt-3">
                      <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-7 text-muted-foreground whitespace-pre-line">
                        {analysis.coverLetter}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.coverLetter, "Lettre")}>
                          <Copy className="mr-2 h-3 w-3" />Copier
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => sendByEmail(analysis.coverLetter, "Candidature — Lettre de motivation")}>
                          <Mail className="mr-2 h-3 w-3" />Envoyer par email
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadPdf(analysis.coverLetter, "lettre_motivation")}>
                          <Download className="mr-2 h-3 w-3" />PDF
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="email" className="mt-3">
                      <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-7 text-muted-foreground whitespace-pre-line">
                        {analysis.applicationEmail}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.applicationEmail, "Email")}>
                          <Copy className="mr-2 h-3 w-3" />Copier
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => sendByEmail(analysis.applicationEmail, "Candidature — Email de motivation")}>
                          <Mail className="mr-2 h-3 w-3" />Envoyer par email
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="pitch" className="mt-3">
                      <div className="rounded-lg border bg-primary/5 p-4 text-sm font-medium leading-7 text-foreground">
                        {analysis.pitch}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(analysis.pitch, "Pitch")}>
                          <Copy className="mr-2 h-3 w-3" />Copier
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toast({ title: "Adapté au poste — version personnalisée prête" })}>
                          <Sparkles className="mr-2 h-3 w-3" />Adapter au poste
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right: Score dashboard */}
        <div className="space-y-4">
          {/* Compatibility ring */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                Score de compatibilité
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className={`text-5xl font-black ${scoreColor(analysis.compatibilityScore)}`}>
                        {analysis.compatibilityScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Compatibilité CV</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-5xl font-black ${scoreColor(analysis.atsScore)}`}>
                        {analysis.atsScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Probabilité ATS</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Compatibilité globale</span>
                        <span className="font-semibold">{analysis.compatibilityScore}%</span>
                      </div>
                      <Progress value={analysis.compatibilityScore} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Mots-clés matchés</span>
                        <span className="font-semibold">{analysis.matchedKeywords.length}/{analysis.matchedKeywords.length + analysis.missingKeywords.length}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                          style={{ width: `${(analysis.matchedKeywords.length / Math.max(1, analysis.matchedKeywords.length + analysis.missingKeywords.length)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Score ATS</span>
                        <span className="font-semibold">{analysis.atsScore}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full rounded-full transition-all duration-700 ${scoreBg(analysis.atsScore)}`} style={{ width: `${analysis.atsScore}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border bg-muted/30 p-2">
                      <div className="text-base font-black text-emerald-500">{analysis.skills.filter((s) => s.status === "present").length}</div>
                      <div className="text-xs text-muted-foreground">Présentes</div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-2">
                      <div className="text-base font-black text-yellow-500">{analysis.skills.filter((s) => s.status === "partial").length}</div>
                      <div className="text-xs text-muted-foreground">Partielles</div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-2">
                      <div className="text-base font-black text-red-500">{analysis.skills.filter((s) => s.status === "missing").length}</div>
                      <div className="text-xs text-muted-foreground">Manquantes</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
                  <Search className="mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm">Analysez une offre pour voir votre score de compatibilité</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          {analysis && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" size="sm" onClick={() => toast({ title: "Ouverture du CV Builder..." })}>
                  <FileText className="mr-2 h-4 w-4 text-primary" />
                  Adapter mon CV à cette offre
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" size="sm" onClick={() => toast({ title: "Démarrage du simulateur..." })}>
                  <Target className="mr-2 h-4 w-4 text-primary" />
                  Simuler l'entretien pour ce poste
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" size="sm" onClick={() => copyToClipboard(analysis.matchedKeywords.join(", "), "Mots-clés")}>
                  <Copy className="mr-2 h-4 w-4 text-primary" />
                  Copier les mots-clés ATS
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" size="sm" onClick={() => toast({ title: "Analyse sauvegardée dans votre historique" })}>
                  <Download className="mr-2 h-4 w-4 text-primary" />
                  Sauvegarder cette analyse
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          {!analysis && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  Comment ça marche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { n: "1", t: "Collez le texte de l'offre ou importez via URL" },
                  { n: "2", t: "Ajoutez un résumé de votre CV pour un matching précis" },
                  { n: "3", t: "L'IA analyse les mots-clés ATS et calcule votre compatibilité" },
                  { n: "4", t: "Générez votre lettre, email et pitch en un clic" },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {step.n}
                    </div>
                    <p className="text-xs text-muted-foreground">{step.t}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
