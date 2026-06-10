import { useState } from "react";
import { useListJobs, useCreateJob, useGetJobMatches, getListJobsQueryKey, getGetJobMatchesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Plus, Users, MapPin, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const COUNTRIES = ["Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Cameroun", "RDC"];
const SECTORS = ["Informatique", "Finance", "Marketing", "Santé", "Agriculture", "Enseignement", "Commerce", "Droit"];

const newJobSchema = z.object({
  title: z.string().min(1, "Titre requis"),
  company: z.string().min(1, "Entreprise requise"),
  country: z.string().min(1, "Pays requis"),
  city: z.string().optional(),
  sector: z.string().min(1, "Secteur requis"),
  description: z.string().min(10, "Description requise"),
  experienceLevel: z.string().optional(),
  contractType: z.string().optional(),
  salary: z.string().optional(),
});

export default function Offres() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const { data: jobs, isLoading } = useListJobs(
    { country: countryFilter !== "all" ? countryFilter : undefined, sector: sectorFilter !== "all" ? sectorFilter : undefined },
    { query: { queryKey: getListJobsQueryKey({ country: countryFilter !== "all" ? countryFilter : undefined, sector: sectorFilter !== "all" ? sectorFilter : undefined }) } }
  );

  const { data: matches, isLoading: matchLoading } = useGetJobMatches(selectedJob ?? 0, {
    query: { enabled: !!selectedJob, queryKey: getGetJobMatchesQueryKey(selectedJob ?? 0) },
  });

  const createJob = useCreateJob();

  const form = useForm<z.infer<typeof newJobSchema>>({
    resolver: zodResolver(newJobSchema),
    defaultValues: { title: "", company: "", country: "", city: "", sector: "", description: "", experienceLevel: "", contractType: "", salary: "" },
  });

  function onSubmit(values: z.infer<typeof newJobSchema>) {
    createJob.mutate({ data: values }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListJobsQueryKey() });
        toast({ title: "Offre créée avec succès" });
        setOpen(false); form.reset();
      },
      onError: () => toast({ title: "Erreur lors de la création", variant: "destructive" }),
    });
  }

  const filtered = (jobs ?? []).filter(j => {
    if (!search) return true;
    const q = search.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.sector.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Offres d'emploi</h2>
          <p className="text-muted-foreground text-sm mt-1">{jobs?.length ?? 0} offres disponibles</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-job"><Plus className="h-4 w-4 mr-2" />Nouvelle offre</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Ajouter une offre d'emploi</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Titre du poste</FormLabel><FormControl><Input {...field} data-testid="input-job-title" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel>Entreprise</FormLabel><FormControl><Input {...field} data-testid="input-company" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem><FormLabel>Pays</FormLabel>
                      <Select onValueChange={field.onChange}><FormControl><SelectTrigger data-testid="select-country"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                        <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="sector" render={({ field }) => (
                    <FormItem><FormLabel>Secteur</FormLabel>
                      <Select onValueChange={field.onChange}><FormControl><SelectTrigger data-testid="select-sector"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                        <SelectContent>{SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} rows={4} data-testid="textarea-description" /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="contractType" render={({ field }) => (
                    <FormItem><FormLabel>Type de contrat</FormLabel>
                      <Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="CDI">CDI</SelectItem>
                          <SelectItem value="CDD">CDD</SelectItem>
                          <SelectItem value="Stage">Stage</SelectItem>
                          <SelectItem value="Alternance">Alternance</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select></FormItem>
                  )} />
                  <FormField control={form.control} name="salary" render={({ field }) => (
                    <FormItem><FormLabel>Salaire</FormLabel><FormControl><Input {...field} placeholder="Ex: 400 000 FCFA/mois" /></FormControl></FormItem>
                  )} />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit" disabled={createJob.isPending} data-testid="button-submit-job">{createJob.isPending ? "Création..." : "Créer l'offre"}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" data-testid="input-search" />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Pays" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Secteur" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-28 w-full rounded-lg" />) :
            !filtered.length ? (
              <Card className="border-dashed"><CardContent className="py-12 text-center text-muted-foreground">Aucune offre disponible.</CardContent></Card>
            ) : filtered.map(j => (
              <Card key={j.id} className={`cursor-pointer transition-colors ${selectedJob === j.id ? "border-primary" : "hover:border-primary/40"}`} onClick={() => setSelectedJob(selectedJob === j.id ? null : j.id)} data-testid={`card-job-${j.id}`}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{j.title}</p>
                      <p className="text-sm text-muted-foreground">{j.company}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{j.city ? `${j.city}, ` : ""}{j.country}</span>
                        <Badge variant="outline" className="text-xs">{j.sector}</Badge>
                        {j.contractType && <Badge variant="secondary" className="text-xs">{j.contractType}</Badge>}
                      </div>
                    </div>
                    {j.salary && <div className="text-sm font-medium text-primary flex-shrink-0">{j.salary}</div>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{j.description}</p>
                  {(j as any).tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {((j as any).tags as string[]).slice(0, 4).map((tag: string) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-primary/8 text-primary rounded-full font-medium border border-primary/20">{tag}</span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        <div>
          {selectedJob ? (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Candidats correspondants</CardTitle></CardHeader>
              <CardContent>
                {matchLoading ? <Skeleton className="h-40 w-full" /> :
                  !matches?.length ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">Aucun match trouvé.</p>
                  ) : (
                    <div className="space-y-3">
                      {matches.map((m, i) => (
                        <div key={i} className="border-b last:border-0 pb-3 last:pb-0">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium text-sm">{m.candidateName}</p>
                            <span className="text-primary font-bold text-sm">{m.matchScore}%</span>
                          </div>
                          {m.reasons.map((r, j) => <p key={j} className="text-xs text-muted-foreground">• {r}</p>)}
                        </div>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Sélectionnez une offre pour voir les candidats correspondants</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
