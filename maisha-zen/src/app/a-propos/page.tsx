import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import FadeIn from "@/components/FadeIn";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez l'histoire de Maisha Zen, cabinet de sophrologie à Saly, et la philosophie de sa fondatrice.",
};

const valeurs = [
  {
    title: "Écoute",
    text: "Chaque personne est accueillie dans sa singularité, sans jugement, avec bienveillance.",
  },
  {
    title: "Douceur",
    text: "Une approche progressive, respectueuse du rythme de chacun.",
  },
  {
    title: "Présence",
    text: "Un accompagnement humain, ancré dans le moment présent.",
  },
  {
    title: "Nature",
    text: "Un cadre inspiré par la lumière et le calme de Saly.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHero eyebrow="Notre histoire" title="À propos de Maisha Zen" />

      <Section>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-[2.5rem] border border-terracotta/20 bg-gradient-to-br from-lavande/40 via-creme-soft to-teal/30 text-center">
              <span className="px-8 text-sm text-ink/50">
                Photo de la sophrologue
                <br />à ajouter
              </span>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-xs tracking-[0.3em] text-bleu-gris uppercase">
              Votre sophrologue
            </p>
            <h2 className="font-heading mt-4 text-3xl text-ink">
              {siteConfig.sophrologist.name}
            </h2>
            <p className="mt-2 text-sm text-terracotta">{siteConfig.sophrologist.title}</p>
            <div className="mt-6 space-y-4 text-ink/70">
              {siteConfig.sophrologist.bio.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </Section>

      <Section tone="soft">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl text-ink">L&apos;histoire de Maisha Zen</h2>
            <p className="mt-6 leading-relaxed text-ink/70">
              [À COMPLÉTER] Racontez ici la genèse du cabinet : pourquoi Saly, quelle
              rencontre ou quel déclic a donné naissance à Maisha Zen, et ce que ce
              nom représente pour vous et pour vos accompagnements.
            </p>
          </FadeIn>
        </div>
      </Section>

      <Section>
        <FadeIn>
          <h2 className="font-heading text-center text-3xl text-ink">Notre philosophie</h2>
          <p className="mx-auto mt-6 max-w-2xl text-center leading-relaxed text-ink/70">
            Maisha, qui signifie « la vie » en swahili, résume notre approche :
            accompagner chacun vers une vie plus légère, plus consciente, plus en
            accord avec soi-même.
          </p>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valeurs.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <Card className="h-full text-center">
                <h3 className="font-heading text-lg text-terracotta">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{v.text}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>
    </>
  );
}
