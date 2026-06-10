// ─────────────────────────────────────────────────────────────────────────────
//  GolléO × UpStack — Simulateur d'entretien IA (Yoodli-inspired)
//  Intégré dans le layout GolléO (pas fullscreen)
//  Design: palette UpStack — violet, lavande, vert sauge, corail
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, Bot, Brain, Briefcase, Check, ChevronDown, ChevronRight,
  Clock, GraduationCap, Keyboard, Lightbulb, Mic, MicOff, Play,
  RefreshCw, Rocket, Send, Sparkles, Star, Target, Timer,
  Trophy, TrendingUp, Users, Volume2, VolumeX, X, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "rh" | "technique" | "comportemental" | "startup" | "commercial" | "ecole";
type Phase = "setup" | "interview" | "results";
type InputMode = "voice" | "text";

interface ScoreDetail { pertinence: number; structure: number; impact: number; persuasion: number }

interface AnswerRecord {
  question: string;
  answer: string;
  score: number;       // /10
  advice: string;
  scores: ScoreDetail;
  duration: number;
  wordCount: number;
}

// ─── Mode data ────────────────────────────────────────────────────────────────

const MODES: Record<Mode, {
  label: string; subtitle: string; icon: React.ElementType;
  color: string; dot: string; bg: string;
  questions: string[]; tips: string[];
}> = {
  rh: {
    label: "Entretien RH", subtitle: "Motivation & soft skills", icon: Users,
    color: "text-sky-600", dot: "bg-sky-400", bg: "bg-sky-50 border-sky-200",
    questions: [
      "Présentez-vous en 2-3 minutes et reliez votre parcours au poste visé.",
      "Pourquoi souhaitez-vous rejoindre notre organisation ?",
      "Quelles sont vos 3 principales forces et une faiblesse honnête ?",
      "Comment gérez-vous les conflits au sein d'une équipe ?",
      "Où vous voyez-vous dans 3 à 5 ans ?",
      "Quelle est votre plus grande réussite professionnelle ?",
    ],
    tips: ["Reliez chaque réponse à la valeur que vous apportez", "Montrez votre connaissance de l'entreprise", "Soyez authentique — les recruteurs détectent la récitation"],
  },
  technique: {
    label: "Technique", subtitle: "Compétences & cas pratiques", icon: Brain,
    color: "text-teal-700", dot: "bg-teal-500", bg: "bg-teal-50 border-teal-200",
    questions: [
      "Décrivez un projet technique complexe que vous avez piloté de A à Z.",
      "Comment priorisez-vous votre backlog dans un environnement agile ?",
      "Décrivez votre processus pour résoudre un problème critique en production.",
      "Quelle est votre approche pour apprendre une nouvelle technologie rapidement ?",
      "Comment mesurez-vous le succès d'une livraison ?",
    ],
    tips: ["Chiffrez vos impacts techniques (délais, coûts, performance)", "Utilisez le vocabulaire du secteur", "Exemples concrets pour chaque compétence citée"],
  },
  comportemental: {
    label: "Comportemental", subtitle: "Méthode STAR", icon: Target,
    color: "text-emerald-600", dot: "bg-emerald-400", bg: "bg-emerald-50 border-emerald-200",
    questions: [
      "Décrivez une décision difficile prise avec peu d'information.",
      "Parlez d'un projet qui a échoué. Qu'avez-vous appris ?",
      "Comment avez-vous géré un désaccord majeur avec votre manager ?",
      "Donnez un exemple d'influence sans autorité formelle.",
      "Comment avez-vous géré une forte pression ou un délai impossible ?",
    ],
    tips: ["Méthode STAR : Situation → Tâche → Action → Résultat", "Résultat mesurable à chaque réponse", "Exemples concrets — pas hypothétiques"],
  },
  startup: {
    label: "Startup", subtitle: "Culture fit & autonomie", icon: Rocket,
    color: "text-orange-600", dot: "bg-orange-400", bg: "bg-orange-50 border-orange-200",
    questions: [
      "Qu'est-ce qui vous attire dans notre stade de développement ?",
      "Comment gérez-vous l'ambiguïté et le changement rapide ?",
      "Quelle startup ou produit digital vous inspire le plus ?",
      "Comment construiriez-vous ce produit avec une équipe de 3 ?",
      "Comment conciliez-vous vitesse et qualité ?",
    ],
    tips: ["Montrez que vous savez prioriser vite", "Side-projects ou contributions open-source", "Jargon startup : MVP, PMF, churn, ARR…"],
  },
  commercial: {
    label: "Commercial B2B", subtitle: "Vente & closing", icon: Briefcase,
    color: "text-amber-600", dot: "bg-amber-400", bg: "bg-amber-50 border-amber-200",
    questions: [
      "Décrivez votre processus de qualification d'un prospect B2B.",
      "Quelle est votre technique de closing dans un cycle long ?",
      "Comment gérez-vous un prospect qui objecte sur le prix ?",
      "Présentez notre produit en 60 secondes comme si j'étais client.",
      "Quelle est votre meilleure vente et comment l'avez-vous conclue ?",
    ],
    tips: ["Chiffrez : CA, taux de conversion, quota atteint", "Écouter avant de pitcher", "Mini-pitch produit solide"],
  },
  ecole: {
    label: "Admissions", subtitle: "Motivation & projet de vie", icon: GraduationCap,
    color: "text-amber-700", dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200",
    questions: [
      "Pourquoi avez-vous choisi cette formation ou cette école ?",
      "Quel est votre projet professionnel à 5 et 10 ans ?",
      "Qu'est-ce qui vous distingue des autres candidats ?",
      "Comment expliquez-vous un résultat académique inférieur à vos capacités ?",
      "Quelle valeur ajoutée apportez-vous à notre promotion ?",
    ],
    tips: ["Vision cohérente et ambitieuse", "Liez expériences passées à votre projet futur", "Préparez une question sur le programme"],
  },
};

