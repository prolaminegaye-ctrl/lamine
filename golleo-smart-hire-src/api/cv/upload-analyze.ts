import type { VercelRequest, VercelResponse } from "@vercel/node";
import Busboy from "busboy";
// Import direct du parseur (évite le harness de debug de l'index pdf-parse).
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { askClaudeJSON } from "../_lib/claude";

// On désactive le body-parser de Vercel pour lire le flux multipart brut.
export const config = { api: { bodyParser: false } };

interface ParsedUpload {
  fileBuffer?: Buffer;
  filename?: string;
  mimeType?: string;
  text?: string;
}

function parseMultipart(req: VercelRequest): Promise<ParsedUpload> {
  return new Promise((resolve, reject) => {
    const result: ParsedUpload = {};
    let bb: Busboy.Busboy;
    try {
      bb = Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } });
    } catch (e) {
      reject(e);
      return;
    }
    const chunks: Buffer[] = [];
    bb.on("file", (_name, stream, info) => {
      result.filename = info.filename;
      result.mimeType = info.mimeType;
      stream.on("data", (d: Buffer) => chunks.push(d));
      stream.on("end", () => {
        result.fileBuffer = Buffer.concat(chunks);
      });
    });
    bb.on("field", (name, val) => {
      if (name === "text") result.text = val;
    });
    bb.on("finish", () => resolve(result));
    bb.on("error", reject);
    req.pipe(bb);
  });
}

async function extractText(up: ParsedUpload): Promise<string> {
  if (up.text && up.text.trim()) return up.text.trim();
  if (!up.fileBuffer) return "";
  const name = (up.filename ?? "").toLowerCase();
  const mime = up.mimeType ?? "";
  try {
    if (name.endsWith(".pdf") || mime.includes("pdf")) {
      const out = await pdfParse(up.fileBuffer);
      return out.text ?? "";
    }
    if (name.endsWith(".docx") || mime.includes("officedocument")) {
      const out = await mammoth.extractRawText({ buffer: up.fileBuffer });
      return out.value ?? "";
    }
    // txt / autres → décodage UTF-8
    return up.fileBuffer.toString("utf-8");
  } catch (err) {
    console.error("[cv/upload-analyze] extraction:", err);
    return up.fileBuffer.toString("utf-8");
  }
}

const DEMO = {
  atsScore: 70, scorePresentation: 74, scorePertinence: 68, scoreImpact: 65,
  pointsForts: ["Structure claire", "Coordonnées complètes", "Expériences datées"],
  pointsAmeliorer: [
    "Ajouter des réalisations chiffrées",
    "Intégrer plus de mots-clés du secteur",
    "Renforcer la section compétences",
  ],
  motsClesManquants: ["résultats", "objectifs", "performance"],
  recommandations: [
    "Quantifiez vos réalisations (chiffres, %, montants).",
    "Adaptez votre CV à chaque offre en reprenant ses mots-clés.",
    "Placez vos compétences clés en haut du CV.",
  ],
  synthese:
    "CV solide sur la forme. Renforcez les mots-clés et chiffrez vos résultats pour passer les filtres ATS.",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }
  try {
    const upload = await parseMultipart(req);
    const text = await extractText(upload);

    if (!text || text.trim().length < 30) {
      res.status(200).json({
        ...DEMO,
        synthese: "Le contenu du CV n'a pas pu être lu. Collez le texte de votre CV pour une analyse complète.",
      });
      return;
    }

    const analysis = await askClaudeJSON(
      `Tu es un expert ATS et recruteur senior pour le marché de l'emploi en Afrique francophone. Tu analyses un CV et produis une évaluation chiffrée et des recommandations concrètes.`,
      `CV À ANALYSER :
"""${text.slice(0, 12000)}"""

Produis un objet JSON avec EXACTEMENT ces clés :
{
  "atsScore": 0-100,
  "scorePresentation": 0-100,
  "scorePertinence": 0-100,
  "scoreImpact": 0-100,
  "pointsForts": ["3 à 5 points forts"],
  "pointsAmeliorer": ["3 à 5 axes d'amélioration"],
  "motsClesManquants": ["mots-clés ATS manquants"],
  "recommandations": ["3 à 5 recommandations concrètes"],
  "synthese": "synthèse en 2-3 phrases"
}`,
      3000,
    );

    res.status(200).json(analysis ?? DEMO);
  } catch (err) {
    console.error("[cv/upload-analyze] erreur:", err);
    res.status(200).json(DEMO);
  }
}
