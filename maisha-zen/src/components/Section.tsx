import { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "creme" | "soft" | "lavande" | "teal";
};

const tones: Record<NonNullable<SectionProps["tone"]>, string> = {
  creme: "bg-creme",
  soft: "bg-creme-soft",
  lavande: "bg-lavande/20",
  teal: "bg-teal/15",
};

export default function Section({
  children,
  className = "",
  id,
  tone = "creme",
}: SectionProps) {
  return (
    <section id={id} className={`${tones[tone]} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28">{children}</div>
    </section>
  );
}
