// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Espace Emploi (hub premium)
//  Tests AFRI propriétaires + résultats persistés
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight, Brain, Briefcase, CheckCircle2, ClipboardList,
  Clock, Compass, FileText, GraduationCap, Mic, Search,
  Sparkles, Target, TrendingUp, Upload, Zap, BarChart3,
  ChevronRight, Star, RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ── Types ────────────────────────────────────────────────────────────────────

interface AfriCodeResultStored {
  result: {
    primaryProfile: string;
    primaryScore: number;
    secondaryProfile: string;
    tagline: string;
    dimensionScores: Record<string, number>;
  };
  date: string;
}

interface AfriSkillResultStored {
  result: {
    globalScore: number;
    level: { label: string; badge: string; color: string };
    dimensionScores: Record<string, number>;
    forces: string[];
    axesDeProgres: string[];
  };
  date: string;
}

// ── Données nav ───────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    href: "/emploi/simulateur",
    icon: Mic,
    label: "Simuler un entretien",
    desc: "Entraînez-vous avec l'IA",
    badge: "IA · Vocal",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    href: "/emploi/cv-analyse",
    icon: Upload,
    label: "Analyser mon CV",
    desc: "Score ATS + conseils",
    badge: "IA · Instant",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    href: "/emploi/analyse-offre",
    icon: Search,
    label: "Analyser une offre",
    desc: "Match & mots-clés",
    badge: "IA · Nouveau",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    href: "/cv",
    icon: FileText,
    label: "Créer mon CV",
    desc: "Templates premium",
    badge: "Builder",
    gradient: "from-amber-600 to-yellow-600",
  },
];

const AFRI_TESTS = [
  {
    href: "/emploi/tests/afri-code",
    storageKey: "afri_code_result",
    icon: Compass,
    label: "AFRI-CODE",
    subtitle: "Test d'orientation professionnel",
    duration: "12–18 min",
    questions: 30,
    desc: "Découvrez votre profil métier africain parmi 6 archétypes : Bâtisseur, Visionnaire, Créateur, Humaniste, Leader ou Gardien.",
    tags: ["Orientation", "Métiers", "Afrique"],
    badge: "NOUVEAU",
    badgeColor: "bg-amber-400/15 text-amber-700 border border-amber-300/40",
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-200/60",
    featured: true,
  },
  {
    href: "/emploi/tests/afri-skill",
    storageKey: "afri_skill_result",
    icon: Target,
    label: "AFRI-SKILL",
    subtitle: "Test de préparation professionnelle",
    duration: "10–15 min",
    questions: 30,
    desc: "Évaluez vos 10 compétences transversales : communication, numérique, organisation, résolution, initiative et plus.",
    tags: ["Compétences", "Employabilité", "Soft Skills"],
    badge: "NOUVEAU",
    badgeColor: "bg-emerald-400/15 text-emerald-700 border border-emerald-300/40",
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-200/60",
    featured: true,
  },
  {
    href: "/emploi/tests/ikigai",
    storageKey: null,
    icon: Target,
    label: "Test IKIGAI",
    subtitle: "Sens & vocation",
    duration: "8–12 min",
    questions: 20,
    desc: "Trouvez votre raison d'être : passion, talent, mission et valeur économique.",
    tags: ["Sens", "Vocation"],
    badge: null,
    badgeColor: "",
    gradient: "from-emerald-600 to-teal-700",
    glow: "",
    featured: false,
  },
  {
    href: "/emploi/tests/personnalite",
    storageKey: null,
    icon: Brain,
    label: "Personnalité Pro",
    subtitle: "Profil de soft skills",
    duration: "8–12 min",
    questions: 24,
    desc: "Leadership, communication, adaptabilité — votre profil complet.",
    tags: ["Soft Skills", "Profil"],
    badge: null,
    badgeColor: "",
    gradient: "from-amber-600 to-yellow-600",
    glow: "",
    featured: false,
  },
];

const TOOLS = [
  { href: "/emploi/bilan", icon: ClipboardList, label: "Bilan de compétences" },
  { href: "/emploi/vae", icon: GraduationCap, label: "Évaluation VAE" },
  { href: "/emploi/tableau-de-bord", icon: TrendingUp, label: "Mon tableau de bord" },
  { href: "/parcours", icon: Briefcase, label: "Parcours métiers" },
];

