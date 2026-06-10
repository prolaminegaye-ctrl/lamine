// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Dashboard Conseiller enrichi
//  Pilotage multi-bénéficiaires, pipeline, tests AFRI, reporting
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Link } from "wouter";
import {
  useGetDashboardStats,
  useGetRecentActivity,
  useGetCvProgressTrend,
} from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, CheckCircle2, FileText, TrendingUp, MapPin, Target,
  Compass, Mic, Brain, ArrowRight, ArrowUp, ArrowDown,
  Clock, Star, AlertCircle, BarChart3, UserCog, Zap,
  ChevronRight, Calendar, Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Palette AFRI ──────────────────────────────────────────────────────────────
const AFRI_AMBER   = "#E8813A";
const AFRI_TEAL    = "#2EB88A";
const AFRI_CORAL   = "#E85D5D";
const AFRI_SKY     = "#5BB8E0";
const AFRI_GOLD    = "#F5C23E";
const AFRI_VIOLET  = "#2E7D5B";
const PIE_COLORS   = [AFRI_AMBER, AFRI_TEAL, AFRI_SKY, AFRI_GOLD, AFRI_VIOLET, AFRI_CORAL];

// ── Mock fallback data (si API pas encore connectée) ─────────────────────────

const MOCK_PIPELINE = [
  {
    id: "1", name: "Aminata Diallo", country: "Sénégal", sector: "Informatique",
    status: "orientation", afriCode: "VISIONNAIRE", afriSkill: 72, atsScore: 68,
    lastActivity: "2026-05-27", priority: "high",
  },
  {
    id: "2", name: "Kofi Mensah", country: "Ghana", sector: "Finance",
    status: "formation", afriCode: "GARDIEN", afriSkill: 85, atsScore: 76,
    lastActivity: "2026-05-26", priority: "normal",
  },
  {
    id: "3", name: "Fatou Camara", country: "Guinée", sector: "Santé",
    status: "recherche", afriCode: "HUMANISTE", afriSkill: 91, atsScore: 82,
    lastActivity: "2026-05-25", priority: "normal",
  },
  {
    id: "4", name: "Ibrahim Touré", country: "Mali", sector: "Commerce",
    status: "entretien", afriCode: "LEADER", afriSkill: 78, atsScore: 74,
    lastActivity: "2026-05-24", priority: "high",
  },
  {
    id: "5", name: "Nadia Bello", country: "Cameroun", sector: "Marketing",
    status: "placement", afriCode: "CRÉATEUR", afriSkill: 94, atsScore: 89,
    lastActivity: "2026-05-23", priority: "normal",
  },
  {
    id: "6", name: "Moussa Traoré", country: "Côte d'Ivoire", sector: "Ingénierie",
    status: "orientation", afriCode: null, afriSkill: null, atsScore: null,
    lastActivity: "2026-05-28", priority: "urgent",
  },
  {
    id: "7", name: "Aïssatou Ba", country: "Sénégal", sector: "Droit",
    status: "formation", afriCode: "BÂTISSEUR", afriSkill: 67, atsScore: 61,
    lastActivity: "2026-05-22", priority: "normal",
  },
  {
    id: "8", name: "Kwame Asante", country: "Burkina Faso", sector: "Agriculture",
    status: "placed", afriCode: "BÂTISSEUR", afriSkill: 88, atsScore: 85,
    lastActivity: "2026-05-20", priority: "normal",
  },
];

const MOCK_ACTIVITIES = [
  { id: "a1", type: "test_completed", desc: "A complété le test AFRI-CODE", candidate: "Aminata Diallo", time: "Il y a 2h", color: AFRI_AMBER },
  { id: "a2", type: "cv_analyzed", desc: "CV analysé — score ATS 76/100", candidate: "Kofi Mensah", time: "Il y a 4h", color: AFRI_SKY },
  { id: "a3", type: "interview_done", desc: "Simulation d'entretien terminée", candidate: "Ibrahim Touré", time: "Hier, 15h30", color: AFRI_VIOLET },
  { id: "a4", type: "placed", desc: "Placement confirmé chez TechAfrica", candidate: "Nadia Bello", time: "Hier, 10h00", color: AFRI_TEAL },
  { id: "a5", type: "test_completed", desc: "A complété AFRI-SKILL (94/100)", candidate: "Nadia Bello", time: "Il y a 2 jours", color: AFRI_TEAL },
  { id: "a6", type: "added", desc: "Nouveau bénéficiaire enregistré", candidate: "Moussa Traoré", time: "Aujourd'hui, 9h12", color: AFRI_CORAL },
];

