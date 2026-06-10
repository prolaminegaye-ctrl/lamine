import type { VercelRequest, VercelResponse } from "@vercel/node";

// GET /api/dashboard/emploi?sessionToken=... — résultats de tests d'une session.
//
// Les résultats de tests sont actuellement persistés côté client (localStorage)
// et dans Supabase pour les utilisateurs connectés. Cette route serveur renvoie
// une liste vide : la page tableau-de-bord agrège alors les résultats locaux.
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ results: [] });
}
