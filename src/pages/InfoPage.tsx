import { Link } from 'react-router-dom';
import ContactRequestForm from '@/components/content/ContactRequestForm';
import type { RequestType } from '@/components/content/ContactRequestForm';
import PageHero from '@/components/content/PageHero';
import { infoPages } from '@/data/siteContent';
import type { InfoPageKey } from '@/data/siteContent';

const requestTypes: Partial<Record<InfoPageKey, RequestType>> = {
  enterprise: 'enterprise',
  partners: 'partner',
  recruitment: 'recruitment',
};

export default function InfoPage({ page }: { page: InfoPageKey }) {
  const content = infoPages[page];
  const requestType = requestTypes[page];

  return (
    <main>
      <PageHero eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-cf max-w-[1100px] grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.sections.map((section, index) => (
            <article key={section.title} className="rounded-2xl p-6 sm:p-8 border bg-white shadow-sm">
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-full text-white font-bold" style={{ backgroundColor: 'var(--cf-green)' }}>{index + 1}</span>
              <h2 className="font-heading text-xl font-bold mt-5">{section.title}</h2>
              <p className="mt-3 leading-relaxed" style={{ color: 'var(--cf-gray-medium)' }}>{section.text}</p>
            </article>
          ))}
        </div>
        {content.ctaTo && content.ctaLabel && (
          <div className="container-cf text-center mt-10">
            <Link to={content.ctaTo} className="btn-primary">{content.ctaLabel}</Link>
          </div>
        )}
      </section>
      {requestType && (
        <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--cf-bg)' }}>
          <div className="container-cf max-w-[820px]">
            <h2 className="section-title text-center">Parlons de votre projet</h2>
            <p className="section-subtitle text-center mb-10">Décrivez votre besoin : votre demande sera enregistrée et transmise à l’équipe.</p>
            <ContactRequestForm requestType={requestType} />
          </div>
        </section>
      )}
    </main>
  );
}
