import { useState } from "react";
import { useListCandidates, useCreateCandidate, getListCandidatesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Plus, Search, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  placed: "Placé",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-gray-100 text-gray-600",
  placed: "bg-primary/10 text-primary",
};

const COUNTRIES = ["Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Cameroun", "RDC", "Bénin", "Togo", "Niger", "Burkina Faso"];
const SECTORS = ["Informatique", "Finance", "Marketing", "Santé", "Agriculture", "Enseignement", "Commerce", "Droit", "Ingénierie"];

const newCandidateSchema = z.object({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  country: z.string().min(1, "Pays requis"),
  city: z.string().optional(),
  sector: z.string().optional(),
  experienceLevel: z.string().optional(),
  language: z.string().default("fr"),
});

export default function Candidats() {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: candidates, isLoading } = useListCandidates(
    { country: countryFilter !== "all" ? countryFilter : undefined, status: statusFilter !== "all" ? statusFilter : undefined },
    { query: { queryKey: getListCandidatesQueryKey({ country: countryFilter !== "all" ? countryFilter : undefined, status: statusFilter !== "all" ? statusFilter : undefined }) } }
  );

  const createCandidate = useCreateCandidate();

  const form = useForm<z.infer<typeof newCandidateSchema>>({
    resolver: zodResolver(newCandidateSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", country: "", city: "", sector: "", experienceLevel: "", language: "fr" },
  });

  const filtered = (candidates ?? []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.sector ?? "").toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    );
  });

  function onSubmit(values: z.infer<typeof newCandidateSchema>) {
    createCandidate.mutate({ data: values }, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListCandidatesQueryKey() });
        toast({ title: "Candidat créé avec succès" });
        setOpen(false);
        form.reset();
      },
      onError: () => toast({ title: "Erreur lors de la création", variant: "destructive" }),
    });
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Candidats</h2>
          <p className="text-muted-foreground text-sm mt-1">{candidates?.length ?? 0} candidats enregistrés</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-candidate">
              <Plus className="h-4 w-4 mr-2" /> Nouveau candidat
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Ajouter un candidat</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl><Input {...field} data-testid="input-firstname" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl><Input {...field} data-testid="input-lastname" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} data-testid="input-email" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger data-testid="select-country"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                        <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl><Input {...field} data-testid="input-city" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="sector" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger data-testid="select-sector"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                        <SelectContent>{SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger data-testid="select-level"><SelectValue placeholder="Choisir" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="mid">Intermédiaire</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl><Input {...field} data-testid="input-phone" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                  <Button type="submit" disabled={createCandidate.isPending} data-testid="button-submit-candidate">
                    {createCandidate.isPending ? "Création..." : "Créer le candidat"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un candidat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-44" data-testid="select-filter-country"><SelectValue placeholder="Pays" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36" data-testid="select-filter-status"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="placed">Placés</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground">Aucun candidat trouvé</p>
            <p className="text-sm text-muted-foreground mt-1">Ajoutez votre premier candidat pour commencer.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/candidats/${c.id}`}>
              <Card className="hover:border-primary/40 transition-colors cursor-pointer" data-testid={`card-candidate-${c.id}`}>
                <CardContent className="py-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center flex-shrink-0 text-sm">
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground" data-testid={`text-name-${c.id}`}>{c.firstName} {c.lastName}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[c.status] ?? ""}`}>{STATUS_LABELS[c.status] ?? c.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{c.email} • {c.city ? `${c.city}, ` : ""}{c.country}</p>
                    {c.sector && <p className="text-xs text-muted-foreground">{c.sector} {c.experienceLevel ? `— ${c.experienceLevel}` : ""}</p>}
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center gap-4">
                    {c.employabilityScore !== null && c.employabilityScore !== undefined && (
                      <div className="w-28 hidden sm:block">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Employabilité</span>
                          <span className="font-medium text-foreground" data-testid={`score-${c.id}`}>{c.employabilityScore}%</span>
                        </div>
                        <Progress value={c.employabilityScore} className="h-1.5" />
                      </div>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
