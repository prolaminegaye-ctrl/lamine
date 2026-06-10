// ─────────────────────────────────────────────────────────────────────────────
//  FRIWOK — Tests propriétaires AFRI-CODE & AFRI-SKILL
//  Contextualisés pour l'Afrique francophone
// ─────────────────────────────────────────────────────────────────────────────

// ── Types communs ─────────────────────────────────────────────────────────────

export type QuestionType = "likert" | "single" | "multi";

export interface AfriQuestion {
  id: number;
  text: string;
  dimension: string;
  type: QuestionType;
  /** Pour single/multi — options textuelles */
  options?: { value: number; label: string }[];
}

export interface AfriTestDefinition {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  description: string;
  questions: AfriQuestion[];
  dimensions: string[];
  dimensionLabels: Record<string, string>;
  dimensionEmojis: Record<string, string>;
  dimensionColors: Record<string, string>;
}

// ── AFRI-CODE — Test d'orientation professionnel africain ────────────────────
// 6 dimensions × 5 questions = 30 questions, Likert 1-5

export type AfriCodeDimension = "terrain" | "numerique" | "creation" | "service" | "leadership" | "gestion";

export type AfriCodeProfile =
  | "BÂTISSEUR"
  | "VISIONNAIRE"
  | "CRÉATEUR"
  | "HUMANISTE"
  | "LEADER"
  | "GARDIEN";

export interface AfriCodeResult {
  scores: Record<AfriCodeDimension, number>;        // 0-100
  topProfiles: AfriCodeProfile[];                    // 2-3 profils dominants
  primaryProfile: AfriCodeProfile;
  secondaryProfile: AfriCodeProfile;
  profileDetails: AfriCodeProfileData;
  secondaryDetails: AfriCodeProfileData;
  recommendations: {
    careers: string[];
    formations: string[];
    environments: string[];
    strengths: string[];
  };
}

export interface AfriCodeProfileData {
  name: AfriCodeProfile;
  emoji: string;
  tagline: string;
  description: string;
  strengths: string[];
  environments: string[];
  careers: string[];
  formations: string[];
  dimension: AfriCodeDimension;
  color: string;
  gradient: string;
}

// ── AFRI-SKILL — Test de readiness professionnelle ───────────────────────────
// 10 dimensions × 3 questions = 30 questions, Likert 1-5

export type AfriSkillDimension =
  | "communication"
  | "numerique"
  | "organisation"
  | "resolution"
  | "apprentissage"
  | "adaptabilite"
  | "initiative"
  | "equipe"
  | "consignes"
  | "posture";

export type AfriSkillLevel = "Débutant" | "En développement" | "Opérationnel" | "Confirmé";

