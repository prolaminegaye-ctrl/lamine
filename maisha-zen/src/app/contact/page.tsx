import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Section from "@/components/Section";
import FadeIn from "@/components/FadeIn";
import { siteConfig, whatsappHref } from "@/config/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Maisha Zen, cabinet de sophrologie à Saly, Sénégal, par téléphone, WhatsApp, email ou via le formulaire de contact.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Restons en contact"
        title="Contactez Maisha Zen"
        description="Une question, une envie de réserver ? Écrivez-nous ou contactez-nous directement, nous serons heureux de vous répondre."
      />

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                  Téléphone
                </h2>
                <p className="mt-2 text-ink/70">{siteConfig.contact.phone}</p>
              </div>
              <div>
                <h2 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                  WhatsApp
                </h2>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mt-2 inline-block text-ink/70 hover:text-terracotta"
                >
                  Discuter sur WhatsApp
                </a>
              </div>
              <div>
                <h2 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                  Email
                </h2>
                <a
                  href={siteConfig.contact.emailHref}
                  className="focus-ring mt-2 inline-block text-ink/70 hover:text-terracotta"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <div>
                <h2 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                  Adresse
                </h2>
                <p className="mt-2 text-ink/70">
                  {siteConfig.contact.address.line1}
                  <br />
                  {siteConfig.contact.address.line2}
                </p>
              </div>
              <div>
                <h2 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                  Horaires
                </h2>
                <p className="mt-2 text-ink/70">{siteConfig.hours.label}</p>
              </div>
              <div>
                <h2 className="font-heading text-sm tracking-wide text-terracotta uppercase">
                  Réseaux sociaux
                </h2>
                <div className="mt-2 flex gap-4 text-ink/70">
                  <a href={siteConfig.social.instagramHref} className="focus-ring hover:text-terracotta">
                    Instagram
                  </a>
                  <a href={siteConfig.social.facebookHref} className="focus-ring hover:text-terracotta">
                    Facebook
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-bleu-gris/50 bg-creme-soft p-6">
                <p className="text-sm text-ink/60">
                  Carte Google Maps à intégrer dès que l&apos;adresse exacte du
                  cabinet sera confirmée. Emplacement réservé ci-dessous.
                </p>
                <div className="mt-4 flex h-40 items-center justify-center rounded-xl bg-teal/15 text-sm text-ink/40">
                  Carte à venir
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <ContactForm />
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
