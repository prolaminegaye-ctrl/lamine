// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Layout premium
//  Palette : Vert Forêt #0D452A · Or #F59E0B · Crème #F2EDE3 · Terracotta #FBBF24
// ─────────────────────────────────────────────────────────────────────────────

import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, FileText, Video, Brain, Map, Briefcase,
  FileCheck, UserCog, Compass, Rocket, FlaskConical, Target,
  BarChart3, Upload, Mic, ClipboardList, GraduationCap, PieChart,
  PlugZap, Search, ChevronRight, Menu, X,
  TrendingUp, Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: string; badgeColor?: string };

// ─── Navigation ───────────────────────────────────────────────────────────────

const EMPLOI_NAV: NavItem[] = [
  { href: "/emploi", label: "Mon espace", icon: LayoutDashboard },
  { href: "/emploi/tableau-de-bord", label: "Tableau de bord", icon: PieChart },
  { href: "/emploi/simulateur", label: "Simulateur entretien", icon: Mic, badge: "IA", badgeColor: "bg-[#FBBF24]/20 text-[#FBBF24]" },
  { href: "/emploi/cv-analyse", label: "Analyse de CV", icon: Upload, badge: "IA", badgeColor: "bg-sky-400/20 text-sky-300" },
  { href: "/emploi/analyse-offre", label: "Analyse d'offres", icon: Search, badge: "IA", badgeColor: "bg-[#22B35F]/25 text-emerald-300" },
  { href: "/cv", label: "CV Builder Premium", icon: FileText },
  { href: "/emploi/bilan", label: "Bilan de compétences", icon: ClipboardList },
  { href: "/emploi/vae", label: "Évaluation VAE", icon: GraduationCap },
  { href: "/parcours", label: "Parcours métiers", icon: Map },
  { href: "/emploi/tests/afri-code", label: "AFRI-CODE", icon: Compass, badge: "NOUVEAU", badgeColor: "bg-[#F59E0B]/25 text-[#F59E0B]" },
  { href: "/emploi/tests/afri-skill", label: "AFRI-SKILL", icon: Target, badge: "NOUVEAU", badgeColor: "bg-[#22B35F]/20 text-emerald-300" },
  { href: "/emploi/tests/ikigai", label: "Test IKIGAI", icon: Target },
  { href: "/emploi/tests/personnalite", label: "Personnalité pro", icon: Brain },
];

const ENTREPRENEUR_NAV: NavItem[] = [
  { href: "/entrepreneur", label: "Mon espace", icon: LayoutDashboard },
  { href: "/entrepreneur/tests/ikigai", label: "IKIGAI Entrepreneurial", icon: Target },
  { href: "/entrepreneur/tests/profil", label: "Profil Entrepreneur", icon: Rocket },
  { href: "/entrepreneur/tests/projet", label: "Maturité de Projet", icon: FlaskConical },
  { href: "/offres", label: "Opportunités", icon: Briefcase },
  { href: "/parcours", label: "Parcours", icon: Map },
];

const CONSEILLER_NAV: NavItem[] = [
  { href: "/conseiller", label: "Tableau de bord", icon: BarChart3 },
  { href: "/candidats", label: "Bénéficiaires", icon: Users },
  { href: "/conseillers", label: "Conseillers", icon: UserCog },
  { href: "/cv", label: "Moteur CV", icon: FileText },
  { href: "/entretiens", label: "Entretiens", icon: Video },
  { href: "/softskills", label: "Soft Skills", icon: Brain },
  { href: "/offres", label: "Offres d'emploi", icon: Briefcase },
  { href: "/documents", label: "Documents IA", icon: FileCheck },
  { href: "/connecteurs", label: "Connecteurs", icon: PlugZap },
];

const SPACE_CONFIG: Record<string, {
  nav: NavItem[];
  label: string;
  description: string;
  accentColor: string;
  initials: string;
}> = {
  emploi: {
    nav: EMPLOI_NAV,
    label: "Espace Emploi",
    description: "Orientation & Carrière",
    accentColor: "#F59E0B",
    initials: "EE",
  },
  entrepreneur: {
    nav: ENTREPRENEUR_NAV,
    label: "Espace Entrepreneur",
    description: "Création d'Entreprise",
    accentColor: "#FBBF24",
    initials: "EP",
  },
  conseiller: {
    nav: CONSEILLER_NAV,
    label: "Espace Conseiller",
    description: "Accompagnement Pro",
    accentColor: "#22B35F",
    initials: "EC",
  },
};

function getSpace(location: string): string | null {
  if (location.startsWith("/emploi")) return "emploi";
  if (location.startsWith("/entrepreneur")) return "entrepreneur";
  if (
    location.startsWith("/conseiller") ||
    location.startsWith("/candidats") ||
    location.startsWith("/conseillers") ||
    location.startsWith("/offres") ||
    location.startsWith("/documents") ||
    location.startsWith("/cv") ||
    location.startsWith("/entretiens") ||
    location.startsWith("/softskills") ||
    location.startsWith("/parcours") ||
    location.startsWith("/connecteurs")
  ) return "conseiller";
  return null;
}

// ─── Logo GolléO ──────────────────────────────────────────────────────────────

function GolleoLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Badge fond navy */}
      <rect width="34" height="34" rx="9" fill="#0D452A"/>
      <rect width="34" height="34" rx="9" fill="none" stroke="rgba(34,179,95,0.4)" strokeWidth="1"/>
      {/* Monogramme "G" stylisé — sobre, géométrique */}
      {/* Arc du G */}
      <path
        d="M22 10.5 C19.5 8.5 15.5 8.5 13 11 C10.5 13.5 10.5 20.5 13 23 C15.5 25.5 20 25.5 22 23.5 L22 18 L17.5 18"
        stroke="#F59E0B"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ─── Wordmark GolléO inline ───────────────────────────────────────────────────

function GolleoWordmark() {
  return (
    <span
      className="text-[15px] font-bold tracking-tight leading-none select-none"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <span style={{ color: "#F59E0B" }}>G</span>
      <span style={{ color: "#0D452A" }}>oll</span>
      <span style={{ color: "rgba(13,69,42,0.5)" }}>é</span>
      <span style={{ color: "#F59E0B" }}>O</span>
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({
  config, location, onClose,
}: {
  config: typeof SPACE_CONFIG[string] | null;
  location: string;
  onClose?: () => void;
}) {
  const nav = config?.nav ?? [];

  return (
    <aside
      className="w-64 h-full flex flex-col select-none"
      style={{ background: "#FFFFFF", borderRight: "1px solid rgba(13,69,42,0.08)" }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-[60px] border-b" style={{ borderColor: "rgba(13,69,42,0.07)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <GolleoLogo size={34} />
          <div className="flex flex-col justify-center leading-none gap-0.5">
            <GolleoWordmark />
            <span
              className="text-[9px] font-medium tracking-[0.18em] uppercase"
              style={{ color: "rgba(13,69,42,0.35)", letterSpacing: "0.18em" }}
            >
              Plateforme IA
            </span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden" style={{ color: "rgba(13,69,42,0.35)" }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Space pill */}
      {config && (
        <div className="px-4 pt-4 pb-2">
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(13,69,42,0.05)", border: "1px solid rgba(13,69,42,0.08)" }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: config.accentColor }}
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold truncate" style={{ color: "#0D452A" }}>
                {config.label}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(13,69,42,0.45)" }}>{config.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {nav.map((item) => {
          const isActive =
            location === item.href ||
            (item.href !== "/emploi" && item.href !== "/entrepreneur" &&
             item.href !== "/conseiller" && location.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all duration-150 relative"
              style={{
                background: isActive ? "rgba(34,179,95,0.10)" : "transparent",
                color: isActive ? "#0D452A" : "rgba(13,69,42,0.55)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ background: "#22B35F" }}
                />
              )}
              <Icon
                className="w-4 h-4 flex-shrink-0 transition-colors"
                style={{ color: isActive ? "#22B35F" : "rgba(13,69,42,0.35)" }}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", item.badgeColor ?? "bg-emerald-50 text-emerald-600")}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(13,69,42,0.07)" }}>
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group cursor-pointer hover:bg-emerald-50"
          style={{ color: "#0D452A" }}
        >
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
            style={{ background: "linear-gradient(135deg, #0D452A 0%, #22B35F 100%)" }}
          >
            LG
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold truncate" style={{ color: "#0D452A" }}>Lamine Gaye</p>
            <p className="text-[10px] truncate" style={{ color: "rgba(13,69,42,0.45)" }}>Changer d'espace</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(13,69,42,0.25)" }} />
        </Link>
      </div>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const space = getSpace(location);
  const isHome = location === "/" || location === "";
  const config = space ? SPACE_CONFIG[space] : null;

  if (isHome) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const nav = config?.nav ?? [];
  const activeItem = nav.find(
    (i) =>
      location === i.href ||
      (i.href !== "/emploi" && i.href !== "/entrepreneur" &&
       i.href !== "/conseiller" && location.startsWith(i.href))
  );

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--golleo-forest)" }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar config={config} location={location} />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-y-0 left-0 z-50 flex lg:hidden">
          <Sidebar config={config} location={location} onClose={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden m-3 rounded-2xl shadow-2xl"
        style={{ background: "hsl(var(--background))" }}>

        {/* Top bar */}
        <header className="h-[60px] flex-shrink-0 flex items-center px-5 border-b"
          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <button onClick={() => setMobileOpen(true)}
            className="lg:hidden mr-3 text-muted-foreground hover:text-foreground transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            {config && (
              <span className="text-xs text-muted-foreground hidden sm:block">{config.label}</span>
            )}
            {activeItem && config && (
              <ChevronRight className="w-3.5 h-3.5 text-border shrink-0 hidden sm:block" />
            )}
            {activeItem && (
              <h1 className="text-sm font-semibold text-foreground truncate">{activeItem.label}</h1>
            )}
          </div>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* IA status pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border"
              style={{ background: "rgba(46,125,91,0.08)", color: "#22B35F", borderColor: "rgba(46,125,91,0.2)" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#22B35F] animate-pulse" />
              IA active
            </div>
            {/* Notification bell */}
            <button className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-muted/60 transition-colors text-muted-foreground relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: "#F59E0B" }} />
            </button>
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer"
              style={{ background: "linear-gradient(135deg, #F59E0B 0%, #15783E 100%)" }}
            >
              LG
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" style={{ background: "hsl(var(--background))" }}>
          <div className="p-5 lg:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
