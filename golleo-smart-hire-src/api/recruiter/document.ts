import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeText, readJsonBody } from "../_lib/claude";

// POST /api/recruiter/document — génère un document RH (CV optimisé, lettre, synthèse…)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);
  const docType = String(b.docType ?? b.documentType ?? "cv");
  const candidate = b.candidate ?? {};

  const labels: Record<string, string> = {
    cv: "un CV professionnel optimisé ATS",
    cover_letter: "une lettre de motivation personnalisée",
    "lettre-motivation": "une lettre de motivation personnalisée",
    synthesis: "une synthèse de profil pour un recruteur",
    recommendation: "une lettre de recommandation",
  };

  const content = await askClaudeText(
    `Tu es un expert RH et rédacteur de documents professionnels pour le marché de l'emploi en Afrique francophone. Tu rédiges ${labels[docType] ?? "un document professionnel"} de haute qualité, prêt à l'emploi, en français.`,
    `Profil du candidat : ${JSON.stringify(candidate)}
${b.jobTitle ? `Poste visé : ${String(b.jobTitle)}` : ""}
${b.extra ? `Contexte : ${String(b.extra)}` : ""}

Rédige le document complet, structuré et professionnel, sans préambule ni commentaire.`,
    3000,
  );

  res.status(200).json({
    title: labels[docType] ? labels[docType].replace(/^(un|une) /, "") : docType,
    content: content ?? "Document indisponible pour le moment. Réessayez.",
    documentType: docType,
    language: "fr",
  });
}
