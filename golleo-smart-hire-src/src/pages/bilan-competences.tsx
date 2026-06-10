import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight, ChevronLeft, Plus, Trash2, Sparkles,
  CheckCircle2, TrendingUp, Briefcase, BookOpen, ArrowRight, RotateCcw
} from "lucide-react";

type Poste = { poste: string; entreprise: string; duree: string; missions: string };
type FormData = {
  situation: string; secteur: string; niveauEtudes: string;
  postes: Poste[];
  competencesTech: string; competencesTrans: string; langues: string;
  courtTerme: string; moyenTerme: string; contraintes: string;
};
type Result = {
  profilProfessionnel?: string;
  competencesCles?: string[];
  pistesMetiers?: Array<{ metier: string; compatibilite: number; description: string; formation: string }>;
  forcesAtouts?: string[];
  pointsVigilance?: string[];
  planAction?: Array<{ etape: string; duree: string; action: string; ressources: string }>;
  formationsRecommandees?: string[];
  dispositifsAides?: string[];
  synthese?: string;
};

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
const STEPS = ["Situation", "Parcours", "Compétences", "Objectifs", "Analyse"];

export default function BilanCompetences() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [form, setForm] = useState<FormData>({
    situation: "", secteur: "", niveauEtudes: "",
    postes: [{ poste: "", entreprise: "", duree: "", missions: "" }],
    competencesTech: "", competencesTrans: "", langues: "",
    courtTerme: "", moyenTerme: "", contraintes: "",
  });

  const upd = (k: keyof FormData, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const updPoste = (i: number, k: keyof Poste, v: string) =>
    setForm(f => { const p = [...f.postes]; p[i] = { ...p[i], [k]: v }; return { ...f, postes: p }; });

  async function analyze() {
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/bilan/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          informations: { situation: form.situation, secteur: form.secteur, niveauEtudes: form.niveauEtudes },
          parcours: form.postes.filter(p => p.poste),
          competences: {
            techniques: form.competencesTech.split(",").map(s => s.trim()).filter(Boolean),
            transversales: form.competencesTrans.split(",").map(s => s.trim()).filter(Boolean),
            langues: form.langues,
          },
          objectifs: { court_terme: form.courtTerme, moyen_terme: form.moyenTerme, contraintes: form.contraintes },
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
      setStep(4);
    } catch {
      setResult({ synthese: "Une erreur est survenue lors de l'analyse." });
      setStep(4);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <Sparkles className="h-6 w-6 text-primary absolute inset-0 m-auto" />
      </div>
      <div className="text-center">
        <p className="font-semibold">Analyse de votre bilan en cours...</p>
        <p className="text-sm text-muted-foreground mt-1">Notre IA analyse votre parcours complet</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold">Bilan de compétences</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analyse complète de votre parcours pour identifier vos atouts et définir votre projet professionnel.
        </p>
      </div>

      {/* Progress steps */}
      {step < 4 && (
        <div className="flex items-center gap-0">
          {STEPS.slice(0, 4).map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-1.5 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`h-6 w-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  i < step ? "bg-primary text-white" : i === step ? "bg-primary/20 text-primary border border-primary" : "bg-muted"
                }`}>{i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}</div>
                <span className="text-xs font-medium hidden sm:block">{s}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-px mx-2 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Step 0 — Situation */}
      {step === 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Votre situation actuelle</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Situation professionnelle actuelle</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.situation}
                onChange={(e) => upd("situation", e.target.value)}
              >
                <option value="">Sélectionner...</option>
                <option>En poste (CDI)</option>
                <option>En poste (CDD / mission)</option>
                <option>Demandeur d'emploi</option>
                <option>En reconversion professionnelle</option>
                <option>Indépendant / Freelance</option>
                <option>En formation / Étudiant</option>
                <option>Inactif (autre raison)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Secteur d'activité actuel ou passé</label>
              <Input placeholder="Ex: Informatique, Commerce, Santé..." value={form.secteur} onChange={(e) => upd("secteur", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Niveau d'études</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.niveauEtudes}
                onChange={(e) => upd("niveauEtudes", e.target.value)}
              >
                <option value="">Sélectionner...</option>
                <option>CAP / BEP</option>
                <option>BAC</option>
                <option>BAC+2 (BTS, DUT)</option>
                <option>BAC+3 (Licence)</option>
                <option>BAC+4 (Master 1)</option>
                <option>BAC+5 (Master, Ingénieur)</option>
                <option>BAC+6 et plus (Doctorat)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1 — Parcours */}
      {step === 1 && (
        <div className="space-y-4">
          {form.postes.map((poste, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Expérience {i + 1}</CardTitle>
                  {form.postes.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() =>
                      setForm(f => ({ ...f, postes: f.postes.filter((_, idx) => idx !== i) }))
                    }>
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Intitulé du poste</label>
                    <Input placeholder="Ex: Chef de projet" value={poste.poste} onChange={(e) => updPoste(i, "poste", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Entreprise</label>
                    <Input placeholder="Nom de l'entreprise" value={poste.entreprise} onChange={(e) => updPoste(i, "entreprise", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Durée</label>
                  <Input placeholder="Ex: 3 ans (2020-2023)" value={poste.duree} onChange={(e) => updPoste(i, "duree", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Missions principales</label>
                  <Textarea placeholder="Décrivez vos missions, responsabilités, réalisations..." className="min-h-20 text-sm resize-none" value={poste.missions} onChange={(e) => updPoste(i, "missions", e.target.value)} />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={() =>
            setForm(f => ({ ...f, postes: [...f.postes, { poste: "", entreprise: "", duree: "", missions: "" }] }))
          }>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une expérience
          </Button>
        </div>
      )}

      {/* Step 2 — Compétences */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Vos compétences</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Compétences techniques (séparées par des virgules)</label>
              <Textarea placeholder="Ex: Excel, Python, Management de projet, Photoshop, SQL..." className="min-h-20 resize-none text-sm" value={form.competencesTech} onChange={(e) => upd("competencesTech", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Compétences transversales / soft skills</label>
              <Textarea placeholder="Ex: Leadership, Communication, Organisation, Adaptabilité..." className="min-h-20 resize-none text-sm" value={form.competencesTrans} onChange={(e) => upd("competencesTrans", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Langues</label>
              <Input placeholder="Ex: Anglais B2, Espagnol A2..." value={form.langues} onChange={(e) => upd("langues", e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — Objectifs */}
      {step === 3 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Vos objectifs professionnels</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Objectif à court terme (0-1 an)</label>
              <Textarea placeholder="Que souhaitez-vous accomplir dans l'année ?" className="min-h-20 resize-none text-sm" value={form.courtTerme} onChange={(e) => upd("courtTerme", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Objectif à moyen terme (1-3 ans)</label>
              <Textarea placeholder="Où vous voyez-vous dans 3 ans ?" className="min-h-20 resize-none text-sm" value={form.moyenTerme} onChange={(e) => upd("moyenTerme", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Contraintes ou souhaits particuliers (optionnel)</label>
              <Input placeholder="Ex: mobilité géographique, télétravail, salaire minimum..." value={form.contraintes} onChange={(e) => upd("contraintes", e.target.value)} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4 — Results */}
      {step === 4 && result && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Synthèse de votre bilan</h3>
            <Button variant="outline" size="sm" onClick={() => { setStep(0); setResult(null); }}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Recommencer
            </Button>
          </div>

          {result.synthese && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-5">
                <p className="text-sm leading-relaxed">{result.synthese}</p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(result.forcesAtouts ?? []).length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Vos atouts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {(result.forcesAtouts ?? []).map((f, i) => (
                    <div key={i} className="flex gap-2 text-sm"><span className="text-emerald-500">•</span><span className="text-muted-foreground">{f}</span></div>
                  ))}
                </CardContent>
              </Card>
            )}
            {(result.competencesCles ?? []).length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Compétences clés identifiées</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {(result.competencesCles ?? []).map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {(result.pistesMetiers ?? []).length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" />Pistes professionnelles recommandées</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {(result.pistesMetiers ?? []).map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-40 flex-shrink-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium truncate">{p.metier}</span>
                        <span className="text-primary font-bold">{p.compatibilite}%</span>
                      </div>
                      <Progress value={p.compatibilite} className="h-1.5" />
                    </div>
                    <div className="flex-1 text-xs text-muted-foreground">
                      <p>{p.description}</p>
                      {p.formation && <p className="mt-0.5 text-primary/70">Formation: {p.formation}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(result.planAction ?? []).length > 0 && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Plan d'action recommandé</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {(result.planAction ?? []).map((p, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</div>
                    <div className="flex-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.etape}</span>
                        {p.duree && <Badge variant="outline" className="text-xs">{p.duree}</Badge>}
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">{p.action}</p>
                      {p.ressources && <p className="text-primary/70 text-xs mt-0.5">{p.ressources}</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(result.formationsRecommandees ?? []).length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Formations recommandées</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {(result.formationsRecommandees ?? []).map((f, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {(result.dispositifsAides ?? []).length > 0 && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Dispositifs d'aide (France)</CardTitle></CardHeader>
                <CardContent className="space-y-1.5">
                  {(result.dispositifsAides ?? []).map((d, i) => (
                    <div key={i} className="flex gap-2 text-xs"><span className="text-primary">•</span><span className="text-muted-foreground">{d}</span></div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>
          {step < 3 ? (
            <Button onClick={() => setStep(s => s + 1)}>
              Suivant
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={analyze}>
              <Sparkles className="h-4 w-4 mr-2" />
              Générer mon bilan
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
