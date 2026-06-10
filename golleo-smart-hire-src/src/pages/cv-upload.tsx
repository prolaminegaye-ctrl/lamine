import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle2, TrendingUp, AlertTriangle, Sparkles, Download, RotateCcw } from "lucide-react";

type Analysis = {
  atsScore?: number;
  scorePresentation?: number;
  scorePertinence?: number;
  scoreImpact?: number;
  globalImpression?: string;
  forces?: string[];
  faiblesses?: string[];
  suggestionsConcretes?: string[];
  motsClesManquants?: string[];
  metiersCibles?: string[];
  niveauSeniorite?: string;
  secteurs?: string[];
  prochainePrioriteCV?: string;
};

const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

export default function CvUpload() {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function analyze() {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (mode === "upload" && file) {
        formData.append("cv", file);
      } else if (mode === "paste" && text.trim()) {
        formData.append("text", text);
      } else {
        setError("Veuillez fournir un CV à analyser");
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE}/api/cv/upload-analyze`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAnalysis(null);
    setFile(null);
    setText("");
    setError(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setMode("upload"); }
  }

  const scoreColor = (s: number) => s >= 75 ? "text-emerald-500" : s >= 50 ? "text-amber-500" : "text-red-500";
  const scores = [
    { label: "Score ATS", value: analysis?.atsScore ?? 0, desc: "Compatibilité avec les ATS" },
    { label: "Présentation", value: analysis?.scorePresentation ?? 0, desc: "Structure et mise en forme" },
    { label: "Pertinence", value: analysis?.scorePertinence ?? 0, desc: "Adéquation au marché" },
    { label: "Impact", value: analysis?.scoreImpact ?? 0, desc: "Force des réalisations" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Sparkles className="h-6 w-6 text-primary absolute inset-0 m-auto" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Analyse IA en cours...</p>
          <p className="text-sm text-muted-foreground mt-1">GPT analyse votre CV en profondeur</p>
        </div>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Analyse de votre CV</h2>
            <p className="text-sm text-muted-foreground mt-1">Rapport généré par IA</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Nouveau CV
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {scores.map(({ label, value, desc }) => (
            <Card key={label}>
              <CardContent className="py-4 text-center">
                <div className={`text-3xl font-bold ${scoreColor(value)}`}>{value}</div>
                <div className="text-xs font-semibold mt-1">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
                <Progress value={value} className="h-1.5 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Global impression */}
        {analysis.globalImpression && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="py-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Première impression</span>
                {analysis.niveauSeniorite && (
                  <Badge variant="secondary" className="text-xs capitalize">{analysis.niveauSeniorite}</Badge>
                )}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{analysis.globalImpression}</p>
            </CardContent>
          </Card>
        )}

        {/* Priorité */}
        {analysis.prochainePrioriteCV && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-600">Action prioritaire</p>
                  <p className="text-sm text-foreground mt-1">{analysis.prochainePrioriteCV}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Forces */}
          {(analysis.forces ?? []).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Points forts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(analysis.forces ?? []).map((f, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-emerald-500 flex-shrink-0">•</span>
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Faiblesses */}
          {(analysis.faiblesses ?? []).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  Axes d'amélioration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(analysis.faiblesses ?? []).map((f, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <span className="text-amber-500 flex-shrink-0">•</span>
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Suggestions */}
        {(analysis.suggestionsConcretes ?? []).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Suggestions concrètes d'amélioration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(analysis.suggestionsConcretes ?? []).map((s, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                  <span className="text-muted-foreground">{s}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Mots-clés manquants */}
          {(analysis.motsClesManquants ?? []).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Mots-clés à ajouter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.motsClesManquants ?? []).map((k, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{k}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Métiers cibles */}
          {(analysis.metiersCibles ?? []).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Métiers compatibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.metiersCibles ?? []).map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Secteurs */}
          {(analysis.secteurs ?? []).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Secteurs recommandés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {(analysis.secteurs ?? []).map((s, i) => (
                    <Badge key={i} className="text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold">Analyse de CV par IA</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Obtenez un feedback détaillé sur votre CV — score ATS, points forts, suggestions concrètes et métiers cibles.
        </p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2">
        <Button
          variant={mode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("upload")}
        >
          <Upload className="h-4 w-4 mr-2" />
          Uploader un fichier
        </Button>
        <Button
          variant={mode === "paste" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("paste")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Coller le texte
        </Button>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          {file ? (
            <div>
              <p className="font-semibold text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024).toFixed(0)} Ko</p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-foreground">Glissez votre CV ici ou cliquez pour parcourir</p>
              <p className="text-sm text-muted-foreground mt-1">PDF, TXT, DOC — max 8 Mo</p>
            </div>
          )}
        </div>
      ) : (
        <Textarea
          placeholder="Collez ici le contenu texte de votre CV..."
          className="min-h-64 resize-none font-mono text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={analyze}
        disabled={loading || (mode === "upload" ? !file : !text.trim())}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Analyser mon CV
      </Button>

      <div className="grid grid-cols-3 gap-4 text-center">
        {[
          { label: "Score ATS", desc: "Compatibilité recruteurs" },
          { label: "Feedback IA", desc: "Forces & axes d'amélioration" },
          { label: "Métiers cibles", desc: "Postes compatibles" },
        ].map(({ label, desc }) => (
          <div key={label} className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs font-semibold text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
