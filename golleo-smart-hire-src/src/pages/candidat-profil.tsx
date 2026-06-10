import { useParams, Link } from "wouter";
import {
  useGetCandidate,
  useGetCandidateEmployabilityScore,
  useListCvs,
  useListInterviews,
  useListSoftSkillsHistory,
  useListDocuments,
  getGetCandidateQueryKey,
  getGetCandidateEmployabilityScoreQueryKey,
  getListCvsQueryKey,
  getListInterviewsQueryKey,
  getListSoftSkillsHistoryQueryKey,
  getListDocumentsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { ArrowLeft, FileText, Video, Brain, Award, Mail, Phone, MapPin, Briefcase } from "lucide-react";

const STATUS_LABELS: Record<string, string> = { active: "Actif", inactive: "Inactif", placed: "Placé" };

export default function CandidatProfil() {
  const { id } = useParams<{ id: string }>();
  const candidateId = Number(id);

  const { data: candidate, isLoading } = useGetCandidate(candidateId, {
    query: { enabled: !!candidateId, queryKey: getGetCandidateQueryKey(candidateId) },
  });
  const { data: score } = useGetCandidateEmployabilityScore(candidateId, {
    query: { enabled: !!candidateId, queryKey: getGetCandidateEmployabilityScoreQueryKey(candidateId) },
  });
  const { data: cvs } = useListCvs(
    { candidateId },
    { query: { enabled: !!candidateId, queryKey: getListCvsQueryKey({ candidateId }) } }
  );
  const { data: interviews } = useListInterviews(
    { candidateId },
    { query: { enabled: !!candidateId, queryKey: getListInterviewsQueryKey({ candidateId }) } }
  );
  const { data: skills } = useListSoftSkillsHistory(
    { candidateId },
    { query: { enabled: !!candidateId, queryKey: getListSoftSkillsHistoryQueryKey({ candidateId }) } }
  );
  const { data: documents } = useListDocuments(
    { candidateId },
    { query: { enabled: !!candidateId, queryKey: getListDocumentsQueryKey({ candidateId }) } }
  );

  const latestSkill = skills?.[0];
  const radarData = latestSkill
    ? [
        { subject: "Communication", value: latestSkill.communication },
        { subject: "Leadership", value: latestSkill.leadership },
        { subject: "Travail équipe", value: latestSkill.teamwork },
        { subject: "Adaptabilité", value: latestSkill.adaptability },
        { subject: "Gestion stress", value: latestSkill.stressManagement },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Candidat introuvable.</p>
        <Link href="/candidats"><Button variant="outline" className="mt-4">Retour</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/candidats">
        <Button variant="ghost" size="sm" data-testid="button-back" className="-ml-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux candidats
        </Button>
      </Link>

      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary text-xl font-bold flex items-center justify-center flex-shrink-0">
              {candidate.firstName[0]}{candidate.lastName[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold" data-testid="text-candidate-name">{candidate.firstName} {candidate.lastName}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.status === "placed" ? "bg-primary/10 text-primary" : candidate.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"}`}>
                  {STATUS_LABELS[candidate.status] ?? candidate.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{candidate.email}</span>
                {candidate.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{candidate.phone}</span>}
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{candidate.city ? `${candidate.city}, ` : ""}{candidate.country}</span>
                {candidate.sector && <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{candidate.sector} {candidate.experienceLevel ? `— ${candidate.experienceLevel}` : ""}</span>}
              </div>
            </div>
            {score && (
              <div className="text-center flex-shrink-0">
                <div className="text-3xl font-bold text-primary" data-testid="score-employability">{score.overallScore}</div>
                <div className="text-xs text-muted-foreground">Score global</div>
              </div>
            )}
          </div>

          {score && (
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t">
              {[
                { label: "CV / ATS", val: score.cvScore },
                { label: "Entretiens", val: score.interviewScore },
                { label: "Soft Skills", val: score.softSkillsScore },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{val}/100</span>
                  </div>
                  <Progress value={val} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="cvs">
        <TabsList>
          <TabsTrigger value="cvs" data-testid="tab-cvs">
            <FileText className="h-4 w-4 mr-2" />CVs ({cvs?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="interviews" data-testid="tab-interviews">
            <Video className="h-4 w-4 mr-2" />Entretiens ({interviews?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="skills" data-testid="tab-skills">
            <Brain className="h-4 w-4 mr-2" />Soft Skills
          </TabsTrigger>
          <TabsTrigger value="documents" data-testid="tab-documents">
            <Award className="h-4 w-4 mr-2" />Documents ({documents?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cvs" className="mt-4 space-y-3">
          {!cvs?.length ? (
            <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">Aucun CV enregistré pour ce candidat.</CardContent></Card>
          ) : cvs.map((cv) => (
            <Card key={cv.id} data-testid={`card-cv-${cv.id}`}>
              <CardContent className="py-4 flex items-center gap-4">
                <FileText className="h-8 w-8 text-primary/60 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{cv.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(cv.createdAt).toLocaleDateString("fr-FR")} • {cv.status === "analyzed" ? "Analysé" : cv.status === "optimized" ? "Optimisé" : "Brouillon"}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary" data-testid={`ats-score-${cv.id}`}>{cv.atsScore}</div>
                    <div className="text-xs text-muted-foreground">ATS</div>
                  </div>
                  <Progress value={cv.atsScore} className="w-20 h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="interviews" className="mt-4 space-y-3">
          {!interviews?.length ? (
            <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">Aucune simulation d'entretien enregistrée.</CardContent></Card>
          ) : interviews.map((iv) => (
            <Card key={iv.id} data-testid={`card-interview-${iv.id}`}>
              <CardContent className="py-4 flex items-center gap-4">
                <Video className="h-8 w-8 text-primary/60 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{iv.jobTitle ?? iv.sector}</p>
                  <p className="text-xs text-muted-foreground">{iv.type} • {new Date(iv.createdAt).toLocaleDateString("fr-FR")} • {iv.answeredCount}/{iv.questionsCount} questions</p>
                </div>
                {iv.overallScore !== null && iv.overallScore !== undefined && (
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-primary">{iv.overallScore}%</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          {!latestSkill ? (
            <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">Aucune évaluation soft skills disponible.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Radar des compétences</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <Radar name="Score" dataKey="value" stroke="hsl(15 86% 56%)" fill="hsl(15 86% 56%)" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Plan d'action</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {latestSkill.actionPlan ?? "Aucun plan d'action disponible."}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4 space-y-3">
          {!documents?.length ? (
            <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">Aucun document généré pour ce candidat.</CardContent></Card>
          ) : documents.map((doc) => (
            <Card key={doc.id} data-testid={`card-document-${doc.id}`}>
              <CardContent className="py-4 flex items-center gap-4">
                <Award className="h-8 w-8 text-primary/60 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.documentType} • {new Date(doc.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
