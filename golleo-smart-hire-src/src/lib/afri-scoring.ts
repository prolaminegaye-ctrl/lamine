// ─────────────────────────────────────────────────────────────────────────────
//  FRIWOK — Moteur de scoring AFRI-CODE & AFRI-SKILL
//  Fonctions pures, indépendantes du layer UI — faciles à tester
// ─────────────────────────────────────────────────────────────────────────────

import type {
  AfriQuestion,
  AfriCodeDimension,
  AfriCodeProfile,
  AfriCodeResult,
  AfriSkillDimension,
  AfriSkillLevel,
  AfriSkillResult,
} from "@/data/afri-tests";
import {
  AFRI_CODE_PROFILES,
  AFRI_CODE_TEST,
  AFRI_SKILL_TEST,
  AFRI_SKILL_LEVELS,
  AFRI_SKILL_COURSES,
} from "@/data/afri-tests";

// ── Utilitaires ───────────────────────────────────────────────────────────────

/** Normalise un score brut (somme) en pourcentage 0-100 */
function normalizeScore(sum: number, count: number, minPerQ = 1, maxPerQ = 5): number {
  if (count === 0) return 0;
  const min = count * minPerQ;
  const max = count * maxPerQ;
  return Math.round(((sum - min) / (max - min)) * 100);
}

/** Calcule la distribution des scores par dimension */
export function computeDimensionScores(
  answers: Record<number, number>,
  questions: AfriQuestion[],
  dimensions: string[]
): Record<string, number> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  dimensions.forEach((d) => { sums[d] = 0; counts[d] = 0; });

  questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans !== undefined && q.dimension in sums) {
      sums[q.dimension] += ans;
      counts[q.dimension]++;
    }
  });

  const scores: Record<string, number> = {};
  dimensions.forEach((d) => {
    scores[d] = normalizeScore(sums[d], counts[d]);
  });
  return scores;
}

// ─────────────────────────────────────────────────────────────────────────────
//  AFRI-CODE Scoring
// ─────────────────────────────────────────────────────────────────────────────

/** Map dimension → profil AFRI-CODE */
const DIMENSION_TO_PROFILE: Record<AfriCodeDimension, AfriCodeProfile> = {
  terrain:    "BÂTISSEUR",
  numerique:  "VISIONNAIRE",
  creation:   "CRÉATEUR",
  service:    "HUMANISTE",
  leadership: "LEADER",
  gestion:    "GARDIEN",
};

/**
 * Calcule le résultat complet AFRI-CODE à partir des réponses.
 * Retourne les profils dominants, recommandations et détails.
 */
