import { whatsappHref } from "@/config/site";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp avec Maisha Zen"
      className="focus-ring fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#3f8a6d] text-creme shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-10px_rgba(0,0,0,0.45)]"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M12.01 2C6.48 2 2 6.48 2 12c0 1.87.5 3.63 1.44 5.15L2 22l4.98-1.4A9.96 9.96 0 0 0 12.01 22C17.54 22 22 17.52 22 12S17.54 2 12.01 2Zm5.34 14.24c-.23.63-1.31 1.22-1.82 1.27-.47.05-1.06.07-1.72-.11-.4-.11-.9-.28-1.55-.55-2.73-1.18-4.51-3.93-4.65-4.11-.14-.18-1.11-1.48-1.11-2.83 0-1.34.7-2 .95-2.28.24-.27.53-.34.71-.34.18 0 .35 0 .5.01.16.01.38-.06.6.46.23.55.77 1.9.83 2.04.07.14.11.3.02.48-.09.18-.14.3-.28.46-.14.16-.29.36-.41.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.89 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.25.09 1.58.75 1.85.88.27.14.45.2.52.31.07.11.07.63-.16 1.26Z" />
      </svg>
    </a>
  );
}
