import { useState } from "react";
import {
  useListInterviews,
  useCreateInterview,
  useGetNextQuestion,
  useSubmitInterviewAnswer,
  useGetInterviewReport,
  getListInterviewsQueryKey,
  getGetInterviewReportQueryKey,
  useListCandidates,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Video, Play, ChevronRight, Star, CheckCircle2, AlertCircle, Mic } from "lucide-react";

const SECTORS = ["Informatique", "Finance", "Marketing", "Santé", "Agriculture", "Enseignement", "Commerce", "Droit"];
const COUNTRIES = ["Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Cameroun", "RDC", "Bénin"];

type Question = { questionId: number; text: string; type: string; questionNumber: number; totalQuestions: number; hint?: string | null };
type Feedback = { score: number; clarity: number; structure: number; relevance: number; confidenceScore: number; strengths: string[]; improvements: string[]; betterAnswer: string };

export default function Entretiens() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [phase, setPhase] = useState<"list" | "setup" | "question" | "feedback" | "report">("list");
  const [activeInterviewId, setActiveInterviewId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [answer, setAnswer] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [sector, setSector] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [country, setCountry] = useState("");

  const { data: candidates } = useListCandidates();
  const { data: interviews, isLoading } = useListInterviews();
  const createInterview = useCreateInterview();
  const getNextQuestion = useGetNextQuestion();
  const submitAnswer = useSubmitInterviewAnswer();

  const { data: report } = useGetInterviewReport(activeInterviewId ?? 0, {
    query: { enabled: phase === "report" && !!activeInterviewId, queryKey: getGetInterviewReportQueryKey(activeInterviewId ?? 0) },
  });

  async function handleStart() {
    if (!candidateId || !interviewType || !sector) {
      toast({ title: "Veuillez remplir les champs requis", variant: "destructive" });
      return;
    }
    createInterview.mutate({
      data: { candidateId: Number(candidateId), type: interviewType as "phone" | "video" | "onsite", sector, jobTitle: jobTitle || undefined, jobDescription: jobDesc || undefined, country: country || undefined },
    }, {
      onSuccess: (interview) => {
        setActiveInterviewId(interview.id);
        qc.invalidateQueries({ queryKey: getListInterviewsQueryKey() });
        fetchNextQuestion(interview.id);
      },
      onError: () => toast({ title: "Erreur lors de la création", variant: "destructive" }),
    });
  }

  function fetchNextQuestion(id: number) {
    setCurrentQuestion(null); setCurrentFeedback(null); setAnswer("");
    getNextQuestion.mutate({ id }, {
      onSuccess: (q) => {
        setCurrentQuestion(q as Question);
        setPhase("question");
      },
      onError: () => setPhase("report"),
    });
  }

  function handleSubmitAnswer() {
    if (!activeInterviewId || !currentQuestion || !answer.trim()) return;
    submitAnswer.mutate({
      id: activeInterviewId,
      data: { questionId: currentQuestion.questionId, answerText: answer },
    }, {
      onSuccess: (fb) => {
        setCurrentFeedback(fb as Feedback);
        setPhase("feedback");
      },
      onError: () => toast({ title: "Erreur lors de l'envoi", variant: "destructive" }),
    });
  }

  function handleNext() {
    if (!activeInterviewId) return;
    if (currentQuestion && currentQuestion.questionNumber >= currentQuestion.totalQuestions) {
      setPhase("report");
    } else {
      fetchNextQuestion(activeInterviewId);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Simulateur d'entretien</h2>
          <p className="text-muted-foreground text-sm mt-1">Préparez-vous avec des entretiens simulés par l'IA</p>
        </div>
        {phase === "list" && (
          <Button onClick={() => setPhase("setup")} data-testid="button-start-interview">
            <Play className="h-4 w-4 mr-2" /> Démarrer une simulation
          </Button>
        )}
        {phase !== "list" && (
          <Button variant="outline" onClick={() => { setPhase("list"); setActiveInterviewId(null); setCurrentQuestion(null); }} data-testid="button-back-list">
            Retour à la liste
          </Button>
        )}
      </div>

      {/* LIST */}
      {phase === "list" && (
        isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
        ) : !interviews?.length ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium">Aucun entretien simulé</p>
              <p className="text-sm text-muted-foreground mt-1">Lancez votre première simulation pour vous préparer.</p>
              <Button className="mt-4" onClick={() => setPhase("setup")}>Commencer maintenant</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {interviews.map((iv) => (
              <Card key={iv.id} data-testid={`card-interview-${iv.id}`}>
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{iv.jobTitle ?? iv.sector}</p>
                    <p className="text-xs text-muted-foreground">{iv.type} • {new Date(iv.createdAt).toLocaleDateString("fr-FR")} • {iv.answeredCount}/{iv.questionsCount} questions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={iv.status === "completed" ? "default" : "outline"}>{iv.status === "completed" ? "Terminé" : iv.status === "in_progress" ? "En cours" : "Démarré"}</Badge>
                    {iv.status !== "completed" && (
                      <Button size="sm" variant="outline" onClick={() => { setActiveInterviewId(iv.id); fetchNextQuestion(iv.id); }} data-testid={`button-resume-${iv.id}`}>
                        Reprendre <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}

      {/* SETUP */}
      {phase === "setup" && (
        <Card>
          <CardHeader><CardTitle>Configurer l'entretien</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Candidat</Label>
                <Select onValueChange={setCandidateId}>
                  <SelectTrigger className="mt-1" data-testid="select-candidate"><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{candidates?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Type d'entretien</Label>
                <Select onValueChange={setInterviewType}>
                  <SelectTrigger className="mt-1" data-testid="select-type"><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Téléphone</SelectItem>
                    <SelectItem value="video">Visioconférence</SelectItem>
                    <SelectItem value="onsite">Présentiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Secteur</Label>
                <Select onValueChange={setSector}>
                  <SelectTrigger className="mt-1" data-testid="select-sector"><SelectValue placeholder="Choisir" /></SelectTrigger>
                  <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pays</Label>
                <Select onValueChange={setCountry}>
                  <SelectTrigger className="mt-1" data-testid="select-country"><SelectValue placeholder="Optionnel" /></SelectTrigger>
                  <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Poste visé</Label>
              <input className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Ex: Chef de projet marketing" data-testid="input-job-title" />
            </div>
            <div>
              <Label>Description du poste (optionnel)</Label>
              <Textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Collez la description du poste..." rows={4} className="mt-1" data-testid="textarea-job-desc" />
            </div>
            <Button onClick={handleStart} disabled={createInterview.isPending || !candidateId || !interviewType || !sector} data-testid="button-start">
              {createInterview.isPending ? "Génération des questions..." : "Démarrer l'entretien"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* QUESTION */}
      {phase === "question" && currentQuestion && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Question {currentQuestion.questionNumber} / {currentQuestion.totalQuestions}</span>
            <Progress value={(currentQuestion.questionNumber / currentQuestion.totalQuestions) * 100} className="flex-1 h-2" />
            <Badge variant="outline" className="capitalize">{currentQuestion.type}</Badge>
          </div>
          <Card>
            <CardContent className="py-6">
              <p className="text-lg font-medium leading-relaxed" data-testid="text-question">{currentQuestion.text}</p>
              {currentQuestion.hint && (
                <p className="text-sm text-muted-foreground mt-3 italic border-l-2 border-primary/30 pl-3">{currentQuestion.hint}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 space-y-3">
              <Label>Votre réponse</Label>
              <Textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Rédigez votre réponse..." rows={6} data-testid="textarea-answer" />
              <Button onClick={handleSubmitAnswer} disabled={!answer.trim() || submitAnswer.isPending} data-testid="button-submit-answer">
                {submitAnswer.isPending ? "Évaluation en cours..." : "Soumettre la réponse"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* FEEDBACK */}
      {phase === "feedback" && currentFeedback && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Évaluation de votre réponse</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Note", val: `${currentFeedback.score}/20` },
                  { label: "Clarté", val: `${currentFeedback.clarity}/10` },
                  { label: "Structure", val: `${currentFeedback.structure}/10` },
                  { label: "Pertinence", val: `${currentFeedback.relevance}/10` },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-primary" data-testid={`score-${label.toLowerCase()}`}>{val}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1 mb-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />Points forts</p>
                  {(currentFeedback.strengths ?? []).map((s, i) => <p key={i} className="text-sm text-muted-foreground">• {s}</p>)}
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-1 mb-2"><AlertCircle className="h-4 w-4 text-amber-500" />À améliorer</p>
                  {(currentFeedback.improvements ?? []).map((s, i) => <p key={i} className="text-sm text-muted-foreground">• {s}</p>)}
                </div>
              </div>
              {currentFeedback.betterAnswer && (
                <div className="border-l-4 border-primary/40 pl-4">
                  <p className="text-sm font-medium mb-2">Réponse améliorée</p>
                  <p className="text-sm text-muted-foreground italic">{currentFeedback.betterAnswer}</p>
                </div>
              )}
              <Button onClick={handleNext} data-testid="button-next-question">
                {currentQuestion && currentQuestion.questionNumber >= currentQuestion.totalQuestions ? "Voir le rapport final" : "Question suivante"} <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* REPORT */}
      {phase === "report" && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-primary" />Rapport final de l'entretien</CardTitle></CardHeader>
            <CardContent>
              {!report ? (
                <div className="py-8 text-center"><Skeleton className="h-6 w-48 mx-auto mb-4" /><Skeleton className="h-4 w-64 mx-auto" /></div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 rounded-xl p-4 text-center">
                      <div className="text-4xl font-bold text-primary">{report.overallScore}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Score global</div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 text-center">
                      <div className="text-4xl font-bold text-foreground">{report.confidenceScore}%</div>
                      <div className="text-sm text-muted-foreground mt-1">Confiance perçue</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{report.summary}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-2">Points forts</p>
                      {(report.strengths ?? []).map((s, i) => <p key={i} className="text-sm text-muted-foreground">• {s}</p>)}
                    </div>
                    <div>
                      <p className="font-medium mb-2">Axes d'amélioration</p>
                      {(report.areasToImprove ?? []).map((s: string, i: number) => <p key={i} className="text-sm text-muted-foreground">• {s}</p>)}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Recommandations</p>
                    {(report.recommendations ?? []).map((r: string, i: number) => <p key={i} className="text-sm text-muted-foreground">• {r}</p>)}
                  </div>
                  <Button variant="outline" onClick={() => setPhase("list")} data-testid="button-done">Terminer</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
