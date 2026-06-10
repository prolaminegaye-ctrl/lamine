import { useState } from "react";
import {
  useListAdvisors,
  useCreateAdvisor,
  useGetAdvisorBeneficiaries,
  useGenerateAdvisorReport,
  getListAdvisorsQueryKey,
  getGetAdvisorBeneficiariesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Plus, Users, FileText, Sparkles, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const COUNTRIES = ["Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Cameroun", "RDC", "France"];

const newAdvisorSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  organization: z.string().min(1, "Organisation requise"),
  country: z.string().min(1, "Pays requis"),
});

export default function Conseillers() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<number | null>(null);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);

  const { data: advisors, isLoading } = useListAdvisors();
  const { data: beneficiaries } = useGetAdvisorBeneficiaries(selectedAdvisorId ?? 0, {
    query: { enabled: !!selectedAdvisorId, queryKey: getGetAdvisorBeneficiariesQueryKey(selectedAdvisorId ?? 0) },
  });

  const createAdvisor = useCreateAdvisor();
  const generateReport = useGenerateAdvisorReport();

  const form = useForm<z.infer<typeof newAdvisorSchema>>({
    resolver: zodResolver(newAdvisorSchema),
    defaultValues: { firstName: "", lastName: "", email: "", organization: "", country: "" },
  });

  function onSubmit(values: z.infer<typeof newAdvisorSchema>) {
    createAdvisor.mutate({ data: values }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListAdvisorsQueryKey() });
        toast({ title: "Conseiller ajouté avec succès" });
        setOpen(false); form.reset();
      },
      onError: () => toast({ title: "Erreur lors de la création", variant: "destructive" }),
    });
  }

  function handleGenerateReport() {
    if (!selectedAdvisorId) return;
    setReport(null);
    generateReport.mutate({ id: selectedAdvisorId, data: {} }, {
      onSuccess: (data) => setReport(data as unknown as Record<string, unknown>),
      onError: () => toast({ title: "Erreur lors de la génération", variant: "destructive" }),
    });
  }

  const selectedAdvisor = advisors?.find(a => a.id === selectedAdvisorId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Conseillers & Organisations</h2>
          <p className="text-muted-foreground text-sm mt-1">Gérez les conseillers et leur suivi de bénéficiaires</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-advisor"><Plus className="h-4 w-4 mr-2" />Nouveau conseiller</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter un conseiller</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>Prénom</FormLabel><FormControl><Input {...field} data-testid="input-firstname" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel>Nom</FormLabel><FormControl><Input {...field} data-testid="input-lastname" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} data-testid="input-email" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="organization" render={({ field }) => (
                  <FormItem><FormLabel>Organisation</FormLabel><FormControl><Input {...field} placeholder="Ex: France Travail Afrique, DERJ..." data-testid="input-org" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem><FormLabel>Pays</FormLabel>
                    <Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                      <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select><FormMessage /></FormItem>
                )} />
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit" disabled={createAdvisor.isPending} data-testid="button-submit-advisor">{createAdvisor.isPending ? "Création..." : "Ajouter"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Advisor list */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground">Conseillers ({advisors?.length ?? 0})</h3>
          {isLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />) :
            !advisors?.length ? (
              <Card className="border-dashed"><CardContent className="py-8 text-center text-muted-foreground text-sm">Aucun conseiller.</CardContent></Card>
            ) : advisors.map(a => (
              <Card key={a.id} className={`cursor-pointer transition-colors ${selectedAdvisorId === a.id ? "border-primary" : "hover:border-primary/40"}`} onClick={() => { setSelectedAdvisorId(a.id); setReport(null); }} data-testid={`card-advisor-${a.id}`}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center flex-shrink-0 text-sm">
                      {a.firstName[0]}{a.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{a.firstName} {a.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><Building2 className="h-3 w-3" />{a.organization}</p>
                      <p className="text-xs text-muted-foreground">{a.country} • <strong>{a.beneficiaryCount ?? 0}</strong> bénéficiaires</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selectedAdvisor ? (
            <Tabs defaultValue="beneficiaries">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{selectedAdvisor.firstName} {selectedAdvisor.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAdvisor.organization} — {selectedAdvisor.country}</p>
                </div>
                <Button size="sm" onClick={handleGenerateReport} disabled={generateReport.isPending} data-testid="button-generate-report">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {generateReport.isPending ? "Génération..." : "Générer rapport IA"}
                </Button>
              </div>
              <TabsList>
                <TabsTrigger value="beneficiaries"><Users className="h-4 w-4 mr-2" />Bénéficiaires ({beneficiaries?.length ?? 0})</TabsTrigger>
                {report && <TabsTrigger value="report"><FileText className="h-4 w-4 mr-2" />Rapport IA</TabsTrigger>}
              </TabsList>

              <TabsContent value="beneficiaries" className="mt-4 space-y-3">
                {!beneficiaries?.length ? (
                  <Card className="border-dashed"><CardContent className="py-10 text-center text-muted-foreground">Aucun bénéficiaire assigné à ce conseiller.</CardContent></Card>
                ) : beneficiaries.map(b => (
                  <Card key={b.id} data-testid={`card-beneficiary-${b.id}`}>
                    <CardContent className="py-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {b.firstName[0]}{b.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{b.firstName} {b.lastName}</p>
                        <p className="text-xs text-muted-foreground">{b.sector ?? "Secteur inconnu"} • {b.country}</p>
                      </div>
                      {b.employabilityScore !== null && b.employabilityScore !== undefined && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="w-20">
                            <Progress value={b.employabilityScore} className="h-1.5" />
                          </div>
                          <span className="text-sm font-medium text-primary">{b.employabilityScore}%</span>
                        </div>
                      )}
                      <Badge variant={b.status === "placed" ? "default" : "outline"} className="text-xs flex-shrink-0">
                        {b.status === "placed" ? "Placé" : b.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {report && (
                <TabsContent value="report" className="mt-4 space-y-4">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="py-4">
                      <div className="flex gap-6 mb-3">
                        <div><div className="text-2xl font-bold text-primary">{report.totalBeneficiaries as number}</div><div className="text-xs text-muted-foreground">Bénéficiaires</div></div>
                        {typeof report.avgEmployabilityScore === "number" && report.avgEmployabilityScore > 0 && (
                          <div><div className="text-2xl font-bold text-foreground">{report.avgEmployabilityScore}%</div><div className="text-xs text-muted-foreground">Score moyen</div></div>
                        )}
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{report.summary as string}</p>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm">Points saillants</CardTitle></CardHeader>
                      <CardContent className="space-y-1">
                        {((report.highlights as string[]) ?? []).map((h, i) => <p key={i} className="text-sm text-muted-foreground">• {h}</p>)}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-600">Candidats à risque</CardTitle></CardHeader>
                      <CardContent className="space-y-1">
                        {((report.atRiskCandidates as string[]) ?? []).length > 0
                          ? (report.atRiskCandidates as string[]).map((c, i) => <p key={i} className="text-sm text-muted-foreground">• {c}</p>)
                          : <p className="text-sm text-muted-foreground">Aucun candidat à risque détecté.</p>}
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Recommandations IA</CardTitle></CardHeader>
                    <CardContent className="space-y-1">
                      {((report.recommendations as string[]) ?? []).map((r, i) => <p key={i} className="text-sm text-muted-foreground">• {r}</p>)}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <Card className="border-dashed h-full flex items-center justify-center min-h-60">
              <CardContent className="py-12 text-center">
                <UserCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Sélectionnez un conseiller pour voir ses bénéficiaires</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
