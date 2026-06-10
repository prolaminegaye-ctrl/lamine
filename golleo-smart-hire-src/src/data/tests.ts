export type Question = {
  id: number;
  text: string;
  category: string;
};

export type TestDefinition = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  questions: Question[];
  categories: string[];
  categoryLabels: Record<string, string>;
};

// RIASEC — 36 questions, 6 per type
export const RIASEC_TEST: TestDefinition = {
  id: "riasec",
  title: "Test RIASEC",
  subtitle: "Découvrez votre profil professionnel selon la théorie de Holland",
  duration: "10–15 min",
  categories: ["R", "I", "A", "S", "E", "C"],
  categoryLabels: {
    R: "Réaliste",
    I: "Investigateur",
    A: "Artistique",
    S: "Social",
    E: "Entreprenant",
    C: "Conventionnel",
  },
  questions: [
    { id: 1, text: "J'aime travailler avec des outils, des machines ou de l'équipement physique", category: "R" },
    { id: 2, text: "Je préfère les activités concrètes et pratiques aux tâches abstraites", category: "R" },
    { id: 3, text: "J'apprécie les travaux manuels ou techniques nécessitant de l'adresse", category: "R" },
    { id: 4, text: "Je me sens à l'aise pour réparer, construire ou assembler des objets", category: "R" },
    { id: 5, text: "J'aime travailler en plein air ou dans des environnements physiques", category: "R" },
    { id: 6, text: "La précision technique et la rigueur pratique me correspondent naturellement", category: "R" },

    { id: 7, text: "J'adore analyser et résoudre des problèmes complexes de manière méthodique", category: "I" },
    { id: 8, text: "La recherche, l'observation et l'expérimentation m'attirent naturellement", category: "I" },
    { id: 9, text: "Je me passionne pour comprendre en profondeur le fonctionnement des choses", category: "I" },
    { id: 10, text: "J'apprécie travailler de façon indépendante sur des projets intellectuels", category: "I" },
    { id: 11, text: "J'aime approfondir mes connaissances dans des domaines très spécialisés", category: "I" },
    { id: 12, text: "Les sciences, la logique et les mathématiques m'ont toujours attiré", category: "I" },

    { id: 13, text: "J'aime créer des œuvres originales et esthétiquement soignées", category: "A" },
    { id: 14, text: "L'art, la musique, l'écriture, le design ou la photographie m'attirent", category: "A" },
    { id: 15, text: "J'exprime facilement mes émotions et idées de façon créative", category: "A" },
    { id: 16, text: "Je préfère les environnements flexibles et peu structurés qui laissent place à l'innovation", category: "A" },
    { id: 17, text: "Mon imagination et ma sensibilité esthétique sont des atouts que je valorise", category: "A" },
    { id: 18, text: "J'apprécie les projets qui laissent de la place à l'improvisation et à la créativité", category: "A" },

    { id: 19, text: "J'aime aider les autres à surmonter leurs difficultés et à progresser", category: "S" },
    { id: 20, text: "Le travail en équipe et la collaboration me motivent et m'épanouissent", category: "S" },
    { id: 21, text: "J'ai naturellement de l'empathie, de l'écoute et de la bienveillance", category: "S" },
    { id: 22, text: "L'enseignement, le coaching, le soin ou l'accompagnement m'attirent", category: "S" },
    { id: 23, text: "Je me sens profondément utile quand je contribue au bien-être des autres", category: "S" },
    { id: 24, text: "Les relations humaines sont au cœur des activités professionnelles que je préfère", category: "S" },

    { id: 25, text: "J'aime convaincre, négocier et influencer les décisions des autres", category: "E" },
    { id: 26, text: "Diriger un groupe, un projet ou une entreprise me plaît et m'anime", category: "E" },
    { id: 27, text: "J'ai le goût du risque, de l'ambition et des grands défis", category: "E" },
    { id: 28, text: "La vente, le marketing, le commerce ou l'entrepreneuriat m'attirent", category: "E" },
    { id: 29, text: "J'aime prendre des initiatives et trancher rapidement dans les situations complexes", category: "E" },
    { id: 30, text: "La compétition, les enjeux importants et les défis stimulants m'energisent", category: "E" },

    { id: 31, text: "J'aime organiser, classer et structurer les informations avec méthode", category: "C" },
    { id: 32, text: "Le respect des règles, des procédures et des standards me convient bien", category: "C" },
    { id: 33, text: "Je préfère les tâches bien définies avec des objectifs clairs et mesurables", category: "C" },
    { id: 34, text: "La précision, la rigueur et l'attention aux détails sont des qualités essentielles", category: "C" },
    { id: 35, text: "J'aime travailler dans des environnements bien organisés et prévisibles", category: "C" },
    { id: 36, text: "La gestion administrative, comptable ou financière m'intéresse", category: "C" },
  ],
};

