import { Link } from 'react-router-dom';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
};

export default function PageHero({ eyebrow, title, intro }: PageHeroProps) {
  return (
    <section className="pt-32 pb-16 sm:pt-36 sm:pb-20" style={{ background: 'linear-gradient(180deg, #eef6e8 0%, #fff 100%)' }}>
      <div className="container-cf max-w-[980px]">
        <div className="text-sm mb-7" style={{ color: 'var(--cf-gray-light)' }}>
          <Link to="/" className="hover:text-[#72b249]">Accueil</Link>
          <span className="mx-2">/</span>
          <span>{eyebrow}</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: 'var(--cf-green)' }}>{eyebrow}</p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-[820px]">{title}</h1>
        <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-[760px]" style={{ color: 'var(--cf-gray-medium)' }}>{intro}</p>
      </div>
    </section>
  );
}
