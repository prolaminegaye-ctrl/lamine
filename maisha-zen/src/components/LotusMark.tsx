type LotusMarkProps = {
  className?: string;
};

// Placeholder logo — a simple lotus glyph. Replace with the real Maisha Zen
// logo file once available.
export default function LotusMark({ className = "h-9 w-9" }: LotusMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Symbole du lotus Maisha Zen"
    >
      <circle cx="24" cy="24" r="23" fill="#A86030" fillOpacity="0.08" />
      <path
        d="M24 34c-6-2-9-7-9-12 3 1 6 3 9 7 3-4 6-6 9-7 0 5-3 10-9 12Z"
        fill="#A86030"
        fillOpacity="0.85"
      />
      <path
        d="M24 32c-4-4-4-10-4-14 3 1 5 4 6 8-1-4 1-8 4-11 1 4 1 10-2 15"
        fill="#D8C8E8"
        fillOpacity="0.9"
      />
      <path
        d="M24 32c4-4 4-10 4-14-3 1-5 4-6 8 1-4-1-8-4-11-1 4-1 10 2 15"
        fill="#B8D8E0"
        fillOpacity="0.85"
      />
      <circle cx="24" cy="33" r="2.2" fill="#A86030" />
    </svg>
  );
}