// ── Profile label map ─────────────────────────────────────────────────────────

const PROFILE_COLORS: Record<string, string> = {
  BÂTISSEUR: "#E8813A",
  VISIONNAIRE: "#5BB8E0",
  CRÉATEUR: "#B8A9FF",
  HUMANISTE: "#2EB88A",
  LEADER: "#E85D5D",
  GARDIEN: "#F5C23E",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Page
// ─────────────────────────────────────────────────────────────────────────────

export default function EspaceEmploi() {
  const [afriCode, setAfriCode] = useState<AfriCodeResultStored | null>(null);
  const [afriSkill, setAfriSkill] = useState<AfriSkillResultStored | null>(null);

  useEffect(() => {
    try {
      const code = localStorage.getItem("afri_code_result");
      if (code) setAfriCode(JSON.parse(code));
      const skill = localStorage.getItem("afri_skill_result");
      if (skill) setAfriSkill(JSON.parse(skill));
    } catch {/* ignore */}
  }, []);

  const hasResults = afriCode || afriSkill;

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #1C1042 0%, #0D2B2B 100%)" }}>
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--afri-amber)" }} />
        <div className="absolute left-1/2 bottom-0 w-48 h-48 rounded-full blur-2xl opacity-10"
          style={{ background: "var(--afri-teal)" }} />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--afri-amber), var(--afri-gold))" }}>
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold mb-1">Bienvenue dans votre espace emploi</h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-xl">
              Découvrez votre profil métier africain, préparez vos entretiens et optimisez votre CV — avec l'IA à chaque étape.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs">
                <Zap className="w-3 h-3" style={{ color: "var(--afri-amber)" }} /> Tests AFRI propriétaires
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Contextualisé pour l'Afrique
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Résultats AFRI (si déjà passés) ── */}
      {hasResults && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Mes derniers résultats AFRI
            </h2>
            <span className="text-xs text-muted-foreground">Sauvegardé localement</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {afriCode && (
              <AfriCodeResultCard stored={afriCode} />
            )}
            {afriSkill && (
              <AfriSkillResultCard stored={afriSkill} />
            )}
          </div>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" /> Actions rapides
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                href={a.href}
                className="group relative bg-white border rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${a.gradient}`} />
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                <Badge className="mt-2 text-[9px] font-semibold px-1.5 py-0.5 bg-muted/80 text-muted-foreground border-0">
                  {a.badge}
                </Badge>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Tests AFRI (featured) ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> Tests d'orientation scientifiques
          </h2>
          <span className="text-xs text-muted-foreground">Analyse IA incluse</span>
        </div>

        {/* AFRI tests — large featured cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {AFRI_TESTS.filter(t => t.featured).map((test) => {
            const Icon = test.icon;
            const done = test.storageKey
              ? (test.storageKey === "afri_code_result" ? !!afriCode : !!afriSkill)
              : false;
            return (
              <Link
                key={test.href}
                href={test.href}
                className={`group relative bg-white border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden ${done ? "border-emerald-200" : ""}`}
              >
                {/* Top stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${test.gradient}`} />

                {/* Done badge */}
                {done && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Complété
                  </div>
                )}

                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${test.gradient} flex items-center justify-center mb-4 shadow-sm ${test.glow} shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-foreground">{test.label}</h3>
                  {test.badge && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${test.badgeColor}`}>
                      {test.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{test.subtitle}</p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
                  <Clock className="w-3 h-3" />
                  <span>{test.duration}</span>
                  <span>·</span>
                  <span>{test.questions} questions</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{test.desc}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {test.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 bg-muted/60 text-muted-foreground rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>

                <div className={`flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2 transition-all bg-gradient-to-r ${test.gradient} bg-clip-text text-transparent`}>
                  {done ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Repasser le test</span>
                    </>
                  ) : (
                    <>Démarrer le test <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" /></>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Autres tests — smaller row */}
        <div className="grid sm:grid-cols-2 gap-3">
          {AFRI_TESTS.filter(t => !t.featured).map((test) => {
            const Icon = test.icon;
            return (
              <Link
                key={test.href}
                href={test.href}
                className="group flex items-center gap-4 bg-white border rounded-xl px-4 py-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${test.gradient} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{test.label}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" />{test.duration} · {test.questions}q
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Other tools ── */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Autres outils</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-2.5 bg-white border rounded-xl px-3.5 py-2.5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs font-medium text-foreground truncate">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Recommended path ── */}
      <div className="rounded-2xl p-4 border"
        style={{ background: "linear-gradient(135deg, rgba(232,129,58,0.05), rgba(46,184,138,0.05))", borderColor: "rgba(232,129,58,0.2)" }}>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Parcours recommandé pour bien démarrer
        </h3>
        <div className="flex flex-col sm:flex-row gap-2">
          {[
            { step: 1, label: "AFRI-CODE", desc: "Votre profil métier", href: "/emploi/tests/afri-code", done: !!afriCode },
            { step: 2, label: "AFRI-SKILL", desc: "Vos compétences", href: "/emploi/tests/afri-skill", done: !!afriSkill },
            { step: 3, label: "Optimisez votre CV", desc: "Score ATS IA", href: "/emploi/cv-analyse", done: false },
            { step: 4, label: "Entraînez-vous", desc: "Simulateur IA", href: "/emploi/simulateur", done: false },
          ].map((s, i, arr) => (
            <div key={s.step} className="flex items-center gap-2 flex-1">
              <Link href={s.href} className={`flex-1 flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-all group ${s.done ? "bg-emerald-50 border-emerald-200" : "bg-white/80 hover:bg-white hover:border-primary/30"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${s.done ? "bg-emerald-500" : "bg-primary"}`}>
                  {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.step}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.done ? "Complété ✓" : s.desc}</p>
                </div>
              </Link>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 shrink-0 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  Result cards mini (résumé)
// ─────────────────────────────────────────────────────────────────────────────

function AfriCodeResultCard({ stored }: { stored: AfriCodeResultStored }) {
  const { result, date } = stored;
  const color = PROFILE_COLORS[result.primaryProfile] ?? "#E8813A";
  const dateLabel = new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  return (
    <Link href="/emploi/tests/afri-code"
      className="group relative bg-white border rounded-2xl p-5 hover:shadow-md transition-all overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">AFRI-CODE · {dateLabel}</span>
          <h3 className="text-base font-extrabold mt-0.5" style={{ color }}>{result.primaryProfile}</h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{result.tagline}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Compass className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${result.primaryScore}%`, background: color }} />
        </div>
        <span className="text-xs font-bold" style={{ color }}>{result.primaryScore}%</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">Profil secondaire : {result.secondaryProfile}</p>
      <div className="flex items-center gap-1 mt-3 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color }}>
        <BarChart3 className="w-3.5 h-3.5" /> Voir mon rapport complet
      </div>
    </Link>
  );
}

function AfriSkillResultCard({ stored }: { stored: AfriSkillResultStored }) {
  const { result, date } = stored;
  const color = result.level.color ?? "#2EB88A";
  const dateLabel = new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  return (
    <Link href="/emploi/tests/afri-skill"
      className="group relative bg-white border rounded-2xl p-5 hover:shadow-md transition-all overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">AFRI-SKILL · {dateLabel}</span>
          <h3 className="text-base font-extrabold mt-0.5" style={{ color }}>{result.level.label}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{result.level.badge}</p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Target className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      {/* Score circle mini */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-extrabold text-white shrink-0"
          style={{ background: `conic-gradient(${color} ${result.globalScore * 3.6}deg, #f1f5f9 0deg)` }}>
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-xs font-extrabold" style={{ color }}>
            {result.globalScore}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Forces : {(result.forces ?? []).slice(0, 2).join(", ")}</p>
          {(result.axesDeProgres ?? []).length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">À renforcer : {(result.axesDeProgres ?? [])[0]}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-3 text-xs font-semibold group-hover:gap-2 transition-all" style={{ color }}>
        <BarChart3 className="w-3.5 h-3.5" /> Voir mon rapport complet
      </div>
    </Link>
  );
}
