export type InfoPageKey =
  | 'about'
  | 'method'
  | 'referents'
  | 'team'
  | 'faq'
  | 'testimonials'
  | 'enterprise'
  | 'partners'
  | 'recruitment';

export type InfoPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; text: string }>;
  ctaLabel?: string;
  ctaTo?: string;
};

export const infoPages: Record<InfoPageKey, InfoPageContent> = {
  about: {
    eyebrow: 'Qui sommes-nous ?',
    title: 'La formation qui avance avec vous',
    intro: "CampusForma est une plateforme de formation en ligne pensée pour les apprenants et les professionnels qui veulent progresser sans mettre leur vie entre parenthèses.",
    sections: [
      { title: 'Notre mission', text: "Rendre des parcours utiles et certifiants accessibles où que vous soyez, avec une expérience simple sur ordinateur comme sur téléphone." },
      { title: 'Une approche concrète', text: "Nos contenus privilégient la pratique, la progression à votre rythme et l'accompagnement par des référents expérimentés." },
      { title: 'Plusieurs chemins pour évoluer', text: "Formations en ligne, bilan de compétences et validation des acquis de l'expérience : chacun peut choisir le parcours adapté à son objectif." },
    ],
    ctaLabel: 'Découvrir les formations',
    ctaTo: '/formations',
  },
  method: {
    eyebrow: 'Notre méthode',
    title: 'Un parcours clair, du choix à la certification',
    intro: "CampusForma structure l'apprentissage pour vous aider à avancer régulièrement et à transformer chaque étape en compétence utilisable.",
    sections: [
      { title: '1. Choisissez votre objectif', text: "Explorez le catalogue, les prérequis et le programme détaillé avant de vous engager." },
      { title: '2. Apprenez à votre rythme', text: "Suivez les modules en ligne depuis le support qui vous convient, y compris votre téléphone." },
      { title: '3. Pratiquez et échangez', text: "Consolidez les acquis grâce aux exercices et à l'accompagnement des référents." },
      { title: '4. Validez vos acquis', text: "Finalisez le parcours et obtenez la certification prévue lorsque les critères sont remplis." },
    ],
    ctaLabel: 'Choisir un parcours',
    ctaTo: '/formations',
  },
  referents: {
    eyebrow: 'Nos référents',
    title: 'Des professionnels proches du terrain',
    intro: "Les référents CampusForma apportent leur expertise métier et accompagnent la progression des apprenants.",
    sections: [
      { title: 'Dr. Amadou Diallo — Data Science & IA', text: "Expert en machine learning, Python et Big Data, avec quinze années d'expérience et un parcours de recherche à l'INRIA." },
      { title: 'Fatou Ndiaye — Marketing digital', text: "Consultante depuis dix ans en Afrique de l'Ouest, spécialisée en SEO, publicité en ligne, réseaux sociaux et analyse de données." },
      { title: 'Jean-Pierre Mensah — Développement web', text: "Développeur senior et formateur depuis douze ans, spécialisé en JavaScript, React, Node.js et technologies open source." },
    ],
    ctaLabel: 'Voir les formations',
    ctaTo: '/formations',
  },
  team: {
    eyebrow: 'Notre équipe',
    title: 'Une équipe réunie autour de votre progression',
    intro: "CampusForma associe expertise pédagogique, connaissance des métiers et accompagnement humain.",
    sections: [
      { title: 'Expertise pédagogique', text: "Les parcours sont organisés pour rendre les objectifs, les étapes et les résultats attendus faciles à comprendre." },
      { title: 'Expertise métier', text: "Nos référents relient les notions enseignées aux réalités professionnelles et aux compétences recherchées." },
      { title: 'Accompagnement', text: "Nos conseillers orientent les apprenants vers la formation, le bilan ou la VAE qui correspond à leur projet." },
    ],
    ctaLabel: 'Rencontrer nos référents',
    ctaTo: '/referents',
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Tout ce qu’il faut savoir avant de commencer',
    intro: "Retrouvez les réponses aux questions les plus fréquentes sur les formations, les paiements et l'accompagnement.",
    sections: [
      { title: 'Comment accéder à une formation ?', text: "Choisissez une formation dans le catalogue, consultez son programme puis utilisez le bouton d'inscription pour créer votre commande." },
      { title: 'Puis-je apprendre sur téléphone ?', text: "Oui. Le site et les parcours sont conçus pour rester accessibles sur mobile, tablette et ordinateur." },
      { title: 'Quels moyens de paiement sont proposés ?', text: "Le parcours de commande affiche les options disponibles, notamment Mobile Money, et enregistre votre demande de façon sécurisée." },
      { title: 'Comment fonctionne le bilan ou la VAE ?', text: "Chaque service suit un parcours détaillé. Un formulaire permet de demander un échange avec un conseiller." },
    ],
    ctaLabel: 'Nous contacter',
    ctaTo: '/contact',
  },
  testimonials: {
    eyebrow: 'Avis & témoignages',
    title: 'Ils ont avancé avec CampusForma',
    intro: "Des parcours différents, un même objectif : acquérir des compétences utiles et faire évoluer son projet professionnel.",
    sections: [
      { title: 'Aminata S. — Marketing', text: "« Grâce à CampusForma, j'ai pu obtenir ma certification en marketing digital tout en poursuivant mes études. »" },
      { title: 'Moussa T. — Entrepreneur', text: "« Les formations en gestion de projet m'ont permis de structurer mon entreprise. »" },
      { title: 'Fatou N. — Développement web', text: "« J'ai suivi le parcours Full Stack et trouvé un emploi deux mois après ma certification. »" },
      { title: 'Koffi M. — Chef de projet', text: "« La certification en gestion de projet m'a ouvert les portes d'un poste à responsabilité. »" },
    ],
    ctaLabel: 'Trouver ma formation',
    ctaTo: '/formations',
  },
  enterprise: {
    eyebrow: 'Entreprises',
    title: 'Développez les compétences de vos équipes',
    intro: "CampusForma accompagne les organisations qui souhaitent structurer un plan de formation adapté à leurs enjeux et à leurs contraintes.",
    sections: [
      { title: 'Parcours ciblés', text: "Sélection de formations selon les métiers, les niveaux et les objectifs de votre organisation." },
      { title: 'Organisation flexible', text: "Des parcours en ligne compatibles avec le rythme de travail et accessibles sur mobile." },
      { title: 'Suivi des besoins', text: "Un échange initial permet de cadrer la demande avant de proposer un accompagnement adapté." },
    ],
  },
  partners: {
    eyebrow: 'Partenariats',
    title: 'Construisons des parcours utiles ensemble',
    intro: "Vous êtes organisme de formation, expert métier, entreprise ou acteur de l'éducation ? Présentez-nous votre projet de collaboration.",
    sections: [
      { title: 'Contenus et expertise', text: "Co-création de contenus et mobilisation d'experts sur des compétences professionnelles concrètes." },
      { title: 'Diffusion de parcours', text: "Mise en valeur de formations pertinentes auprès d'un public qui souhaite évoluer." },
      { title: 'Projets sur mesure', text: "Étude de partenariats répondant aux besoins d'une organisation ou d'un secteur." },
    ],
  },
  recruitment: {
    eyebrow: 'Recrutement',
    title: 'Rejoignez l’aventure CampusForma',
    intro: "Nous sommes attentifs aux profils qui veulent rendre l'apprentissage plus accessible, concret et humain.",
    sections: [
      { title: 'Formateurs et experts', text: "Partagez une expertise métier et une expérience de transmission orientée vers la pratique." },
      { title: 'Pédagogie et accompagnement', text: "Aidez les apprenants à progresser grâce à des contenus clairs et un suivi attentif." },
      { title: 'Produit et technologie', text: "Contribuez à une expérience de formation fiable, simple et adaptée au mobile." },
    ],
  },
};

