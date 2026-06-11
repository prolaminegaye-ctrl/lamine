// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Landing Page Premium
//  Design : Vert Forêt · Or Africain · Crème · Sections visuelles
//  Micro-interactions : framer-motion (apparition au scroll, hover sobres)
// ─────────────────────────────────────────────────────────────────────────────

import { Link } from "wouter";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight, Brain, Briefcase, Check, Mic,
  Rocket, Sparkles, Target, UserCog, Zap, Play, Globe2,
  Star, Shield, TrendingUp, Quote, ChevronRight,
} from "lucide-react";

// ── Palette GolléO ───────────────────────────────────────────────────────────
const C = {
  forest:  "#0D452A",
  green:   "#22B35F",
  gold:    "#F59E0B",
  cream:   "#FFFFFF",
  terra:   "#FBBF24",
  light:   "#F0FDF5",
  dark:    "#051A0D",
  muted:   "rgba(13,69,42,0.55)",
};

const PATTERN_SVG = `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230D452A' stroke-width='0.5' opacity='0.05'%3E%3Cpath d='M24 5 L43 24 L24 43 L5 24 Z'/%3E%3Cpath d='M24 12 L36 24 L24 36 L12 24 Z'/%3E%3Ccircle cx='24' cy='24' r='4'/%3E%3C/g%3E%3C/svg%3E")`;

// ── Anim helpers (sobres) ─────────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const viewportOnce = { once: true, amount: 0.25 } as const;

// ── Données ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "2 000+", label: "Utilisateurs actifs" },
  { value: "50+",    label: "Pays couverts" },
  { value: "94%",    label: "Taux de satisfaction" },
  { value: "6 tests", label: "Tests propriétaires" },
];

const TEMOIGNAGES = [
  {
    text: "GolléO m'a permis de décrocher mon premier CDI en 3 semaines. Le simulateur d'entretien est bluffant.",
    name: "Aïcha Diallo",
    role: "Chargée de communication, Dakar",
    img: "/images/temoignages.jpg",
  },
  {
    text: "Le test AFRI-SKILL m'a révélé des compétences que je ne savais même pas valoriser. Incroyable !",
    name: "Fatou Koné",
    role: "Responsable RH, Abidjan",
    img: "/images/temoignages.jpg",
  },
];

// ── Composant Logo ────────────────────────────────────────────────────────────
function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const s = size === "sm" ? { box: "w-6 h-6", text: "text-sm", icon: 14 } : { box: "w-9 h-9", text: "text-lg", icon: 20 };
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.box} rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{ background: C.forest, border: `1.5px solid rgba(34,179,95,0.35)` }}>
        <svg width={s.icon} height={s.icon} viewBox="0 0 34 34" fill="none">
          <path d="M26 11C23 8.5 18.5 8.5 15.5 11.5C12.5 14.5 12.5 22 15.5 25C18.5 28 24 28 26 25.5L26 19.5L21 19.5"
            stroke="#22B35F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className={`font-extrabold ${s.text} leading-none`} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
        <span style={{ color: C.gold }}>G</span>
        <span style={{ color: C.forest }}>oll</span>
        <span style={{ color: "rgba(13,69,42,0.45)" }}>é</span>
        <span style={{ color: C.gold }}>O</span>
      </span>
    </div>
  );
}

// ── Eyebrow réutilisable ───────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(13,69,42,0.40)" }}>
      {children}
    </p>
  );
}

