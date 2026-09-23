import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
};

export default function Card({ children, className = "", highlight = false }: CardProps) {
  return (
    <div
      className={`rounded-3xl border p-8 transition-shadow duration-500 ${
        highlight
          ? "border-terracotta/30 bg-creme-soft shadow-[0_18px_40px_-24px_rgba(168,96,48,0.35)]"
          : "border-ink/10 bg-creme-soft shadow-[0_10px_30px_-24px_rgba(60,50,41,0.25)]"
      } hover:shadow-[0_20px_44px_-22px_rgba(60,50,41,0.3)] ${className}`}
    >
      {children}
    </div>
  );
}