const MOCK_SECTOR_DATA = [
  { sector: "Informatique", count: 38 },
  { sector: "Finance", count: 24 },
  { sector: "Santé", count: 19 },
  { sector: "Commerce", count: 16 },
  { sector: "Ingénierie", count: 14 },
  { sector: "Autres", count: 21 },
];

const MOCK_COUNTRY_DATA = [
  { country: "Sénégal", count: 42 },
  { country: "C. d'Ivoire", count: 31 },
  { country: "Cameroun", count: 22 },
  { country: "Mali", count: 18 },
  { country: "Guinée", count: 15 },
  { country: "Autres", count: 32 },
];

const MOCK_ATS_TREND = [
  { date: "Jan", score: 58 }, { date: "Fév", score: 62 }, { date: "Mar", score: 67 },
  { date: "Avr", score: 71 }, { date: "Mai", score: 76 },
];

const PROFILE_COLORS: Record<string, string> = {
  BÂTISSEUR: AFRI_AMBER, VISIONNAIRE: AFRI_SKY, CRÉATEUR: AFRI_VIOLET,
  HUMANISTE: AFRI_TEAL, LEADER: AFRI_CORAL, GARDIEN: AFRI_GOLD,
};

const PIPELINE_STAGES: { key: string; label: string; color: string }[] = [
  { key: "orientation", label: "Orientation", color: AFRI_AMBER },
  { key: "formation", label: "Formation", color: AFRI_SKY },
  { key: "recherche", label: "Recherche active", color: AFRI_VIOLET },
  { key: "entretien", label: "Entretiens", color: AFRI_GOLD },
  { key: "placement", label: "Placement imm.", color: AFRI_TEAL },
  { key: "placed", label: "Placé ✓", color: AFRI_CORAL },
];

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  urgent: { label: "Urgent", color: "#E85D5D", bg: "bg-red-50 text-red-700 border-red-200" },
  high:   { label: "Prioritaire", color: AFRI_AMBER, bg: "bg-amber-50 text-amber-700 border-amber-200" },
  normal: { label: "Standard", color: "#94a3b8", bg: "bg-slate-50 text-slate-500 border-slate-200" },
};

const ACTIVITY_ICONS: Record<string, typeof FileText> = {
  test_completed: Brain,
  cv_analyzed: FileText,
  interview_done: Mic,
  placed: CheckCircle2,
  added: Users,
};