// ── Composant principal ────────────────────────────────────────────────────────
export default function Accueil() {
  const reduce = useReducedMotion();
  // Si l'utilisateur préfère réduire les animations, on neutralise les variants.
  const v = (variant: Variants): Variants => (reduce ? {} : variant);

  return (
    <div className="min-h-screen" style={{ background: C.cream }}>

      {/* ── Motif de fond ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: PATTERN_SVG, opacity: 0.3 }} aria-hidden="true" />

      {/* ─────────────────── HEADER ─────────────────── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", borderColor: "rgba(13,69,42,0.08)" }}>
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22B35F] focus-visible:ring-offset-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium" style={{ color: C.muted }}>
            <Link href="/emploi" className="relative py-1 hover:text-[#0D452A] transition-colors focus-visible:outline-none focus-visible:text-[#0D452A]">Candidats</Link>
            <Link href="/entrepreneur" className="relative py-1 hover:text-[#0D452A] transition-colors focus-visible:outline-none focus-visible:text-[#0D452A]">Entrepreneurs</Link>
            <Link href="/conseiller" className="relative py-1 hover:text-[#0D452A] transition-colors focus-visible:outline-none focus-visible:text-[#0D452A]">Conseillers</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/emploi"
              className="hidden sm:block text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:bg-[#0D452A]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22B35F] focus-visible:ring-offset-2"
              style={{ color: C.forest }}>
              Connexion
            </Link>
            <Link href="/emploi"
              className="flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-lg transition-all hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2"
              style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.green})`, boxShadow: "0 4px 16px rgba(13,69,42,0.30)" }}>
              Commencer <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────── HERO — Split screen ─────────────────── */}
      <section className="relative overflow-hidden">
        {/* halos décoratifs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: C.green, opacity: 0.07 }} aria-hidden="true" />
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-0 min-h-[580px] items-center">

          {/* Texte */}
          <motion.div
            className="relative z-10 py-20 md:py-24 pr-0 md:pr-12"
            variants={v(stagger)}
            initial="hidden"
            animate="show"
          >
            {/* Pill */}
            <motion.div variants={v(fadeUp)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: "rgba(13,69,42,0.06)", color: C.forest, border: `1px solid rgba(34,179,95,0.20)` }}>
              <Zap className="w-3.5 h-3.5" style={{ color: C.gold }} />
              IA · Insertion · Afrique &amp; diaspora
            </motion.div>

            <motion.h1 variants={v(fadeUp)}
              className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] mb-5 tracking-tight"
              style={{ color: C.forest, fontFamily: "'Playfair Display', serif" }}>
              Connecter les talents.{" "}
              <span className="relative inline-block" style={{ color: C.gold }}>
                Créer l'avenir.
                <span className="absolute left-0 -bottom-1 h-[3px] w-full rounded-full" style={{ background: `linear-gradient(90deg, ${C.gold}, transparent)` }} aria-hidden="true" />
              </span>
            </motion.h1>

            <motion.p variants={v(fadeUp)}
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-md" style={{ color: "rgba(13,69,42,0.62)" }}>
              Tests d'orientation contextualisés, CV IA premium, simulation d'entretien et analyse d'offres —
              la première plateforme d'insertion professionnelle pilotée par l'IA pour l'Afrique.
            </motion.p>

            <motion.div variants={v(fadeUp)} className="flex flex-wrap items-center gap-3 mb-8">
              <Link href="/emploi/simulateur"
                className="flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm text-white shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2"
                style={{ background: `linear-gradient(135deg, ${C.gold}, #D97706)`, boxShadow: "0 8px 24px rgba(217,119,6,0.32)" }}>
                <Play className="w-4 h-4" /> Simuler un entretien
              </Link>
              <Link href="/emploi"
                className="flex items-center gap-2 font-semibold px-6 py-3.5 rounded-xl text-sm border-2 transition-all hover:bg-[#0D452A]/5 hover:border-[#0D452A]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22B35F] focus-visible:ring-offset-2"
                style={{ color: C.forest, borderColor: "rgba(13,69,42,0.16)" }}>
                Commencer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={v(fadeUp)} className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B]" style={{ color: C.gold }} aria-hidden="true" />
                ))}
              </div>
              <span className="text-sm ml-1.5 font-medium" style={{ color: "rgba(13,69,42,0.50)" }}>
                4.9/5 · +2 000 utilisateurs
              </span>
            </motion.div>
          </motion.div>

          {/* Image hero */}
          <motion.div
            className="relative hidden md:flex items-end justify-center h-full min-h-[580px]"
            initial={reduce ? undefined : { opacity: 0, x: 30 }}
            animate={reduce ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            {/* Fond décoratif vert */}
            <div className="absolute inset-0 rounded-bl-[80px]"
              style={{ background: `linear-gradient(160deg, ${C.light} 0%, rgba(34,179,95,0.12) 100%)` }} aria-hidden="true" />
            {/* Blob or */}
            <div className="absolute top-12 right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: C.gold, opacity: 0.12 }} aria-hidden="true" />
            <img
              src="/images/hero-femme.jpg"
              alt="Professionnelle utilisant la plateforme GolléO"
              className="relative z-10 h-[520px] w-auto object-cover object-top"
              style={{ filter: "drop-shadow(0 20px 40px rgba(13,69,42,0.20))" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            {/* Badge flottant */}
            <motion.div
              className="absolute bottom-16 left-6 z-20 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl"
              style={{ background: "white", border: "1px solid rgba(13,69,42,0.08)" }}
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${C.green}18` }}>
                <Sparkles className="w-4 h-4" style={{ color: C.green }} />
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: C.forest }}>IA prête en 30 sec</p>
                <p className="text-[11px]" style={{ color: C.muted }}>Analyse en temps réel</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── STATS ─────────────────── */}
      <section className="px-6 py-12">
        <motion.div
          className="mx-auto max-w-4xl"
          variants={v(fadeUp)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <div className="rounded-3xl p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 shadow-xl"
            style={{ background: `linear-gradient(135deg, ${C.forest} 0%, #114A2D 100%)`, backgroundImage: PATTERN_SVG, boxShadow: "0 18px 50px rgba(13,69,42,0.25)" }}>
            {STATS.map((s) => (
              <div key={s.value} className="text-center">
                <div className="text-3xl font-extrabold mb-1"
                  style={{ color: C.gold, fontFamily: "'Playfair Display', serif" }}>
                  {s.value}
                </div>
                <div className="text-xs font-medium" style={{ color: "rgba(242,237,227,0.62)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─────────────────── ESPACES CANDIDATS ─────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <motion.div className="text-center mb-12"
            variants={v(fadeUp)} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <Eyebrow>Choisissez votre espace</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: C.forest, fontFamily: "'Playfair Display', serif" }}>
              Une plateforme,<br/>trois parcours sur mesure
            </h2>
          </motion.div>

          {/* ── Espace Emploi — grande carte visuelle ── */}
          <motion.div
            className="group rounded-3xl overflow-hidden mb-6 shadow-xl"
            style={{ border: "1.5px solid rgba(13,69,42,0.08)" }}
            variants={v(fadeUp)} initial="hidden" whileInView="show" viewport={viewportOnce}
            whileHover={reduce ? undefined : { y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="grid md:grid-cols-2 min-h-[340px]">
              {/* Image entretien */}
              <div className="relative overflow-hidden min-h-[240px]">
                <img src="/images/entretien.jpg" alt="Simulateur d'entretien IA"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    (el.parentElement as HTMLElement).style.background = "linear-gradient(135deg, #F0FDF5, #D1FAE5)";
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 55%, rgba(255,255,255,0.96) 100%)" }} aria-hidden="true" />
                {/* Badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{ background: C.gold }}>
                  <Mic className="w-3 h-3" /> Simulateur IA
                </div>
              </div>
              {/* Contenu */}
              <div className="p-8 lg:p-10 flex flex-col justify-center bg-white">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `${C.gold}18`, border: `1px solid ${C.gold}30` }}>
                  <Briefcase className="w-5 h-5" style={{ color: C.gold }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: C.forest, fontFamily: "'Playfair Display', serif" }}>Je cherche un emploi</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: C.muted }}>
                  Tests d'orientation contextualisés pour l'Afrique, CV IA premium, simulation d'entretien avec feedback détaillé et recommandations métiers personnalisées.
                </p>
                <ul className="space-y-2 mb-6">
                  {["Simulateur entretien IA", "Analyse de CV + Score ATS", "Tests AFRI-CODE & AFRI-SKILL"].map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(13,69,42,0.70)" }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${C.gold}18` }}>
                        <Check className="w-3 h-3" style={{ color: C.gold }} />
                      </span>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/emploi"
                  className="self-start flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-lg transition-all hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:ring-offset-2"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, #D97706)` }}>
                  Accéder <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── Espace Entrepreneur + Conseiller ── */}
          <motion.div className="grid md:grid-cols-2 gap-5"
            variants={v(stagger)} initial="hidden" whileInView="show" viewport={viewportOnce}>

            {/* Entrepreneur */}
            <motion.div variants={v(fadeUp)} whileHover={reduce ? undefined : { y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
              <Link href="/entrepreneur"
                className="group relative block rounded-3xl overflow-hidden h-full transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBBF24] focus-visible:ring-offset-2"
                style={{ border: "1.5px solid rgba(13,69,42,0.08)", background: "white", minHeight: 260 }}>
                <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, ${C.terra}, ${C.gold})` }} aria-hidden="true" />
                <div className="p-6">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: `${C.terra}18`, border: `1px solid ${C.terra}30` }}>
                    <Rocket className="w-5 h-5" style={{ color: C.terra }} />
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: C.forest }}>Je crée mon entreprise</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>
                    Validation d'idée, profil entrepreneurial, maturité de projet et accompagnement financement.
                  </p>
                  <ul className="space-y-1.5 mb-5">
                    {["Profil entrepreneur IA", "Test de maturité projet", "Opportunités & financement"].map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "rgba(13,69,42,0.62)" }}>
                        <Check className="w-3 h-3 shrink-0" style={{ color: C.terra }} />{f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1.5 text-xs font-bold group-hover:gap-3 transition-all" style={{ color: C.terra }}>
                    Accéder <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Conseiller — avec image */}
            <motion.div variants={v(fadeUp)} whileHover={reduce ? undefined : { y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
              <Link href="/conseiller"
                className="group relative block rounded-3xl overflow-hidden h-full transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2"
                style={{ border: "1.5px solid rgba(13,69,42,0.08)", minHeight: 260 }}>
                {/* Image de fond */}
                <div className="absolute inset-0">
                  <img src="/images/conseiller.jpg" alt="Espace conseiller — accompagnement professionnel"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(13,69,42,0.92) 0%, rgba(5,26,13,0.86) 100%)" }} aria-hidden="true" />
                </div>
                {/* Contenu */}
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.30)" }}>
                        <UserCog className="w-5 h-5" style={{ color: C.gold }} />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide"
                        style={{ background: "rgba(245,158,11,0.18)", color: C.gold, border: "1px solid rgba(245,158,11,0.30)" }}>
                        PROFESSIONNEL
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-2 text-white">Je suis conseiller</h3>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.58)" }}>
                      Pilotage multi-bénéficiaires, tableaux de bord, outils RH et reporting avancé.
                    </p>
                    <ul className="space-y-1.5 mb-4">
                      {["Dashboard bénéficiaires", "Outils IA intégrés", "Reporting temps réel"].map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.68)" }}>
                          <Check className="w-3 h-3 shrink-0" style={{ color: C.gold }} />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold group-hover:gap-3 transition-all" style={{ color: C.gold }}>
                    Accéder <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── OUTILS IA ─────────────────── */}
      <section className="px-6 py-16" style={{ background: C.light }}>
        <div className="mx-auto max-w-6xl">
          <motion.div className="text-center mb-10"
            variants={v(fadeUp)} initial="hidden" whileInView="show" viewport={viewportOnce}>
            <Eyebrow>Outils IA inclus</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: C.forest, fontFamily: "'Playfair Display', serif" }}>
              Tout ce dont vous avez besoin
            </h2>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 gap-6"
            variants={v(stagger)} initial="hidden" whileInView="show" viewport={viewportOnce}>

            {/* CV Builder — avec image */}
            <motion.div variants={v(fadeUp)} whileHover={reduce ? undefined : { y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
              <Link href="/cv" className="group block h-full rounded-3xl overflow-hidden shadow-lg transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2"
                style={{ border: "1.5px solid rgba(13,69,42,0.08)", background: "white" }}>
                <div className="relative h-48 overflow-hidden">
                  <img src="/images/cv-template.jpg" alt="CV Builder Premium ATS-optimisé"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = "none";
                      (el.parentElement as HTMLElement).style.background = "linear-gradient(135deg, #FEF3C7, #FDE68A)";
                    }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 60%)" }} aria-hidden="true" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                      style={{ background: "rgba(245,158,11,0.88)", backdropFilter: "blur(8px)" }}>
                      ✨ ATS-Optimisé
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold" style={{ color: C.forest }}>CV Builder Premium</h3>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: C.gold }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                    Templates ATS-optimisés, score IA, export PDF professionnel avec mise en page africaine contextualisée.
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Autres outils */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Mic, label: "Simulateur entretien IA", desc: "Entraînez-vous avec un recruteur IA. Feedback et analyse détaillée.", color: C.terra, href: "/emploi/simulateur" },
                { icon: Target, label: "Analyse d'offres IA", desc: "Match sémantique, mots-clés clés, axes de progrès concrets.", color: C.green, href: "/emploi/analyse-offre" },
                { icon: Brain, label: "Tests AFRI propriétaires", desc: "AFRI-CODE, AFRI-SKILL, IKIGAI — votre profil complet contextualisé.", color: "#5BB8E0", href: "/emploi/tests/afri-code" },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.href} variants={v(fadeUp)} whileHover={reduce ? undefined : { x: 4 }} transition={{ duration: 0.2, ease: EASE }}>
                    <Link href={f.href}
                      className="group flex items-center gap-4 p-4 rounded-2xl transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22B35F] focus-visible:ring-offset-2"
                      style={{ background: "white", border: "1.5px solid rgba(13,69,42,0.07)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                        <Icon className="w-4 h-4" style={{ color: f.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold mb-0.5" style={{ color: C.forest }}>{f.label}</p>
                        <p className="text-xs leading-relaxed truncate" style={{ color: C.muted }}>{f.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "rgba(13,69,42,0.25)" }} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── TÉMOIGNAGES ─────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <motion.div className="grid md:grid-cols-2 gap-8 items-center"
            variants={v(stagger)} initial="hidden" whileInView="show" viewport={viewportOnce}>
            {/* Image */}
            <motion.div variants={v(fadeUp)} className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl">
              <img src="/images/temoignages.jpg" alt="Utilisatrices de GolléO"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  (el.parentElement as HTMLElement).style.background = "linear-gradient(135deg, #F0FDF5, #D1FAE5)";
                }}
              />
              {/* Overlay doux */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,69,42,0.5) 0%, transparent 50%)" }} aria-hidden="true" />
              {/* Stat flottante */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div className="px-4 py-3 rounded-2xl shadow-xl"
                  style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}>
                  <p className="text-2xl font-extrabold" style={{ color: C.forest, fontFamily: "'Playfair Display', serif" }}>94%</p>
                  <p className="text-[11px] font-medium" style={{ color: C.muted }}>taux de satisfaction</p>
                </div>
                <div className="px-4 py-3 rounded-2xl shadow-xl"
                  style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)" }}>
                  <p className="text-2xl font-extrabold" style={{ color: C.gold, fontFamily: "'Playfair Display', serif" }}>2000+</p>
                  <p className="text-[11px] font-medium" style={{ color: C.muted }}>utilisateurs actifs</p>
                </div>
              </div>
            </motion.div>

            {/* Témoignages */}
            <motion.div variants={v(fadeUp)}>
              <Eyebrow>Témoignages</Eyebrow>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 tracking-tight" style={{ color: C.forest, fontFamily: "'Playfair Display', serif" }}>
                Ils ont transformé leur carrière avec GolléO
              </h2>
              <div className="space-y-5">
                {TEMOIGNAGES.map((t) => (
                  <div key={t.name} className="p-5 rounded-2xl transition-shadow hover:shadow-md"
                    style={{ background: C.light, border: "1px solid rgba(34,179,95,0.12)" }}>
                    <Quote className="w-5 h-5 mb-3" style={{ color: C.gold }} />
                    <p className="text-sm leading-relaxed mb-4 italic" style={{ color: "rgba(13,69,42,0.78)" }}>
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                        style={{ background: `${C.green}20`, border: `2px solid ${C.green}30` }}>
                        <img src={t.img} alt={t.name} className="w-full h-full object-cover object-top"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: C.forest }}>{t.name}</p>
                        <p className="text-[11px]" style={{ color: C.muted }}>{t.role}</p>
                      </div>
                      <div className="ml-auto flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#F59E0B]" style={{ color: C.gold }} aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────── VALEURS + CTA FINAL ─────────────────── */}
      <section className="px-6 py-16">
        <motion.div className="mx-auto max-w-5xl"
          variants={v(fadeUp)} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <div className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${C.forest} 0%, #1A5C38 100%)`, backgroundImage: PATTERN_SVG, boxShadow: "0 24px 60px rgba(13,69,42,0.30)" }}>
            <div className="grid md:grid-cols-2 gap-0 items-stretch">
              {/* Texte + CTA */}
              <div className="p-10 lg:p-12 flex flex-col justify-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(245,158,11,0.70)" }}>
                  Notre ambition
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Bâtir le futur du travail en Afrique et partout.
                </h2>
                <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.60)" }}>
                  GolléO connecte les talents africains aux opportunités mondiales grâce à des outils IA contextualisés, accessibles et éthiques.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: TrendingUp, label: "Ambition" },
                    { icon: Star, label: "Excellence" },
                    { icon: Zap, label: "Impact" },
                    { icon: Shield, label: "Intégrité" },
                  ].map((vl) => {
                    const Icon = vl.icon;
                    return (
                      <div key={vl.label} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)" }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: C.gold }} />
                        </div>
                        <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.88)" }}>{vl.label}</span>
                      </div>
                    );
                  })}
                </div>
                <Link href="/emploi"
                  className="self-start flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm shadow-xl transition-all hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D452A]"
                  style={{ background: `linear-gradient(135deg, ${C.gold}, #D97706)`, color: "white" }}>
                  Commencer maintenant <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Image conseiller */}
              <div className="relative hidden md:block min-h-[380px]">
                <img src="/images/conseiller.jpg" alt="Coaching professionnel GolléO"
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.55 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(13,69,42,0.85) 0%, transparent 60%)" }} aria-hidden="true" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="border-t py-10 px-6" style={{ borderColor: "rgba(13,69,42,0.10)" }}>
        <div className="mx-auto max-w-6xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="max-w-xs">
              <Logo size="sm" />
              <p className="text-xs mt-3 leading-relaxed" style={{ color: "rgba(13,69,42,0.45)" }}>
                La plateforme d'insertion professionnelle pilotée par l'IA pour l'Afrique francophone et la diaspora.
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium" style={{ color: C.muted }} aria-label="Liens de pied de page">
              <Link href="/emploi" className="hover:text-[#0D452A] transition-colors focus-visible:outline-none focus-visible:text-[#0D452A]">Candidats</Link>
              <Link href="/entrepreneur" className="hover:text-[#0D452A] transition-colors focus-visible:outline-none focus-visible:text-[#0D452A]">Entrepreneurs</Link>
              <Link href="/conseiller" className="hover:text-[#0D452A] transition-colors focus-visible:outline-none focus-visible:text-[#0D452A]">Conseillers</Link>
              <Link href="/cv" className="hover:text-[#0D452A] transition-colors focus-visible:outline-none focus-visible:text-[#0D452A]">CV Builder</Link>
            </nav>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t" style={{ borderColor: "rgba(13,69,42,0.07)" }}>
            <div className="flex items-center gap-6 text-xs" style={{ color: "rgba(13,69,42,0.42)" }}>
              <span className="flex items-center gap-1"><Globe2 className="w-3 h-3" /> 50+ pays</span>
              <span>RGPD · IA Responsable</span>
            </div>
            <span className="text-xs" style={{ color: "rgba(13,69,42,0.42)" }}>© 2025 GolléO. Tous droits réservés.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
