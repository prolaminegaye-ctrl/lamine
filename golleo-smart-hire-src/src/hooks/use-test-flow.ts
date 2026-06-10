// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — useTestFlow
//  État unifié : phase + résultats dans UN SEUL objet (pas de race condition).
//  Stratégie IA : essaie /api/ai/analyze (Claude réel) → fallback local.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { computeScores, generateAnalysis, type TestType } from "@/hooks/use-test";
import type { TestDefinition } from "@/data/tests";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TestPhase = "intro" | "test" | "computing" | "results";

export type TestFlowState =
  | { phase: "intro" }
  | { phase: "test" }
  | { phase: "computing" }
  | { phase: "results"; scores: Record<string, number>; analysis: Record<string, unknown>; aiMode: "claude" | "local" }
  | { phase: "error"; message: string };

// ── Appel Claude via l'API locale ─────────────────────────────────────────────

// Base relative : les fonctions serverless /api/* sont servies sur la même
// origine que l'app (Vercel). En local, le proxy Vite redirige /api.
const API_BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");

async function fetchClaudeAnalysis(
  testType: TestType,
  scores: Record<string, number>,
  profileType?: string
): Promise<Record<string, unknown> | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000); // 15s max

    const res = await fetch(`${API_BASE}/api/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testType, scores, profileType }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json() as { analysis?: Record<string, unknown>; demo?: boolean };
    // Si le serveur répond en mode démo, on utilise l'analyse locale de toute façon
    if (data.demo) return null;
    return data.analysis ?? null;
  } catch {
    // Serveur absent ou timeout → fallback local silencieux
    return null;
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useTestFlow(
  testDef: TestDefinition,
  testType: TestType,
  profileType?: string
) {
  const [state, setState] = useState<TestFlowState>({ phase: "intro" });

  const startTest = useCallback(() => {
    setState({ phase: "test" });
  }, []);

  const retake = useCallback(() => {
    setState({ phase: "intro" });
  }, []);

  const handleAnswers = useCallback(
    async (answers: Record<number, number>) => {
      setState({ phase: "computing" });

      try {
        // 1. Calcul des scores local (toujours synchrone et fiable)
        const scores = computeScores(
          answers,
          testDef.questions,
          testDef.categories
        );

        // 2. Tentative Claude réel — avec délai minimum 900ms pour l'animation
        const [claudeAnalysis] = await Promise.all([
          fetchClaudeAnalysis(testType, scores, profileType),
          new Promise((r) => setTimeout(r, 900)),
        ]);

        // 3. Fallback local si Claude indisponible
        const analysis = claudeAnalysis ?? generateAnalysis(testType, scores, profileType);
        const aiMode: "claude" | "local" = claudeAnalysis ? "claude" : "local";

        // 4. Persistance
        try {
          localStorage.setItem(
            `golleo_test_${testType}`,
            JSON.stringify({ scores, analysis, aiMode, date: new Date().toISOString() })
          );
        } catch (_) { /* mode privé, etc. */ }

        // 5. État résultats — discriminé, pas de race condition
        setState({ phase: "results", scores, analysis, aiMode });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[useTestFlow] Erreur:", err);
        setState({ phase: "error", message: msg });
      }
    },
    [testDef, testType, profileType]
  );

  return { state, startTest, retake, handleAnswers };
}
