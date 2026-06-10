import { useState } from "react";
import { useGetCareerRecommendations, useListCandidates } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Sparkles, Briefcase, BookOpen, TrendingUp, ArrowRight } from "lucide-react";

type CareerJob = { title: string; sector: string; matchScore: number; description: string; growthPotential: string };
type Formation = { title: string; provider: string; duration: string; relevance: string };
type Recommendations = {
  recommendedJobs: CareerJob[];
  recommendedFormations: Formation[];
  skillsToAcquire: string[];
  reconversionPaths: string[];
  summary: string;
};

export default function Parcours() {
  const { toast } = useToast();
  const [candidateId, setCandidateId] = useState("");
  const [aspirations, setAspirations] = useState("");
  const [mobility, setMobility] = useState("");
  const [recs, setRecs] = useState<Recommendations | null>(null);

  const { data: candidates } = useListCandidates();
  const getRecommendations = useGetCareerRecommendations();

  function handleGenerate() {
    if (!candidateId) {
      toast({ title: "Veuillez sélectionner un candidat", variant: "destructive" });
      return;
    }
    setRecs(null);
    getRecommendations.mutate({ data: { candidateId: Number(candidateId), aspirations: aspirations || undefined, geographicMobility: mobility || undefined } }, {
      onSuccess: (data) => setRecs(data as unknown as Recommendations),
      onError: () => toast({ title: "Erreur lors de la génération", variant: "destructive" }),
    });
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Parcours de carrière IA</h2>
        <p className="text-muted-foreground text-sm mt-1">Recommandations personnalisées de métiers, formations et reconversions</p>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Candidat</Label>
              <Select onValueChange={v => { setCandidateId(v); setRecs(null); }}>
                <SelectTrigger className="mt-1" data-testid="select-candidate"><SelectValue placeholder="Choisir un candidat" /></SelectTrigger>
                <SelectContent>{candidates?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName} — {c.country}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mobilité géographique</Label>
              <input className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={mobility} onChange={e => setMobility(e.target.value)} placeholder="Ex: Dakar, Paris, sous-région..." data-testid="input-mobility" />
            </div>
          </div>
          <div>
            <Label>Aspirations et objectifs</Label>
            <Textarea value={aspirations} onChange={e => setAspirations(e.target.value)} placeholder="Décrivez les ambitions et objectifs du candidat..." rows={3} className="mt-1" data-testid="textarea-aspirations" />
          </div>
          <Button onClick={handleGenerate} disabled={getRecommendations.isPending || !candidateId} data-testid="button-generate">
            <Sparkles className="h-4 w-4 mr-2" />
            {getRecommendations.isPending ? "Génération en cours..." : "Générer les recommandations"}
          </Button>
        </CardContent>
      </Card>

      {getRecommendations.isPending && (
        <Card>
          <CardContent className="py-16 text-center">
            <MapPin className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Analyse du profil et génération des recommandations...</p>
          </CardContent>
        </Card>
      )}

      {recs && (
        <div className="space-y-5">
          {recs.summary && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-4 text-sm text-foreground leading-relaxed">{recs.summary}</CardContent>
            </Card>
          )}

          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />Métiers recommandés</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recs.recommendedJobs.map((job, i) => (
                <Card key={i} data-testid={`card-job-rec-${i}`}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.sector}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-primary">{job.matchScore}%</div>
                        <div className="text-xs text-muted-foreground">match</div>
                      </div>
                    </div>
                    <Progress value={job.matchScore} className="h-1.5 mb-3" />
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                    {job.growthPotential && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700">
                        <TrendingUp className="h-3.5 w-3.5" />{job.growthPotential}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" />Formations recommandées</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {recs.recommendedFormations.map((f, i) => (
                  <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                    <p className="font-medium text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.provider} • {f.duration}</p>
                    <p className="text-xs text-primary mt-1">{f.relevance}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Compétences à acquérir</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {recs.skillsToAcquire.map((s, i) => <Badge key={i} variant="outline">{s}</Badge>)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />Reconversions possibles</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {recs.reconversionPaths.map((p, i) => <p key={i} className="text-sm text-muted-foreground">• {p}</p>)}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {!recs && !getRecommendations.isPending && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground">Générez des recommandations personnalisées</p>
            <p className="text-sm text-muted-foreground mt-1">Sélectionnez un candidat et cliquez sur "Générer"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