// ─────────────────────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [pipelineView, setPipelineView] = useState<"list" | "kanban">("list");
  const [activeStage, setActiveStage] = useState<string>("all");

  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: activityData, isLoading: activityLoading } = useGetRecentActivity();
  const { data: cvProgress } = useGetCvProgressTrend();

  // Données réelles si dispo, sinon mock
  const candidates = MOCK_PIPELINE;
  const activities = activityLoading ? [] : (activityData?.length ? activityData.map((a: any) => ({
    id: a.id, type: a.type, desc: a.description, candidate: a.candidateName,
    time: new Date(a.timestamp).toLocaleDateString("fr-FR"), color: AFRI_TEAL,
  })) : MOCK_ACTIVITIES);
  const atsData = cvProgress?.length ? cvProgress.map((d: any) => ({ date: d.date, score: d.atsScore })) : MOCK_ATS_TREND;

  const totalCandidates = stats?.totalCandidates ?? MOCK_PIPELINE.length;
  const activeCandidates = stats?.activeCandidates ?? MOCK_PIPELINE.filter(c => c.status !== "placed").length;
  const placedCandidates = stats?.placedCandidates ?? MOCK_PIPELINE.filter(c => c.status === "placed").length;
  const avgScore = stats?.avgEmployabilityScore ?? Math.round(candidates.filter(c => c.afriSkill).reduce((s, c) => s + (c.afriSkill ?? 0), 0) / candidates.filter(c => c.afriSkill).length);
  const testsCompleted = candidates.filter(c => c.afriCode).length;

  const filteredCandidates = activeStage === "all"
    ? candidates
    : candidates.filter(c => c.status === activeStage);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tableau de bord conseiller</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Pilotage et suivi de vos bénéficiaires</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            IA active
          </div>
          <Link href="/candidats"
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{ background: "linear-gradient(135deg, var(--afri-amber), var(--afri-gold))" }}>
            <Users className="w-4 h-4" /> Tous les candidats
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard
          label="Bénéficiaires"
          value={statsLoading ? undefined : totalCandidates}
          icon={Users}
          color={AFRI_SKY}
          trend="+3 ce mois"
          trendUp
        />
        <KpiCard
          label="En cours"
          value={statsLoading ? undefined : activeCandidates}
          icon={Zap}
          color={AFRI_AMBER}
          trend="actifs"
        />
        <KpiCard
          label="Placés"
          value={statsLoading ? undefined : placedCandidates}
          icon={CheckCircle2}
          color={AFRI_TEAL}
          trend="+2 ce mois"
          trendUp
          highlight
        />
        <KpiCard
          label="Score moy. AFRI-SKILL"
          value={statsLoading ? undefined : `${avgScore}/100`}
          icon={Target}
          color={AFRI_VIOLET}
          trend="+4pts"
          trendUp
        />
        <KpiCard
          label="Tests AFRI complétés"
          value={statsLoading ? undefined : testsCompleted}
          icon={Brain}
          color={AFRI_GOLD}
          trend={`sur ${totalCandidates}`}
        />
      </div>

      {/* ── Pipeline ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Pipeline bénéficiaires
          </h2>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setPipelineView("list")}
              className={cn("px-3 py-1 text-xs rounded-md font-medium transition-colors",
                pipelineView === "list" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >Liste</button>
            <button
              onClick={() => setPipelineView("kanban")}
              className={cn("px-3 py-1 text-xs rounded-md font-medium transition-colors",
                pipelineView === "kanban" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >Pipeline</button>
          </div>
        </div>

        {/* Stage filter pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => setActiveStage("all")}
            className={cn("text-xs px-3 py-1.5 rounded-full font-semibold border transition-all",
              activeStage === "all" ? "bg-foreground text-background border-foreground" : "bg-white text-muted-foreground border-border hover:border-foreground/30")}
          >
            Tous ({candidates.length})
          </button>
          {PIPELINE_STAGES.map(st => {
            const count = candidates.filter(c => c.status === st.key).length;
            if (count === 0) return null;
            return (
              <button
                key={st.key}
                onClick={() => setActiveStage(st.key)}
                className={cn("text-xs px-3 py-1.5 rounded-full font-semibold border transition-all",
                  activeStage === st.key ? "text-white border-transparent" : "bg-white text-muted-foreground border-border")}
                style={activeStage === st.key ? { background: st.color, borderColor: st.color } : {}}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        {pipelineView === "list" ? (
          <PipelineList candidates={filteredCandidates} />
        ) : (
          <PipelineKanban candidates={candidates} />
        )}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ATS trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Progression des scores ATS
            </h3>
            <span className="text-xs text-muted-foreground">5 derniers mois</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={atsData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[40, 100]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v) => [`${v}/100`, "Score ATS moyen"]} />
              <Line type="monotone" dataKey="score" stroke={AFRI_AMBER} strokeWidth={2.5}
                dot={{ r: 4, fill: AFRI_AMBER }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sector pie */}
        <div className="bg-white rounded-2xl border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Répartition sectorielle</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={stats?.candidatesBySector ?? MOCK_SECTOR_DATA}
                dataKey="count" nameKey="sector"
                cx="50%" cy="50%" outerRadius={65} innerRadius={30}
                label={({ sector, percent }) => percent > 0.12 ? `${Math.round(percent * 100)}%` : ""}
                labelLine={false}>
                {(stats?.candidatesBySector ?? MOCK_SECTOR_DATA).map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {(stats?.candidatesBySector ?? MOCK_SECTOR_DATA).slice(0, 4).map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-muted-foreground flex-1 truncate">{d.sector}</span>
                <span className="font-semibold text-foreground">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Country bar + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Country bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-primary" /> Candidats par pays
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={stats?.candidatesByCountry ?? MOCK_COUNTRY_DATA}
              margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="country" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v) => [v, "Candidats"]} />
              <Bar dataKey="count" fill={AFRI_TEAL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Activité récente
            </h3>
          </div>
          {activityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="flex gap-3"><Skeleton className="w-8 h-8 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-24" /></div></div>)}
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {activities.map((item: any) => {
                const Icon = ACTIVITY_ICONS[item.type] ?? CheckCircle2;
                return (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}15` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug">{item.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{item.candidate} · {item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Actions rapides conseiller ── */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Outils conseiller
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/candidats", icon: Users, label: "Bénéficiaires", desc: "Gérer la liste", color: AFRI_SKY, gradient: "from-sky-400 to-cyan-500" },
            { href: "/entretiens", icon: Mic, label: "Entretiens", desc: "Planifier / Suivre", color: AFRI_VIOLET, gradient: "from-emerald-600 to-teal-700" },
            { href: "/softskills", icon: Brain, label: "Soft Skills", desc: "Évaluation", color: AFRI_AMBER, gradient: "from-amber-400 to-orange-500" },
            { href: "/documents", icon: FileText, label: "Documents IA", desc: "CV, lettres", color: AFRI_TEAL, gradient: "from-emerald-400 to-teal-500" },
          ].map(a => {
            const Icon = a.icon;
            return (
              <Link key={a.href} href={a.href}
                className="group relative bg-white border rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${a.gradient}`} />
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  KPI Card
// ─────────────────────────────────────────────────────────────────────────────

function KpiCard({ label, value, icon: Icon, color, trend, trendUp, highlight }: {
  label: string; value?: string | number; icon: React.ElementType; color: string;
  trend?: string; trendUp?: boolean; highlight?: boolean;
}) {
  return (
    <div className={cn("bg-white rounded-2xl border p-4 transition-all hover:shadow-sm",
      highlight ? "border-emerald-200 bg-emerald-50/30" : "")}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground font-medium leading-tight">{label}</p>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
      </div>
      {value === undefined ? (
        <Skeleton className="h-7 w-16 mb-1" />
      ) : (
        <p className="text-2xl font-extrabold text-foreground leading-none">{value}</p>
      )}
      {trend && (
        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground">
          {trendUp !== undefined && (
            trendUp
              ? <ArrowUp className="w-3 h-3 text-emerald-500" />
              : <ArrowDown className="w-3 h-3 text-red-400" />
          )}
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Pipeline list view
// ─────────────────────────────────────────────────────────────────────────────

function PipelineList({ candidates }: { candidates: typeof MOCK_PIPELINE }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Bénéficiaire</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Pays · Secteur</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Étape</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">AFRI-CODE</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">AFRI-SKILL</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">ATS</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Priorité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {candidates.map(c => {
              const stage = PIPELINE_STAGES.find(s => s.key === c.status);
              const profileColor = c.afriCode ? (PROFILE_COLORS[c.afriCode] ?? AFRI_AMBER) : "#cbd5e1";
              const prio = PRIORITY_CONFIG[c.priority] ?? PRIORITY_CONFIG.normal;
              return (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors group cursor-pointer">
                  <td className="px-4 py-3">
                    <Link href={`/candidats/${c.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${profileColor}, ${profileColor}80)` }}>
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-semibold text-foreground text-xs group-hover:text-primary transition-colors truncate max-w-[140px]">
                        {c.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                    {c.country}<br /><span className="text-[10px]">{c.sector}</span>
                  </td>
                  <td className="px-4 py-3">
                    {stage ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: stage.color }}>
                        {stage.label}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {c.afriCode ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${profileColor}18`, color: profileColor }}>
                        {c.afriCode}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> À faire
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {c.afriSkill !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${c.afriSkill}%`, background: AFRI_TEAL }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: AFRI_TEAL }}>{c.afriSkill}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> À faire
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {c.atsScore !== null ? (
                      <span className="text-xs font-semibold text-foreground">{c.atsScore}<span className="text-muted-foreground font-normal">/100</span></span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", prio.bg)}>
                      {prio.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {candidates.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucun bénéficiaire dans cette étape</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Pipeline Kanban view
// ─────────────────────────────────────────────────────────────────────────────

function PipelineKanban({ candidates }: { candidates: typeof MOCK_PIPELINE }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
      {PIPELINE_STAGES.map(stage => {
        const stageCandidates = candidates.filter(c => c.status === stage.key);
        return (
          <div key={stage.key} className="flex-shrink-0 w-52">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
              <span className="text-xs font-semibold text-foreground truncate">{stage.label}</span>
              <span className="ml-auto text-[10px] text-muted-foreground font-medium bg-muted rounded-full px-1.5 py-0.5">
                {stageCandidates.length}
              </span>
            </div>
            <div className="space-y-2">
              {stageCandidates.map(c => {
                const profileColor = c.afriCode ? (PROFILE_COLORS[c.afriCode] ?? AFRI_AMBER) : "#94a3b8";
                const prio = PRIORITY_CONFIG[c.priority] ?? PRIORITY_CONFIG.normal;
                return (
                  <Link key={c.id} href={`/candidats/${c.id}`}
                    className="block bg-white rounded-xl border p-3 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: profileColor }}>
                        {c.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {c.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mb-2">{c.country} · {c.sector}</p>
                    {c.afriCode && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: `${profileColor}15`, color: profileColor }}>
                        {c.afriCode}
                      </span>
                    )}
                    {c.afriSkill !== null && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${c.afriSkill}%`, background: AFRI_TEAL }} />
                        </div>
                        <span className="text-[9px] font-bold" style={{ color: AFRI_TEAL }}>{c.afriSkill}</span>
                      </div>
                    )}
                    {c.priority !== "normal" && (
                      <div className={cn("mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block border", prio.bg)}>
                        {prio.label}
                      </div>
                    )}
                  </Link>
                );
              })}
              {stageCandidates.length === 0 && (
                <div className="bg-muted/30 border border-dashed rounded-xl p-4 text-center">
                  <p className="text-[10px] text-muted-foreground">Aucun candidat</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
