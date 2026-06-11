import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../_lib/claude.js";

// POST /api/bilan/analyze — bilan de compétences complet.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);

  const result = await askClaudeJSON(
    `Tu es un conseiller en bilan de compétences certifié, expert du marché de l'emploi en Afrique francophone. Tu produis un bilan structuré, concret et encourageant.`,
    `Données du bénéficiaire :
${JSON.stringify(b, null, 2)}

Produis un objet JSON avec ces clés :
{
  "synthese": "synthèse du profil en 3-4 phrases",
  "competencesCles": ["5 à 8 compétences clés identifiées"],
  "forcesAtouts": ["4 à 6 forces et atouts"],
  "pistesMetiers": [{"metier": "nom", "raison": "pourquoi c'est adapté"}],
  "formationsRecommandees": ["3 à 5 formations utiles"],
  "dispositifsAides": ["dispositifs d'aide ou financements pertinents en Afrique francophone"],
  "planAction": [{"etape": "action", "echeance": "court|moyen|long terme"}]
}`,
    4000,
  );

  if (!result) {
    res.status(200).json({
      synthese:
        "Votre parcours révèle des compétences transférables solides. Approfondissez les pistes ci-dessous avec un conseiller.",
      competencesCles: [],
      forcesAtouts: [],
      pistesMetiers: [],
      formationsRecommandees: [],
      dispositifsAides: [],
      planAction: [],
    });
    return;
  }
  res.status(200).json(result);
}
