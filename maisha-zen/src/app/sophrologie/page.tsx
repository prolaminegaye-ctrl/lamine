import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "La sophrologie",
  description:
    "Qu'est-ce que la sophrologie ? Découvrez ses bienfaits, son déroulement et à qui elle s'adresse, avec Maisha Zen, cabinet de sophrologie à Saly, Sénégal.",
};

const bienfaits = [
  "Réduire le stress et les tensions du quotidien",
  "Améliorer la qualité du sommeil",
  "Développer la confiance en soi",
  "Mieux gérer les émotions",
  "Retrouver énergie et vitalité",
  "Accompagner les périodes de transition",
];

const etapes = [
  {
    title: "L'échange",
    text: "Chaque séance commence par un temps de parole, pour accueillir ce que vous traversez et ajuster l'accompagnement.",
  },
  {
    title: "La respiration",
    text: "Des exercices respiratoires simples installent progressivement le calme dans le corps et l'esprit.",
  },
  {
    title: "La relaxation dynamique",
    text: "Une succession de mouvements doux, debout ou assis, associés à la respiration et à la conscience du corps.",
  },
  {
    title: "L'intégration",
    text: "Un temps de partage, à l'oral ou par écrit, pour ancrer ce qui a été vécu pendant la séance.",
  },
];

export default function SophrologiePage() {
  return (
    <>
      <PageHero
        eyebrow="Comprendre la sophrologie"
        title="Une méthode douce au service de votre équilibre"
        description="La sophrologie est une pratique psychocorporelle qui associe respiration, relaxation et visualisation positive pour renforcer le lien entre le corps et l'esprit."
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="font-heading text-3xl text-ink">Qu&apos;est-ce que la sophrologie ?</h2>
            <p className="mt-6 leading-relaxed text-ink/70">
              Créée dans les années 1960, la sophrologie est une méthode
              d&apos;accompagnement qui s&apos;appuie sur des techniques de
              respiration, de relaxation dynamique et de visualisation. Elle vise à
              développer une meilleure conscience de soi, à apaiser le mental et à
              mobiliser ses ressources positives face aux difficultés du quotidien.
              Ce n&apos;est ni une thérapie, ni une pratique médicale : c&apos;est un
              accompagnement complémentaire, centré sur le bien-être.
            </p>
          </FadeIn>
        </div>
      </Section>

      <Section tone="soft">
        <FadeIn>
          <h2 className="font-heading text-center text-3xl text-ink">Les bienfaits</h2>
        </FadeIn>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bienfaits.map((b, i) => (
            <FadeIn key={b} delay={i * 0.08}>
              <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-creme-soft px-6 py-5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-terracotta" />
                <span className="text-sm leading-relaxed text-ink/80">{b}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="font-heading text-center text-3xl text-ink">
            Comment se déroule une séance ?
          </h2>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {etapes.map((e, i) => (
            <FadeIn key={e.title} delay={i * 0.1}>
              <Card className="h-full">
                <h3 className="font-heading text-lg text-terracotta">{e.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{e.text}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section tone="lavande">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl text-ink">À qui s&apos;adresse-t-elle ?</h2>
            <p className="mt-6 leading-relaxed text-ink/70">
              À toute personne souhaitant mieux gérer son stress, retrouver un
              sommeil apaisé, traverser une période de transition ou simplement
              prendre soin de son équilibre intérieur — quel que soit son âge ou son
              expérience de la relaxation.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/seances">Découvrir nos séances</Button>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
