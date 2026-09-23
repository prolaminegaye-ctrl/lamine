import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Maisha Zen.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero eyebrow="Informations légales" title="Mentions légales" />
      <Section>
        <div className="mx-auto max-w-3xl space-y-8 text-ink/70">
          <div className="rounded-2xl border border-dashed border-bleu-gris/50 bg-creme-soft p-6 text-sm text-ink/60">
            Cette page est un modèle à compléter. Elle doit être vérifiée et
            finalisée (idéalement avec un conseil juridique) avant la mise en
            ligne définitive du site, conformément à la réglementation en
            vigueur au Sénégal.
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Éditeur du site</h2>
            <p className="mt-2 leading-relaxed">
              Nom du cabinet : {siteConfig.legal.companyName}
              <br />
              Statut juridique : {siteConfig.legal.legalForm}
              <br />
              Numéro d&apos;enregistrement : {siteConfig.legal.registrationNumber}
              <br />
              Adresse : {siteConfig.contact.address.line1}, {siteConfig.contact.address.line2}
              <br />
              Téléphone : {siteConfig.contact.phone}
              <br />
              Email : {siteConfig.contact.email}
              <br />
              Directeur de la publication : {siteConfig.legal.publicationDirector}
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Hébergement</h2>
            <p className="mt-2 leading-relaxed">{siteConfig.legal.host}</p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Propriété intellectuelle</h2>
            <p className="mt-2 leading-relaxed">
              [À COMPLÉTER] L&apos;ensemble des contenus (textes, images, logo)
              présents sur ce site est la propriété de {siteConfig.name}, sauf
              mention contraire, et ne peut être reproduit sans autorisation.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-ink">Responsabilité</h2>
            <p className="mt-2 leading-relaxed">
              [À COMPLÉTER] Clause de limitation de responsabilité relative au
              contenu du site et à son utilisation.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
