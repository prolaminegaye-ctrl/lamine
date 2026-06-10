import { useState } from "react";
import { useGenerateDocument, useListDocuments, useListCandidates, getListDocumentsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Sparkles, Copy, CheckCheck } from "lucide-react";

const DOC_TYPES = [
  { value: "cover_letter", label: "Lettre de motivation" },
  { value: "email_application", label: "E-mail de candidature" },
  { value: "spontaneous_application", label: "Candidature spontanée" },
  { value: "linkedin_profile", label: "Profil LinkedIn" },
];

const TONES = [
  { value: "formal", label: "Formel" },
  { value: "warm", label: "Chaleureux" },
  { value: "dynamic", label: "Dynamique" },
];

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "es", label: "Espagnol" },
  { value: "ar", label: "Arabe" },
];

export default function Documents() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [candidateId, setCandidateId] = useState("");
  const [docType, setDocType] = useState("");
  const [tone, setTone] = useState("formal");
  const [language, setLanguage] = useState("fr");
  const [jobDesc, setJobDesc] = useState("");
  const [company, setCompany] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: candidates } = useListCandidates();
  const { data: documents, isLoading: docsLoading } = useListDocuments();
  const generateDoc = useGenerateDocument();

  function handleGenerate() {
    if (!candidateId || !docType) {
      toast({ title: "Veuillez sélectionner un candidat et le type de document", variant: "destructive" });
      return;
    }
    setGenerated(null);
    generateDoc.mutate({
      data: {
        candidateId: Number(candidateId),
        documentType: docType as "cover_letter" | "email_application" | "spontaneous_application" | "linkedin_profile",
        jobDescription: jobDesc || undefined,
        targetCompany: company || undefined,
        language,
        tone: tone as "formal" | "warm" | "dynamic",
      },
    }, {
      onSuccess: (doc) => {
        setGenerated(doc.content);
        qc.invalidateQueries({ queryKey: getListDocumentsQueryKey() });
      },
      onError: () => toast({ title: "Erreur lors de la génération", variant: "destructive" }),
    });
  }

  function handleCopy() {
    if (!generated) return;
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Documents IA</h2>
        <p className="text-muted-foreground text-sm mt-1">Générez des lettres de motivation, e-mails et profils LinkedIn personnalisés</p>
      </div>

      <Tabs defaultValue="generate">
        <TabsList>
          <TabsTrigger value="generate" data-testid="tab-generate">Générer</TabsTrigger>
          <TabsTrigger value="history" data-testid="tab-history">Historique ({documents?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-base">Paramètres</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Candidat</Label>
                    <Select onValueChange={setCandidateId}>
                      <SelectTrigger className="mt-1" data-testid="select-candidate"><SelectValue placeholder="Choisir un candidat" /></SelectTrigger>
                      <SelectContent>{candidates?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type de document</Label>
                    <Select onValueChange={setDocType}>
                      <SelectTrigger className="mt-1" data-testid="select-doc-type"><SelectValue placeholder="Choisir le type" /></SelectTrigger>
                      <SelectContent>{DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ton</Label>
                      <Select onValueChange={setTone} defaultValue="formal">
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{TONES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Langue</Label>
                      <Select onValueChange={setLanguage} defaultValue="fr">
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Entreprise cible (optionnel)</Label>
                    <input className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={company} onChange={e => setCompany(e.target.value)} placeholder="Ex: Orange, MTN, Ecobank..." data-testid="input-company" />
                  </div>
                  <div>
                    <Label>Offre d'emploi (optionnel)</Label>
                    <Textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Collez l'offre d'emploi pour personnaliser..." rows={5} className="mt-1" data-testid="textarea-job-desc" />
                  </div>
                  <Button onClick={handleGenerate} disabled={generateDoc.isPending || !candidateId || !docType} className="w-full" data-testid="button-generate">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {generateDoc.isPending ? "Génération en cours..." : "Générer le document"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              {generateDoc.isPending && (
                <Card>
                  <CardContent className="py-16 text-center">
                    <FileCheck className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Rédaction du document en cours...</p>
                  </CardContent>
                </Card>
              )}
              {generated && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span>Document généré</span>
                      <Button size="sm" variant="outline" onClick={handleCopy} data-testid="button-copy">
                        {copied ? <><CheckCheck className="h-4 w-4 mr-2" />Copié</> : <><Copy className="h-4 w-4 mr-2" />Copier</>}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed text-foreground max-h-[500px] overflow-y-auto" data-testid="generated-content">
                      {generated}
                    </div>
                  </CardContent>
                </Card>
              )}
              {!generated && !generateDoc.isPending && (
                <Card className="border-dashed h-full flex items-center justify-center min-h-60">
                  <CardContent className="py-12 text-center">
                    <FileCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Le document généré apparaîtra ici</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          {docsLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-lg" />) :
            !documents?.length ? (
              <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">Aucun document généré.</CardContent></Card>
            ) : documents.map(doc => (
              <Card key={doc.id} data-testid={`card-doc-${doc.id}`}>
                <CardContent className="py-4 flex items-center gap-4">
                  <FileCheck className="h-8 w-8 text-primary/60 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">{doc.documentType} • {new Date(doc.createdAt).toLocaleDateString("fr-FR")} • {doc.language ?? "fr"}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setGenerated(doc.content)}>Voir</Button>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
