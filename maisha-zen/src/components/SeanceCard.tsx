import Card from "./Card";
import type { siteConfig } from "@/config/site";

type Seance = (typeof siteConfig)["seances"][number];

export default function SeanceCard({ seance }: { seance: Seance }) {
  return (
    <Card highlight={seance.highlight} className="flex h-full flex-col">
      {seance.highlight && (
        <span className="mb-3 inline-block w-fit rounded-full bg-terracotta/10 px-3 py-1 text-xs tracking-wide text-terracotta">
          Le plus choisi
        </span>
      )}
      <h3 className="font-heading text-xl text-ink">{seance.name}</h3>
      <p className="mt-1 text-sm text-bleu-gris">{seance.duration}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
        {seance.description}
      </p>
      <p className="mt-6 font-heading text-lg text-terracotta">{seance.price}</p>
    </Card>
  );
}
