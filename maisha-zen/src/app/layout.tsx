import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.name} — Sophrologue à Saly, Sénégal`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Sophrologue Saly",
    "Sophrologie Saly",
    "Sophrologie Sénégal",
    "Cabinet de sophrologie Saly",
    "Gestion du stress Saly",
    "Relaxation Saly",
    "Bien-être Saly Sénégal",
  ],
  openGraph: {
    title: `${siteConfig.name} — Sophrologue à Saly, Sénégal`,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    siteName: siteConfig.name,
    locale: "fr_SN",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: siteConfig.name,
  description: siteConfig.description,
  image: `${siteConfig.baseUrl}/icon.svg`,
  telephone: "[À COMPLÉTER] Téléphone",
  email: "[À COMPLÉTER] Adresse email",
  address: {
    "@type": "PostalAddress",
    streetAddress: "[À COMPLÉTER] Adresse (rue, quartier)",
    addressLocality: "Saly",
    addressCountry: "SN",
  },
  url: siteConfig.baseUrl,
  priceRange: "[À COMPLÉTER]",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full scroll-smooth">
      <body className="flex min-h-full flex-col bg-creme text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
