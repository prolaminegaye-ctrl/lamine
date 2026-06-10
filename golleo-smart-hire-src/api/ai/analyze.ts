import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../_lib/claude";

// POST /api/ai/analyze — analyse IA d'un test (AFRI-CODE, ikigai, personnalité…)
// Body: { testType, scores, profileType? }
// Réponse: { analysis: {...} } (Claude) ou { demo: true } → fallback local côté client
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const { testType, scores, profileType } = readJsonBody(req);

  const analysis = await askClaudeJSON(
    `Tu es un conseiller d'orientation et d'insertion professionnelle expert, spécialisé sur les marchés de l'emploi en Afrique francophone. Tu analyses les résultats d'un test psychométrique propriétaire GolléO et produis une analyse personnalisée, bienveillante, concrète et actionnable.`,
    `Type de test : ${String(testType)}
Profil dominant : ${profileType ? String(profileType) : "non précisé"}
Scores (sur 100) : ${JSON.stringify(scores)}

Produis un objet JSON avec ces clés :
{
  "synthese": "2-3 phrases qui résument le profil",
  "forces": ["3 à 5 forces clés"],
  "axesProgression": ["2 à 4 axes de développement"],
  "metiersRecommandes": ["4 à 6 métiers adaptés, pertinents pour l'Afrique francophone"],
  "conseilsActionnables": ["3 à 5 conseils concrets et immédiats"],
  "messageMotivation": "1 phrase d'encouragement personnalisée"
}`,
    3000,
  );

  if (!analysis) {
    res.status(200).json({ demo: true });
    return;
  }
  res.status(200).json({ analysis });
}
