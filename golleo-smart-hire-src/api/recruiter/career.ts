import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../_lib/claude.js";

// POST /api/recruiter/career — recommandations de parcours / orientation.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);

  const result = await askClaudeJSON(
    `Tu es un conseiller en évolution professionnelle expert du marché de l'emploi en Afrique francophone. Tu proposes des recommandations de carrière personnalisées, réalistes et adaptées au contexte local.`,
    `Candidat : ${JSON.stringify(b.candidate ?? {})}
Aspirations : ${String(b.aspirations ?? "non précisées")}
Mobilité géographique : ${String(b.geographicMobility ?? "non précisée")}

Produis un objet JSON avec ces clés :
{
  "summary": "synthèse des recommandations en 3-4 phrases",
  "recommendedJobs": [{"titre": "métier", "raison": "pourquoi", "compatibilite": 0-100}],
  "recommendedFormations": [{"titre": "formation", "duree": "durée", "objectif": "objectif"}],
  "skillsToAcquire": ["compétences clés à développer"],
  "reconversionPaths": [{"voie": "piste de reconversion", "description": "détail"}]
}`,
    3500,
  );

  if (!result) {
    res.status(200).json({
      summary: "Recommandations indisponibles pour le moment. Réessayez.",
      recommendedJobs: [], recommendedFormations: [],
      skillsToAcquire: [], reconversionPaths: [],
    });
    return;
  }
  res.status(200).json(result);
}
