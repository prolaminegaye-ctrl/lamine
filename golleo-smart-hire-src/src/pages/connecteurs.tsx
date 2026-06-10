import { useState } from "react";
import {
  Bot,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Cloud,
  FileSignature,
  Globe2,
  Mail,
  MessageSquareText,
  PlugZap,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const connectors = [
  {
    name: "OpenAI Realtime & Documents",
    category: "IA",
    icon: Bot,
    region: "Global",
    status: "Prêt",
    description: "Analyse CV, scoring ATS, entretiens vocaux, synthèses conseiller et génération de documents.",
  },
  {
    name: "Google Workspace",
    category: "Productivité",
    icon: CalendarClock,
    region: "Global",
    status: "OAuth",
    description: "Agenda, Gmail, Drive, invitation entretien, partage de CV et exports PDF.",
  },
  {
    name: "Microsoft 365",
    category: "Productivité",
    icon: Mail,
    region: "Global",
    status: "OAuth",
    description: "Outlook, Teams, OneDrive, modèles Word et suivi institutionnel.",
  },
  {
    name: "LinkedIn / ATS import",
    category: "Recrutement",
    icon: BriefcaseBusiness,
    region: "Global",
    status: "À valider",
    description: "Import de profils, offres, mots-clés métier et matching recruteur.",
  },
  {
    name: "WhatsApp Business / Twilio",
    category: "Messagerie",
    icon: MessageSquareText,
    region: "Afrique, Europe, Amériques, Asie",
    status: "Prêt",
    description: "Rappels de rendez-vous, coaching court, relance documentaire et notifications multilingues.",
  },
  {
    name: "Zoom / Google Meet / Teams",
    category: "Entretien",
    icon: Video,
    region: "Global",
    status: "OAuth",
    description: "Planification, lien visio, compte-rendu automatique et archivage du bilan.",
  },
  {
    name: "DocuSign / SignNow",
    category: "Signature",
    icon: FileSignature,
    region: "Global",
    status: "Prêt",
    description: "Contrats, conventions d'accompagnement, consentements RGPD et mandats de mission.",
  },
  {
    name: "CRM & financeurs",
    category: "Opérations",
    icon: Users,
    region: "Europe, Afrique",
    status: "API",
    description: "Suivi prescripteurs, organismes publics, missions locales, cabinets RH et partenaires formation.",
  },
  {
    name: "Stockage souverain",
    category: "Conformité",
    icon: Cloud,
    region: "UE, US, APAC, Afrique",
    status: "Choix région",
    description: "Routage des données par région, conservation paramétrable et exports de conformité.",
  },
];

const regions = [
  "Union européenne / RGPD",
  "Amérique du Nord / SOC2-ready",
  "Afrique francophone / mobile-first",
  "Asie-Pacifique / multi-langues",
  "Amérique latine / WhatsApp-first",
];

export default function Connecteurs() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(connectors.slice(0, 5).map((connector) => [connector.name, true]))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <PlugZap className="h-4 w-4" />
              Centre de connecteurs
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Plugiciels prêts pour un SaaS international</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Activez les briques nécessaires selon le pays, la réglementation, le canal candidat et le niveau
              d'automatisation attendu par vos équipes.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-md border bg-background px-3 py-2">
              <div className="font-bold text-foreground">9</div>
              <div className="text-muted-foreground">connecteurs</div>
            </div>
            <div className="rounded-md border bg-background px-3 py-2">
              <div className="font-bold text-foreground">5</div>
              <div className="text-muted-foreground">régions</div>
            </div>
            <div className="rounded-md border bg-background px-3 py-2">
              <div className="font-bold text-foreground">RGPD</div>
              <div className="text-muted-foreground">socle</div>
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="catalogue">
        <TabsList>
          <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
          <TabsTrigger value="regions">Régions</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogue" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {connectors.map((connector) => {
              const Icon = connector.icon;
              return (
                <Card key={connector.name} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{connector.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{connector.category}</p>
                        </div>
                      </div>
                      <Switch
                        checked={enabled[connector.name] ?? false}
                        onCheckedChange={(checked) => setEnabled((current) => ({ ...current, [connector.name]: checked }))}
                        aria-label={`Activer ${connector.name}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="min-h-14 text-sm leading-6 text-muted-foreground">{connector.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{connector.status}</Badge>
                      <Badge variant="outline" className="gap-1">
                        <Globe2 className="h-3 w-3" />
                        {connector.region}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="regions" className="mt-4">
          <Card>
            <CardContent className="grid gap-3 p-5 md:grid-cols-2">
              {regions.map((region) => (
                <div key={region} className="flex items-center gap-3 rounded-md border bg-background p-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">{region}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="securite" className="mt-4">
          <Card>
            <CardContent className="grid gap-4 p-5 lg:grid-cols-3">
              {[
                "Consentement candidat, suppression et portabilité des données",
                "Chiffrement en transit, séparation par organisation et journaux d'audit",
                "Choix de région d'hébergement et politique de rétention documentaire",
              ].map((item) => (
                <div key={item} className="rounded-md border bg-background p-4">
                  <ShieldCheck className="mb-3 h-5 w-5 text-emerald-600" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
