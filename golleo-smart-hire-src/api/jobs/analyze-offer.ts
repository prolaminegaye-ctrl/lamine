import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeJSON, readJsonBody } from "../_lib/claude.js";

// POST /api/jobs/analyze-offer — analyse une offre d'emploi vs un CV.
// Body: { jobText, cvContext }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const { jobText, cvContext } = readJsonBody(req);
  const hasCV = String(cvContext ?? "").trim().length > 10;

  const result = await askClaudeJSON(
    `Tu es un expert ATS et recruteur senior pour le marché de l'emploi en Afrique francophone. Tu analyses une offre d'emploi (et éventuellement un CV) et produis une analyse de compatibilité, des mots-clés ATS, et des livrables de candidature prêts à l'emploi.`,
    `OFFRE D'EMPLOI :
${String(jobText ?? "")}

${hasCV ? `CV DU CANDIDAT :\n${String(cvContext)}` : "Aucun CV fourni — analyse l'offre seule."}

Produis un objet JSON avec EXACTEMENT ces clés :
{
  "poste": "intitulé du poste",
  "entreprise": "nom si identifiable, sinon ''",
  "scoreCompatibilite": ${hasCV ? "nombre 0-100 (adéquation CV/offre)" : "null"},
  "scoreATS": "nombre 0-100 (optimisation ATS)",
  "motsClésATS": ["8 à 12 mots-clés ATS essentiels de l'offre"],
  "compétencesTechniques": [{"nom": "compétence", "priorité": "haute|moyenne", "présent": ${hasCV ? "true|false" : "null"}}],
  "compétencesSoftSkills": [{"nom": "soft skill", "priorité": "haute|moyenne"}],
  "recommandations": [{"priorité": "haute|moyenne", "action": "action concrète"}],
  "pointsAttention": ["2 à 4 points de vigilance ou conseils LinkedIn"],
  "lettreCandidature": "lettre de motivation complète, personnalisée, prête à envoyer",
  "emailCandidature": "email de candidature court et percutant",
  "pitch30Secondes": "pitch oral de 30 secondes",
  "analyseSynthèse": "2-3 phrases de synthèse"
}`,
    4000,
  );

  if (!result) {
    res.status(200).json(demoJobAnalysis(hasCV));
    return;
  }
  res.status(200).json(result);
}

function demoJobAnalysis(hasCV: boolean) {
  return {
    poste: "Poste analysé",
    entreprise: "",
    scoreCompatibilite: hasCV ? 68 : null,
    scoreATS: 72,
    motsClésATS: ["gestion de projet", "communication", "analyse", "autonomie", "rigueur"],
    compétencesTechniques: [
      { nom: "Gestion de projet", priorité: "haute", présent: hasCV ? true : null },
      { nom: "Maîtrise des outils digitaux", priorité: "moyenne", présent: hasCV ? false : null },
    ],
    compétencesSoftSkills: [
      { nom: "Communication", priorité: "haute" },
      { nom: "Travail en équipe", priorité: "moyenne" },
    ],
    recommandations: [
      { priorité: "haute", action: "Ajoutez les mots-clés de l'offre dans votre CV." },
      { priorité: "moyenne", action: "Chiffrez vos réalisations passées." },
    ],
    pointsAttention: [
      "Mettez à jour votre titre LinkedIn avec les mots-clés de l'offre.",
      "Connectez-vous avec des collaborateurs de l'entreprise avant de candidater.",
    ],
    lettreCandidature: "",
    emailCandidature: "",
    pitch30Secondes: "",
    analyseSynthèse: "Profil pertinent pour ce poste. Optimisez l'alignement avec les mots-clés de l'offre.",
  };
}
