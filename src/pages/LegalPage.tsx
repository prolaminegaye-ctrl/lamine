import PageHero from '@/components/content/PageHero';

type LegalType = 'mentions' | 'privacy' | 'terms';

const pages = {
  mentions: {
    eyebrow: 'Mentions légales',
    title: 'Informations légales',
    intro: 'Les informations essentielles concernant le site CampusForma.',
    sections: [
      ['Éditeur', 'CampusForma édite cette plateforme de formation en ligne. Pour toute demande relative au site, utilisez la page Contact.'],
      ['Hébergement', 'Le site est déployé sur Vercel. Les services de données et d’authentification sont fournis par Supabase.'],
      ['Contenus', 'Les textes, éléments graphiques et contenus pédagogiques du site sont protégés. Toute réutilisation nécessite une autorisation préalable.'],
    ],
  },
  privacy: {
    eyebrow: 'Confidentialité',
    title: 'Politique de confidentialité',
    intro: 'Comment les informations transmises à CampusForma sont utilisées.',
    sections: [
      ['Données collectées', 'Le site enregistre les informations nécessaires à votre compte, vos demandes de contact, vos demandes de bilan ou VAE et vos commandes.'],
      ['Finalités', 'Ces données servent à fournir le service demandé, assurer le suivi des inscriptions et répondre aux messages.'],
      ['Sécurité et droits', 'L’accès aux données est limité par des règles de sécurité. Vous pouvez demander l’accès, la rectification ou la suppression de vos informations depuis la page Contact.'],
    ],
  },
  terms: {
    eyebrow: 'Conditions d’utilisation',
    title: 'Conditions générales d’utilisation',
    intro: 'Les règles principales applicables lors de l’utilisation de CampusForma.',
    sections: [
      ['Accès au service', 'Vous vous engagez à transmettre des informations exactes lors de la création d’un compte, d’une demande ou d’une commande.'],
      ['Formations et commandes', 'Le programme, les prérequis, le prix et les modalités affichés sur chaque formation doivent être consultés avant toute inscription.'],
      ['Usage responsable', 'Toute tentative de perturbation du service, d’accès non autorisé ou de reproduction abusive des contenus est interdite.'],
    ],
  },
} as const;

export default function LegalPage({ type }: { type: LegalType }) {
  const page = pages[type];
  return (
    <main>
      <PageHero eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <section className="container-cf max-w-[820px] py-14 sm:py-20">
        {page.sections.map(([title, text]) => (
          <div key={title} className="mb-10">
            <h2 className="font-heading text-2xl font-bold">{title}</h2>
            <p className="mt-3 leading-relaxed" style={{ color: 'var(--cf-gray-medium)' }}>{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
