"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name")?.toString() ?? "";
    const email = data.get("email")?.toString() ?? "";
    const message = data.get("message")?.toString() ?? "";

    const subject = encodeURIComponent(`Prise de contact — ${name || "Site Maisha Zen"}`);
    const body = encodeURIComponent(
      `Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`
    );

    setSubmitted(true);
    window.open(`${siteConfig.contact.emailHref}?subject=${subject}&body=${body}`, "_self");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-ink/10 bg-creme-soft p-8"
      noValidate
    >
      <h2 className="font-heading text-xl text-ink">Envoyez-nous un message</h2>
      <p className="mt-2 text-sm text-ink/60">
        Ce formulaire ouvre votre messagerie avec un message pré-rempli
        (aucune donnée n&apos;est stockée ni envoyée à un serveur).
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-ink/70">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="focus-ring w-full rounded-xl border border-ink/15 bg-creme px-4 py-3 text-sm text-ink placeholder:text-ink/30"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-ink/70">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="focus-ring w-full rounded-xl border border-ink/15 bg-creme px-4 py-3 text-sm text-ink placeholder:text-ink/30"
            placeholder="vous@exemple.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm text-ink/70">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="focus-ring w-full resize-none rounded-xl border border-ink/15 bg-creme px-4 py-3 text-sm text-ink placeholder:text-ink/30"
            placeholder="Votre message..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="focus-ring mt-6 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-7 py-3.5 text-sm text-creme transition-transform duration-500 hover:-translate-y-0.5 hover:bg-terracotta-dark sm:w-auto"
      >
        Envoyer le message
      </button>

      {submitted && (
        <p className="mt-4 text-sm text-terracotta" role="status">
          Votre messagerie va s&apos;ouvrir avec votre message pré-rempli.
        </p>
      )}
    </form>
  );
}