export interface AfriSkillResult {
  dimensionScores: Record<AfriSkillDimension, number>;  // 0-100
  globalScore: number;                                   // 0-100
  level: AfriSkillLevel;
  levelDescription: string;
  strengths: AfriSkillDimension[];
  toImprove: AfriSkillDimension[];
  recommendations: string[];
  shortCourses: { title: string; platform: string; duration: string }[];
  nextSteps: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
//  AFRI-CODE — Définition complète
// ─────────────────────────────────────────────────────────────────────────────

const AFRI_CODE_LIKERT = [
  { value: 1, label: "Pas du tout moi" },
  { value: 2, label: "Peu me correspond" },
  { value: 3, label: "Neutre" },
  { value: 4, label: "Me correspond bien" },
  { value: 5, label: "Tout à fait moi" },
];

export const AFRI_CODE_TEST: AfriTestDefinition = {
  id: "afri-code",
  title: "AFRI-CODE",
  subtitle: "Votre boussole professionnelle africaine",
  duration: "8–12 min",
  description:
    "AFRI-CODE est un test d'orientation fondé sur vos intérêts, motivations et valeurs professionnels. Il identifie votre profil parmi 6 archétypes contextualisés pour le marché du travail africain et vous recommande des métiers, formations et environnements adaptés.",
  dimensions: ["terrain", "numerique", "creation", "service", "leadership", "gestion"],
  dimensionLabels: {
    terrain:     "Terrain & Technique",
    numerique:   "Numérique & Innovation",
    creation:    "Création & Expression",
    service:     "Service & Humanisme",
    leadership:  "Leadership & Entreprise",
    gestion:     "Gestion & Organisation",
  },
  dimensionEmojis: {
    terrain:    "🔧",
    numerique:  "💻",
    creation:   "🎨",
    service:    "🤝",
    leadership: "🚀",
    gestion:    "📊",
  },
  dimensionColors: {
    terrain:    "#C2441D",   /* terre rouge */
    numerique:  "#5BB8E0",   /* ciel sahel */
    creation:   "#F5C23E",   /* or soleil */
    service:    "#2EB88A",   /* vert savane */
    leadership: "#E8813A",   /* ambre */
    gestion:    "#B8A9FF",   /* lavande */
  },
  questions: [
    // ── TERRAIN (5 questions) ──
    {
      id: 1,
      dimension: "terrain",
      type: "likert",
      text: "J'aime travailler avec mes mains : construire, réparer, fabriquer ou cultiver.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 2,
      dimension: "terrain",
      type: "likert",
      text: "Les activités pratiques sur le terrain (chantier, atelier, ferme, usine) me motivent plus qu'un bureau.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 3,
      dimension: "terrain",
      type: "likert",
      text: "Je me sens fier(e) quand je vois un résultat concret et tangible de mon travail.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 4,
      dimension: "terrain",
      type: "likert",
      text: "L'agriculture, le BTP, la mécanique, l'électricité ou les métiers industriels m'attirent.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 5,
      dimension: "terrain",
      type: "likert",
      text: "Je préfère agir et produire plutôt que passer du temps à analyser ou planifier.",
      options: AFRI_CODE_LIKERT,
    },

    // ── NUMERIQUE (5 questions) ──
    {
      id: 6,
      dimension: "numerique",
      type: "likert",
      text: "Les technologies, applications et outils numériques m'intéressent et j'aime les explorer.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 7,
      dimension: "numerique",
      type: "likert",
      text: "Je suis curieux(se) de comprendre comment fonctionnent les systèmes, algorithmes ou réseaux.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 8,
      dimension: "numerique",
      type: "likert",
      text: "L'idée de développer une application, un site web ou une solution digitale m'enthousiasme.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 9,
      dimension: "numerique",
      type: "likert",
      text: "J'aime résoudre des problèmes de façon logique et méthodique, étape par étape.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 10,
      dimension: "numerique",
      type: "likert",
      text: "L'innovation technologique et la transformation numérique de l'Afrique m'inspirent.",
      options: AFRI_CODE_LIKERT,
    },

    // ── CREATION (5 questions) ──
    {
      id: 11,
      dimension: "creation",
      type: "likert",
      text: "J'aime créer : dessiner, filmer, écrire, concevoir ou mettre en scène.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 12,
      dimension: "creation",
      type: "likert",
      text: "L'esthétique, le style et la beauté des choses ont une grande importance pour moi.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 13,
      dimension: "creation",
      type: "likert",
      text: "J'exprime facilement mes idées et émotions à travers des formes artistiques ou créatives.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 14,
      dimension: "creation",
      type: "likert",
      text: "La mode, la musique, la communication visuelle ou les médias m'attirent naturellement.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 15,
      dimension: "creation",
      type: "likert",
      text: "Je préfère les environnements flexibles et créatifs aux cadres rigides et répétitifs.",
      options: AFRI_CODE_LIKERT,
    },

    // ── SERVICE (5 questions) ──
    {
      id: 16,
      dimension: "service",
      type: "likert",
      text: "Aider les autres à surmonter leurs difficultés me donne un sentiment d'accomplissement profond.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 17,
      dimension: "service",
      type: "likert",
      text: "L'enseignement, la formation, le soin ou l'accompagnement social m'attirent.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 18,
      dimension: "service",
      type: "likert",
      text: "Je suis naturellement à l'écoute et j'ai de l'empathie pour les personnes en difficulté.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 19,
      dimension: "service",
      type: "likert",
      text: "Contribuer au développement de ma communauté ou de mon pays est une priorité pour moi.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 20,
      dimension: "service",
      type: "likert",
      text: "Le travail en équipe, l'entraide et la solidarité sont des valeurs professionnelles essentielles.",
      options: AFRI_CODE_LIKERT,
    },

    // ── LEADERSHIP (5 questions) ──
    {
      id: 21,
      dimension: "leadership",
      type: "likert",
      text: "J'ai envie de créer ma propre activité, entreprise ou projet entrepreneurial.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 22,
      dimension: "leadership",
      type: "likert",
      text: "Convaincre, négocier, vendre ou influencer sont des compétences que j'aime développer.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 23,
      dimension: "leadership",
      type: "likert",
      text: "Je suis à l'aise pour prendre des décisions et diriger une équipe ou un projet.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 24,
      dimension: "leadership",
      type: "likert",
      text: "Les défis, la compétition et les grands objectifs ambitieux me stimulent.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 25,
      dimension: "leadership",
      type: "likert",
      text: "Le commerce, le business, le marketing ou la gestion d'équipe m'attirent naturellement.",
      options: AFRI_CODE_LIKERT,
    },

    // ── GESTION (5 questions) ──
    {
      id: 26,
      dimension: "gestion",
      type: "likert",
      text: "J'aime organiser, planifier, structurer et optimiser les processus et ressources.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 27,
      dimension: "gestion",
      type: "likert",
      text: "La comptabilité, la finance, l'administration ou la logistique m'intéressent.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 28,
      dimension: "gestion",
      type: "likert",
      text: "Je préfère les environnements avec des règles claires, des procédures définies et des objectifs mesurables.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 29,
      dimension: "gestion",
      type: "likert",
      text: "La précision, la rigueur et l'attention aux détails font partie de mes points forts.",
      options: AFRI_CODE_LIKERT,
    },
    {
      id: 30,
      dimension: "gestion",
      type: "likert",
      text: "Analyser des données, gérer des budgets ou produire des rapports ne me rebute pas.",
      options: AFRI_CODE_LIKERT,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  AFRI-CODE — Profils complets
// ─────────────────────────────────────────────────────────────────────────────

export const AFRI_CODE_PROFILES: Record<AfriCodeProfile, AfriCodeProfileData> = {
  BÂTISSEUR: {
    name: "BÂTISSEUR",
    emoji: "🔨",
    tagline: "Vous construisez l'Afrique de demain avec vos mains",
    description:
      "Le Bâtisseur est un profil pratique et concret, passionné par le travail manuel, technique et la production visible. Il prospère dans des environnements où l'action prime sur la théorie, et trouve une grande satisfaction dans le résultat tangible de son travail.",
    strengths: ["Sens pratique développé", "Endurance et rigueur physique", "Autonomie terrain", "Résolution de problèmes concrets", "Fiabilité et constance"],
    environments: ["Chantiers et BTP", "Ateliers de fabrication", "Exploitations agricoles", "Centres techniques", "Environnements industriels"],
    careers: ["Ingénieur en génie civil", "Technicien BTP", "Agriculteur entrepreneur", "Mécanicien / électricien", "Plombier / menuisier entrepreneur", "Technicien en énergies renouvelables"],
    formations: ["BTS Bâtiment & Travaux Publics", "Formation en agriculture moderne", "Certification en énergies solaires", "CAP Maintenance industrielle", "Formation en irrigation & agri-tech"],
    dimension: "terrain",
    color: "#C2441D",
    gradient: "from-orange-700 to-red-600",
  },
  VISIONNAIRE: {
    name: "VISIONNAIRE",
    emoji: "🔭",
    tagline: "Vous décryptez le monde pour le transformer",
    description:
      "Le Visionnaire est analytique, curieux et passionné par l'innovation numérique. Il aime comprendre les systèmes complexes, explorer les nouvelles technologies et contribuer à la transformation digitale du continent africain.",
    strengths: ["Pensée analytique et logique", "Curiosité intellectuelle", "Apprentissage rapide", "Résolution de problèmes complexes", "Vision systémique"],
    environments: ["Startups tech", "Centres de recherche", "Entreprises de conseil digital", "Laboratoires d'innovation", "Télétravail et remote"],
    careers: ["Développeur logiciel / mobile", "Data analyst / Data scientist", "Ingénieur cybersécurité", "Chef de projet digital", "Consultant en transformation digitale", "Créateur de startup tech"],
    formations: ["Licence/Master informatique", "Formation développement web/mobile", "Certification data science", "Bootcamp coding", "Formation IA & Machine Learning"],
    dimension: "numerique",
    color: "#5BB8E0",
    gradient: "from-sky-500 to-blue-600",
  },
  CRÉATEUR: {
    name: "CRÉATEUR",
    emoji: "✨",
    tagline: "Vous donnez vie aux idées et à la beauté",
    description:
      "Le Créateur est un profil artistique et expressif qui s'épanouit dans les métiers de la création, du design, de la communication et des industries culturelles. L'Afrique dispose d'un patrimoine créatif immense et d'une scène artistique en pleine explosion.",
    strengths: ["Sens esthétique développé", "Originalité et imagination", "Expression créative forte", "Sensibilité aux tendances", "Storytelling naturel"],
    environments: ["Studios créatifs", "Agences de communication", "Maisons de production", "Ateliers d'artisanat d'art", "Freelance / indépendant"],
    careers: ["Designer graphique / UX", "Photographe / vidéaste", "Créateur de contenu digital", "Architecte d'intérieur", "Styliste / créateur de mode", "Illustrateur / animateur"],
    formations: ["École des beaux-arts / design", "Formation en communication visuelle", "Certification Adobe / Canva", "Formation vidéo & montage", "École de mode et stylisme"],
    dimension: "creation",
    color: "#F5C23E",
    gradient: "from-yellow-400 to-amber-500",
  },
  HUMANISTE: {
    name: "HUMANISTE",
    emoji: "🌍",
    tagline: "Vous placez l'humain au cœur de tout",
    description:
      "L'Humaniste trouve son sens dans le service aux autres et le développement humain. Enseignant, soignant, travailleur social ou formateur, ce profil est le pilier de la cohésion sociale et du développement communautaire en Afrique.",
    strengths: ["Empathie et écoute active", "Bienveillance et patience", "Communication interpersonnelle", "Sens du collectif", "Engagement social fort"],
    environments: ["Écoles et universités", "Centres de santé", "ONG et organisations sociales", "Services RH d'entreprise", "Associations communautaires"],
    careers: ["Enseignant / formateur", "Infirmier(e) / sage-femme", "Travailleur social", "Chargé(e) RH", "Conseiller d'orientation", "Responsable d'ONG"],
    formations: ["Licence en sciences de l'éducation", "Formation en soins infirmiers", "Diplôme de travail social", "Licence RH / management", "Certification coaching professionnel"],
    dimension: "service",
    color: "#2EB88A",
    gradient: "from-emerald-500 to-teal-600",
  },
  LEADER: {
    name: "LEADER",
    emoji: "🦁",
    tagline: "Vous bâtissez, vendez et transformez le monde",
    description:
      "Le Leader est entrepreneurial, ambitieux et naturellement à l'aise dans les rôles de direction, de commerce et d'influence. Ce profil correspond aux jeunes africains qui veulent créer de la valeur économique, monter des affaires et laisser une empreinte.",
    strengths: ["Vision stratégique", "Capacité à convaincre et négocier", "Prise de risque calculée", "Leadership naturel", "Résilience face aux défis"],
    environments: ["Entreprises commerciales", "Startups", "Marchés et commerces", "Cabinets de conseil", "Structures de financement"],
    careers: ["Entrepreneur / fondateur de startup", "Commercial / account manager", "Chef d'entreprise", "Directeur marketing", "Consultant en stratégie", "Responsable business development"],
    formations: ["École de commerce / MBA", "Formation en entrepreneuriat", "Certification en marketing digital", "Formation en gestion commerciale", "Programme incubateur startup"],
    dimension: "leadership",
    color: "#E8813A",
    gradient: "from-orange-500 to-amber-600",
  },
  GARDIEN: {
    name: "GARDIEN",
    emoji: "⚖️",
    tagline: "Vous organisez, protégez et faites durer",
    description:
      "Le Gardien est méthodique, rigoureux et fiable. Il excelle dans la gestion administrative, financière et organisationnelle. Dans un continent où la structuration des entreprises est un enjeu majeur, ce profil est indispensable.",
    strengths: ["Rigueur et précision", "Sens de l'organisation", "Fiabilité et constance", "Respect des procédures", "Gestion efficace des ressources"],
    environments: ["Services administratifs", "Directions financières", "Cabinets comptables", "Services logistiques", "Administrations publiques"],
    careers: ["Comptable / expert-comptable", "Gestionnaire administratif", "Logisticien / supply chain", "Auditeur interne", "Responsable qualité", "Directeur financier"],
    formations: ["BTS Comptabilité / Gestion", "Licence en gestion d'entreprise", "Certification OHADA / comptabilité", "Formation en logistique", "Master finance et contrôle de gestion"],
    dimension: "gestion",
    color: "#B8A9FF",
    gradient: "from-violet-400 to-purple-500",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
//  AFRI-SKILL — Définition complète
// ─────────────────────────────────────────────────────────────────────────────

const AFRI_SKILL_LIKERT = [
  { value: 1, label: "Rarement ou jamais" },
  { value: 2, label: "Parfois" },
  { value: 3, label: "Assez souvent" },
  { value: 4, label: "Souvent" },
  { value: 5, label: "Toujours ou presque" },
];

export const AFRI_SKILL_TEST: AfriTestDefinition = {
  id: "afri-skill",
  title: "AFRI-SKILL",
  subtitle: "Mesurez votre prêt-à-l'emploi professionnel",
  duration: "6–10 min",
  description:
    "AFRI-SKILL évalue votre niveau de préparation au marché du travail à travers 10 compétences transférables essentielles. Il identifie vos forces, vos axes de progrès et vous recommande des formations courtes pour accélérer votre employabilité.",
  dimensions: [
    "communication", "numerique", "organisation", "resolution",
    "apprentissage", "adaptabilite", "initiative", "equipe",
    "consignes", "posture",
  ],
  dimensionLabels: {
    communication: "Communication",
    numerique:     "Numérique de base",
    organisation:  "Organisation",
    resolution:    "Résolution de problèmes",
    apprentissage: "Apprentissage",
    adaptabilite:  "Adaptabilité",
    initiative:    "Initiative",
    equipe:        "Travail en équipe",
    consignes:     "Compréhension des consignes",
    posture:       "Posture professionnelle",
  },
  dimensionEmojis: {
    communication: "🗣️",
    numerique:     "📱",
    organisation:  "📅",
    resolution:    "🧩",
    apprentissage: "📚",
    adaptabilite:  "🌊",
    initiative:    "💡",
    equipe:        "👥",
    consignes:     "📋",
    posture:       "🎯",
  },
  dimensionColors: {
    communication: "#E8813A",
    numerique:     "#5BB8E0",
    organisation:  "#F5C23E",
    resolution:    "#2EB88A",
    apprentissage: "#B8A9FF",
    adaptabilite:  "#6C4FDA",
    initiative:    "#C2441D",
    equipe:        "#2EB88A",
    consignes:     "#F5C23E",
    posture:       "#E8813A",
  },
  questions: [
    // ── COMMUNICATION (3) ──
    {
      id: 1,
      dimension: "communication",
      type: "likert",
      text: "Je m'exprime clairement à l'oral devant un groupe ou un supérieur.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 2,
      dimension: "communication",
      type: "likert",
      text: "Je sais rédiger un message, un email ou un rapport de façon compréhensible et structurée.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 3,
      dimension: "communication",
      type: "likert",
      text: "J'écoute activement mes interlocuteurs sans les couper, et je reformule pour m'assurer d'avoir bien compris.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── NUMÉRIQUE (3) ──
    {
      id: 4,
      dimension: "numerique",
      type: "likert",
      text: "Je sais utiliser un ordinateur ou un smartphone pour des tâches professionnelles (email, Word, Excel, internet).",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 5,
      dimension: "numerique",
      type: "likert",
      text: "Je suis à l'aise avec les outils de communication en ligne (WhatsApp Business, Zoom, Google Drive, etc.).",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 6,
      dimension: "numerique",
      type: "likert",
      text: "Je peux apprendre rapidement à utiliser un nouvel outil numérique si on me montre les bases.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── ORGANISATION (3) ──
    {
      id: 7,
      dimension: "organisation",
      type: "likert",
      text: "Je planifie mes tâches à l'avance et je gère mon temps de façon efficace.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 8,
      dimension: "organisation",
      type: "likert",
      text: "Je respecte les délais et les rendez-vous, même quand il y a des imprévus.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 9,
      dimension: "organisation",
      type: "likert",
      text: "Je tiens mon espace de travail et mes dossiers organisés et facilement accessibles.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── RÉSOLUTION (3) ──
    {
      id: 10,
      dimension: "resolution",
      type: "likert",
      text: "Face à un problème au travail, j'analyse la situation avant d'agir et je cherche plusieurs solutions possibles.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 11,
      dimension: "resolution",
      type: "likert",
      text: "Quand quelque chose ne fonctionne pas comme prévu, je ne me décourage pas et je cherche une alternative.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 12,
      dimension: "resolution",
      type: "likert",
      text: "Je sais identifier la cause d'un problème plutôt que de ne traiter que ses symptômes.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── APPRENTISSAGE (3) ──
    {
      id: 13,
      dimension: "apprentissage",
      type: "likert",
      text: "Je suis curieux(se) et je cherche à apprendre de nouvelles choses de façon autonome.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 14,
      dimension: "apprentissage",
      type: "likert",
      text: "Je prends des notes, je relis et je m'entraîne pour mémoriser et améliorer mes compétences.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 15,
      dimension: "apprentissage",
      type: "likert",
      text: "Je prends en compte les retours et les critiques constructives pour progresser.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── ADAPTABILITÉ (3) ──
    {
      id: 16,
      dimension: "adaptabilite",
      type: "likert",
      text: "Je m'adapte facilement aux changements de priorités, d'environnement ou de méthodes de travail.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 17,
      dimension: "adaptabilite",
      type: "likert",
      text: "Je reste calme et efficace face aux situations imprévues ou stressantes.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 18,
      dimension: "adaptabilite",
      type: "likert",
      text: "Je suis prêt(e) à travailler dans des contextes variés (différents postes, régions, équipes).",
      options: AFRI_SKILL_LIKERT,
    },

    // ── INITIATIVE (3) ──
    {
      id: 19,
      dimension: "initiative",
      type: "likert",
      text: "Je propose des idées ou des améliorations sans attendre qu'on me le demande.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 20,
      dimension: "initiative",
      type: "likert",
      text: "Quand j'identifie un besoin ou un problème, je passe à l'action plutôt que d'attendre.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 21,
      dimension: "initiative",
      type: "likert",
      text: "Je prends des responsabilités supplémentaires quand l'occasion se présente.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── TRAVAIL EN ÉQUIPE (3) ──
    {
      id: 22,
      dimension: "equipe",
      type: "likert",
      text: "Je collabore efficacement avec des personnes ayant des profils et des opinions différents des miens.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 23,
      dimension: "equipe",
      type: "likert",
      text: "Je partage volontiers mes connaissances et j'aide mes collègues quand ils en ont besoin.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 24,
      dimension: "equipe",
      type: "likert",
      text: "Je gère les désaccords avec calme et je cherche des solutions qui conviennent à tous.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── CONSIGNES (3) ──
    {
      id: 25,
      dimension: "consignes",
      type: "likert",
      text: "Je lis ou écoute attentivement les consignes avant de commencer une tâche.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 26,
      dimension: "consignes",
      type: "likert",
      text: "Quand je ne comprends pas quelque chose, je pose des questions plutôt que de supposer.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 27,
      dimension: "consignes",
      type: "likert",
      text: "Je vérifie mon travail avant de le remettre pour m'assurer qu'il correspond à ce qui était demandé.",
      options: AFRI_SKILL_LIKERT,
    },

    // ── POSTURE PROFESSIONNELLE (3) ──
    {
      id: 28,
      dimension: "posture",
      type: "likert",
      text: "Je suis ponctuel(le), présentable et attentif(ve) à l'image que je renvoie dans un cadre professionnel.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 29,
      dimension: "posture",
      type: "likert",
      text: "Je fais preuve de respect envers mes collègues, supérieurs et clients, quelle que soit la situation.",
      options: AFRI_SKILL_LIKERT,
    },
    {
      id: 30,
      dimension: "posture",
      type: "likert",
      text: "Je prends mes engagements au sérieux et je tiens mes promesses même quand c'est difficile.",
      options: AFRI_SKILL_LIKERT,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
//  AFRI-SKILL — Niveaux et descriptions
// ─────────────────────────────────────────────────────────────────────────────

export const AFRI_SKILL_LEVELS: Record<AfriSkillLevel, { min: number; max: number; description: string; badge: string; color: string }> = {
  "Débutant": {
    min: 0, max: 40,
    description: "Vous débutez votre parcours professionnel. Des formations ciblées vous aideront à développer rapidement vos compétences de base.",
    badge: "🌱 Débutant",
    color: "#C2441D",
  },
  "En développement": {
    min: 41, max: 60,
    description: "Vous avez des bases solides mais encore des marges de progression importantes. Avec de la pratique et des formations courtes, vous évoluerez rapidement.",
    badge: "🌿 En développement",
    color: "#F5C23E",
  },
  "Opérationnel": {
    min: 61, max: 75,
    description: "Vous êtes prêt(e) à intégrer le marché du travail. Quelques axes ciblés vous permettront d'atteindre l'excellence.",
    badge: "⭐ Opérationnel",
    color: "#2EB88A",
  },
  "Confirmé": {
    min: 76, max: 100,
    description: "Vous présentez un excellent niveau de préparation professionnelle. Vous êtes prêt(e) à relever des défis complexes et à prendre des responsabilités.",
    badge: "🏆 Confirmé",
    color: "#E8813A",
  },
};

// Formations courtes recommandées par dimension
export const AFRI_SKILL_COURSES: Record<AfriSkillDimension, { title: string; platform: string; duration: string }[]> = {
  communication: [
    { title: "Prise de parole en public", platform: "Coursera", duration: "4h" },
    { title: "Rédaction professionnelle en français", platform: "FUN-MOOC", duration: "6h" },
  ],
  numerique: [
    { title: "Initiation à la bureautique (Word, Excel)", platform: "Google Digital Garage", duration: "8h" },
    { title: "Google Workspace pour débutants", platform: "Google Skillshop", duration: "3h" },
  ],
  organisation: [
    { title: "Gestion du temps et des priorités", platform: "LinkedIn Learning", duration: "3h" },
    { title: "GTD — Getting Things Done", platform: "Udemy", duration: "5h" },
  ],
  resolution: [
    { title: "Résolution créative de problèmes", platform: "Coursera", duration: "6h" },
    { title: "Design Thinking pour tous", platform: "IDEO U", duration: "8h" },
  ],
  apprentissage: [
    { title: "Apprendre à apprendre", platform: "Coursera", duration: "10h" },
    { title: "Mindset de croissance", platform: "YouTube FranceTravail", duration: "2h" },
  ],
  adaptabilite: [
    { title: "Gestion du stress et résilience", platform: "Calm / Headspace", duration: "4h" },
    { title: "Intelligence émotionnelle en entreprise", platform: "LinkedIn Learning", duration: "4h" },
  ],
  initiative: [
    { title: "Leadership et prise d'initiative", platform: "Coursera", duration: "6h" },
    { title: "Introduction à l'entrepreneuriat", platform: "FUN-MOOC", duration: "10h" },
  ],
  equipe: [
    { title: "Collaboration et travail en équipe", platform: "LinkedIn Learning", duration: "3h" },
    { title: "Gestion des conflits professionnels", platform: "Udemy", duration: "4h" },
  ],
  consignes: [
    { title: "Lecture rapide et compréhension écrite", platform: "Readlax", duration: "5h" },
    { title: "Méthode de travail efficace", platform: "FUN-MOOC", duration: "4h" },
  ],
  posture: [
    { title: "Image professionnelle et etiquette business", platform: "Coursera", duration: "4h" },
    { title: "Bien se présenter en entretien", platform: "Pôle Emploi en ligne", duration: "3h" },
  ],
};
