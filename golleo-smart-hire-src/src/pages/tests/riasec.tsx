import { useState } from "react";
import { TestEngine } from "@/components/test-engine";
import { TestResults } from "@/components/test-results";
import { useCompleteTest, computeScores } from "@/hooks/use-test";
import { RIASEC_TEST } from "@/data/tests";
import { Compass, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type Phase = "intro" | "test" | "loading" | "results";

export default function RiasecTest() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [result, setResult] = useState<{ scores: Record<string, number>; aiAnalysis: Record<string, unknown> } | null>(null);
  const { completeTest, isLoading, error } = useCompleteTest();

  async function handleComplete(answers: Record<number, number>) {
    setPhase("loading");
    const scores = computeScores(answers, RIASEC_TEST.questions, RIASEC_TEST.categories);
    const sessionToken = localStorage.getItem("golleo_session") ?? Math.random().toString(36).slice(2);
    localStorage.setItem("golleo_session", sessionToken);

    const res = await completeTest({ testType: "riasec", answers: answers as Record<string, number>, scores, sessionToken });
    if (res) {
      setResult({ scores: res.scores, aiAnalysis: res.aiAnalysis });
      setPhase("results");
    } else {
      setPhase("test");
    }
  }

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{RIASEC_TEST.title}</h2>
            <p className="text-sm text-muted-foreground">{RIASEC_TEST.subtitle}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Qu'est-ce que le RIASEC ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La théorie de Holland (RIASEC) est l'un des outils d'orientation les plus utilisés dans le monde. Elle classe les personnalités professionnelles en 6 types : Réaliste, Investigateur, Artistique, Social, Entreprenant et Conventionnel. Votre combinaison de types détermine les métiers et environnements qui vous correspondent le mieux.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 py-2">
              {[
                { code: "R", label: "Réaliste", desc: "Pratique, technique" },
                { code: "I", label: "Investigateur", desc: "Analytique, curieux" },
                { code: "A", label: "Artistique", desc: "Créatif, expressif" },
                { code: "S", label: "Social", desc: "Empathique, aidant" },
                { code: "E", label: "Entreprenant", desc: "Leader, ambitieux" },
                { code: "C", label: "Conventionnel", desc: "Rigoureux, organisé" },
              ].map((t) => (
                <div key={t.code} className="bg-muted/30 rounded-lg p-2.5 text-center">
                  <span className="text-lg font-black text-primary">{t.code}</span>
                  <div className="text-xs font-semibold text-foreground mt-0.5">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground border-t pt-4">
              <span><b className="text-foreground">36</b> questions</span>
              <span><b className="text-foreground">10–15</b> minutes</span>
              <span><b className="text-foreground">Échelle</b> 1 à 5</span>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full h-11" onClick={() => setPhase("test")} data-testid="start-test">
          Commencer le test RIASEC
        </Button>
        <Link href="/emploi">
          <Button variant="ghost" className="w-full text-muted-foreground">Retour à mon espace</Button>
        </Link>
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
          <Compass className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Analyse en cours...</p>
          <p className="text-sm text-muted-foreground mt-1">L'IA analyse votre profil RIASEC et génère vos recommandations</p>
        </div>
      </div>
    );
  }

  if (phase === "results" && result) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
            <Compass className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Résultats RIASEC</h2>
            <p className="text-xs text-muted-foreground">Analyse complète de votre profil professionnel</p>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" /> {error}
          </div>
        )}
        <TestResults
          testType="riasec"
          scores={result.scores}
          aiAnalysis={result.aiAnalysis}
          categoryLabels={RIASEC_TEST.categoryLabels}
          onRetake={() => setPhase("intro")}
          onNext={() => window.location.href = "/emploi/tests/ikigai"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
          <Compass className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">{RIASEC_TEST.title}</h2>
          <p className="text-xs text-muted-foreground">Répondez honnêtement à chaque affirmation</p>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      <TestEngine test={RIASEC_TEST} onComplete={handleComplete} isSubmitting={isLoading} />
    </div>
  );
}