// IKIGAI — 20 questions, 5 per dimension
export const IKIGAI_TEST: TestDefinition = {
  id: "ikigai",
  title: "Test IKIGAI",
  subtitle: "Trouvez votre raison d'être professionnelle et vos métiers de prédilection",
  duration: "8–12 min",
  categories: ["passion", "talent", "mission", "vocation"],
  categoryLabels: {
    passion: "Ce que j'aime",
    talent: "Ce en quoi je suis doué",
    mission: "Ce dont le monde a besoin",
    vocation: "Ce pour quoi on peut me payer",
  },
  questions: [
    { id: 1, text: "Il existe des activités qui me font perdre la notion du temps tant elles m'absorbent", category: "passion" },
    { id: 2, text: "Certains sujets me passionnent au point que je veux tout apprendre sur eux", category: "passion" },
    { id: 3, text: "Je sais clairement quelles activités professionnelles me rendent vraiment heureux", category: "passion" },
    { id: 4, text: "J'ai des activités créatives, intellectuelles ou physiques qui me ressourcent profondément", category: "passion" },
    { id: 5, text: "Je suis capable d'identifier avec précision mes vraies passions personnelles et professionnelles", category: "passion" },

    { id: 6, text: "Je dispose de compétences spécifiques régulièrement reconnues et valorisées par mon entourage", category: "talent" },
    { id: 7, text: "Certaines tâches me semblent naturelles et faciles là où d'autres les trouvent difficiles", category: "talent" },
    { id: 8, text: "Des personnes me sollicitent régulièrement pour mon expertise ou mes conseils dans un domaine", category: "talent" },
    { id: 9, text: "J'apprends facilement et rapidement dans certains domaines qui correspondent à mon profil", category: "talent" },
    { id: 10, text: "Je suis conscient de mes forces distinctives et de ce qui me différencie professionnellement", category: "talent" },

    { id: 11, text: "Je me sens concerné par un problème ou une cause dans la société ou mon environnement", category: "mission" },
    { id: 12, text: "Je sais comment mes compétences pourraient concrètement aider les autres ou résoudre des problèmes", category: "mission" },
    { id: 13, text: "J'ai une vision de la contribution positive que je veux apporter au monde ou à mon secteur", category: "mission" },
    { id: 14, text: "Les enjeux humains, sociaux, environnementaux ou culturels me tiennent vraiment à cœur", category: "mission" },
    { id: 15, text: "Je pense souvent à l'impact que mon travail pourrait avoir sur les autres et sur la société", category: "mission" },

    { id: 16, text: "Je connais des domaines professionnels dans lesquels mes compétences sont valorisées sur le marché", category: "vocation" },
    { id: 17, text: "J'identifie des opportunités économiques concrètes dans mes domaines d'intérêt et d'expertise", category: "vocation" },
    { id: 18, text: "Certaines de mes compétences ont déjà généré des revenus ou pourraient être monétisées", category: "vocation" },
    { id: 19, text: "Je vois clairement des secteurs porteurs qui correspondent à mon profil professionnel", category: "vocation" },
    { id: 20, text: "Je pense pouvoir construire une activité professionnelle économiquement viable autour de mes talents", category: "vocation" },
  ],
};

