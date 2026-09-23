// ---------------------------------------------------------------------------
// Configuration centrale du site Maisha Zen.
// Toute valeur marquée "[À COMPLÉTER]" est un PLACEHOLDER : elle doit être
// remplacée par une information réelle avant la mise en ligne définitive.
// Aucune donnée réelle (téléphone, email, adresse, prix, nom) n'a été
// inventée : ne rien publier sans avoir rempli ces champs.
// ---------------------------------------------------------------------------

export const siteConfig = {
  name: "Maisha Zen",
  tagline: "Cabinet de sophrologie à Saly, Sénégal",
  baseUrl: "https://www.maisha-zen.example", // [À COMPLÉTER] nom de domaine définitif

  description:
    "Maisha Zen est un cabinet de sophrologie à Saly, au Sénégal, dédié à la gestion du stress, à la relaxation et au bien-être. Séances individuelles et de groupe pour retrouver votre équilibre intérieur.",

  contact: {
    phone: "[À COMPLÉTER] Téléphone",
    phoneHref: "tel:+221000000000", // [À COMPLÉTER] numéro réel au format international
    whatsappNumber: "+221000000000", // [À COMPLÉTER] numéro WhatsApp réel (format international, sans espaces)
    email: "[À COMPLÉTER] Adresse email",
    emailHref: "mailto:contact@maisha-zen.example", // [À COMPLÉTER]
    address: {
      line1: "[À COMPLÉTER] Adresse (rue, quartier)",
      line2: "Saly, Sénégal",
      mapsQuery: "", // [À COMPLÉTER] laisser vide tant que l'adresse exacte n'est pas connue
    },
  },

  whatsappMessage:
    "Bonjour Maisha Zen, je souhaiterais avoir des renseignements / réserver une séance de sophrologie.",

  social: {
    instagram: "[À COMPLÉTER] identifiant Instagram", // ex: "@maishazen"
    instagramHref: "#", // [À COMPLÉTER] lien réel
    facebook: "[À COMPLÉTER] page Facebook",
    facebookHref: "#", // [À COMPLÉTER] lien réel
  },

  sophrologist: {
    name: "[Prénom NOM à compléter]",
    title: "Sophrologue certifiée · Fondatrice de Maisha Zen",
    bio: [
      "[À COMPLÉTER] Présentation de la sophrologue : parcours, formation, certifications, approche personnelle de la sophrologie.",
      "[À COMPLÉTER] Ce qui l'a menée à installer son cabinet à Saly et sa vision de l'accompagnement proposé.",
    ],
    photoAlt: "Portrait de la sophrologue de Maisha Zen — photo à ajouter",
  },

  hours: {
    label: "[À COMPLÉTER] Horaires d'ouverture (ex : Lun–Sam, 9h–18h, sur rendez-vous)",
  },

  nav: [
    { href: "/", label: "Accueil" },
    { href: "/sophrologie", label: "La sophrologie" },
    { href: "/seances", label: "Nos séances" },
    { href: "/a-propos", label: "À propos" },
    { href: "/contact", label: "Contact" },
  ],

  seances: [
    {
      id: "bilan-initial",
      name: "Bilan initial",
      duration: "[À COMPLÉTER] Durée (ex : 1h)",
      price: "[À COMPLÉTER] Tarif",
      description:
        "Un premier échange approfondi pour comprendre vos besoins, vos objectifs et construire ensemble un accompagnement sur mesure.",
      highlight: false,
    },
    {
      id: "seance-individuelle",
      name: "Séance individuelle",
      duration: "[À COMPLÉTER] Durée (ex : 45 min)",
      price: "[À COMPLÉTER] Tarif",
      description:
        "Une séance en tête-à-tête, rythmée par la respiration, la détente et la visualisation, adaptée à votre rythme.",
      highlight: true,
    },
    {
      id: "seance-groupe",
      name: "Séance de groupe",
      duration: "[À COMPLÉTER] Durée (ex : 1h)",
      price: "[À COMPLÉTER] Tarif par personne",
      description:
        "Un moment collectif de relâchement et de respiration partagée, dans un cadre bienveillant, en petit groupe.",
      highlight: false,
    },
    {
      id: "forfait-decouverte",
      name: "Forfait découverte",
      duration: "[À COMPLÉTER] Nombre de séances (ex : 3 séances)",
      price: "[À COMPLÉTER] Tarif du forfait",
      description:
        "Un parcours d'initiation pensé pour découvrir la sophrologie à votre rythme et en ressentir les premiers effets.",
      highlight: false,
    },
  ],

  legal: {
    companyName: "[À COMPLÉTER] Raison sociale / nom du cabinet",
    legalForm: "[À COMPLÉTER] Statut juridique (ex : entreprise individuelle)",
    registrationNumber: "[À COMPLÉTER] Numéro d'enregistrement / NINEA (Sénégal)",
    publicationDirector: "[À COMPLÉTER] Directeur de publication",
    host: "[À COMPLÉTER] Hébergeur du site",
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function whatsappHref(number: string = siteConfig.contact.whatsappNumber, message: string = siteConfig.whatsappMessage) {
  const digits = number.replace(/[^\d+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
