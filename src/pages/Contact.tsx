import ContactRequestForm from '@/components/content/ContactRequestForm';
import PageHero from '@/components/content/PageHero';

export default function Contact() {
  return (
    <main>
      <PageHero eyebrow="Contact" title="Comment pouvons-nous vous aider ?" intro="Une question sur une formation, une inscription ou votre projet professionnel ? Envoyez-nous votre demande." />
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'var(--cf-bg)' }}>
        <div className="container-cf max-w-[820px]">
          <ContactRequestForm />
        </div>
      </section>
    </main>
  );
}
