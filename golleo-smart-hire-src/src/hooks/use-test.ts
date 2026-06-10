// ─────────────────────────────────────────────────────────────────────────────
//  GolléO — use-test.ts
//  Scoring 100% local — aucune dépendance API
//  Les analyses "IA" sont générées localement depuis les scores
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TestType =
  | "riasec"
  | "ikigai"
  | "entrepreneur_profile"
  | "project_maturity"
  | "personality";

type CompleteTestPayload = {
  testType: TestType;
  answers: Record<number, number> | Record<string, number>;
  scores: Record<string, number>;
  sessionToken?: string;
  profileType?: string;
};

export type TestResult = {
  id: number;
  testType: string;
  scores: Record<string, number>;
  aiAnalysis: Record<string, unknown>;
  createdAt: string;
};

// ── Score utils ───────────────────────────────────────────────────────────────

function topN(scores: Record<string, number>, n: number): string[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([k]) => k);
}

function bottomN(scores: Record<string, number>, n: number): string[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, n)
    .map(([k]) => k);
}

function avg(scores: Record<string, number>): number {
  const vals = Object.values(scores);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

// ── Analyse IKIGAI ─────────────────────────────────────────────────────────────

function analyzeIkigai(
  scores: Record<string, number>,
  profileType?: string
): Record<string, unknown> {
  const top = topN(scores, 2);
  const low = bottomN(scores, 2);
  const globalScore = avg(scores);

  const dimensionLabels: Record<string, string> = {
    passion: "Passion & Énergie",
    talent: "Talent & Compétences",
    besoin: "Besoin du monde",
    valeur: "Valeur économique",
    passions: "Vos passions",
    talents: "Vos talents",
    mission: "Votre mission",
    vocation: "Votre vocation",
  };

  const isEntrepreneur = profileType === "entrepreneur";
  const topDim = top[0] ?? "passion";
  const secondDim = top[1] ?? "talent";

  const careersByDim: Record<string, string[]> = {
    passion: ["Formateur en ligne", "Coach de vie", "Créateur de contenu", "Consultant développement personnel"],
    talent: ["Consultant spécialisé", "Expert freelance", "Mentor professionnel", "Formateur technique"],
    mission: ["Coordinateur ONG", "Responsable RSE", "Éducateur communautaire", "Social entrepreneur"],
    vocation: ["Entrepreneur e-commerce", "Consultant B2B", "Gestionnaire de projets", "Conseiller financier"],
    besoin: ["Travailleur humanitaire", "Responsable santé publique", "Éducateur", "Ingénieur social"],
    valeur: ["Chef d'entreprise", "Consultant stratégique", "Directeur commercial", "Financier"],
  };

  return {
    summary: isEntrepreneur
      ? `Votre énergie entrepreneuriale se concentre autour de ${dimensionLabels[topDim] ?? topDim}. C'est votre levier principal pour créer de la valeur.`
      : `Votre profil révèle une forte orientation vers ${dimensionLabels[topDim] ?? topDim} et ${dimensionLabels[secondDim] ?? secondDim}. Ces dimensions guident votre épanouissement professionnel.`,
    globalScore,
    strengths: top.slice(0, 3).map((d) => `Fort(e) en ${dimensionLabels[d] ?? d}`),
    developmentAxes: low.slice(0, 2).map((d) => `Développer davantage ${dimensionLabels[d] ?? d}`),
    careers: careersByDim[topDim] ?? ["Consultant", "Formateur", "Coach professionnel", "Entrepreneur"],
    formations: isEntrepreneur
      ? ["Formation entrepreneuriat social", "Incubateur de startups africaines", "Programme GolléO Business"]
      : [`Formations liées à ${dimensionLabels[topDim] ?? topDim}`, "Bilan de compétences approfondi", "Coaching carrière certifié"],
    nextSteps: isEntrepreneur
      ? [
          "Validez votre idée en discutant avec 10 clients potentiels",
          "Créez un prototype ou une offre pilote en 30 jours",
          "Rejoignez un incubateur ou une communauté d'entrepreneurs",
        ]
      : [
          "Explorez des métiers liés à votre dimension dominante",
          "Passez l'AFRI-CODE pour affiner votre orientation métier",
          "Réfléchissez à vos 3 plus grandes sources d'accomplissement",
          "Rencontrez 5 professionnels dans vos domaines d'intérêt",
        ],
  };
}

// ── Analyse Personnalité ───────────────────────────────────────────────────────

function analyzePersonnality(scores: Record<string, number>): Record<string, unknown> {
  const top = topN(scores, 3);
  const low = bottomN(scores, 2);
  const globalScore = avg(scores);

  const traitLabels: Record<string, string> = {
    leadership: "Leadership",
    communication: "Communication",
    adaptabilite: "Adaptabilité",
    organisation: "Organisation",
    empathie: "Empathie",
    creativite: "Créativité",
    resilience: "Résilience",
    confiance: "Confiance en soi",
    E: "Extraversion",
    A: "Agréabilité",
    C: "Conscienciosité",
    N: "Stabilité émotionnelle",
    O: "Ouverture",
  };

  const profileTypes: Record<string, string> = {
    leadership: "Leader naturel",
    communication: "Communicant d'exception",
    adaptabilite: "Caméléon professionnel",
    organisation: "Architecte rigoureux",
    empathie: "Humaniste engagé",
    creativite: "Innovateur créatif",
    resilience: "Résilient exemplaire",
    confiance: "Professionnel affirmé",
  };

  const careersByTrait: Record<string, string[]> = {
    leadership: ["Manager d'équipe", "Directeur de projet", "Chef d'entreprise", "Responsable RH"],
    communication: ["Commercial", "Relations publiques", "Formateur", "Journaliste"],
    empathie: ["Coach professionnel", "Assistant social", "Enseignant", "Psychologue"],
    creativite: ["Designer", "Artiste", "Directeur artistique", "Développeur produit"],
    organisation: ["Gestionnaire de projet", "Contrôleur de gestion", "Logisticien", "Auditeur"],
    adaptabilite: ["Consultant", "Freelance multi-secteurs", "Coordinateur international"],
    resilience: ["Entrepreneur", "Manager de crise", "Avocat", "Commercial senior"],
    confiance: ["Fondateur startup", "Conférencier", "Coach", "Commercial senior"],
  };

  const topTrait = top[0] ?? "communication";
  const profileName = profileTypes[topTrait] ?? "Professionnel polyvalent";

  return {
    summary: `Votre profil dominant est "${profileName}". Vous excellez en ${top.slice(0, 2).map((t) => traitLabels[t] ?? t).join(" et ")}. Ces atouts font de vous un collaborateur précieux dans des contextes ${topTrait === "leadership" || topTrait === "communication" ? "dynamiques et relationnels" : "structurés et analytiques"}.`,
    globalScore,
    profileName,
    strengths: top.slice(0, 3).map((t) => traitLabels[t] ?? t),
    developmentAxes: low.slice(0, 2).map((t) => `Renforcer ${traitLabels[t] ?? t}`),
    careers: careersByTrait[topTrait] ?? ["Consultant", "Manager", "Chef de projet", "Formateur"],
    formations: [
      `Formation en ${traitLabels[topTrait] ?? topTrait} professionnelle`,
      "Coaching de leadership et soft skills",
      "Programme de développement personnel certifié",
    ],
    nextSteps: [
      `Capitalisez sur votre ${traitLabels[topTrait] ?? topTrait} dans votre recherche d'emploi`,
      "Préparez des exemples concrets illustrant vos soft skills",
      "Cherchez des rôles où vos points forts sont valorisés",
      "Identifiez un mentor dans votre domaine cible",
    ],
  };
}

// ── Analyse Entrepreneur ───────────────────────────────────────────────────────

function analyzeEntrepreneur(scores: Record<string, number>): Record<string, unknown> {
  const top = topN(scores, 2);
  const low = bottomN(scores, 2);
  const globalScore = avg(scores);

  const typeLabels: Record<string, string> = {
    vision: "Visionnaire",
    execution: "Exécutant",
    innovation: "Innovateur",
    resilience: "Résilient",
    leadership: "Leader",
    commercial: "Commercial",
    motivation: "Motivé",
    competences: "Compétent",
    reseau: "Networker",
  };

  const topDim = top[0] ?? "vision";
  const entrepreneurType = typeLabels[topDim] ?? "Entrepreneur polyvalent";
  const readiness = globalScore >= 75 ? "Haute" : globalScore >= 55 ? "Moyenne" : "En développement";

  return {
    summary: `Votre profil entrepreneurial dominant est celui du ${entrepreneurType}. Avec un niveau de préparation "${readiness}", vous avez les bases pour ${globalScore >= 70 ? "lancer votre projet dès maintenant" : "préparer votre lancement dans les 3 à 6 prochains mois"}.`,
    globalScore,
    entrepreneurType,
    readiness,
    strengths: top.slice(0, 2).map((d) => typeLabels[d] ?? d),
    developmentAxes: low.slice(0, 2).map((d) => `Renforcer : ${typeLabels[d] ?? d}`),
    careers: topDim === "vision" || topDim === "innovation"
      ? ["Fondateur de startup tech", "Social entrepreneur", "Intrapreneur", "Directeur Innovation"]
      : topDim === "commercial"
      ? ["Directeur commercial", "Business Developer", "Franchisé", "Agent commercial"]
      : ["Prestataire de services", "Artisan premium", "Consultant indépendant", "Formateur expert"],
    formations: [
      "Programme entrepreneuriat africain (AEPM / jeunes entrepreneurs)",
      "Formation Business Model Canvas & validation d'idée",
      "GolléO — formations entrepreneuriales contextualisées",
    ],
    nextSteps: [
      globalScore >= 70
        ? "Structurez votre Business Plan et cherchez vos premiers clients"
        : "Validez votre idée avec un prototype simple d'abord",
      "Rejoignez un réseau d'entrepreneurs africains",
      "Identifiez un mentor ou partenaire complémentaire",
      "Ouvrez votre espace entrepreneur sur GolléO",
    ],
  };
}

// ── Analyse Maturité Projet ───────────────────────────────────────────────────

function analyzeProjectMaturity(scores: Record<string, number>): Record<string, unknown> {
  const globalScore = avg(scores);
  const top = topN(scores, 2);
  const low = bottomN(scores, 2);

  const maturityLevel =
    globalScore >= 75
      ? "Projet mature — prêt pour le lancement"
      : globalScore >= 55
      ? "Projet en structuration — encore quelques étapes"
      : "Projet en idéation — beaucoup à construire";

  return {
    summary: `${maturityLevel}. Votre score de ${globalScore}/100 indique ${globalScore >= 70 ? "une préparation solide pour le lancement" : "des axes d'amélioration importants avant le démarrage"}.`,
    globalScore,
    maturityLevel,
    strengths: top.slice(0, 2).map((k) => `Point fort : ${k}`),
    developmentAxes: low.slice(0, 2).map((k) => `À renforcer : ${k}`),
    careers: ["Fondateur de startup", "Chef de projet", "Entrepreneur", "Directeur de développement"],
    formations: [
      "Programme d'incubation ou d'accélération local",
      "Formation gestion de projet & lean startup",
      "Coaching par un mentor expérimenté dans votre secteur",
    ],
    nextSteps: globalScore >= 70
      ? [
          "Finalisez votre étude de marché et votre Business Plan",
          "Cherchez des financements (microcrédits, fonds d'amorçage)",
          "Constituez votre équipe de fondateurs",
          "Lancez une version bêta auprès de 20 utilisateurs pilotes",
        ]
      : [
          "Clarifiez votre proposition de valeur unique",
          "Validez votre idée auprès de 10 à 20 clients potentiels",
          "Définissez votre modèle économique (revenus, coûts, marges)",
          "Rejoignez un programme d'accompagnement entrepreneurial",
        ],
  };
}

// ── Moteur principal (exporté pour useTestFlow) ───────────────────────────────

export function generateAnalysis(
  testType: TestType,
  scores: Record<string, number>,
  profileType?: string
): Record<string, unknown> {
  switch (testType) {
    case "ikigai":
      return analyzeIkigai(scores, profileType);
    case "personality":
      return analyzePersonnality(scores);
    case "entrepreneur_profile":
      return analyzeEntrepreneur(scores);
    case "project_maturity":
      return analyzeProjectMaturity(scores);
    case "riasec":
    default:
      return analyzePersonnality(scores);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Hook principal — useCompleteTest
// ─────────────────────────────────────────────────────────────────────────────

export function useCompleteTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);

  async function completeTest(payload: CompleteTestPayload): Promise<TestResult | null> {
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));

      const aiAnalysis = generateAnalysis(
        payload.testType,
        payload.scores,
        payload.profileType
      );

      const result: TestResult = {
        id: Math.floor(Math.random() * 100000),
        testType: payload.testType,
        scores: payload.scores,
        aiAnalysis,
        createdAt: new Date().toISOString(),
      };

      try {
        const key = `golleo_test_${payload.testType}`;
        localStorage.setItem(key, JSON.stringify({ result, date: new Date().toISOString() }));
      } catch (_) {}

      return result;
    } catch (e) {
      console.error("completeTest error:", e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { completeTest, isLoading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
//  computeScores — Calcul local des scores par catégorie
// ─────────────────────────────────────────────────────────────────────────────

export function computeScores(
  answers: Record<number, number>,
  questions: Array<{ id: number; category: string }>,
  categories: string[]
): Record<string, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  categories.forEach((cat) => {
    sums[cat] = 0;
    counts[cat] = 0;
  });

  questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans !== undefined && q.category in sums) {
      sums[q.category] += ans;
      counts[q.category]++;
    }
  });

  const scores: Record<string, number> = {};
  categories.forEach((cat) => {
    const count = counts[cat];
    const sum = sums[cat];
    if (count === 0) { scores[cat] = 0; return; }
    const min = count;
    const max = count * 5;
    scores[cat] = Math.round(((sum - min) / (max - min)) * 100);
  });

  return scores;
}
