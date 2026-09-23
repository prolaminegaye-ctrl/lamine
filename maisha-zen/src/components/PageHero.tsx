import { ReactNode } from "react";
import FadeIn from "./FadeIn";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
};

export default function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-creme">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-lavande/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        <FadeIn>
          {eyebrow && (
            <p className="text-xs tracking-[0.3em] text-bleu-gris uppercase">{eyebrow}</p>
          )}
          <h1 className="font-heading mt-5 text-4xl leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
              {description}
            </p>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
