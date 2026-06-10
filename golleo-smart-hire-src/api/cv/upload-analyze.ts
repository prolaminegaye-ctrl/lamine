import type { VercelRequest, VercelResponse } from "@vercel/node";

// POST /api/cv/upload-analyze — analyse ATS d'un CV uploadé (multipart).
//
// Note: l'extraction de fichiers (PDF/DOCX) côté serveur nécessite un parseur
// multipart dédié. En attendant, cette route renvoie une grille d'évaluation de
// démonstration cohérente ; la page CV gère ce retour sans erreur. Quand le
// parsing fichier sera branché, on basculera vers askClaudeJSON comme les autres
// routes.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  res.status(200).json({
    atsScore: 70,
    scorePresentation: 74,
    scorePertinence: 68,
    scoreImpact: 65,
    pointsForts: [
      "Structure claire et lisible",
      "Coordonnées complètes",
      "Expériences datées",
    ],
    pointsAmeliorer: [
      "Ajouter des réalisations chiffrées",
      "Intégrer davantage de mots-clés du secteur visé",
      "Renforcer la section compétences",
    ],
    motsClesManquants: ["résultats", "objectifs", "performance"],
    recommandations: [
      "Quantifiez vos réalisations (chiffres, %, montants).",
      "Adaptez votre CV à chaque offre en reprenant ses mots-clés.",
      "Placez vos compétences clés en haut du CV.",
    ],
    synthese:
      "Votre CV est solide sur la forme. Pour passer les filtres ATS, renforcez les mots-clés et chiffrez vos résultats.",
  });
}