// Entrepreneur Profile — 30 questions, 10 traits
export const ENTREPRENEUR_TEST: TestDefinition = {
  id: "entrepreneur_profile",
  title: "Profil d'Entrepreneur",
  subtitle: "Évaluez vos aptitudes entrepreneuriales et votre modèle business idéal",
  duration: "10–15 min",
  categories: ["autonomie", "risque", "resilience", "leadership", "commercial", "vision", "creativite", "organisation", "perseverance", "confiance"],
  categoryLabels: {
    autonomie: "Autonomie",
    risque: "Prise de risque",
    resilience: "Résilience",
    leadership: "Leadership",
    commercial: "Sens commercial",
    vision: "Vision stratégique",
    creativite: "Créativité",
    organisation: "Organisation",
    perseverance: "Persévérance",
    confiance: "Confiance en soi",
  },
  questions: [
    { id: 1, text: "Je préfère prendre mes propres décisions plutôt que d'attendre des instructions", category: "autonomie" },
    { id: 2, text: "Je suis à l'aise pour gérer mon temps et mes priorités sans supervision", category: "autonomie" },
    { id: 3, text: "L'indépendance et la liberté professionnelles sont des priorités fondamentales pour moi", category: "autonomie" },

    { id: 4, text: "Je suis prêt à investir mes économies dans un projet en lequel je crois", category: "risque" },
    { id: 5, text: "L'incertitude inhérente à un projet entrepreneurial ne m'effraie pas, elle me stimule", category: "risque" },
    { id: 6, text: "J'accepte la possibilité d'échouer comme une étape normale d'apprentissage", category: "risque" },

    { id: 7, text: "Face aux obstacles, je trouve généralement des solutions plutôt que d'abandonner", category: "resilience" },
    { id: 8, text: "Les critiques et les refus me motivent davantage qu'ils ne me découragent", category: "resilience" },
    { id: 9, text: "Je rebondis rapidement après un échec, une déception ou une période difficile", category: "resilience" },

    { id: 10, text: "J'arrive naturellement à fédérer des personnes autour d'une vision ou d'une idée", category: "leadership" },
    { id: 11, text: "Je suis à l'aise pour motiver, orienter et responsabiliser les membres d'une équipe", category: "leadership" },
    { id: 12, text: "J'ai déjà pris des initiatives pour organiser ou diriger un groupe vers un objectif commun", category: "leadership" },

    { id: 13, text: "Je n'ai pas de difficulté à présenter et vendre mes idées avec conviction", category: "commercial" },
    { id: 14, text: "La prospection, la négociation ou la relation client ne m'intimident pas", category: "commercial" },
    { id: 15, text: "Je comprends les mécanismes fondamentaux du commerce, de la persuasion et de la valeur", category: "commercial" },

    { id: 16, text: "J'anticipe facilement les tendances et les opportunités qui émergent sur le marché", category: "vision" },
    { id: 17, text: "Je suis capable de définir une direction stratégique claire sur plusieurs années", category: "vision" },
    { id: 18, text: "Je sais prendre du recul pour voir les situations dans leur globalité plutôt que dans leur détail", category: "vision" },

    { id: 19, text: "Je génère régulièrement des idées nouvelles et innovantes pour résoudre des problèmes", category: "creativite" },
    { id: 20, text: "J'aime trouver des approches originales là où d'autres reproduisent ce qui existe déjà", category: "creativite" },
    { id: 21, text: "L'innovation, la différenciation et la disruption font partie de mes réflexes naturels", category: "creativite" },

    { id: 22, text: "Je suis capable de structurer un projet en étapes concrètes, réalistes et planifiées", category: "organisation" },
    { id: 23, text: "Je respecte mes engagements et tiens mes délais même sans pression externe", category: "organisation" },
    { id: 24, text: "Je gère efficacement plusieurs projets ou priorités en parallèle", category: "organisation" },

    { id: 25, text: "Je maintiens mes efforts sur le long terme même quand les résultats tardent à venir", category: "perseverance" },
    { id: 26, text: "Je ne renonce pas facilement à un objectif important une fois que je m'y suis engagé", category: "perseverance" },
    { id: 27, text: "La patience et la constance dans l'effort sont des qualités que mes proches me reconnaissent", category: "perseverance" },

    { id: 28, text: "Je crois profondément en mes capacités à réussir un projet ambitieux", category: "confiance" },
    { id: 29, text: "Je défends mes convictions avec assurance face à des interlocuteurs sceptiques ou critiques", category: "confiance" },
    { id: 30, text: "Je me sens pleinement légitime pour me lancer et réussir dans une activité entrepreneuriale", category: "confiance" },
  ],
};

