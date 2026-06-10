import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, CheckCircle2, XCircle, GraduationCap,
  ClipboardList, Info, RotateCcw, ChevronRight
} from "lucide-react";

type Result = {
  eligible?: boolean;
  scoreMaturite?: number;
  conditionsRemplies?: string[];
  conditionsManquantes?: string[];
  diplomesCompatibles?: Array<{ diplome: string; niveau: string; organisme: string; compatibilite: number }>;
  etapesVAE?: Array<{ etape: string; description: string; duree: string; organisme: string }>;
  documentsNecessaires?: string[];
  conseilsLivet1?: string[];
  organismes?: string[];
  financement?: string[];
  synthese?: string;
};

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

const DOMAINES = [
  "Informatique & Numérique", "Commerce & Vente", "Management & RH",
  "Santé & Social", "Bâtiment & Construction", "Industrie & Production",
  "Transport & Logistique", "Hôtellerie & Restauration",
  "Arts & Communication", "Comptabilité & Finance", "Enseignement & Formation",
  "Agriculture & Environnement",
];

export default function EvaluationAcquis() {
  const [form, setForm] = useState({
    domaine: "",
    annees: "",
    description: "",
    diplomeCible: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!form.domaine || !form.annees || !form.description) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/bilan/vae`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domaine: form.domaine,
          anneesDExperience: parseFloat(form.annees),
          descriptionExperience: form.description,
          diplomeCible: form.diplomeCible || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <GraduationCap className="h-6 w-6 text-primary absolute inset-0 m-auto" />
      </div>
      <div className="text-center">
        <p className="font-semibold">Analyse VAE en cours...</p>
        <p className="text-sm text-muted-foreground mt-1">Évaluation de votre éligibilité à la VAE</p>
      </div>
    </div>
  );

  if (result) return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Rapport d'évaluation VAE</h2>
        <Button variant="outline" size="sm" onClick={() => setResult(null)}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Nouvelle analyse
        </Button>
      </div>

      {/* Eligibilité + score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className={result.eligible ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-400/30 bg-red-400/5"}>
          <CardContent className="py-5">
            <div className="flex items-center gap-3">
              {result.eligible
                ? <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                : <XCircle className="h-8 w-8 text-red-400" />
              }
              <div>
                <div className={`text-lg font-bold ${result.eligible ? "text-emerald-600" : "text-red-500"}`}>
                  {result.eligible ? "Éligible à la VAE" : "Non éligible pour l'instant"}
                </div>
                <div className="text-xs text-muted-foreground">Statut d'éligibilité</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5 text-center">
            <div className={`text-4xl font-bold ${
              (result.scoreMaturite ?? 0) >= 70 ? "text-emerald-500" : (result.scoreMaturite ?? 0) >= 40 ? "text-amber-500" : "text-red-500"
            }`}>{result.scoreMaturite ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">Score de maturité du dossier</div>
            <Progress value={result.scoreMaturite} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Synthèse */}
      {result.synthese && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-5">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{result.synthese}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(result.conditionsRemplies ?? []).length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Conditions remplies</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {(result.conditionsRemplies ?? []).map((c, i) => (
                <div key={i} className="flex gap-2 text-sm"><span className="text-emerald-500">✓</span><span className="text-muted-foreground">{c}</span></div>
              ))}
            </CardContent>
          </Card>
        )}
        {(result.conditionsManquantes ?? []).length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-amber-500" />Conditions à compléter</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {(result.conditionsManquantes ?? []).map((c, i) => (
                <div key={i} className="flex gap-2 text-sm"><span className="text-amber-500">!</span><span className="text-muted-foreground">{c}</span></div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Diplômes compatibles */}
      {(result.diplomesCompatibles ?? []).length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" />Diplômes compatibles avec votre profil</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(result.diplomesCompatibles ?? []).map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{d.diplome}</span>
                    <Badge variant="outline" className="text-xs">{d.niveau}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{d.organisme}</p>
                </div>
                <div className="text-right flex-shrink-0 w-16">
                  <div className="text-sm font-bold text-primary">{d.compatibilite}%</div>
                  <Progress value={d.compatibilite} className="h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Étapes VAE */}
      {(result.etapesVAE ?? []).length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />Étapes du parcours VAE</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(result.etapesVAE ?? []).map((e, i) => (
              <div key={i} className="flex gap-3">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{e.etape}</span>
                    {e.duree && <Badge variant="outline" className="text-xs">{e.duree}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{e.description}</p>
                  {e.organisme && <p className="text-xs text-primary/70 mt-0.5">{e.organisme}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(result.financement ?? []).length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Financement disponible</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {(result.financement ?? []).map((f, i) => (
                <div key={i} className="flex gap-2 text-xs"><span className="text-primary">•</span><span className="text-muted-foreground">{f}</span></div>
              ))}
            </CardContent>
          </Card>
        )}
        {(result.organismes ?? []).length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Organismes d'accompagnement</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {(result.organismes ?? []).map((o, i) => (
                <div key={i} className="flex gap-2 text-xs"><span className="text-primary">•</span><span className="text-muted-foreground">{o}</span></div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold">Évaluation des acquis — VAE</h2>
        <p className="text-sm text-muted-foreground mt-1">
          La Validation des Acquis de l'Expérience (VAE) permet d'obtenir un diplôme grâce à votre expérience professionnelle. Évaluez votre éligibilité.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">Condition principale VAE :</strong> Justifier d'au moins 1 an d'expérience (en activité salariée, non salariée ou bénévole) en lien avec le diplôme visé.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Domaine d'activité <span className="text-red-400">*</span></label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.domaine}
              onChange={(e) => setForm(f => ({ ...f, domaine: e.target.value }))}
            >
              <option value="">Sélectionner votre domaine...</option>
              {DOMAINES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Années d'expérience dans ce domaine <span className="text-red-400">*</span></label>
            <Input
              type="number"
              min="0"
              step="0.5"
              placeholder="Ex: 3"
              value={form.annees}
              onChange={(e) => setForm(f => ({ ...f, annees: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description de votre expérience <span className="text-red-400">*</span></label>
            <Textarea
              placeholder="Décrivez vos missions, responsabilités, réalisations, contexte professionnel... Plus votre description est précise, meilleure sera l'évaluation."
              className="min-h-32 resize-none text-sm"
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Diplôme cible (optionnel)</label>
            <Input
              placeholder="Ex: BTS Management Commercial Opérationnel, Licence professionnelle..."
              value={form.diplomeCible}
              onChange={(e) => setForm(f => ({ ...f, diplomeCible: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button className="w-full" size="lg" onClick={analyze}>
        <Sparkles className="h-4 w-4 mr-2" />
        Évaluer mon éligibilité VAE
      </Button>
    </div>
  );
}
