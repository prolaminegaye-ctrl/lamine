import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../_lib/claude.js";

// POST /api/bilan/vae — évaluation d'éligibilité à la VAE.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);

  const result = await askClaudeJSON(
    `Tu es un expert de la Validation des Acquis de l'Expérience (VAE) et des dispositifs de certification professionnelle en Afrique francophone et en France. Tu évalues l'éligibilité d'un candidat à la VAE.`,
    `Domaine : ${String(b.domaine ?? "")}
Années d'expérience : ${String(b.anneesDExperience ?? "")}
Description de l'expérience : ${String(b.descriptionExperience ?? "")}
Diplôme cible : ${String(b.diplomeCible ?? "non précisé")}

Produis un objet JSON avec ces clés :
{
  "eligible": true/false,
  "scoreMaturite": nombre 0-100,
  "synthese": "synthèse de l'éligibilité en 2-3 phrases",
  "conditionsRemplies": ["conditions déjà satisfaites"],
  "conditionsManquantes": ["conditions à compléter"],
  "diplomesCompatibles": ["diplômes/certifications accessibles par VAE"],
  "etapesVAE": [{"etape": "intitulé", "description": "détail"}],
  "organismes": ["organismes ou structures d'accompagnement"],
  "financement": ["pistes de financement de la démarche"]
}`,
    4000,
  );

  if (!result) {
    res.status(200).json({
      eligible: true,
      scoreMaturite: 60,
      synthese:
        "Votre expérience semble compatible avec une démarche VAE. Rapprochez-vous d'un organisme accompagnateur pour confirmer.",
      conditionsRemplies: [],
      conditionsManquantes: [],
      diplomesCompatibles: [],
      etapesVAE: [],
      organismes: [],
      financement: [],
    });
    return;
  }
  res.status(200).json(result);
}
