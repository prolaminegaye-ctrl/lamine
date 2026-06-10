import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../../_lib/claude";

// POST /api/dashboard/emploi/employability-score — score d'employabilité global.
// Body: { sessionToken, results? }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);
  const results = Array.isArray(b.results) ? b.results : [];

  if (results.length === 0) {
    res.status(200).json({
      scoreEmployabilite: 0,
      niveau: "À évaluer",
      synthese:
        "Complétez vos tests d'orientation pour obtenir votre score d'employabilité personnalisé.",
      dimensionsScore: [],
      atouts: [],
      prioritesAction: [],
      testsSuggeres: [],
      prochainEtape: "Commencez par le test AFRI-CODE.",
      message: "Votre parcours ne fait que commencer.",
    });
    return;
  }

  const result = await askClaudeJSON(
    `Tu es un expert en employabilité et insertion professionnelle pour l'Afrique francophone. À partir des résultats de tests d'un candidat, tu calcules un score d'employabilité global et un plan d'action.`,
    `Résultats de tests : ${JSON.stringify(results)}

Produis un objet JSON avec ces clés :
{
  "scoreEmployabilite": nombre 0-100,
  "niveau": "Débutant|Intermédiaire|Avancé|Expert",
  "synthese": "synthèse en 2-3 phrases",
  "dimensionsScore": [{"dimension": "nom", "score": 0-100}],
  "atouts": ["3 à 5 atouts"],
  "prioritesAction": ["3 à 5 priorités d'action"],
  "testsSuggeres": ["tests complémentaires recommandés"],
  "prochainEtape": "la prochaine étape concrète",
  "message": "message d'encouragement"
}`,
    3000,
  );

  if (!result) {
    res.status(200).json({
      scoreEmployabilite: 0,
      niveau: "À évaluer",
      synthese: "Erreur lors du calcul. Réessayez dans un instant.",
      dimensionsScore: [],
      atouts: [],
      prioritesAction: [],
      testsSuggeres: [],
      prochainEtape: "",
      message: "",
    });
    return;
  }
  res.status(200).json(result);
}
