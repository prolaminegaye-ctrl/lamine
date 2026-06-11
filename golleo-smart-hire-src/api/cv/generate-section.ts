import type { VercelRequest, VercelResponse } from "@vercel/node";
import { askClaudeText, readJsonBody } from "../_lib/claude.js";

// POST /api/cv/generate-section — génère une section de CV par IA.
// Body: { section, jobTitle, experience, skills, languages, region, currentContent }
// Réponse: { content: string }
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  const b = readJsonBody(req);
  const section = String(b.section ?? "summary");

  const instructions: Record<string, string> = {
    summary:
      "Rédige un résumé professionnel de CV percutant (3-4 phrases), à la première personne implicite, cohérent avec le titre et l'expérience.",
    skills:
      "Génère une liste de 8 à 12 compétences pertinentes, séparées par des virgules, sans puces.",
    atouts:
      "Génère 4 atouts personnels forts, séparés par ' · ', concis et orientés impact.",
    title:
      "Propose un titre de CV optimisé et professionnel. Renvoie uniquement le titre, éventuellement 2-3 variantes séparées par ' | '.",
  };

  const content = await askClaudeText(
    `Tu es un expert en rédaction de CV pour le marché de l'emploi en Afrique francophone (région: ${String(b.region ?? "")}). Tu écris dans un français professionnel et impactant. ${instructions[section] ?? instructions.summary}`,
    `Titre / poste visé : ${String(b.jobTitle ?? "")}
Expérience : ${String(b.experience ?? "")}
Compétences : ${String(b.skills ?? "")}
Langues : ${String(b.languages ?? "")}
Contenu actuel (à améliorer) : ${String(b.currentContent ?? "")}

Génère uniquement le contenu de la section "${section}", sans préambule.`,
    800,
  );

  // Si l'IA est indisponible, on renvoie une chaîne vide → le client a son propre fallback.
  res.status(200).json({ content: content ?? "" });
}
