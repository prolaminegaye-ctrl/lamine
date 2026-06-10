// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — CV Builder Premium · Style CVDesignr · 8 Templates · Export PDF
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useRef, useState } from "react";
import {
  AlertCircle, Award, BookOpen, CheckCircle2, ChevronDown, ChevronUp,
  Download, FileText, Globe2, Heart, Languages, LayoutTemplate,
  Lightbulb, Loader2, Plus, Sparkles, Star, Trash2, TrendingUp,
  User, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type Template = "moderne" | "classique" | "executive" | "minimaliste" | "colonne" | "creatif" | "ats" | "africain";

interface Language { name: string; level: string }
interface Interest { label: string }
interface Experience { title: string; company: string; period: string; location: string; description: string }
interface Education { degree: string; school: string; year: string; mention?: string }

interface Profile {
  name: string; title: string; email: string; phone: string;
  city: string; linkedin: string; website: string;
  summary: string; skills: string; atouts: string;
  experiences: Experience[]; education: Education[];
  languages: Language[]; interests: Interest[];
}

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES: Record<Template, {
  label: string; description: string; accent: string; bg: string;
  preview: string; // mini visual fingerprint for the grid
}> = {
  moderne: {
    label: "Moderne", description: "Bande colorée · épuré",
    accent: "#6C4FDA", bg: "#f5f3ff",
    preview: "sidebar-left",
  },
  classique: {
    label: "Classique", description: "Timeless · universel",
    accent: "#0f766e", bg: "#f0fdfa",
    preview: "header-line",
  },
  executive: {
    label: "Executive", description: "Prestige · directions",
    accent: "#1e3a5f", bg: "#eff6ff",
    preview: "dark-header",
  },
  minimaliste: {
    label: "Minimaliste", description: "Ultra épuré · start-up",
    accent: "#334155", bg: "#f8fafc",
    preview: "dots",
  },
  colonne: {
    label: "2 Colonnes", description: "Dense · technique",
    accent: "#059669", bg: "#f0fdf4",
    preview: "two-col",
  },
  creatif: {
    label: "Créatif", description: "Profils créatifs",
    accent: "#c2410c", bg: "#fff7ed",
    preview: "accent-block",
  },
  ats: {
    label: "ATS Pure", description: "Systèmes RH · parsing",
    accent: "#1a1a2e", bg: "#fafafa",
    preview: "plain",
  },
  africain: {
    label: "Africain", description: "Marché africain · warm",
    accent: "#E8813A", bg: "#fffbf5",
    preview: "warm-header",
  },
};

const LANG_LEVELS = ["A1 – Débutant", "A2 – Élémentaire", "B1 – Intermédiaire", "B2 – Avancé", "C1 – Courant", "C2 – Bilingue", "Langue maternelle"];

const REGION_HINTS: Record<string, string[]> = {
  "Afrique francophone": ["polyvalence", "terrain", "mobile money", "marchés locaux", "SYSCOHADA", "UEMOA"],
  "Europe": ["RGPD", "réalisations chiffrées", "langues CECRL", "format sobre", "compétences numériques"],
  "International": ["leadership", "impact metrics", "ATS keywords", "anglais courant", "mobilité"],
  "Maghreb": ["bilingue", "marché MENA", "export", "coopération", "certifications"],
};

// ─── Default profile ──────────────────────────────────────────────────────────

const defaultProfile: Profile = {
  name: "Aminata Diallo",
  title: "Responsable Marketing Digital",
  email: "aminata.diallo@gmail.com",
  phone: "+221 77 123 45 67",
  city: "Dakar, Sénégal",
  linkedin: "linkedin.com/in/aminata-diallo",
  website: "",
  summary: "Professionnelle du marketing digital avec 5 ans d'expérience dans la stratégie de contenu, la gestion de campagnes digitales et l'analyse data pour des marchés africains en forte croissance.",
  skills: "Marketing digital, SEO/SEM, Google Analytics, Canva, Meta Ads, Community management, Stratégie de contenu, Email marketing",
  atouts: "Leadership · Créativité · Rigueur analytique · Adaptabilité",
  experiences: [
    { title: "Responsable Marketing Digital", company: "AfriTech Solutions", period: "2022 – aujourd'hui", location: "Dakar, Sénégal", description: "• Pilotage de la stratégie digitale (budget 50M FCFA/an)\n• +120% de trafic organique en 12 mois grâce au SEO\n• Gestion d'une communauté de 45 000 abonnés" },
    { title: "Chargée de Communication", company: "Orange Sénégal", period: "2019 – 2022", location: "Dakar", description: "• Création et animation des comptes sociaux (Instagram, Facebook, LinkedIn)\n• Production de 200+ contenus/mois en lien avec les équipes créatives" },
  ],
  education: [
    { degree: "Master en Marketing & Communication", school: "Université Cheikh Anta Diop", year: "2018", mention: "Mention Bien" },
    { degree: "Licence en Sciences de Gestion", school: "UCAD", year: "2016", mention: "" },
  ],
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "B2 – Avancé" },
    { name: "Wolof", level: "Langue maternelle" },
  ],
  interests: [
    { label: "Entrepreneuriat" },
    { label: "Design graphique" },
    { label: "Podcast Tech Afrique" },
    { label: "Football" },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CvEngine() {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<Template>("moderne");
  const [region, setRegion] = useState("Afrique francophone");
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [openSection, setOpenSection] = useState<string>("experience");

  // ── Updaters ──────────────────────────────────────────────────────────────

  function updateField(field: keyof Profile, value: any) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  function updateExp(idx: number, field: keyof Experience, value: string) {
    const arr = [...profile.experiences];
    arr[idx] = { ...arr[idx], [field]: value };
    updateField("experiences", arr);
  }

  function addExp() {
    updateField("experiences", [...profile.experiences, { title: "", company: "", period: "", location: "", description: "" }]);
  }

  function removeExp(idx: number) {
    updateField("experiences", profile.experiences.filter((_, i) => i !== idx));
  }

  function updateEdu(idx: number, field: keyof Education, value: string) {
    const arr = [...profile.education];
    arr[idx] = { ...arr[idx], [field]: value };
    updateField("education", arr);
  }

  function addEdu() {
    updateField("education", [...profile.education, { degree: "", school: "", year: "", mention: "" }]);
  }

  function removeEdu(idx: number) {
    updateField("education", profile.education.filter((_, i) => i !== idx));
  }

  function addLanguage() {
    updateField("languages", [...profile.languages, { name: "", level: "B1 – Intermédiaire" }]);
  }

  function updateLanguage(idx: number, field: keyof Language, value: string) {
    const arr = [...profile.languages];
    arr[idx] = { ...arr[idx], [field]: value };
    updateField("languages", arr);
  }

  function removeLanguage(idx: number) {
    updateField("languages", profile.languages.filter((_, i) => i !== idx));
  }

  function addInterest() {
    updateField("interests", [...profile.interests, { label: "" }]);
  }

  function updateInterest(idx: number, value: string) {
    const arr = [...profile.interests];
    arr[idx] = { label: value };
    updateField("interests", arr);
  }

  function removeInterest(idx: number) {
    updateField("interests", profile.interests.filter((_, i) => i !== idx));
  }

  // ── ATS Score ─────────────────────────────────────────────────────────────

  const atsDetails = useMemo(() => {
    const text = [profile.name, profile.title, profile.summary, profile.skills,
      ...profile.experiences.map(e => `${e.title} ${e.description}`),
      ...profile.education.map(e => e.degree),
      ...profile.languages.map(l => l.name)].join(" ").toLowerCase();

    const checks: Record<string, boolean> = {
      "Résultats chiffrés (%, FCFA, nombres)": /\d/.test(text),
      "Résumé professionnel complet": profile.summary.length > 100,
      "5+ compétences listées": profile.skills.split(",").filter(Boolean).length >= 5,
      "Expérience détaillée": profile.experiences.some(e => e.description.length > 50),
      "Formation renseignée": profile.education.length > 0 && !!profile.education[0].degree,
      "Langues renseignées": profile.languages.length > 0,
      "Email valide": /\S+@\S+/.test(profile.email),
      "Mots-clés marché": REGION_HINTS[region]?.some(kw => text.includes(kw.toLowerCase())) ?? false,
    };
    const score = Math.round((Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100);
    return { score, checks };
  }, [profile, region]);

  // ── AI Generation ─────────────────────────────────────────────────────────

  async function generateWithAI(section: string) {
    setAiLoading(section);
    try {
      const res = await fetch("/api/cv/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section,
          jobTitle: profile.title,
          experience: profile.experiences.map(e => `${e.title} chez ${e.company} (${e.period}): ${e.description}`).join("\n"),
          skills: profile.skills,
          languages: profile.languages.map(l => `${l.name} (${l.level})`).join(", "),
          region,
          currentContent: section === "summary" ? profile.summary : section === "skills" ? profile.skills : profile.atouts,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const content = data.content ?? "";

      if (section === "summary") {
        updateField("summary", content);
        toast({ title: "Résumé généré — cohérent avec votre titre" });
      } else if (section === "skills") {
        updateField("skills", content);
        toast({ title: "Compétences générées par l'IA" });
      } else if (section === "atouts") {
        updateField("atouts", content);
        toast({ title: "Atouts générés" });
      } else if (section === "title") {
        const first = content.split("|")[0].trim();
        updateField("title", first);
        toast({ title: "Titre optimisé" });
      }
    } catch {
      // fallback local
      const fallbacks: Record<string, string> = {
        summary: `${profile.title} avec une expérience confirmée dans ${profile.skills.split(",")[0]?.trim() || "son domaine"}. Reconnu(e) pour sa rigueur, sa capacité d'adaptation et son impact mesurable sur les résultats.`,
        skills: profile.skills || "Gestion de projet, Communication, Analyse de données, Leadership, Outils digitaux",
        atouts: "Leadership naturel · Esprit analytique · Adaptabilité · Orientation résultats",
        title: profile.title,
      };
      if (section in fallbacks) {
        updateField(section as keyof Profile, fallbacks[section]);
        toast({ title: `Généré (mode local)` });
      }
    } finally {
      setAiLoading(null);
    }
  }

  // ── PDF Export ────────────────────────────────────────────────────────────

  // ── PDF Export — HTML propre A4 + impression navigateur ──────────────────
  function exportPdf() {
    setExportLoading(true);
    try {
      const tpl = TEMPLATES[template];
      const ac = tpl.accent;

      const expHtml = profile.experiences.map(e => `
        <div class="no-break" style="margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <strong style="font-size:13px;color:#0f172a">${e.title}</strong>
            <span style="font-size:11px;color:#94a3b8">${e.period || ""}</span>
          </div>
          <div style="font-size:12px;color:${ac};font-weight:600;margin:2px 0 5px">${e.company}${e.location ? ` · ${e.location}` : ""}</div>
          ${e.description ? `<div style="font-size:12px;color:#475569;white-space:pre-line;line-height:1.6">${e.description}</div>` : ""}
        </div>`).join("");

      const eduHtml = profile.education.map(e => `
        <div class="no-break" style="margin-bottom:10px">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <strong style="font-size:13px;color:#0f172a">${e.degree}</strong>
            <span style="font-size:11px;color:#94a3b8">${e.year}</span>
          </div>
          <div style="font-size:12px;color:${ac}">${e.school}${e.mention ? ` · <em>${e.mention}</em>` : ""}</div>
        </div>`).join("");

      const langHtml = profile.languages.map(l => {
        const lvlIdx = LANG_LEVELS.indexOf(l.level);
        const pct = lvlIdx < 0 ? 70 : Math.round(((lvlIdx + 1) / LANG_LEVELS.length) * 100);
        return `<div style="margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:#374151">
            <span style="font-weight:600">${l.name}</span><span style="color:#94a3b8">${l.level}</span>
          </div>
          <div style="height:3px;background:#e2e8f0;border-radius:3px;margin-top:4px">
            <div style="height:100%;width:${pct}%;background:${ac};border-radius:3px"></div>
          </div>
        </div>`;
      }).join("");

      const skillsArr = profile.skills.split(",").map(s => s.trim()).filter(Boolean);
      const skillsHtml = skillsArr.map(s =>
        `<span style="display:inline-block;background:${ac}18;color:${ac};border:1px solid ${ac}40;border-radius:5px;padding:3px 10px;font-size:11.5px;margin:2px 3px;font-weight:500">${s}</span>`
      ).join("");

      const atoutsArr = profile.atouts.split(",").map(s => s.trim()).filter(Boolean);
      const atoutsHtml = atoutsArr.map(s =>
        `<span style="display:inline-block;background:#f1f5f9;color:#334155;border-radius:5px;padding:3px 10px;font-size:11.5px;margin:2px 3px">✦ ${s}</span>`
      ).join("");

      const interestsHtml = profile.interests.length
        ? profile.interests.map(i => `<span style="font-size:12px;color:#64748b;margin-right:16px">◆ ${i.label}</span>`).join("")
        : "";

      const sec = (title: string, body: string) =>
        body ? `<div class="section no-break">
          <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${ac};
            border-bottom:2px solid ${ac};padding-bottom:5px;margin:22px 0 12px">${title}</h2>
          ${body}
        </div>` : "";

      // Header selon template
      let header = "";
      if (template === "executive") {
        header = `<div style="background:${ac};color:white;padding:32px 40px;margin:-40px -40px 28px;-webkit-print-color-adjust:exact;print-color-adjust:exact">
          <h1 style="font-size:28px;font-weight:700;margin:0;letter-spacing:-0.5px">${profile.name}</h1>
          <p style="font-size:14px;margin:5px 0 0;opacity:0.85;font-weight:500">${profile.title}</p>
          <div style="display:flex;gap:20px;margin-top:12px;font-size:11px;opacity:0.7;flex-wrap:wrap">
            ${profile.email ? `<span>✉ ${profile.email}</span>` : ""}${profile.phone ? `<span>✆ ${profile.phone}</span>` : ""}${profile.city ? `<span>⚲ ${profile.city}</span>` : ""}${profile.linkedin ? `<span>${profile.linkedin}</span>` : ""}
          </div>
        </div>`;
      } else if (template === "africain" || template === "creatif") {
        header = `<div style="background:${ac};color:white;padding:28px 40px;margin:-40px -40px 24px;border-radius:0 0 20px 20px;-webkit-print-color-adjust:exact;print-color-adjust:exact">
          <h1 style="font-size:26px;font-weight:700;margin:0">${profile.name}</h1>
          <p style="font-size:13px;margin:4px 0 0;opacity:0.9">${profile.title}</p>
          <div style="display:flex;gap:16px;margin-top:10px;font-size:11px;opacity:0.75;flex-wrap:wrap">
            ${profile.email ? `<span>${profile.email}</span>` : ""}${profile.phone ? `<span>${profile.phone}</span>` : ""}${profile.city ? `<span>${profile.city}</span>` : ""}
          </div>
        </div>`;
      } else if (template === "moderne") {
        header = `<div style="padding-left:18px;border-left:5px solid ${ac};margin-bottom:24px">
          <h1 style="font-size:26px;font-weight:700;margin:0;color:#0f172a">${profile.name}</h1>
          <p style="font-size:13.5px;color:${ac};margin:4px 0 0;font-weight:600">${profile.title}</p>
          <div style="display:flex;gap:18px;margin-top:8px;font-size:11px;color:#64748b;flex-wrap:wrap">
            ${profile.email ? `<span>${profile.email}</span>` : ""}${profile.phone ? `<span>${profile.phone}</span>` : ""}${profile.city ? `<span>${profile.city}</span>` : ""}${profile.linkedin ? `<span>${profile.linkedin}</span>` : ""}
          </div>
        </div>`;
      } else if (template === "ats") {
        header = `<div style="margin-bottom:20px">
          <h1 style="font-size:22px;font-weight:700;margin:0;color:#000">${profile.name}</h1>
          <p style="font-size:13px;margin:3px 0;color:#333">${profile.title}</p>
          <p style="font-size:11px;color:#666;margin-top:6px">${[profile.email, profile.phone, profile.city, profile.linkedin].filter(Boolean).join(" | ")}</p>
          <hr style="margin-top:10px;border:none;border-top:1px solid #000"/>
        </div>`;
      } else {
        header = `<div style="border-bottom:2.5px solid ${ac};padding-bottom:18px;margin-bottom:22px">
          <h1 style="font-size:26px;font-weight:700;margin:0;color:#0f172a">${profile.name}</h1>
          <p style="font-size:13.5px;color:${ac};margin:4px 0 0">${profile.title}</p>
          <div style="display:flex;gap:20px;margin-top:9px;font-size:11px;color:#64748b;flex-wrap:wrap">
            ${profile.email ? `<span>${profile.email}</span>` : ""}${profile.phone ? `<span>${profile.phone}</span>` : ""}${profile.city ? `<span>${profile.city}</span>` : ""}${profile.linkedin ? `<span>${profile.linkedin}</span>` : ""}
          </div>
        </div>`;
      }

      const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<title>CV — ${profile.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,Helvetica,sans-serif;font-size:13px;color:#1e293b;background:#fff;line-height:1.5}
  @page{size:A4;margin:0}
  @media print{
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .no-break{page-break-inside:avoid}
    .section{page-break-inside:avoid}
  }
  .page{width:210mm;min-height:297mm;padding:40px;background:#fff;margin:0 auto}
</style>
</head><body>
<div class="page">
  ${header}
  ${profile.summary ? sec("Profil professionnel", `<p style="font-size:13px;line-height:1.75;color:#374151">${profile.summary}</p>`) : ""}
  ${skillsHtml ? sec("Compétences", `<div style="line-height:2.2">${skillsHtml}</div>`) : ""}
  ${expHtml ? sec("Expériences professionnelles", expHtml) : ""}
  ${eduHtml ? sec("Formation", eduHtml) : ""}
  ${langHtml ? sec("Langues", langHtml) : ""}
  ${atoutsHtml ? sec("Atouts clés", `<div style="line-height:2.2">${atoutsHtml}</div>`) : ""}
  ${interestsHtml ? sec("Centres d'intérêt", `<div style="line-height:2.2">${interestsHtml}</div>`) : ""}
</div>
<script>window.onload=function(){setTimeout(function(){window.print();},800);};<\/script>
</body></html>`;

      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        toast({ title: "✓ CV prêt pour l'export", description: "Dans la boîte d'impression → Enregistrer en PDF" });
      } else {
        toast({ title: "Popup bloqué — autorisez les popups", variant: "destructive" });
      }
    } catch {
      toast({ title: "Erreur d'export", variant: "destructive" });
    } finally {
      setExportLoading(false);
    }
  }
  const accent = TEMPLATES[template].accent;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">

      {/* Header */}
      <section className="rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <FileText className="h-4 w-4" /> CV Builder Premium
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight">Créez votre CV professionnel · 8 modèles · Export PDF</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-xl border bg-background">
              <div className={`text-2xl font-black ${atsDetails.score >= 80 ? "text-emerald-500" : atsDetails.score >= 60 ? "text-blue-500" : "text-orange-500"}`}>
                {atsDetails.score}
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground">Score ATS</div>
            </div>
            <Button onClick={exportPdf} disabled={exportLoading} size="lg" className="gap-2">
              {exportLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Exporter PDF
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[480px_1fr]">

        {/* ── Left panel — Studio ── */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutTemplate className="h-4 w-4 text-primary" /> Studio d'édition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="infos">
              <TabsList className="grid w-full grid-cols-4 text-xs">
                <TabsTrigger value="infos"><User className="h-3 w-3 mr-1" />Profil</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="design"><Star className="h-3 w-3 mr-1" />Design</TabsTrigger>
                <TabsTrigger value="ats"><TrendingUp className="h-3 w-3 mr-1" />ATS</TabsTrigger>
              </TabsList>

              {/* ── Onglet Profil ── */}
              <TabsContent value="infos" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InlineField label="Prénom & Nom" value={profile.name} onChange={v => updateField("name", v)} />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs">Titre / Poste</Label>
                      <AiBtn label="Optimiser" loading={aiLoading === "title"} onClick={() => generateWithAI("title")} />
                    </div>
                    <Input className="text-sm" value={profile.title} onChange={e => updateField("title", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InlineField label="Email" value={profile.email} onChange={v => updateField("email", v)} type="email" />
                  <InlineField label="Téléphone" value={profile.phone} onChange={v => updateField("phone", v)} />
                </div>
                <InlineField label="Ville / Pays" value={profile.city} onChange={v => updateField("city", v)} />
                <div className="grid grid-cols-2 gap-3">
                  <InlineField label="LinkedIn" value={profile.linkedin} onChange={v => updateField("linkedin", v)} />
                  <InlineField label="Portfolio / Site" value={profile.website} onChange={v => updateField("website", v)} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">Résumé professionnel</Label>
                    <AiBtn label="Générer" loading={aiLoading === "summary"} onClick={() => generateWithAI("summary")} />
                  </div>
                  <Textarea value={profile.summary} rows={4} className="text-xs" onChange={e => updateField("summary", e.target.value)} placeholder="Décrivez votre profil en 3-4 lignes percutantes..." />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">Compétences (séparées par des virgules)</Label>
                    <AiBtn label="Suggérer" loading={aiLoading === "skills"} onClick={() => generateWithAI("skills")} />
                  </div>
                  <Textarea value={profile.skills} rows={2} className="text-xs" onChange={e => updateField("skills", e.target.value)} />
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {profile.skills.split(",").filter(Boolean).slice(0, 8).map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${accent}18`, color: accent }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">Atouts clés (soft skills)</Label>
                    <AiBtn label="Générer" loading={aiLoading === "atouts"} onClick={() => generateWithAI("atouts")} />
                  </div>
                  <Input className="text-xs" value={profile.atouts} onChange={e => updateField("atouts", e.target.value)} placeholder="Leadership · Créativité · Rigueur · Adaptabilité" />
                </div>
              </TabsContent>

              {/* ── Onglet Sections ── */}
              <TabsContent value="sections" className="mt-4 space-y-3">

                {/* Expériences */}
                <Accordion
                  id="experience" open={openSection} onToggle={setOpenSection}
                  icon={<FileText className="h-3.5 w-3.5" />} title="Expériences professionnelles"
                  action={<button onClick={addExp} className="text-xs text-primary flex items-center gap-0.5 hover:opacity-70"><Plus className="h-3 w-3" />Ajouter</button>}
                >
                  {profile.experiences.map((exp, idx) => (
                    <div key={idx} className="rounded-lg border p-3 space-y-2 mb-2 relative group">
                      <button onClick={() => removeExp(idx)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <MiniField label="Titre du poste" value={exp.title} onChange={v => updateExp(idx, "title", v)} />
                        <MiniField label="Entreprise" value={exp.company} onChange={v => updateExp(idx, "company", v)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <MiniField label="Période" value={exp.period} onChange={v => updateExp(idx, "period", v)} placeholder="2022 – 2024" />
                        <MiniField label="Lieu" value={exp.location} onChange={v => updateExp(idx, "location", v)} />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Description (commencez par • pour les bullet points)</Label>
                        <Textarea value={exp.description} rows={3} className="text-xs mt-0.5" onChange={e => updateExp(idx, "description", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </Accordion>

                {/* Formation */}
                <Accordion
                  id="education" open={openSection} onToggle={setOpenSection}
                  icon={<BookOpen className="h-3.5 w-3.5" />} title="Formation"
                  action={<button onClick={addEdu} className="text-xs text-primary flex items-center gap-0.5 hover:opacity-70"><Plus className="h-3 w-3" />Ajouter</button>}
                >
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="rounded-lg border p-3 space-y-2 mb-2 relative group">
                      <button onClick={() => removeEdu(idx)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <MiniField label="Diplôme / Certification" value={edu.degree} onChange={v => updateEdu(idx, "degree", v)} />
                      <div className="grid grid-cols-2 gap-2">
                        <MiniField label="École / Université" value={edu.school} onChange={v => updateEdu(idx, "school", v)} />
                        <MiniField label="Année" value={edu.year} onChange={v => updateEdu(idx, "year", v)} placeholder="2022" />
                      </div>
                      <MiniField label="Mention (optionnel)" value={edu.mention ?? ""} onChange={v => updateEdu(idx, "mention", v)} placeholder="Mention Bien" />
                    </div>
                  ))}
                </Accordion>

                {/* Langues */}
                <Accordion
                  id="languages" open={openSection} onToggle={setOpenSection}
                  icon={<Languages className="h-3.5 w-3.5" />} title="Langues"
                  action={<button onClick={addLanguage} className="text-xs text-primary flex items-center gap-0.5 hover:opacity-70"><Plus className="h-3 w-3" />Ajouter</button>}
                >
                  {profile.languages.map((lang, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Input
                        className="text-xs flex-1" value={lang.name}
                        onChange={e => updateLanguage(idx, "name", e.target.value)}
                        placeholder="Langue"
                      />
                      <Select value={lang.level} onValueChange={v => updateLanguage(idx, "level", v)}>
                        <SelectTrigger className="text-xs w-44"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {LANG_LEVELS.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <button onClick={() => removeLanguage(idx)} className="text-muted-foreground hover:text-red-500 shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </Accordion>

                {/* Centres d'intérêt */}
                <Accordion
                  id="interests" open={openSection} onToggle={setOpenSection}
                  icon={<Heart className="h-3.5 w-3.5" />} title="Centres d'intérêt"
                  action={<button onClick={addInterest} className="text-xs text-primary flex items-center gap-0.5 hover:opacity-70"><Plus className="h-3 w-3" />Ajouter</button>}
                >
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((int, idx) => (
                      <div key={idx} className="flex items-center gap-1 bg-muted rounded-full px-2 py-1">
                        <Input
                          className="border-0 bg-transparent text-xs p-0 h-auto w-28 focus-visible:ring-0"
                          value={int.label}
                          onChange={e => updateInterest(idx, e.target.value)}
                          placeholder="Centre d'intérêt"
                        />
                        <button onClick={() => removeInterest(idx)} className="text-muted-foreground hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Accordion>
              </TabsContent>

              {/* ── Onglet Design ── */}
              <TabsContent value="design" className="mt-4 space-y-4">
                <div>
                  <Label className="text-xs font-semibold mb-2 block">Modèle de CV</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(TEMPLATES) as [Template, typeof TEMPLATES[Template]][]).map(([key, tpl]) => (
                      <button
                        key={key}
                        onClick={() => setTemplate(key)}
                        className={`rounded-xl border-2 p-3 text-left transition-all ${template === key ? "border-primary shadow-sm" : "border-border hover:border-primary/40"}`}
                      >
                        {/* Mini preview */}
                        <TemplateMiniPreview type={tpl.preview} accent={tpl.accent} />
                        <div className="mt-2 text-xs font-bold text-foreground">{tpl.label}</div>
                        <div className="text-[10px] text-muted-foreground">{tpl.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Marché cible</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(REGION_HINTS).map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {REGION_HINTS[region]?.map(h => (
                      <Badge key={h} variant="secondary" className="text-[10px] cursor-pointer" onClick={() => updateField("skills", profile.skills ? `${profile.skills}, ${h}` : h)}>
                        + {h}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ── Onglet ATS ── */}
              <TabsContent value="ats" className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Score ATS global</span>
                  <span className={`text-2xl font-black ${atsDetails.score >= 80 ? "text-emerald-500" : atsDetails.score >= 60 ? "text-blue-500" : "text-orange-500"}`}>
                    {atsDetails.score}/100
                  </span>
                </div>
                <Progress value={atsDetails.score} className="h-2" />
                <div className="space-y-1.5 mt-3">
                  {Object.entries(atsDetails.checks).map(([label, ok]) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      {ok
                        ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        : <AlertCircle className="h-3.5 w-3.5 shrink-0 text-orange-400" />}
                      <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground flex gap-2">
                  <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                  Ajoutez des résultats chiffrés (%, FCFA, durées) dans chaque expérience pour booster votre score ATS et l'impact sur les recruteurs.
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* ── Right panel — CV Preview ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">Format A4</Badge>
              <Badge variant="outline" className="text-xs">{TEMPLATES[template].label}</Badge>
              <Badge variant="outline" className="text-xs">{region}</Badge>
            </div>
            <Button onClick={exportPdf} disabled={exportLoading} variant="outline" size="sm" className="gap-2">
              {exportLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
              Télécharger PDF
            </Button>
          </div>

          <div className="overflow-auto rounded-xl border bg-muted/30 p-4 shadow-inner">
            <div
              ref={previewRef}
              className="mx-auto bg-white shadow-lg"
              style={{ width: 744, minHeight: 1052 }}
            >
              <CvPreview profile={profile} template={template} accent={accent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Accordion helper ─────────────────────────────────────────────────────────

function Accordion({ id, open, onToggle, icon, title, action, children }: {
  id: string; open: string; onToggle: (id: string) => void;
  icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  const isOpen = open === id;
  return (
    <div className="rounded-xl border overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors"
        onClick={() => onToggle(isOpen ? "" : id)}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          {icon} {title}
        </div>
        <div className="flex items-center gap-2">
          {action && <span onClick={e => e.stopPropagation()}>{action}</span>}
          {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </div>
      </button>
      {isOpen && <div className="p-3">{children}</div>}
    </div>
  );
}

function InlineField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input className="mt-0.5 text-sm h-8" type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function MiniField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label className="text-[10px] text-muted-foreground">{label}</Label>
      <Input className="mt-0.5 text-xs h-7" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function AiBtn({ label, loading, onClick }: { label: string; loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} className="flex items-center gap-1 text-[10px] text-primary hover:opacity-70 disabled:opacity-40 font-semibold">
      {loading ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5" />}
      {label}
    </button>
  );
}

// ─── Template Mini Preview ────────────────────────────────────────────────────

function TemplateMiniPreview({ type, accent }: { type: string; accent: string }) {
  const base = "w-full rounded overflow-hidden bg-white border";
  const h = "h-16";
  if (type === "sidebar-left") return (
    <div className={`${base} ${h} flex`}>
      <div className="w-5 h-full" style={{ background: accent }} />
      <div className="flex-1 p-1.5 space-y-1">
        <div className="h-2 w-16 rounded" style={{ background: accent }} />
        <div className="h-1.5 w-12 bg-gray-200 rounded" />
        <div className="h-1 w-full bg-gray-100 rounded mt-1" />
        <div className="h-1 w-4/5 bg-gray-100 rounded" />
      </div>
    </div>
  );
  if (type === "header-line") return (
    <div className={`${base} ${h} p-1.5`}>
      <div className="h-2 w-20 rounded mb-1" style={{ background: accent }} />
      <div className="h-0.5 w-full rounded mb-1.5" style={{ background: accent }} />
      <div className="space-y-0.5">
        <div className="h-1 w-full bg-gray-100 rounded" />
        <div className="h-1 w-4/5 bg-gray-100 rounded" />
      </div>
    </div>
  );
  if (type === "dark-header") return (
    <div className={`${base} ${h}`}>
      <div className="h-5 w-full px-2 py-1" style={{ background: accent }}>
        <div className="h-1.5 w-14 bg-white/70 rounded" />
      </div>
      <div className="p-1.5 space-y-0.5">
        <div className="h-1 w-full bg-gray-100 rounded" />
        <div className="h-1 w-4/5 bg-gray-100 rounded" />
      </div>
    </div>
  );
  if (type === "two-col") return (
    <div className={`${base} ${h} flex`}>
      <div className="w-16 p-1.5 space-y-0.5" style={{ background: `${accent}12` }}>
        <div className="h-1 w-full bg-gray-200 rounded" />
        <div className="h-1 w-3/4 bg-gray-200 rounded" />
        <div className="h-1 w-full bg-gray-200 rounded" />
      </div>
      <div className="flex-1 p-1.5 space-y-0.5">
        <div className="h-1.5 w-12 rounded" style={{ background: accent }} />
        <div className="h-1 w-full bg-gray-100 rounded" />
        <div className="h-1 w-4/5 bg-gray-100 rounded" />
      </div>
    </div>
  );
  if (type === "accent-block") return (
    <div className={`${base} ${h}`}>
      <div className="h-8 w-full p-2 flex items-end" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}>
        <div className="h-2 w-16 bg-white/80 rounded" />
      </div>
      <div className="p-1.5 space-y-0.5">
        <div className="h-1 w-4/5 bg-gray-100 rounded" />
      </div>
    </div>
  );
  if (type === "warm-header") return (
    <div className={`${base} ${h}`}>
      <div className="h-5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, #2EB88A)` }} />
      <div className="p-1.5 space-y-0.5">
        <div className="h-1.5 w-14 rounded" style={{ background: accent }} />
        <div className="h-1 w-full bg-gray-100 rounded" />
      </div>
    </div>
  );
  // dots & plain
  return (
    <div className={`${base} ${h} p-1.5 space-y-0.5`}>
      <div className="h-2 w-16 rounded" style={{ background: accent }} />
      <div className="h-1 w-full bg-gray-100 rounded" />
      <div className="h-1 w-4/5 bg-gray-100 rounded" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  CV Preview renderers (8 templates)
// ─────────────────────────────────────────────────────────────────────────────

function CvPreview({ profile, template, accent }: { profile: Profile; template: Template; accent: string }) {
  const skills = profile.skills.split(",").map(s => s.trim()).filter(Boolean);
  const atouts = profile.atouts.split("·").map(s => s.trim()).filter(Boolean);

  switch (template) {
    case "moderne": return <TplModerne p={profile} accent={accent} skills={skills} atouts={atouts} />;
    case "classique": return <TplClassique p={profile} accent={accent} skills={skills} atouts={atouts} />;
    case "executive": return <TplExecutive p={profile} accent={accent} skills={skills} atouts={atouts} />;
    case "colonne": return <TplColonne p={profile} accent={accent} skills={skills} atouts={atouts} />;
    case "creatif": return <TplCreatif p={profile} accent={accent} skills={skills} atouts={atouts} />;
    case "africain": return <TplAfricain p={profile} accent={accent} skills={skills} atouts={atouts} />;
    case "ats": return <TplATS p={profile} accent={accent} skills={skills} atouts={atouts} />;
    default: return <TplMinimaliste p={profile} accent={accent} skills={skills} atouts={atouts} />;
  }
}

type TplProps = { p: Profile; accent: string; skills: string[]; atouts: string[] };

// ── Section heading shared ─────────────────────────────────────────────────

function SectionTitle({ title, accent, style = "line" }: { title: string; accent: string; style?: "line" | "filled" | "dot" }) {
  if (style === "filled") return (
    <div className="px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest text-white mb-3" style={{ background: accent }}>
      {title}
    </div>
  );
  if (style === "dot") return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-3 h-3 rounded-full" style={{ background: accent }} />
      <span className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>{title}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-black uppercase tracking-widest" style={{ color: accent }}>{title}</span>
      <div className="flex-1 h-px" style={{ background: `${accent}40` }} />
    </div>
  );
}

function LangBar({ lang, accent }: { lang: Language; accent: string }) {
  const levels: Record<string, number> = {
    "A1 – Débutant": 15, "A2 – Élémentaire": 30, "B1 – Intermédiaire": 50,
    "B2 – Avancé": 70, "C1 – Courant": 85, "C2 – Bilingue": 95, "Langue maternelle": 100,
  };
  const pct = levels[lang.level] ?? 60;
  return (
    <div className="mb-1.5">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="font-semibold">{lang.name}</span>
        <span className="text-gray-500 text-[10px]">{lang.level}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
    </div>
  );
}

// ── Template MODERNE (bande gauche colorée) ────────────────────────────────

function TplModerne({ p, accent, skills, atouts }: TplProps) {
  return (
    <div className="flex min-h-[1052px] font-sans text-gray-900">
      {/* Sidebar */}
      <div className="w-48 shrink-0 p-6 text-white flex flex-col gap-5" style={{ background: accent }}>
        {/* Avatar initials */}
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-black mx-auto">
          {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>

        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1.5">Contact</div>
          <div className="text-[10px] opacity-90 space-y-0.5 leading-relaxed">
            {p.email && <div>✉ {p.email}</div>}
            {p.phone && <div>✆ {p.phone}</div>}
            {p.city && <div>📍 {p.city}</div>}
            {p.linkedin && <div>🔗 {p.linkedin}</div>}
          </div>
        </div>

        {skills.length > 0 && (
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1.5">Compétences</div>
            <div className="space-y-1">
              {skills.slice(0, 8).map(s => (
                <div key={s} className="flex items-center gap-1 text-[10px] opacity-90">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {p.languages.length > 0 && (
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1.5">Langues</div>
            {p.languages.map(l => (
              <div key={l.name} className="text-[10px] opacity-90 mb-0.5">
                <span className="font-semibold">{l.name}</span> · {l.level.split(" – ")[1] || l.level}
              </div>
            ))}
          </div>
        )}

        {atouts.length > 0 && (
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1.5">Atouts</div>
            {atouts.map(a => <div key={a} className="text-[10px] opacity-90">· {a}</div>)}
          </div>
        )}

        {p.interests.length > 0 && (
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1.5">Intérêts</div>
            <div className="flex flex-wrap gap-1">
              {p.interests.filter(i => i.label).map(i => (
                <span key={i.label} className="text-[9px] bg-white/15 rounded-full px-1.5 py-0.5">{i.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 p-8 space-y-6">
        <header>
          <h1 className="text-3xl font-black tracking-tight leading-tight">{p.name}</h1>
          <p className="text-base font-semibold mt-1" style={{ color: accent }}>{p.title}</p>
          {p.summary && <p className="mt-3 text-sm leading-6 text-gray-600 max-w-lg">{p.summary}</p>}
        </header>

        {p.experiences.length > 0 && (
          <section>
            <SectionTitle title="Expérience professionnelle" accent={accent} />
            {p.experiences.map((e, i) => <ExpBlock key={i} exp={e} accent={accent} />)}
          </section>
        )}

        {p.education.length > 0 && (
          <section>
            <SectionTitle title="Formation" accent={accent} />
            {p.education.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold">{e.degree}</div>
                    <div className="text-xs text-gray-500">{e.school}{e.mention ? ` · ${e.mention}` : ""}</div>
                  </div>
                  <div className="text-xs font-semibold shrink-0 ml-4" style={{ color: accent }}>{e.year}</div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

// ── Template CLASSIQUE ─────────────────────────────────────────────────────

function TplClassique({ p, accent, skills, atouts }: TplProps) {
  return (
    <div className="min-h-[1052px] font-serif p-10 text-gray-900">
      <header className="text-center pb-6 mb-6" style={{ borderBottom: `3px solid ${accent}` }}>
        <h1 className="text-4xl font-black tracking-tight">{p.name}</h1>
        <p className="text-lg font-semibold mt-1" style={{ color: accent }}>{p.title}</p>
        <div className="flex justify-center flex-wrap gap-4 mt-3 text-xs text-gray-500">
          {[p.email, p.phone, p.city, p.linkedin].filter(Boolean).map(v => <span key={v}>{v}</span>)}
        </div>
      </header>

      {p.summary && (
        <section className="mb-6">
          <SectionTitle title="Profil" accent={accent} />
          <p className="text-sm leading-7 text-gray-600">{p.summary}</p>
        </section>
      )}

      {p.experiences.length > 0 && (
        <section className="mb-6">
          <SectionTitle title="Expérience" accent={accent} />
          {p.experiences.map((e, i) => <ExpBlock key={i} exp={e} accent={accent} />)}
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {p.education.length > 0 && (
          <section>
            <SectionTitle title="Formation" accent={accent} />
            {p.education.map((e, i) => (
              <div key={i} className="mb-3 text-sm">
                <div className="font-bold">{e.degree}</div>
                <div className="text-gray-500 text-xs">{e.school} · {e.year}{e.mention ? ` · ${e.mention}` : ""}</div>
              </div>
            ))}
          </section>
        )}
        <div className="space-y-5">
          {skills.length > 0 && (
            <section>
              <SectionTitle title="Compétences" accent={accent} />
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => <span key={s} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${accent}18`, color: accent }}>{s}</span>)}
              </div>
            </section>
          )}
          {p.languages.length > 0 && (
            <section>
              <SectionTitle title="Langues" accent={accent} />
              {p.languages.map(l => <LangBar key={l.name} lang={l} accent={accent} />)}
            </section>
          )}
        </div>
      </div>

      {p.interests.length > 0 && (
        <section className="mt-5">
          <SectionTitle title="Centres d'intérêt" accent={accent} />
          <div className="flex flex-wrap gap-2">
            {p.interests.filter(i => i.label).map(i => (
              <span key={i.label} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{i.label}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ── Template EXECUTIVE (dark header) ─────────────────────────────────────

function TplExecutive({ p, accent, skills, atouts }: TplProps) {
  return (
    <div className="min-h-[1052px] font-sans text-gray-900">
      <div className="px-10 py-8 text-white" style={{ background: accent }}>
        <h1 className="text-3xl font-black tracking-tight">{p.name}</h1>
        <p className="text-base font-medium mt-1 opacity-80">{p.title}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs opacity-70">
          {[p.email, p.phone, p.city, p.linkedin].filter(Boolean).map(v => <span key={v}>{v}</span>)}
        </div>
      </div>
      <div className="p-10 space-y-6">
        {p.summary && (
          <section>
            <SectionTitle title="Synthèse" accent={accent} />
            <p className="text-sm leading-6 text-gray-600">{p.summary}</p>
          </section>
        )}
        {p.experiences.length > 0 && (
          <section>
            <SectionTitle title="Parcours" accent={accent} />
            {p.experiences.map((e, i) => <ExpBlock key={i} exp={e} accent={accent} />)}
          </section>
        )}
        <div className="grid grid-cols-3 gap-6">
          {p.education.length > 0 && (
            <section>
              <SectionTitle title="Formation" accent={accent} />
              {p.education.map((e, i) => (
                <div key={i} className="mb-2 text-xs">
                  <div className="font-bold text-sm">{e.degree}</div>
                  <div className="text-gray-500">{e.school} · {e.year}</div>
                </div>
              ))}
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <SectionTitle title="Compétences" accent={accent} />
              {skills.map(s => <div key={s} className="text-xs py-0.5 text-gray-700">· {s}</div>)}
            </section>
          )}
          <div className="space-y-4">
            {p.languages.length > 0 && (
              <section>
                <SectionTitle title="Langues" accent={accent} />
                {p.languages.map(l => <LangBar key={l.name} lang={l} accent={accent} />)}
              </section>
            )}
            {atouts.length > 0 && (
              <section>
                <SectionTitle title="Atouts" accent={accent} />
                {atouts.map(a => <div key={a} className="text-xs py-0.5 text-gray-600">✓ {a}</div>)}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Template MINIMALISTE ──────────────────────────────────────────────────

function TplMinimaliste({ p, accent, skills, atouts }: TplProps) {
  return (
    <div className="min-h-[1052px] font-sans p-12 text-gray-900">
      <header className="mb-8">
        <h1 className="text-5xl font-black tracking-tighter leading-none">{p.name}</h1>
        <p className="text-lg text-gray-400 mt-2 font-light">{p.title}</p>
        <div className="flex gap-4 mt-3 text-xs text-gray-400">
          {[p.email, p.phone, p.city].filter(Boolean).map(v => <span key={v}>{v}</span>)}
        </div>
      </header>

      {p.summary && <p className="text-sm leading-7 text-gray-500 mb-8 max-w-lg">{p.summary}</p>}

      {p.experiences.length > 0 && (
        <section className="mb-8">
          <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 mb-4">Expérience</div>
          {p.experiences.map((e, i) => <ExpBlock key={i} exp={e} accent={accent} compact />)}
        </section>
      )}

      <div className="grid grid-cols-3 gap-8">
        {p.education.length > 0 && (
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 mb-3">Formation</div>
            {p.education.map((e, i) => (
              <div key={i} className="mb-2">
                <div className="text-xs font-semibold">{e.degree}</div>
                <div className="text-[10px] text-gray-400">{e.school} · {e.year}</div>
              </div>
            ))}
          </div>
        )}
        {skills.length > 0 && (
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 mb-3">Compétences</div>
            {skills.map(s => <div key={s} className="text-xs text-gray-600 py-0.5">{s}</div>)}
          </div>
        )}
        {p.languages.length > 0 && (
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 mb-3">Langues</div>
            {p.languages.map(l => (
              <div key={l.name} className="text-xs mb-1">
                <span className="font-semibold">{l.name}</span> <span className="text-gray-400 text-[10px]">{l.level.split(" – ")[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Template 2 COLONNES ───────────────────────────────────────────────────

function TplColonne({ p, accent, skills, atouts }: TplProps) {
  return (
    <div className="min-h-[1052px] font-sans flex text-gray-900">
      {/* Left col */}
      <div className="w-56 shrink-0 p-6 space-y-5" style={{ background: `${accent}0f` }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-white mx-auto" style={{ background: accent }}>
          {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div className="text-center">
          <h1 className="font-black text-lg leading-tight">{p.name}</h1>
          <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>{p.title}</p>
        </div>

        <div className="text-[10px] space-y-0.5 text-gray-600">
          {[{ icon: "✉", v: p.email }, { icon: "✆", v: p.phone }, { icon: "📍", v: p.city }].filter(x => x.v).map(x => (
            <div key={x.v} className="flex gap-1"><span>{x.icon}</span><span className="break-all">{x.v}</span></div>
          ))}
        </div>

        {skills.length > 0 && (
          <div>
            <SectionTitle title="Compétences" accent={accent} style="dot" />
            {skills.slice(0, 10).map(s => (
              <div key={s} className="flex items-center gap-1.5 text-[10px] mb-1 text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                {s}
              </div>
            ))}
          </div>
        )}

        {p.languages.length > 0 && (
          <div>
            <SectionTitle title="Langues" accent={accent} style="dot" />
            {p.languages.map(l => <LangBar key={l.name} lang={l} accent={accent} />)}
          </div>
        )}

        {atouts.length > 0 && (
          <div>
            <SectionTitle title="Atouts" accent={accent} style="dot" />
            {atouts.map(a => <div key={a} className="text-[10px] text-gray-600 mb-0.5">· {a}</div>)}
          </div>
        )}

        {p.interests.length > 0 && (
          <div>
            <SectionTitle title="Intérêts" accent={accent} style="dot" />
            {p.interests.filter(i => i.label).map(i => <div key={i.label} className="text-[10px] text-gray-600 mb-0.5">· {i.label}</div>)}
          </div>
        )}
      </div>

      {/* Right col */}
      <div className="flex-1 p-7 space-y-5">
        {p.summary && (
          <section>
            <SectionTitle title="Profil" accent={accent} />
            <p className="text-xs leading-6 text-gray-600">{p.summary}</p>
          </section>
        )}
        {p.experiences.length > 0 && (
          <section>
            <SectionTitle title="Expérience" accent={accent} />
            {p.experiences.map((e, i) => <ExpBlock key={i} exp={e} accent={accent} />)}
          </section>
        )}
        {p.education.length > 0 && (
          <section>
            <SectionTitle title="Formation" accent={accent} />
            {p.education.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="text-sm font-bold">{e.degree}</div>
                <div className="text-xs text-gray-500">{e.school} · {e.year}{e.mention ? ` · ${e.mention}` : ""}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

// ── Template CRÉATIF ──────────────────────────────────────────────────────

function TplCreatif({ p, accent, skills, atouts }: TplProps) {
  return (
    <div className="min-h-[1052px] font-sans text-gray-900">
      <header className="relative overflow-hidden text-white p-10" style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}99 100%)` }}>
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-10" style={{ background: "white", transform: "translate(30%, -30%)" }} />
        <h1 className="text-4xl font-black tracking-tight relative">{p.name}</h1>
        <p className="text-lg opacity-80 mt-1 relative">{p.title}</p>
        <div className="flex flex-wrap gap-4 mt-3 text-xs opacity-70 relative">
          {[p.email, p.phone, p.city, p.linkedin].filter(Boolean).map(v => <span key={v}>{v}</span>)}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-0 flex-1">
        <div className="col-span-2 p-8 space-y-6">
          {p.summary && (
            <section>
              <SectionTitle title="À propos" accent={accent} />
              <p className="text-sm leading-6 text-gray-600">{p.summary}</p>
            </section>
          )}
          {p.experiences.length > 0 && (
            <section>
              <SectionTitle title="Expériences" accent={accent} />
              {p.experiences.map((e, i) => <ExpBlock key={i} exp={e} accent={accent} />)}
            </section>
          )}
          {p.education.length > 0 && (
            <section>
              <SectionTitle title="Formation" accent={accent} />
              {p.education.map((e, i) => (
                <div key={i} className="mb-3">
                  <div className="text-sm font-bold">{e.degree}</div>
                  <div className="text-xs text-gray-500">{e.school} · {e.year}</div>
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="p-6 space-y-5 border-l" style={{ background: `${accent}05` }}>
          {skills.length > 0 && (
            <div>
              <SectionTitle title="Skills" accent={accent} style="dot" />
              <div className="flex flex-wrap gap-1.5">
                {skills.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${accent}18`, color: accent }}>{s}</span>)}
              </div>
            </div>
          )}
          {p.languages.length > 0 && (
            <div>
              <SectionTitle title="Langues" accent={accent} style="dot" />
              {p.languages.map(l => <LangBar key={l.name} lang={l} accent={accent} />)}
            </div>
          )}
          {atouts.length > 0 && (
            <div>
              <SectionTitle title="Atouts" accent={accent} style="dot" />
              {atouts.map(a => (
                <div key={a} className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                  <Award className="h-3 w-3 shrink-0" style={{ color: accent }} /> {a}
                </div>
              ))}
            </div>
          )}
          {p.interests.length > 0 && (
            <div>
              <SectionTitle title="Intérêts" accent={accent} style="dot" />
              {p.interests.filter(i => i.label).map(i => <div key={i.label} className="text-xs text-gray-600 mb-0.5">· {i.label}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Template AFRICAIN (warm gradient) ────────────────────────────────────

function TplAfricain({ p, accent, skills, atouts }: TplProps) {
  const teal = "#2EB88A";
  return (
    <div className="min-h-[1052px] font-sans text-gray-900">
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${teal})` }} />
      <div className="p-10 pb-6 border-b-2" style={{ borderColor: `${accent}30` }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${teal})` }}>
            {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{p.name}</h1>
            <p className="font-semibold mt-0.5" style={{ color: accent }}>{p.title}</p>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
              {[p.email, p.phone, p.city].filter(Boolean).map(v => <span key={v}>{v}</span>)}
            </div>
          </div>
        </div>
        {p.summary && <p className="mt-4 text-sm leading-6 text-gray-600">{p.summary}</p>}
      </div>

      <div className="grid grid-cols-3 gap-0">
        <div className="col-span-2 p-8 space-y-6">
          {p.experiences.length > 0 && (
            <section>
              <SectionTitle title="Expérience" accent={accent} />
              {p.experiences.map((e, i) => <ExpBlock key={i} exp={e} accent={accent} />)}
            </section>
          )}
          {p.education.length > 0 && (
            <section>
              <SectionTitle title="Formation" accent={accent} />
              {p.education.map((e, i) => (
                <div key={i} className="mb-3">
                  <div className="text-sm font-bold">{e.degree}</div>
                  <div className="text-xs text-gray-500">{e.school} · {e.year}{e.mention ? ` · ${e.mention}` : ""}</div>
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="p-6 space-y-5 border-l" style={{ background: `${accent}06` }}>
          {skills.length > 0 && (
            <div>
              <SectionTitle title="Compétences" accent={accent} style="filled" />
              {skills.slice(0, 8).map(s => (
                <div key={s} className="flex items-center gap-1.5 text-xs text-gray-700 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} /> {s}
                </div>
              ))}
            </div>
          )}
          {p.languages.length > 0 && (
            <div>
              <SectionTitle title="Langues" accent={accent} style="filled" />
              {p.languages.map(l => <LangBar key={l.name} lang={l} accent={accent} />)}
            </div>
          )}
          {atouts.length > 0 && (
            <div>
              <SectionTitle title="Atouts" accent={accent} style="filled" />
              {atouts.map(a => <div key={a} className="text-xs text-gray-600 mb-0.5">✦ {a}</div>)}
            </div>
          )}
          {p.interests.length > 0 && (
            <div>
              <SectionTitle title="Intérêts" accent={accent} style="filled" />
              <div className="flex flex-wrap gap-1.5">
                {p.interests.filter(i => i.label).map(i => (
                  <span key={i.label} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${accent}18`, color: accent }}>{i.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Template ATS ──────────────────────────────────────────────────────────

function TplATS({ p, accent, skills, atouts }: TplProps) {
  return (
    <div className="min-h-[1052px] font-sans p-10 text-gray-900 text-sm">
      <h1 className="text-2xl font-bold border-b-2 pb-2 mb-1" style={{ borderColor: accent }}>{p.name}</h1>
      <p className="font-semibold mb-1" style={{ color: accent }}>{p.title}</p>
      <div className="text-xs text-gray-500 mb-5">{[p.email, p.phone, p.city, p.linkedin].filter(Boolean).join(" | ")}</div>

      {p.summary && (
        <section className="mb-4">
          <div className="font-bold uppercase text-xs tracking-widest mb-1" style={{ color: accent }}>RÉSUMÉ</div>
          <p className="text-xs leading-5 text-gray-700">{p.summary}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-4">
          <div className="font-bold uppercase text-xs tracking-widest mb-1" style={{ color: accent }}>COMPÉTENCES</div>
          <p className="text-xs text-gray-700">{skills.join(" · ")}</p>
        </section>
      )}

      {p.experiences.length > 0 && (
        <section className="mb-4">
          <div className="font-bold uppercase text-xs tracking-widest mb-2" style={{ color: accent }}>EXPÉRIENCE</div>
          {p.experiences.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between font-bold text-sm">
                <span>{e.title}</span><span className="text-xs font-normal text-gray-500">{e.period}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{e.company}{e.location ? ` — ${e.location}` : ""}</div>
              <div className="text-xs leading-5 text-gray-700 whitespace-pre-line">{e.description}</div>
            </div>
          ))}
        </section>
      )}

      {p.education.length > 0 && (
        <section className="mb-4">
          <div className="font-bold uppercase text-xs tracking-widest mb-2" style={{ color: accent }}>FORMATION</div>
          {p.education.map((e, i) => (
            <div key={i} className="mb-2 flex justify-between">
              <div>
                <div className="font-semibold text-sm">{e.degree}</div>
                <div className="text-xs text-gray-500">{e.school}{e.mention ? ` · ${e.mention}` : ""}</div>
              </div>
              <div className="text-xs text-gray-500">{e.year}</div>
            </div>
          ))}
        </section>
      )}

      {p.languages.length > 0 && (
        <section className="mb-4">
          <div className="font-bold uppercase text-xs tracking-widest mb-1" style={{ color: accent }}>LANGUES</div>
          <p className="text-xs text-gray-700">{p.languages.map(l => `${l.name} (${l.level})`).join(" · ")}</p>
        </section>
      )}

      {atouts.length > 0 && (
        <section className="mb-4">
          <div className="font-bold uppercase text-xs tracking-widest mb-1" style={{ color: accent }}>ATOUTS</div>
          <p className="text-xs text-gray-700">{atouts.join(" · ")}</p>
        </section>
      )}
    </div>
  );
}

// ── Shared ExpBlock ───────────────────────────────────────────────────────

function ExpBlock({ exp, accent, compact = false }: { exp: Experience; accent: string; compact?: boolean }) {
  return (
    <div className={compact ? "mb-4" : "mb-5"}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-bold text-sm leading-tight">{exp.title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</div>
        </div>
        <div className="text-xs font-semibold shrink-0 px-2 py-0.5 rounded-full text-xs" style={{ background: `${accent}18`, color: accent }}>
          {exp.period}
        </div>
      </div>
      {exp.description && (
        <div className="mt-2 text-xs leading-5 text-gray-600 whitespace-pre-line">{exp.description}</div>
      )}
    </div>
  );
}
