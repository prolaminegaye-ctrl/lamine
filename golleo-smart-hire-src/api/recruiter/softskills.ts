import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../_lib/claude.js";

// POST /api/recruiter/softskills — évaluation des soft skills à partir d'un échantillon écrit.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);

  const result = await askClaudeJSON(
    `Tu es un psychologue du travail expert en évaluation des compétences comportementales (soft skills). Tu analyses un échantillon écrit produit par un candidat et tu évalues ses soft skills de façon rigoureuse et bienveillante.`,
    `Candidat : ${JSON.stringify(b.candidate ?? {})}
Contexte : ${String(b.context ?? "")}
Échantillon écrit du candidat :
"""${String(b.textSample ?? "")}"""

Produis un objet JSON avec ces clés (scores 0-100) :
{
  "communication": 0-100,
  "leadership": 0-100,
  "teamwork": 0-100,
  "adaptability": 0-100,
  "stressManagement": 0-100,
  "overallScore": 0-100,
  "strengths": ["3 points forts observés"],
  "improvements": ["2 à 3 axes d'amélioration"],
  "actionPlan": ["3 actions concrètes de développement"],
  "summary": "synthèse en 2-3 phrases"
}`,
    3000,
  );

  if (!result) {
    res.status(200).json({
      communication: 0, leadership: 0, teamwork: 0, adaptability: 0,
      stressManagement: 0, overallScore: 0,
      strengths: [], improvements: [], actionPlan: [],
      summary: "Évaluation indisponible pour le moment. Réessayez.",
    });
    return;
  }
  res.status(200).json(result);
}
