// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Espace Conseiller
//  Design chaud : vert forêt · or africain · crème
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, FileText, Video, Brain, Map, Briefcase, FileCheck, BarChart3, Sparkles, UserCog } from "lucide-react";

const GOLLEO = { forest: "#1E3A2F", green: "#2E7D5B", gold: "#C8964E", terra: "#D6845A" };

const TOOLS = [
  { href: "/candidats", icon: Users, label: "Bénéficiaires", desc: "Gérez vos bénéficiaires et suivez leur progression", bg: GOLLEO.green },
  { href: "/conseillers", icon: UserCog, label: "Conseillers", desc: "Équipe et gestion des conseillers", bg: GOLLEO.forest },
  { href: "/cv", icon: FileText, label: "Moteur CV", desc: "Analyse et optimisation de CV avec IA", bg: GOLLEO.gold },
  { href: "/entretiens", icon: Video, label: "Entretiens", desc: "Simulateur d'entretien avec feedback IA", bg: GOLLEO.terra },
  { href: "/softskills", icon: Brain, label: "Soft Skills", desc: "Évaluation des compétences comportementales", bg: GOLLEO.green },
  { href: "/parcours", icon: Map, label: "Parcours", desc: "Recommandations de parcours et formations", bg: GOLLEO.gold },
  { href: "/offres", icon: Briefcase, label: "Offres d'emploi", desc: "Matching candidats ↔ offres avec IA", bg: GOLLEO.forest },
  { href: "/documents", icon: FileCheck, label: "Documents IA", desc: "Génération de lettres et documents pro", bg: GOLLEO.terra },
];

export default function EspaceConseiller() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero */}
      <div className="rounded-2xl p-7" style={{
        background: "linear-gradient(135deg, rgba(30,58,47,0.07), rgba(46,125,91,0.04))",
        border: "1px solid rgba(30,58,47,0.15)",
      }}>
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${GOLLEO.green}, ${GOLLEO.forest})` }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: GOLLEO.forest, fontFamily: "'Playfair Display', serif" }}>
              Bienvenue dans votre Espace Conseiller
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(30,58,47,0.65)" }}>
              Gérez vos bénéficiaires, suivez leurs résultats de tests, générez des synthèses IA et accédez à tous
              les outils d'accompagnement — CV, entretiens, soft skills, offres d'emploi, documents.
            </p>
          </div>
        </div>
      </div>

      {/* Outils */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: GOLLEO.forest }}>
            <BarChart3 className="h-4 w-4" style={{ color: GOLLEO.gold }} />
            Tableau de bord & outils
          </h3>
          <Link href="/conseiller">
            <Button size="sm" variant="outline" style={{ borderColor: "rgba(30,58,47,0.2)", color: GOLLEO.forest }}>
              Voir le dashboard
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <div className="rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition-all h-full"
                style={{
                  background: "white",
                  border: "1px solid rgba(30,58,47,0.08)",
                  boxShadow: "0 2px 8px rgba(30,58,47,0.04)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,58,47,0.1)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,150,78,0.3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(30,58,47,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(30,58,47,0.08)";
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: tool.bg }}>
                  <tool.icon className="h-4 w-4 text-white" />
                </div>
                <div className="font-semibold text-sm" style={{ color: GOLLEO.forest }}>{tool.label}</div>
                <p className="text-xs leading-tight" style={{ color: "rgba(30,58,47,0.55)" }}>{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
