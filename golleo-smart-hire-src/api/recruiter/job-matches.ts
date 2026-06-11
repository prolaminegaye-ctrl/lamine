import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../_lib/claude.js";

// POST /api/recruiter/job-matches — matching IA entre une offre et une liste de candidats.
// Body: { job, candidates: [...] } → { matches: [{candidateName, matchScore, reasons[]}] }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);
  const candidates = Array.isArray(b.candidates) ? b.candidates : [];
  if (candidates.length === 0) {
    res.status(200).json({ matches: [] });
    return;
  }

  const result = await askClaudeJSON(
    `Tu es un expert en recrutement et matching de profils pour le marché de l'emploi en Afrique francophone. Tu évalues l'adéquation entre une offre d'emploi et une liste de candidats.`,
    `OFFRE : ${JSON.stringify(b.job ?? {})}

CANDIDATS : ${JSON.stringify(candidates)}

Pour chaque candidat pertinent, évalue le matching. Produis un objet JSON :
{
  "matches": [
    {"candidateName": "Prénom Nom", "matchScore": 0-100, "reasons": ["2-3 raisons concrètes du score"]}
  ]
}
Classe du meilleur au moins bon, ne garde que les candidats avec un score >= 40.`,
    3000,
  );

  res.status(200).json(result ?? { matches: [] });
}