// Project Maturity — 24 questions, 6 areas
export const PROJECT_TEST: TestDefinition = {
  id: "project_maturity",
  title: "Maturité de Projet",
  subtitle: "Évaluez le niveau de préparation de votre projet entrepreneurial",
  duration: "8–10 min",
  categories: ["vision", "marche", "financement", "competences", "strategie", "viabilite"],
  categoryLabels: {
    vision: "Vision & Concept",
    marche: "Marché & Clients",
    financement: "Financement",
    competences: "Compétences",
    strategie: "Stratégie",
    viabilite: "Viabilité",
  },
  questions: [
    { id: 1, text: "J'ai une description claire, précise et convaincante de mon projet ou de mon activité", category: "vision" },
    { id: 2, text: "Je connais la valeur ajoutée unique et distinctive que mon projet apporte au marché", category: "vision" },
    { id: 3, text: "J'ai défini des objectifs précis à court, moyen et long terme pour mon projet", category: "vision" },
    { id: 4, text: "Ma vision entrepreneuriale est partagée et comprise par mon entourage proche", category: "vision" },

    { id: 5, text: "J'ai identifié précisément ma cible de clients et leurs besoins réels", category: "marche" },
    { id: 6, text: "J'ai réalisé une étude ou une analyse du marché sur lequel je veux me positionner", category: "marche" },
    { id: 7, text: "Je connais mes principaux concurrents et sais comment m'en différencier clairement", category: "marche" },
    { id: 8, text: "J'ai validé mon concept auprès de potentiels clients ou utilisateurs réels", category: "marche" },

    { id: 9, text: "J'ai estimé de façon réaliste le budget nécessaire pour lancer mon activité", category: "financement" },
    { id: 10, text: "J'ai identifié des sources de financement adaptées à mon projet", category: "financement" },
    { id: 11, text: "Je dispose d'un apport personnel, de partenaires ou d'investisseurs potentiels", category: "financement" },
    { id: 12, text: "J'ai construit ou ébauché un business model économiquement cohérent", category: "financement" },

    { id: 13, text: "Je maîtrise les compétences clés requises pour exercer mon activité efficacement", category: "competences" },
    { id: 14, text: "J'ai identifié les compétences qui me manquent et des moyens concrets pour les acquérir", category: "competences" },
    { id: 15, text: "Mon réseau professionnel peut activement m'aider à développer mon projet", category: "competences" },
    { id: 16, text: "J'ai déjà expérimenté ou testé concrètement certains aspects de mon activité", category: "competences" },

    { id: 17, text: "J'ai un plan d'action structuré avec des étapes concrètes et des échéances", category: "strategie" },
    { id: 18, text: "J'ai réfléchi à ma stratégie commerciale, marketing et de communication", category: "strategie" },
    { id: 19, text: "J'ai identifié les partenaires, fournisseurs ou collaborateurs clés nécessaires", category: "strategie" },
    { id: 20, text: "J'ai réfléchi à la structure juridique, administrative et organisationnelle adaptée", category: "strategie" },

    { id: 21, text: "J'ai réalisé une estimation de mes revenus et charges sur les 12 à 24 premiers mois", category: "viabilite" },
    { id: 22, text: "Mon projet peut atteindre la rentabilité dans un délai raisonnable et planifié", category: "viabilite" },
    { id: 23, text: "J'ai évalué les principaux risques de mon projet et prévu des plans de contingence", category: "viabilite" },
    { id: 24, text: "Mon activité peut rester viable même dans des conditions économiques difficiles", category: "viabilite" },
  ],
};

