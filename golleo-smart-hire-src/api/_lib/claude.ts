// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — Helper Claude partagé pour les fonctions serverless Vercel
//
//  Toutes les routes /api/* l'utilisent pour appeler Claude. Si ANTHROPIC_API_KEY
//  est absente, askClaudeJSON renvoie null et chaque route bascule sur une
//  réponse de démonstration — l'app ne casse jamais.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-opus-4-8";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  if (!client) client = new Anthropic({ apiKey: key });
  return client;
}

/** Extrait le premier objet JSON d'une chaîne (tolère les ```json fences). */
function extractJSON(text: string): unknown | null {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * Demande à Claude une réponse JSON structurée.
 * @returns l'objet parsé, ou null si l'IA est indisponible / la réponse invalide.
 */
export async function askClaudeJSON(
  system: string,
  userPrompt: string,
  maxTokens = 4000,
): Promise<Record<string, unknown> | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const msg = await c.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system:
        system +
        "\n\nRéponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après, sans balises Markdown.",
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    return extractJSON(text) as Record<string, unknown> | null;
  } catch (err) {
    console.error("[claude] erreur:", err);
    return null;
  }
}

/** Demande à Claude une réponse texte libre (ex. génération de section CV). */
export async function askClaudeText(
  system: string,
  userPrompt: string,
  maxTokens = 1500,
): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const msg = await c.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return text || null;
  } catch (err) {
    console.error("[claude] erreur:", err);
    return null;
  }
}

/** Lecture robuste du corps JSON d'une requête Vercel Node. */
export function readJsonBody(req: { body?: unknown }): Record<string, unknown> {
  const b = req.body;
  if (!b) return {};
  if (typeof b === "string") {
    try {
      return JSON.parse(b);
    } catch {
      return {};
    }
  }
  return b as Record<string, unknown>;
}
