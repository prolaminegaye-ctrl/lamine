import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, FlaskConical, Target, ArrowRight, Clock, Sparkles, BarChart2 } from "lucide-react";

const TESTS = [
  {
    href: "/entrepreneur/tests/ikigai",
    icon: Target,
    label: "IKIGAI Entrepreneurial",
    duration: "8–12 min",
    questions: 20,
    description: "Découvrez les activités alignées avec votre personnalité, vos passions monétisables et les modèles business compatibles avec votre profil.",
    tags: ["Vision", "Passion", "Business"],
    color: "golleo-gold",
    style: { background: "linear-gradient(135deg, #C8964E, #B07A35)" },
  },
  {
    href: "/entrepreneur/tests/profil",
    icon: Rocket,
    label: "Profil d'Entrepreneur",
    duration: "10–15 min",
    questions: 30,
    description: "Évaluez vos 10 aptitudes entrepreneuriales clés — autonomie, résilience, vision, leadership — et découvrez votre modèle business idéal.",
    tags: ["Aptitudes", "Profil", "Business model"],
    color: "golleo-terra",
    style: { background: "linear-gradient(135deg, #D6845A, #B8603A)" },
  },
  {
    href: "/entrepreneur/tests/projet",
    icon: FlaskConical,
    label: "Maturité de Projet",
    duration: "8–10 min",
    questions: 24,
    description: "Évaluez le niveau de préparation de votre projet sur 6 dimensions : vision, marché, financement, compétences, stratégie, viabilité.",
    tags: ["Projet", "Roadmap", "Viabilité"],
    color: "golleo-green",
    style: { background: "linear-gradient(135deg, #2E7D5B, #1E3A2F)" },
  },
];

const TIPS = [
  "Commencez par l'IKIGAI pour identifier votre terrain d'activité naturel",
  "Passez le Profil d'Entrepreneur pour connaître vos forces et points de vigilance",
  "Finalisez avec la Maturité de Projet pour évaluer votre préparation au lancement",
];

export default function EspaceEntrepreneur() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero */}
      <div className="rounded-2xl p-7" style={{ background: "linear-gradient(135deg, rgba(200,150,78,0.12), rgba(214,132,90,0.06))", border: "1px solid rgba(200,150,78,0.25)" }}>
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #C8964E, #B07A35)" }}>
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Bienvenue dans votre Espace Entrepreneur</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Évaluez votre profil entrepreneurial, validez vos aptitudes et structurez votre projet grâce à nos tests spécialisés et à notre analyse IA. Chaque test génère une roadmap personnalisée.
            </p>
          </div>
        </div>
      </div>

      {/* Parcours */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-primary" />
          Parcours conseillé
        </h3>
        <div className="space-y-2">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
              {tip}
            </div>
          ))}
        </div>
      </div>

      {/* Tests */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Tests disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TESTS.map((test) => (
            <Card key={test.href} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={test.style}>
                  <test.icon className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">{test.label}</h4>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2.5">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{test.duration}</span>
                  <span>{test.questions} questions</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">{test.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {test.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
                <Link href={test.href}>
                  <Button size="sm" className="w-full" data-testid={`start-${test.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    Démarrer <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Outils complémentaires</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/offres", label: "Opportunités business" },
            { href: "/parcours", label: "Parcours" },
            { href: "/documents", label: "Documents IA" },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="bg-card border rounded-xl p-3 text-center hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <span className="text-xs font-medium text-foreground">{link.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