export const blogPosts = [
  {
    slug: 'choisir-formation-certifiante-en-ligne',
    title: 'Comment choisir une formation certifiante en ligne ?',
    excerpt: 'Objectifs, programme, rythme et accompagnement : les points à vérifier avant de commencer.',
    paragraphs: [
      "Commencez par définir le résultat attendu : changer de métier, consolider une compétence ou obtenir une certification. Cette décision permet d'écarter les parcours trop généraux.",
      "Consultez ensuite le programme, les prérequis et la durée. Un bon parcours indique clairement ce que vous saurez faire à la fin et comment vos acquis seront évalués.",
      "Enfin, vérifiez que le rythme, le support mobile et les possibilités d'accompagnement sont compatibles avec votre quotidien.",
    ],
  },
  {
    slug: 'preparer-validation-acquis-experience',
    title: 'Préparer sa validation des acquis de l’expérience',
    excerpt: 'Organiser ses preuves et présenter clairement les compétences acquises sur le terrain.',
    paragraphs: [
      "La VAE transforme l'expérience en preuves de compétences. La première étape consiste à choisir une certification cohérente avec les activités réellement exercées.",
      "Rassemblez attestations, fiches de poste, productions et exemples de situations professionnelles. Chaque pièce doit éclairer une compétence du référentiel visé.",
      "L'accompagnement aide à structurer le dossier, à expliciter les acquis et à préparer l'échange avec le jury.",
    ],
  },
  {
    slug: 'reussir-bilan-competences',
    title: 'Réussir son bilan de compétences',
    excerpt: 'Faire le point sur son parcours pour transformer une envie de changement en plan d’action.',
    paragraphs: [
      "Un bilan utile part de votre situation réelle : expériences, motivations, contraintes et envies. Il ne s'agit pas seulement de dresser une liste de qualités.",
      "L'investigation permet de faire émerger des pistes, puis de les confronter aux compétences à développer et aux réalités du projet.",
      "La synthèse doit aboutir à un plan concret, avec des étapes, des échéances et les éventuelles formations à suivre.",
    ],
  },
];