export function computeAfriCode(answers: Record<number, number>): AfriCodeResult {
  const rawScores = computeDimensionScores(
    answers,
    AFRI_CODE_TEST.questions,
    AFRI_CODE_TEST.dimensions
  ) as Record<AfriCodeDimension, number>;

  // Trier les dimensions par score décroissant
  const sorted = (Object.keys(rawScores) as AfriCodeDimension[]).sort(
    (a, b) => rawScores[b] - rawScores[a]
  );

  const primaryDim = sorted[0];
  const secondaryDim = sorted[1];

  const primaryProfile = DIMENSION_TO_PROFILE[primaryDim];
  const secondaryProfile = DIMENSION_TO_PROFILE[secondaryDim];

  const profileDetails = AFRI_CODE_PROFILES[primaryProfile];
  const secondaryDetails = AFRI_CODE_PROFILES[secondaryProfile];

  // Top 3 profils
  const topProfiles = sorted.slice(0, 3).map((d) => DIMENSION_TO_PROFILE[d]);

  // Recommandations fusionnées depuis les deux profils dominants
  const careers = [
    ...profileDetails.careers.slice(0, 3),
    ...secondaryDetails.careers.slice(0, 2),
  ];
  const formations = [
    ...profileDetails.formations.slice(0, 2),
    ...secondaryDetails.formations.slice(0, 2),
  ];
  const environments = [
    ...profileDetails.environments.slice(0, 3),
    ...secondaryDetails.environments.slice(0, 2),
  ];
  const strengths = [
    ...profileDetails.strengths.slice(0, 3),
    ...secondaryDetails.strengths.slice(0, 2),
  ];

  return {
    scores: rawScores,
    topProfiles,
    primaryProfile,
    secondaryProfile,
    profileDetails,
    secondaryDetails,
    recommendations: { careers, formations, environments, strengths },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  AFRI-SKILL Scoring
// ─────────────────────────────────────────────────────────────────────────────

function getSkillLevel(score: number): AfriSkillLevel {
  if (score <= 40) return "Débutant";
  if (score <= 60) return "En développement";
  if (score <= 75) return "Opérationnel";
  return "Confirmé";
}

/**
 * Calcule le résultat complet AFRI-SKILL à partir des réponses.
 */
export function computeAfriSkill(answers: Record<number, number>): AfriSkillResult {
  const dimensionScores = computeDimensionScores(
    answers,
    AFRI_SKILL_TEST.questions,
    AFRI_SKILL_TEST.dimensions
  ) as Record<AfriSkillDimension, number>;

  // Score global = moyenne de toutes les dimensions
  const values = Object.values(dimensionScores);
  const globalScore = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  const level = getSkillLevel(globalScore);
  const levelData = AFRI_SKILL_LEVELS[level];

  // Forces = top 3 dimensions (score >= 70)
  const sorted = (Object.keys(dimensionScores) as AfriSkillDimension[]).sort(
    (a, b) => dimensionScores[b] - dimensionScores[a]
  );
  const strengths = sorted.filter((d) => dimensionScores[d] >= 65).slice(0, 3);

  // À améliorer = bottom 3 dimensions (score < 55)
  const toImprove = sorted
    .reverse()
    .filter((d) => dimensionScores[d] < 55)
    .slice(0, 3);

  // Recommandations textuelles
  const recommendations = buildSkillRecommendations(dimensionScores, level);

  // Formations courtes basées sur les dims faibles
  const shortCourses = toImprove
    .flatMap((d) => AFRI_SKILL_COURSES[d] ?? [])
    .slice(0, 4);

  // Prochaines étapes selon niveau
  const nextSteps = buildNextSteps(level, toImprove);

  return {
    dimensionScores,
    globalScore,
    level,
    levelDescription: levelData.description,
    strengths,
    toImprove,
    recommendations,
    shortCourses,
    nextSteps,
  };
}

function buildSkillRecommendations(
  scores: Record<AfriSkillDimension, number>,
  level: AfriSkillLevel
): string[] {
  const recs: string[] = [];

  if (scores.communication < 55)
    recs.push("Entraînez-vous à la prise de parole en public et à la rédaction professionnelle");
  if (scores.numerique < 55)
    recs.push("Développez vos compétences numériques de base (bureautique, outils digitaux)");
  if (scores.organisation < 55)
    recs.push("Adoptez une méthode de planification simple : liste de tâches, agenda hebdomadaire");
  if (scores.initiative < 55)
    recs.push("Osez proposer des idées et prendre des responsabilités sans attendre");
  if (scores.posture < 55)
    recs.push("Travaillez votre posture professionnelle : ponctualité, présentation, respect des engagements");
  if (scores.adaptabilite < 55)
    recs.push("Exposez-vous volontairement à des situations nouvelles pour développer votre flexibilité");
  if (scores.equipe < 55)
    recs.push("Participez à des projets collectifs ou associatifs pour renforcer votre collaboration");

  if (level === "Confirmé") {
    recs.push("Votre profil est solide — visez un rôle de mentor ou de leader dans votre équipe");
    recs.push("Cherchez des missions complexes ou des responsabilités de coordination de projet");
  } else if (level === "Opérationnel") {
    recs.push("Continuez à consolider vos points forts et ciblez 1-2 axes de progrès spécifiques");
    recs.push("Cherchez un premier emploi ou stage dans un domaine proche de vos compétences");
  } else {
    recs.push("Commencez par des formations courtes et gratuites sur vos dimensions les plus faibles");
    recs.push("Cherchez un stage, un apprentissage ou un bénévolat pour mettre en pratique vos compétences");
  }

  return recs.slice(0, 5);
}

function buildNextSteps(level: AfriSkillLevel, weakDims: AfriSkillDimension[]): string[] {
  const dimensionLabels: Record<AfriSkillDimension, string> = {
    communication: "communication",
    numerique: "numérique de base",
    organisation: "organisation",
    resolution: "résolution de problèmes",
    apprentissage: "apprentissage",
    adaptabilite: "adaptabilité",
    initiative: "initiative",
    equipe: "travail en équipe",
    consignes: "compréhension des consignes",
    posture: "posture professionnelle",
  };

  const steps: string[] = [];

  if (weakDims.length > 0) {
    steps.push(
      `Suivre une formation courte en ${dimensionLabels[weakDims[0]]} dans les 30 prochains jours`
    );
  }
  if (weakDims.length > 1) {
    steps.push(
      `Pratiquer la ${dimensionLabels[weakDims[1]]} dans votre quotidien (exercices simples 15min/jour)`
    );
  }

  if (level === "Débutant") {
    steps.push("Rejoindre un centre de formation ou un programme d'insertion professionnelle");
    steps.push("Compléter votre profil GolléO et passer l'AFRI-CODE pour découvrir votre orientation");
    steps.push("Chercher un mentor ou un conseiller d'emploi pour vous accompagner");
  } else if (level === "En développement") {
    steps.push("Postuler à des stages ou des contrats de professionnalisation");
    steps.push("Mettre à jour votre CV en mettant en avant vos compétences confirmées");
    steps.push("Simuler un entretien d'embauche pour tester votre préparation");
  } else if (level === "Opérationnel") {
    steps.push("Postuler à des offres d'emploi adaptées à votre profil AFRI-CODE");
    steps.push("Préparer votre entretien avec le simulateur IA GolléO");
    steps.push("Demander des lettres de recommandation à vos anciens formateurs ou superviseurs");
  } else {
    steps.push("Viser des postes avec responsabilités ou une promotion interne");
    steps.push("Envisager un rôle de formateur ou de coach pour partager vos compétences");
    steps.push("Explorer des certifications professionnelles reconnues dans votre secteur");
  }

  return steps.slice(0, 5);
}
