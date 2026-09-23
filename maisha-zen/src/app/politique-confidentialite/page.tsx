import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site Maisha Zen.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <PageHero eyebrow="Vos données" title="Politique de confidentialité" />
      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-ink/70">
          <div className="rounded-2xl border border-dashed border-bleu-gris/50 bg-creme-soft p-6 text-sm text-ink/60">
            Cette page est un modèle à compléter et à valider avant la mise en
            ligne définitive du site, en fonction des outils réellement utilisés
            (formulaire, statistiques, cookies, etc.).
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Données collectées</h2>
            <p className="mt-2 leading-relaxed">
              [À COMPLÉTER] Le formulaire de contact du site n&apos;envoie
              aucune donnée à un serveur : il ouvre votre messagerie
              habituelle avec un message pré-rempli. Si un service tiers
              (statistiques, newsletter, prise de rendez-vous en ligne) est
              ajouté ultérieurement, cette section devra être mise à jour.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Utilisation des données</h2>
            <p className="mt-2 leading-relaxed">
              [À COMPLÉTER] Préciser ici la finalité de toute collecte de
              données (prise de rendez-vous, réponse à une demande de
              contact, etc.) et la durée de conservation.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Vos droits</h2>
            <p className="mt-2 leading-relaxed">
              [À COMPLÉTER] Vous disposez d&apos;un droit d&apos;accès, de
              rectification et de suppression de vos données. Pour l&apos;exercer,
              contactez {siteConfig.name} à l&apos;adresse {siteConfig.contact.email}.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Cookies</h2>
            <p className="mt-2 leading-relaxed">
              [À COMPLÉTER] Ce site n&apos;utilise, en l&apos;état, aucun cookie de
              suivi. Cette section devra être mise à jour si un outil de mesure
              d&apos;audience est ajouté.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
