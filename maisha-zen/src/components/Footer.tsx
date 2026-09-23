import Link from "next/link";
import { siteConfig, whatsappHref } from "@/config/site";
import LotusMark from "./LotusMark";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-creme-soft">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <LotusMark className="h-8 w-8" />
              <span className="font-heading text-lg text-ink">{siteConfig.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/60">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-wide text-ink">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="focus-ring hover:text-terracotta">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-wide text-ink">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              <li>{siteConfig.contact.phone}</li>
              <li>{siteConfig.contact.email}</li>
              <li>
                {siteConfig.contact.address.line1}
                <br />
                {siteConfig.contact.address.line2}
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring hover:text-terracotta"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-wide text-ink">Suivez-nous</h3>
            <ul className="mt-4 space-y-2 text-sm text-ink/70">
              <li>
                <a href={siteConfig.social.instagramHref} className="focus-ring hover:text-terracotta">
                  Instagram — {siteConfig.social.instagram}
                </a>
              </li>
              <li>
                <a href={siteConfig.social.facebookHref} className="focus-ring hover:text-terracotta">
                  Facebook — {siteConfig.social.facebook}
                </a>
              </li>
            </ul>
            <div className="mt-6 space-y-1 text-xs text-ink/70">
              <Link href="/mentions-legales" className="focus-ring block hover:text-terracotta">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="focus-ring block hover:text-terracotta">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-ink/10 pt-6">
          <p className="text-xs leading-relaxed text-ink/50">
            La sophrologie est une pratique d&apos;accompagnement au bien-être et ne
            remplace en aucun cas un diagnostic, un traitement ou un suivi médical ou
            psychologique. En cas de besoin, consultez un professionnel de santé.
          </p>
          <p className="mt-3 text-xs text-ink/40">
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
