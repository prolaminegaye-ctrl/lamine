"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import LotusMark from "./LotusMark";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-creme/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-full" onClick={() => setOpen(false)}>
          <LotusMark className="h-8 w-8" />
          <span className="font-heading text-lg tracking-wide text-ink">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring rounded-full text-sm tracking-wide transition-colors duration-300 ${
                  active ? "text-terracotta" : "text-ink/70 hover:text-terracotta"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="focus-ring hidden rounded-full bg-terracotta px-6 py-2.5 text-sm text-creme transition-transform duration-300 hover:-translate-y-0.5 hover:bg-terracotta-dark md:inline-flex"
        >
          Réserver une séance
        </Link>

        <button
          type="button"
          className="focus-ring inline-flex items-center justify-center rounded-full p-2 md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink/5 bg-creme px-6 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring block rounded-lg px-2 py-3 text-base text-ink/80 hover:text-terracotta"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="focus-ring block rounded-full bg-terracotta px-6 py-3 text-center text-sm text-creme"
              >
                Réserver une séance
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
