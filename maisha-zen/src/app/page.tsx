import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";
import LotusMark from "@/components/LotusMark";
import SeanceCard from "@/components/SeanceCard";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Accueil`,
  description: siteConfig.description,
};

const piliers = [
  {
    title: "Respirer",
    text: "Reconnecter au souffle, ancre naturelle du calme, pour relâcher les tensions accumulées.",
  },
  {
    title: "Se relâcher",
    text: "Libérer le corps et l'esprit des crispations du quotidien, séance après séance.",
  },
  {
    title: "Se recentrer",
    text: "Retrouver un espace intérieur stable, loin de l'agitation, pour s'écouter vraiment.",
  },
  {
    title: "Avancer",
    text: "Mobiliser ses ressources positives pour aborder les défis avec plus de sérénité.",
  },
];

const publics = [
  "Gérer le stress du quotidien",
  "Mieux dormir et se reposer",
  "Traverser une période de transition",
  "Préparer un examen ou un événement",
  "Apaiser l'anxiété passagère",
  "Retrouver confiance et énergie",
];

const etapes = [
  {
    n: "01",
    title: "Échange",
    text: "Un temps de parole pour poser vos besoins et le déroulé de la séance.",
  },
  {
    n: "02",
    title: "Respiration",
    text: "Des exercices de respiration consciente pour installer le calme.",
  },
  {
    n: "03",
    title: "Relaxation",
    text: "Une relaxation dynamique guidée, debout, assis ou allongé.",
  },
  {
    n: "04",
    title: "Intégration",
    text: "Un partage en douceur de ce qui a été vécu pendant la séance.",
  },
];

const temoignages = [
  {
    text: "« [Témoignage placeholder] Un accompagnement d'une grande douceur, qui m'a permis de retrouver un sommeil apaisé. »",
    author: "— [Prénom, témoignage à compléter]",
  },
  {
    text: "« [Témoignage placeholder] Les séances m'ont aidé à traverser une période de stress intense avec beaucoup plus de sérénité. »",
    author: "— [Prénom, témoignage à compléter]",
  },
  {
    text: "« [Témoignage placeholder] Un cabinet chaleureux à Saly, où l'on se sent vraiment écouté. »",
    author: "— [Prénom, témoignage à compléter]",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-creme">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/images/hero-priere-plage.jpg"
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-creme/78" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-lavande/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-10%] left-[-10%] h-96 w-96 rounded-full bg-teal/25 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-28 text-center sm:py-36">
          <FadeIn>
            <LotusMark className="h-14 w-14" />
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-8 text-xs tracking-[0.35em] text-bleu-gris uppercase">
              Cabinet de sophrologie · Saly, Sénégal
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <h1 className="font-heading mt-6 text-4xl leading-tight text-ink sm:text-6xl">
              Retrouvez votre équilibre intérieur
            </h1>
          </FadeIn>
          <FadeIn delay={0.45}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              Un espace de calme et d&apos;écoute au cœur de Saly, pour apprendre à
              respirer, se relâcher et avancer avec plus de sérénité.
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button href="/contact">Réserver une séance</Button>
              <Button href="/sophrologie" variant="secondary">
                Découvrir Maisha Zen
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Un instant pour vous */}
      <Section tone="soft">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-sm">
              <Image
                src="/images/meditation-interieur.jpg"
                alt="Femme assise en pleine conscience dans un intérieur lumineux et épuré"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">
              Un instant pour vous
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Entre le rythme du quotidien et le bruit du monde, la sophrologie
              offre une parenthèse. Un moment rien qu&apos;à vous, où le corps se
              détend, où le mental s&apos;apaise, et où vous retrouvez, séance
              après séance, le chemin vers votre propre équilibre.
            </p>
          </FadeIn>
        </div>
      </Section>

      {/* La sophrologie */}
      <Section>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">La sophrologie</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Une méthode douce alliant respiration, relaxation dynamique et
              visualisation positive, pour se reconnecter à soi-même.
            </p>
          </div>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {piliers.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.1}>
              <Card className="h-full text-center">
                <h3 className="font-heading text-lg tracking-wide text-terracotta">
                  {p.title.toUpperCase()}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.text}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Nos séances */}
      <Section tone="lavande">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">Nos séances</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Des formules pensées pour tous les besoins, du premier bilan au suivi
              régulier.
            </p>
          </div>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.seances.map((s, i) => (
            <FadeIn key={s.id} delay={i * 0.1}>
              <SeanceCard seance={s} />
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.3}>
          <p className="mt-8 text-center text-xs text-ink/50">
            Tarifs et durées indiqués à titre d&apos;exemple — informations à
            confirmer avec le cabinet.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="/seances" variant="secondary">
              Voir toutes les séances
            </Button>
          </div>
        </FadeIn>
      </Section>

      {/* Pour qui */}
      <Section>
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">Pour qui ?</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              La sophrologie s&apos;adresse à toute personne souhaitant prendre
              soin de son bien-être, à son rythme.
            </p>
          </div>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publics.map((need, i) => (
            <FadeIn key={need} delay={i * 0.08}>
              <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-creme-soft px-6 py-5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-teal" />
                <span className="text-sm leading-relaxed text-ink/80">{need}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Sophrologue */}
      <Section tone="soft">
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
            <h2 className="font-heading mt-4 text-3xl text-ink sm:text-4xl">
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
            <div className="mt-8">
              <Button href="/a-propos" variant="secondary">
                En savoir plus
              </Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Expérience à Saly */}
      <Section tone="teal">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">
              L&apos;expérience Maisha Zen à Saly
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              À Saly, entre lumière douce et rythme apaisé, Maisha Zen vous accueille
              dans un cadre pensé pour la sérénité. Ici, le temps ralentit : chaque
              séance est une invitation à respirer avec l&apos;océan, à se poser avec
              le vent tiède, et à repartir plus léger.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={0.2}>
          <div className="relative mx-auto mt-12 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-[2.5rem] shadow-sm">
            <Image
              src="/images/piscine-jardin-tropical.jpg"
              alt="Jardin tropical apaisant et bassin d'eau évoquant l'atmosphère paisible de Saly"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 60vw, 90vw"
            />
          </div>
          <p className="mt-4 text-center text-xs text-ink/50">
            Photo d&apos;illustration — cadre représentatif de l&apos;atmosphère Maisha Zen
          </p>
        </FadeIn>
      </Section>

      {/* Déroulé d'une séance */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] shadow-sm">
              <Image
                src="/images/yoga-piscine-tropicale.jpg"
                alt="Étirement en pleine conscience dans un jardin tropical au bord de l'eau"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">
              Comment se déroule une séance ?
            </h2>
            <p className="mt-4 text-ink/70">
              Un parcours simple, en douceur, pensé pour vous accompagner du premier
              échange jusqu&apos;au retour au calme.
            </p>
          </FadeIn>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {etapes.map((e, i) => (
            <FadeIn key={e.n} delay={i * 0.1}>
              <div className="text-center">
                <span className="font-heading text-4xl text-lavande">{e.n}</span>
                <h3 className="font-heading mt-3 text-lg text-ink">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{e.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Témoignages */}
      <Section tone="soft">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">Témoignages</h2>
            <p className="mt-4 text-sm text-ink/50">
              Exemples de témoignages — à remplacer par de véritables retours de clients
              avec leur accord.
            </p>
          </div>
        </FadeIn>
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {temoignages.map((t, i) => (
            <FadeIn key={t.author} delay={i * 0.1}>
              <Card className="h-full">
                <p className="text-sm leading-relaxed text-ink/70 italic">{t.text}</p>
                <p className="mt-4 text-sm text-terracotta">{t.author}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Booking CTA */}
      <Section tone="lavande">
        <div className="mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl text-ink sm:text-4xl">
              Prenez un instant pour vous
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Offrez-vous une parenthèse de calme. Réservez votre séance dès
              aujourd&apos;hui.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/contact">Réserver ma séance</Button>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Contact preview */}
      <Section>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <FadeIn>
            <div className="text-center">
              <h3 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                Téléphone
              </h3>
              <p className="mt-2 text-ink/70">{siteConfig.contact.phone}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="text-center">
              <h3 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                Email
              </h3>
              <p className="mt-2 text-ink/70">{siteConfig.contact.email}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="text-center">
              <h3 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                Adresse
              </h3>
              <p className="mt-2 text-ink/70">
                {siteConfig.contact.address.line1}
                <br />
                {siteConfig.contact.address.line2}
              </p>
            </div>
          </FadeIn>
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/contact" variant="secondary">
            Voir la page contact
          </Button>
        </div>
      </Section>
    </>
  );
}