export const PERSONALITY_TEST: TestDefinition = {
  id: "personality",
  title: "Personnalité Professionnelle",
  subtitle: "Analysez vos traits de personnalité et vos soft skills professionnels",
  duration: "8–12 min",
  categories: ["leadership", "communication", "adaptabilite", "autonomie", "motivation", "stress", "organisation", "creativite"],
  categoryLabels: {
    leadership: "Leadership",
    communication: "Communication",
    adaptabilite: "Adaptabilité",
    autonomie: "Autonomie",
    motivation: "Motivation",
    stress: "Gestion du stress",
    organisation: "Organisation",
    creativite: "Créativité",
  },
  questions: [
    { id: 1, text: "Je prends naturellement l'initiative dans des situations ambiguës ou sans leadership clair", category: "leadership" },
    { id: 2, text: "Je sais fédérer un groupe et créer une dynamique collective positive", category: "leadership" },
    { id: 3, text: "Je me porte volontaire pour représenter mon équipe ou défendre ses intérêts", category: "leadership" },

    { id: 4, text: "Je m'exprime clairement et avec aisance, à l'écrit comme à l'oral", category: "communication" },
    { id: 5, text: "Je sais adapter mon discours à mon interlocuteur, qu'il soit expert ou novice", category: "communication" },
    { id: 6, text: "J'écoute activement et reformule ce que j'entends pour m'assurer de bien comprendre", category: "communication" },

    { id: 7, text: "Je m'adapte facilement et rapidement à des situations nouvelles ou imprévues", category: "adaptabilite" },
    { id: 8, text: "Le changement, même soudain, est une opportunité plutôt qu'un problème pour moi", category: "adaptabilite" },
    { id: 9, text: "Je suis à l'aise pour apprendre de nouvelles méthodes ou de nouveaux outils", category: "adaptabilite" },

    { id: 10, text: "Je travaille efficacement sans avoir besoin d'être constamment supervisé ou guidé", category: "autonomie" },
    { id: 11, text: "Je sais me fixer des objectifs clairs et m'organiser pour les atteindre seul", category: "autonomie" },
    { id: 12, text: "Je prends des décisions importantes sans nécessairement consulter ma hiérarchie", category: "autonomie" },

    { id: 13, text: "J'ai une vision claire de ce qui me motive profondément dans mon travail", category: "motivation" },
    { id: 14, text: "Je reste énergique et engagé même sur des projets longs ou difficiles", category: "motivation" },
    { id: 15, text: "Mon enthousiasme et mon énergie sont communicatifs et motivent mon entourage", category: "motivation" },

    { id: 16, text: "Je garde mon calme et ma lucidité dans les situations stressantes ou sous pression", category: "stress" },
    { id: 17, text: "Je dispose de méthodes efficaces pour gérer mon niveau de stress", category: "stress" },
    { id: 18, text: "Les situations d'urgence ou les délais serrés ne nuisent pas significativement à ma performance", category: "stress" },

    { id: 19, text: "Je planifie mes tâches et respecte mes engagements avec rigueur", category: "organisation" },
    { id: 20, text: "Je priorise efficacement mes activités selon leur importance et leur urgence", category: "organisation" },
    { id: 21, text: "Mon espace de travail et mes outils sont toujours bien organisés et à jour", category: "organisation" },

    { id: 22, text: "Je génère régulièrement des idées nouvelles ou des solutions innovantes", category: "creativite" },
    { id: 23, text: "Je remets en question les méthodes établies pour proposer de meilleures approches", category: "creativite" },
    { id: 24, text: "L'improvisation et l'expérimentation font partie de mon mode de fonctionnement naturel", category: "creativite" },
  ],
};

