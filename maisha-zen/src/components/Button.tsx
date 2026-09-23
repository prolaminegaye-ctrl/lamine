import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
};

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm tracking-wide transition-all duration-500 ease-out";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-terracotta text-creme hover:bg-terracotta-dark shadow-[0_8px_24px_-10px_rgba(168,96,48,0.55)] hover:shadow-[0_10px_28px_-8px_rgba(168,96,48,0.6)] hover:-translate-y-0.5",
  secondary:
    "border border-terracotta/40 text-terracotta bg-transparent hover:bg-terracotta/5 hover:-translate-y-0.5",
  ghost: "text-terracotta hover:bg-terracotta/5",
};

export default function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