const JOB_CHIPS = ["Product Manager", "Développeur Full-Stack", "Data Scientist", "Commercial B2B", "Chef de projet", "UX Designer", "Consultant", "Data Analyst"];

// ─── Local evaluation ─────────────────────────────────────────────────────────

function evaluate(answer: string, mode: Mode): { score: number; advice: string; scores: ScoreDetail } {
  const t = answer.toLowerCase();
  const words = answer.trim().split(/\s+/).filter(Boolean).length;

  let p = 50; // pertinence
  if (words > 60) p += 15;
  if (/\d|%|euros?|mois|semaines?|ans?|utilisateurs?|clients?/.test(t)) p += 20;
  if (/résultat|impact|amélioration|réduction|augmentation/.test(t)) p += 15;
  p = Math.min(100, p);

  let s = 40; // structure
  if (mode === "comportemental" && /situation|tâche|action|résultat/.test(t)) s += 30;
  if (/premièrement|ensuite|enfin|d'abord|pour conclure/.test(t)) s += 20;
  if (words > 80 && words < 300) s += 10;
  s = Math.min(100, s);

  let i = 40; // impact
  if (/\d+\s*%|\d+\s*k|\d+\s*m€|\d+\s*fois/.test(t)) i += 30;
  if (/j'ai|nous avons|j'ai piloté|j'ai développé/.test(t)) i += 20;
  if (/grâce à|ce qui a permis|résultant en/.test(t)) i += 10;
  i = Math.min(100, i);

  let ps = 45; // persuasion
  if (words > 100) ps += 10;
  if (/je crois|je pense|je suis convaincu/.test(t)) ps += 15;
  if (/exemple|concrètement|c'est-à-dire/.test(t)) ps += 15;
  if (words < 25) ps -= 20;
  ps = Math.min(100, Math.max(0, ps));

  const g = Math.round((p + s + i + ps) / 4);
  const score = Math.round(g / 10);
  const advice =
    g >= 85 ? "Excellente réponse ! Structure solide et impact démontré." :
    g >= 70 ? "Bonne réponse. Ajoutez un résultat chiffré pour +15 pts." :
    g >= 55 ? "Correcte mais manque de précision. Utilisez la méthode STAR." :
    "Trop vague. Donnez des exemples précis avec résultat mesurable.";
  return { score, advice, scores: { pertinence: p, structure: s, impact: i, persuasion: ps } };
}

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

function scoreColor(v: number) {
  if (v >= 70) return "bg-emerald-500";
  if (v >= 50) return "bg-amber-500";
  return "bg-rose-500";
}
function scoreBadgeClass(s: number) {
  if (s >= 8) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (s >= 6) return "bg-amber-100 text-amber-700 border-amber-200";
  return "bg-rose-100 text-rose-700 border-rose-200";
}
function mention(v: number) {
  if (v >= 85) return { label: "Excellent", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (v >= 70) return { label: "Très Bien", cls: "text-blue-600 bg-blue-50 border-blue-200" };
  if (v >= 55) return { label: "Bien", cls: "text-amber-600 bg-amber-50 border-amber-200" };
  return { label: "Passable", cls: "text-orange-600 bg-orange-50 border-orange-200" };
}

// ─── Waveform ─────────────────────────────────────────────────────────────────

function Waveform({ active }: { active: boolean }) {
  const bars = 20;
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: 3,
            background: active ? "var(--upstack-lavender)" : "hsl(var(--border))",
            height: active
              ? `${10 + Math.abs(Math.sin(i * 0.6 + Date.now() / 300)) * 28}px`
              : `${4 + Math.sin(i * 0.8) * 3}px`,
            animationDelay: `${i * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Score Gauge SVG ──────────────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const r = 48, c = 2 * Math.PI * r;
  const progress = (score / 100) * c;
  const m = mention(score);
  const strokeColor = score >= 70 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={strokeColor} strokeWidth="8"
          strokeDasharray={`${progress} ${c}`} strokeLinecap="round"
          transform="rotate(-90 60 60)" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold leading-none">{score}</span>
        <span className="text-[10px] text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PHASE 1 — SETUP
// ═══════════════════════════════════════════════════════════════════════════════

function SetupPhase({
  jobTitle, setJobTitle, mode, setMode, onStart,
}: {
  jobTitle: string; setJobTitle: (v: string) => void;
  mode: Mode; setMode: (m: Mode) => void; onStart: () => void;
}) {
  const [showList, setShowList] = useState(false);
  const filtered = JOB_CHIPS.filter(j =>
    j.toLowerCase().includes(jobTitle.toLowerCase()) && j !== jobTitle
  );

  return (
    <div className="max-w-2xl mx-auto py-4">

      {/* Hero */}
      <div className="rounded-2xl p-6 mb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--upstack-purple-deep) 0%, #2D1B69 100%)" }}>
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--upstack-lavender)" }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-3"
            style={{ background: "rgba(184,169,255,0.15)", color: "var(--upstack-lavender)", border: "1px solid rgba(184,169,255,0.25)" }}>
            <Sparkles className="w-3.5 h-3.5" /> Simulateur d'entretien IA
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Préparez votre entretien</h1>
          <p className="text-white/50 text-sm">Entraînez-vous avec un recruteur IA · Feedback instantané · Transcription vocale</p>
        </div>
      </div>

      {/* Card setup */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-5 shadow-sm">

        {/* Job input */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Poste visé</label>
          <div className="relative">
            <input
              type="text"
              value={jobTitle}
              onChange={e => { setJobTitle(e.target.value); setShowList(true); }}
              onFocus={() => setShowList(true)}
              onBlur={() => setTimeout(() => setShowList(false), 180)}
              placeholder="ex. Product Manager, Data Analyst…"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            {showList && filtered.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                {filtered.slice(0, 5).map(j => (
                  <button key={j} className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                    onMouseDown={() => { setJobTitle(j); setShowList(false); }}>
                    {j}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {JOB_CHIPS.slice(0, 5).map(j => (
              <button key={j} onClick={() => setJobTitle(j)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all font-medium ${
                  jobTitle === j
                    ? "text-white border-primary" : "bg-muted/40 text-muted-foreground border-border hover:border-primary/40"
                }`}
                style={jobTitle === j ? { background: "var(--upstack-purple)" } : {}}>
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* Mode cards */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Type d'entretien</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(MODES) as [Mode, typeof MODES[Mode]][]).map(([key, m]) => {
              const Icon = m.icon;
              const sel = mode === key;
              return (
                <button key={key} onClick={() => setMode(key)}
                  className={`relative flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${
                    sel ? "border-primary shadow-sm" : "border-border hover:border-primary/30 hover:bg-muted/20"
                  }`}
                  style={sel ? { background: "rgba(108, 79, 218, 0.05)" } : {}}>
                  {sel && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "var(--upstack-purple)" }}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${m.bg} border`}>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{m.label}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{m.subtitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className={`rounded-xl p-3.5 border ${MODES[mode].bg} flex items-start gap-2.5`}>
          <Lightbulb className={`w-4 h-4 shrink-0 mt-0.5 ${MODES[mode].color}`} />
          <div>
            <p className="text-xs font-semibold text-foreground">{MODES[mode].label} · {MODES[mode].questions.length} questions</p>
            <ul className="mt-1 space-y-0.5">
              {MODES[mode].tips.slice(0, 2).map((t, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1">
                  <span className={`${MODES[mode].color} mt-0.5`}>•</span> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={onStart}
          disabled={!jobTitle.trim()}
          className="w-full h-12 rounded-xl text-sm font-bold gap-2 shadow-lg"
          style={{ background: "linear-gradient(135deg, #8B6FEA 0%, var(--upstack-purple) 100%)", boxShadow: "0 4px 20px rgba(108, 79, 218, 0.35)" }}>
          <Play className="w-4 h-4" />
          Commencer l'entretien
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PHASE 2 — INTERVIEW (Yoodli-style, intégré dans GolléO)
// ═══════════════════════════════════════════════════════════════════════════════

function InterviewPhase({
  mode, jobTitle, answers, onAnswer, onFinish, onAbort,
}: {
  mode: Mode; jobTitle: string; answers: AnswerRecord[];
  onAnswer: (r: AnswerRecord) => void; onFinish: () => void; onAbort: () => void;
}) {
  const { toast } = useToast();
  const questions = MODES[mode].questions;
  const idx = answers.length;
  const done = idx >= questions.length;
  const isLast = idx === questions.length - 1;
  const currentQ = questions[idx] ?? "";

  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [recording, setRecording] = useState(false);
  const [tts, setTts] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [qTime, setQTime] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [flash, setFlash] = useState<{ score: number; advice: string } | null>(null);

  const recogRef = useRef<any>(null);
  const gTimerRef = useRef<any>(null);
  const qTimerRef = useRef<any>(null);

  // Global timer
  useEffect(() => {
    gTimerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(gTimerRef.current);
  }, []);

  // Per-question timer
  useEffect(() => {
    setQTime(0);
    qTimerRef.current = setInterval(() => setQTime(s => s + 1), 1000);
    return () => clearInterval(qTimerRef.current);
  }, [idx]);

  const speakQ = useCallback((text: string) => {
    if (!tts || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text.slice(0, 280));
    u.lang = "fr-FR"; u.rate = 0.88; u.pitch = 1.0;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [tts]);

  useEffect(() => {
    if (!done) {
      setTranscript(""); setInterim(""); setFlash(null);
      speakQ(currentQ);
    }
  }, [idx, done]);

  const startRec = useCallback(() => {
    const API = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!API) {
      toast({ title: "Microphone non supporté", description: "Utilisez Chrome ou Edge, ou passez en mode Texte.", variant: "destructive" });
      setInputMode("text"); return;
    }
    const r = new API();
    r.lang = "fr-FR"; r.continuous = true; r.interimResults = true;
    r.onresult = (e: any) => {
      let fin = "", int = "";
      for (const res of e.results) {
        if (res.isFinal) fin += res[0].transcript + " ";
        else int += res[0].transcript;
      }
      if (fin) setTranscript(p => p + fin);
      setInterim(int);
    };
    r.onerror = () => setRecording(false);
    r.onend = () => setRecording(false);
    recogRef.current = r; r.start(); setRecording(true);
  }, [toast]);

  const stopRec = useCallback(() => {
    recogRef.current?.stop(); setRecording(false); setInterim("");
  }, []);

  const fullAnswer = transcript + interim;

  const submit = useCallback(() => {
    const ans = fullAnswer.trim();
    if (!ans) { toast({ title: "Réponse vide", variant: "destructive" }); return; }
    stopRec();
    const ev = evaluate(ans, mode);
    setFlash({ score: ev.score, advice: ev.advice });
    const record: AnswerRecord = {
      question: currentQ, answer: ans, score: ev.score,
      advice: ev.advice, scores: ev.scores, duration: qTime,
      wordCount: ans.split(/\s+/).filter(Boolean).length,
    };
    setTimeout(() => {
      onAnswer(record);
      if (idx >= questions.length - 1) onFinish();
    }, 2000);
  }, [fullAnswer, currentQ, mode, qTime, idx, questions.length, onAnswer, onFinish, stopRec, toast]);

  const skip = useCallback(() => {
    stopRec();
    const record: AnswerRecord = {
      question: currentQ, answer: "(Passée)", score: 0,
      advice: "Question passée — préparez une réponse pour le vrai entretien.",
      scores: { pertinence: 0, structure: 0, impact: 0, persuasion: 0 },
      duration: qTime, wordCount: 0,
    };
    onAnswer(record);
    if (idx >= questions.length - 1) onFinish();
  }, [currentQ, qTime, idx, questions.length, onAnswer, onFinish, stopRec]);

  if (done) return null;
  const prog = (idx / questions.length) * 100;
  const wc = fullAnswer.trim().split(/\s+/).filter(Boolean).length;
  const m = MODES[mode];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">

      {/* ── Top bar ── */}
      <div className="bg-card border border-border rounded-2xl px-5 py-3 flex items-center gap-4 shadow-sm">
        <button onClick={() => { window.speechSynthesis?.cancel(); onAbort(); }}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium">
          <X className="w-4 h-4" /> Quitter
        </button>

        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs text-muted-foreground shrink-0 font-medium">Q{idx + 1}/{questions.length}</span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${prog}%`, background: "var(--upstack-purple)" }} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Timer className="w-3.5 h-3.5" /> {fmt(elapsed)}
          </div>
          <button onClick={() => setTts(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors">
            {tts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Past scores */}
        {answers.length > 0 && (
          <div className="flex gap-1">
            {answers.map((a, i) => (
              <div key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${a.score >= 7 ? "bg-emerald-500" : a.score >= 5 ? "bg-amber-500" : "bg-rose-400"}`}>
                {a.score}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Main grid: Question | Recording ── */}
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">

        {/* Left — Question */}
        <div className="space-y-3">
          {/* AI interviewer badge */}
          <div className="flex items-center gap-3">
            <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${speaking ? "ring-2 ring-offset-2 animate-pulse" : ""}`}
              style={{ background: "linear-gradient(135deg, #B8A9FF, var(--upstack-purple))", outlineColor: "var(--upstack-lavender)" }}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Recruteur IA GolléO</p>
              <p className="text-xs text-muted-foreground">{speaking ? "En train de parler…" : m.label}</p>
            </div>
            <button onClick={() => speakQ(currentQ)}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Question bubble */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-1.5 mb-3">
              <div className={`w-2 h-2 rounded-full ${m.dot}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Question {idx + 1}</span>
            </div>
            <p className="text-base font-medium text-foreground leading-relaxed">{currentQ}</p>
          </div>

          {/* Tips toggle */}
          <button onClick={() => setShowTips(v => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Lightbulb className="w-3.5 h-3.5" />
            Conseils pour cette question
            <ChevronDown className={`w-3 h-3 transition-transform ${showTips ? "rotate-180" : ""}`} />
          </button>
          {showTips && (
            <div className={`rounded-xl p-3.5 border ${m.bg} space-y-1.5`}>
              {m.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-foreground/70">
                  <span className={`${m.color} mt-0.5 shrink-0`}>✦</span> {tip}
                </div>
              ))}
            </div>
          )}

          {/* Flash feedback */}
          {flash && (
            <div className={`rounded-xl p-4 border ${flash.score >= 7 ? "bg-emerald-50 border-emerald-200" : flash.score >= 5 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200"}`}>
              <div className="flex items-center gap-2 mb-1">
                <Star className={`w-4 h-4 ${flash.score >= 7 ? "text-emerald-600" : flash.score >= 5 ? "text-amber-600" : "text-rose-600"}`} />
                <span className="text-sm font-semibold">Score : {flash.score}/10</span>
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground animate-spin ml-auto" />
              </div>
              <p className="text-xs text-muted-foreground">{flash.advice}</p>
            </div>
          )}
        </div>

        {/* Right — Recording */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">

          {/* Mode toggle */}
          <div className="flex bg-muted/50 rounded-xl p-1 border border-border">
            {(["voice", "text"] as InputMode[]).map(im => (
              <button key={im} onClick={() => { stopRec(); setInputMode(im); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${inputMode === im ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}>
                {im === "voice" ? <><Mic className="w-3.5 h-3.5" /> Voix</> : <><Keyboard className="w-3.5 h-3.5" /> Texte</>}
              </button>
            ))}
          </div>

          {inputMode === "voice" ? (
            <>
              {/* Waveform */}
              <div className="bg-muted/30 border border-border rounded-xl p-4">
                <Waveform active={recording} />
                {recording && (
                  <p className="text-center text-[10px] font-medium mt-2 animate-pulse" style={{ color: "var(--upstack-lavender)" }}>
                    Enregistrement en cours…
                  </p>
                )}
              </div>

              {/* Big mic button */}
              <div className="flex justify-center">
                <button onClick={recording ? stopRec : startRec}
                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${recording ? "scale-110" : "hover:scale-105"}`}
                  style={{
                    background: recording
                      ? "linear-gradient(135deg, #f87171, #ef4444)"
                      : "linear-gradient(135deg, #B8A9FF, var(--upstack-purple))",
                    boxShadow: recording
                      ? "0 4px 20px rgba(239,68,68,0.4)"
                      : "0 4px 20px rgba(108, 79, 218, 0.4)",
                  }}>
                  {recording ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
                  {recording && <span className="absolute inset-0 rounded-2xl border-2 border-red-400 animate-ping opacity-60" />}
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                {recording ? "Cliquez pour arrêter" : "Cliquez pour parler"}
              </p>

              {/* Transcript */}
              {fullAnswer && (
                <div className="bg-muted/30 border border-border rounded-xl p-3 max-h-28 overflow-y-auto">
                  <p className="text-xs text-foreground leading-relaxed">
                    {transcript}
                    {interim && <span className="text-muted-foreground">{interim}</span>}
                  </p>
                </div>
              )}
            </>
          ) : (
            <Textarea
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Tapez votre réponse… (80-150 mots recommandés)"
              className="bg-muted/30 border-border resize-none h-44 rounded-xl text-sm"
            />
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <div className="flex items-center gap-3">
              <span>{wc} mots</span>
              {wc > 0 && wc < 40 && <span className="text-amber-500 font-medium">↗ Développez</span>}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {fmt(qTime)}
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={submit}
            disabled={!fullAnswer.trim() || !!flash}
            className="w-full h-10 rounded-xl gap-2 text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, #8B6FEA, var(--upstack-purple))",
              boxShadow: "0 4px 16px rgba(108, 79, 218, 0.3)",
            }}>
            {flash
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Question suivante…</>
              : isLast
              ? <><Trophy className="w-4 h-4" /> Terminer l'entretien</>
              : <><Send className="w-4 h-4" /> Envoyer ma réponse</>
            }
          </Button>

          {!flash && (
            <button onClick={skip} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
              Passer cette question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PHASE 3 — RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

function ResultsPhase({
  answers, mode, jobTitle, onRestart,
}: {
  answers: AnswerRecord[]; mode: Mode; jobTitle: string; onRestart: () => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const global = useMemo(() => {
    const valid = answers.filter(a => a.score > 0);
    if (!valid.length) return 0;
    return Math.round((valid.reduce((s, a) => s + a.score, 0) / valid.length) * 10);
  }, [answers]);

  const avgs = useMemo(() => {
    const v = answers.filter(a => a.score > 0);
    if (!v.length) return { pertinence: 0, structure: 0, impact: 0, persuasion: 0 };
    const avg = (k: keyof ScoreDetail) => Math.round(v.reduce((s, a) => s + a.scores[k], 0) / v.length);
    return { pertinence: avg("pertinence"), structure: avg("structure"), impact: avg("impact"), persuasion: avg("persuasion") };
  }, [answers]);

  const totalTime = answers.reduce((s, a) => s + a.duration, 0);
  const avgWc = Math.round(answers.filter(a => a.wordCount > 0).reduce((s, a, _, arr) => s + a.wordCount / arr.length, 0));
  const m = mention(global);
  const mod = MODES[mode];

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      {/* Hero score */}
      <div className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: "linear-gradient(135deg, var(--upstack-purple-deep) 0%, #2D1B69 100%)" }}>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl opacity-30"
          style={{ background: "var(--upstack-lavender)" }} />
        <div className="relative flex items-center gap-6">
          <ScoreGauge score={global} />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5" style={{ color: "var(--upstack-lavender)" }} />
              <span className="text-white font-bold">Entretien terminé</span>
            </div>
            <p className="text-white/50 text-sm mb-3">{jobTitle} · {mod.label}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${m.cls}`}>{m.label}</span>
            <div className="flex gap-5 mt-3">
              {[["Questions", answers.length], ["Durée", fmt(totalTime)], ["Mots/rép", avgWc]].map(([k, v]) => (
                <div key={k as string}>
                  <p className="text-lg font-bold text-white">{v}</p>
                  <p className="text-[10px] text-white/40">{k}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: "var(--upstack-purple)" }} />
          Analyse de performance
        </h3>
        <div className="space-y-3">
          {([
            ["Pertinence", avgs.pertinence, "bg-sky-400"],
            ["Structure", avgs.structure, "bg-teal-600"],
            ["Impact & Résultats", avgs.impact, "bg-emerald-400"],
            ["Persuasion", avgs.persuasion, "bg-amber-400"],
          ] as [string, number, string][]).map(([label, val, cls]) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground font-medium">{label}</span>
                <span className="font-bold text-foreground">{val}<span className="text-muted-foreground font-normal">/100</span></span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${cls}`} style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forces / Axes */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5 mb-3">
            <Zap className="w-4 h-4" /> Points forts
          </h3>
          <ul className="space-y-1.5">
            {[
              avgs.pertinence >= 70 && "Réponses pertinentes par rapport au poste",
              avgs.structure >= 70 && "Bonne structure argumentaire",
              avgs.impact >= 70 && "Impacts concrets mis en avant",
              avgWc > 80 && "Développements suffisamment étoffés",
              global >= 70 && "Performance globale solide",
            ].filter(Boolean).slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-1.5 mb-3">
            <Target className="w-4 h-4" /> À améliorer
          </h3>
          <ul className="space-y-1.5">
            {[
              avgs.structure < 60 && "Structurez avec la méthode STAR",
              avgs.impact < 60 && "Ajoutez des résultats chiffrés",
              avgWc < 50 && "Développez vos réponses (viser 80+ mots)",
              avgs.persuasion < 60 && "Renforcez votre argumentation",
            ].filter(Boolean).slice(0, 3).map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
                <ChevronRight className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" /> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question review */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4" style={{ color: "var(--upstack-purple)" }} />
            Détail par question
          </h3>
        </div>
        {answers.map((a, i) => {
          const open = expanded === i;
          return (
            <div key={i} className="border-b border-border last:border-0">
              <button onClick={() => setExpanded(open ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 ${a.score >= 7 ? "bg-emerald-500" : a.score >= 5 ? "bg-amber-500" : "bg-rose-400"}`}>
                  {a.score}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{a.question}</p>
                  <p className="text-[10px] text-muted-foreground">{a.wordCount} mots · {fmt(a.duration)}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="border-t border-border bg-muted/20 p-4 space-y-3">
                  <p className="text-xs text-foreground leading-relaxed">{a.answer}</p>
                  <div className={`rounded-xl p-3 border text-xs font-medium ${scoreBadgeClass(a.score)}`}>
                    {a.advice}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(a.scores).map(([k, v]) => (
                      <div key={k}>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-muted-foreground capitalize">{k}</span>
                          <span className="font-semibold">{v}</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${scoreColor(v)}`} style={{ width: `${v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <Button onClick={onRestart} className="flex-1 h-11 rounded-xl gap-2 text-sm font-bold"
          style={{ background: "linear-gradient(135deg, #8B6FEA, var(--upstack-purple))", boxShadow: "0 4px 16px rgba(108,79,218,0.3)" }}>
          <RefreshCw className="w-4 h-4" /> Recommencer
        </Button>
        <Button variant="outline" className="flex-1 h-11 rounded-xl gap-2 text-sm" onClick={() => window.print()}>
          <Trophy className="w-4 h-4" /> Exporter
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════════════════

export default function InterviewSimulator() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<Mode>("rh");
  const [jobTitle, setJobTitle] = useState("Product Manager");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const onStart = useCallback(() => { setAnswers([]); setPhase("interview"); }, []);
  const onAnswer = useCallback((r: AnswerRecord) => setAnswers(p => [...p, r]), []);
  const onFinish = useCallback(() => { window.speechSynthesis?.cancel(); setPhase("results"); }, []);
  const onRestart = useCallback(() => { window.speechSynthesis?.cancel(); setAnswers([]); setPhase("setup"); }, []);

  if (phase === "setup") return <SetupPhase jobTitle={jobTitle} setJobTitle={setJobTitle} mode={mode} setMode={setMode} onStart={onStart} />;
  if (phase === "interview") return <InterviewPhase mode={mode} jobTitle={jobTitle} answers={answers} onAnswer={onAnswer} onFinish={onFinish} onAbort={() => { window.speechSynthesis?.cancel(); setPhase("setup"); }} />;
  return <ResultsPhase answers={answers} mode={mode} jobTitle={jobTitle} onRestart={onRestart} />;
}