// Career recommendations by RIASEC top profile
export const RIASEC_CAREERS: Record<string, { careers: string[]; formations: string[]; description: string }> = {
  RI: {
    careers: ["Ingénieur R&D", "Chercheur scientifique", "Ingénieur système", "Architecte logiciel"],
    formations: ["École d'ingénieurs", "Master Sciences appliquées", "Doctorat", "BTS Informatique"],
    description: "Profil technique et analytique, à l'aise avec les défis scientifiques et technologiques.",
  },
  RA: {
    careers: ["Designer industriel", "Architecte", "Technicien audiovisuel", "Infographiste 3D"],
    formations: ["École des Beaux-Arts", "BTS Design", "Architecture", "Arts Appliqués"],
    description: "Profil alliant créativité et sens pratique, pour des métiers à la croisée du technique et de l'esthétique.",
  },
  IR: {
    careers: ["Médecin", "Pharmacien", "Géologue", "Biologiste", "Chimiste"],
    formations: ["PACES / Médecine", "Pharmacie", "Master Sciences de la vie", "Géologie"],
    description: "Profil scientifique rigoureux, attiré par la recherche, l'analyse et la résolution de problèmes complexes.",
  },
  IA: {
    careers: ["Psychologue", "Chercheur en sciences humaines", "Philosophe", "Data Scientist"],
    formations: ["Psychologie", "Sciences humaines", "Philosophie", "Master Data Science"],
    description: "Profil intellectuel et créatif, attiré par la compréhension humaine et les approches innovantes.",
  },
  IS: {
    careers: ["Médecin généraliste", "Psychologue clinicien", "Conseiller d'orientation", "Chercheur social"],
    formations: ["Médecine", "Psychologie", "Sciences de l'éducation", "Travail social"],
    description: "Profil analytique et empathique, orienté vers la compréhension et l'aide aux personnes.",
  },
  AS: {
    careers: ["Éducateur artistique", "Thérapeute par l'art", "Animateur culturel", "Formateur créatif"],
    formations: ["Éducation artistique", "Art-thérapie", "Animation socioculturelle", "Métiers du spectacle"],
    description: "Profil alliant créativité et sens du service, idéal pour transmettre et créer avec les autres.",
  },
  AE: {
    careers: ["Directeur artistique", "Responsable communication", "Chef de projet créatif", "Entrepreneur culturel"],
    formations: ["École de commerce créative", "Communication", "Marketing créatif", "Management culturel"],
    description: "Profil créatif et ambitieux, capable de développer des projets artistiques avec une vision business.",
  },
  SE: {
    careers: ["Responsable RH", "Consultant en recrutement", "Coach professionnel", "Commercial grands comptes"],
    formations: ["Ressources Humaines", "Management", "École de commerce", "Coaching professionnel"],
    description: "Profil humain et ambitieux, excellent dans les rôles de développement des personnes et des affaires.",
  },
  SI: {
    careers: ["Médecin", "Orthophoniste", "Éducateur spécialisé", "Travailleur social", "Sage-femme"],
    formations: ["Médecine", "Orthophonie", "Éducation spécialisée", "DEASS"],
    description: "Profil bienveillant et analytique, orienté vers le soin, le développement humain et l'accompagnement.",
  },
  EC: {
    careers: ["Directeur commercial", "Entrepreneur", "Responsable achats", "Manager de projet"],
    formations: ["École de commerce", "MBA", "Management", "Gestion d'entreprise"],
    description: "Profil ambitieux et structuré, idéal pour les rôles de direction, de gestion et de développement.",
  },
  CE: {
    careers: ["Comptable", "Contrôleur de gestion", "Auditeur", "Responsable administratif"],
    formations: ["DCG", "DSCG", "BTS Comptabilité", "Master Finance"],
    description: "Profil rigoureux et ambitieux, excellent dans les fonctions de gestion, audit et direction financière.",
  },
  RC: {
    careers: ["Technicien de maintenance", "Opérateur de production", "Technicien qualité", "Logisticien"],
    formations: ["BTS Maintenance", "BTS Logistique", "Licence Pro Industries", "CAP/BEP technique"],
    description: "Profil technique et méthodique, à l'aise dans les environnements industriels et opérationnels.",
  },
};

// Business models for Entrepreneur
export const ENTREPRENEUR_BUSINESS_MODELS = [
  { id: "freelance", label: "Freelance / Conseil", traits: ["autonomie", "commercial", "organisation"] },
  { id: "startup", label: "Startup Tech", traits: ["vision", "creativite", "risque", "leadership"] },
  { id: "ecommerce", label: "E-commerce", traits: ["commercial", "organisation", "vision"] },
  { id: "agence", label: "Agence / Studio", traits: ["creativite", "commercial", "leadership"] },
  { id: "saas", label: "SaaS / Logiciel", traits: ["vision", "creativite", "perseverance", "organisation"] },
  { id: "consulting", label: "Consulting / Expertise", traits: ["commercial", "autonomie", "confiance"] },
  { id: "franchise", label: "Franchise", traits: ["organisation", "commercial", "risque"] },
  { id: "artisanat", label: "Artisanat / Métier de bouche", traits: ["autonomie", "perseverance", "organisation"] },
  { id: "social", label: "Entreprise Sociale / Impact", traits: ["leadership", "vision", "perseverance"] },
  { id: "local", label: "Commerce Local / Services", traits: ["commercial", "resilience", "organisation"] },
];
