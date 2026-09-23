import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";
import SeanceCard from "@/components/SeanceCard";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nos séances",
  description:
    "Découvrez les séances de sophrologie proposées par Maisha Zen à Saly : bilan initial, séance individuelle, séance de groupe et forfait découverte.",
};

export default function SeancesPage() {
  return (
    <>
      <PageHero
        eyebrow="Formules & tarifs"
        title="Nos séances"
        description="Chaque parcours est adapté à vos besoins, à votre rythme. Voici un aperçu de nos formules — n'hésitez pas à nous contacter pour construire ensemble votre accompagnement."
      />

      <Section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.seances.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.1}>
              <SeanceCard seance={s} />
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <p className="mt-10 text-center text-xs text-ink/50">
            Les tarifs et durées ci-dessus sont des exemples de présentation
            (placeholders) — ils doivent être remplacés par les informations
            réelles du cabinet avant publication.
          </p>
        </FadeIn>
      </Section>

      <Section tone="teal">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl text-ink">
              Une question sur nos séances ?
            </h2>
            <p className="mt-6 leading-relaxed text-ink/70">
              Contactez-nous pour toute question sur le déroulé, les tarifs ou pour
              réserver votre créneau.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact">Nous contacter</Button>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
