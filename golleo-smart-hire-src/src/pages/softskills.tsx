import { useState } from "react";
import { useAssessSoftSkills, useListSoftSkillsHistory, useListCandidates, getListSoftSkillsHistoryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Brain, Sparkles } from "lucide-react";

const SKILL_LABELS: Record<string, string> = {
  communication: "Communication",
  leadership: "Leadership",
  teamwork: "Travail en équipe",
  adaptability: "Adaptabilité",
  stressManagement: "Gestion du stress",
};

export default function SoftSkillsPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [candidateId, setCandidateId] = useState("");
  const [textSample, setTextSample] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const { data: candidates } = useListCandidates();
  const { data: history } = useListSoftSkillsHistory(
    { candidateId: Number(candidateId) },
    { query: { enabled: !!candidateId, queryKey: getListSoftSkillsHistoryQueryKey({ candidateId: Number(candidateId) }) } }
  );

  const assess = useAssessSoftSkills();

  function handleAssess() {
    if (!candidateId || !textSample.trim()) {
      toast({ title: "Veuillez sélectionner un candidat et entrer du texte", variant: "destructive" });
      return;
    }
    assess.mutate({ data: { candidateId: Number(candidateId), textSample, context: context || undefined } }, {
      onSuccess: (data) => {
        setResult(data as unknown as Record<string, unknown>);
        qc.invalidateQueries({ queryKey: getListSoftSkillsHistoryQueryKey({ candidateId: Number(candidateId) }) });
      },
      onError: () => toast({ title: "Erreur lors de l'évaluation", variant: "destructive" }),
    });
  }

  const radarData = result
    ? [
        { subject: "Communication", value: result.communication as number },
        { subject: "Leadership", value: result.leadership as number },
        { subject: "Équipe", value: result.teamwork as number },
        { subject: "Adaptabilité", value: result.adaptability as number },
        { subject: "Stress", value: result.stressManagement as number },
      ]
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Soft Skills IA</h2>
        <p className="text-muted-foreground text-sm mt-1">Évaluez les compétences comportementales avec l'intelligence artificielle</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Nouvelle évaluation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Candidat</Label>
                <Select onValueChange={(v) => { setCandidateId(v); setResult(null); }}>
                  <SelectTrigger className="mt-1" data-testid="select-candidate"><SelectValue placeholder="Choisir un candidat" /></SelectTrigger>
                  <SelectContent>{candidates?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Contexte (optionnel)</Label>
                <input className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={context} onChange={e => setContext(e.target.value)} placeholder="Ex: Entretien, lettre de motivation..." data-testid="input-context" />
              </div>
              <div>
                <Label>Texte à analyser</Label>
                <Textarea
                  value={textSample}
                  onChange={e => setTextSample(e.target.value)}
                  placeholder="Collez un texte rédigé par le candidat, une réponse d'entretien, une présentation..."
                  rows={8}
                  className="mt-1"
                  data-testid="textarea-sample"
                />
              </div>
              <Button onClick={handleAssess} disabled={assess.isPending || !candidateId || !textSample.trim()} data-testid="button-assess">
                <Sparkles className="h-4 w-4 mr-2" />
                {assess.isPending ? "Évaluation en cours..." : "Évaluer les soft skills"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Result */}
        <div className="space-y-4">
          {assess.isPending && (
            <Card><CardContent className="py-16 text-center">
              <Brain className="h-12 w-12 animate-pulse mx-auto mb-3 text-primary" />
              <p className="text-muted-foreground">Analyse en cours...</p>
            </CardContent></Card>
          )}

          {result && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Radar des compétences</span>
                    <span className="text-primary text-xl font-bold" data-testid="overall-score">{result.overallScore as number}/100</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <Radar name="Score" dataKey="value" stroke="hsl(15 86% 56%)" fill="hsl(15 86% 56%)" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {Object.entries(SKILL_LABELS).map(([key, label]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{result[key] as number}</span>
                        </div>
                        <Progress value={result[key] as number} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Points forts</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {((result.strengths as string[]) ?? []).map((s, i) => <p key={i} className="text-sm text-muted-foreground">• {s}</p>)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Axes d'amélioration</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  {((result.improvements as string[]) ?? []).map((s, i) => <p key={i} className="text-sm text-muted-foreground">• {s}</p>)}
                </CardContent>
              </Card>

              {result.actionPlan && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base">Plan d'action (4 semaines)</CardTitle></CardHeader>
                  <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">{result.actionPlan as string}</CardContent>
                </Card>
              )}
            </>
          )}

          {/* History */}
          {history && history.length > 0 && !result && (
            <Card>
              <CardHeader><CardTitle className="text-base">Historique des évaluations</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {history.slice(0, 5).map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-sm" data-testid={`history-${h.id}`}>
                    <span className="text-muted-foreground">{new Date(h.createdAt).toLocaleDateString("fr-FR")}</span>
                    <div className="flex gap-3">
                      <span>Global: <strong>{h.overallScore}</strong></span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!result && !assess.isPending && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Soumettez un texte pour analyser les soft skills</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
