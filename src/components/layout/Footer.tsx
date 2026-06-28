import { Link } from 'react-router-dom';

const services = [
  'Nos parcours certifiants',
  'Nos modules',
  'Bilan de compétences',
  'Certification VAE',
  'Formations en ligne',
  'Accompagnement entreprise',
];

const ressources = [
  'Notre méthode',
  'Nos référents',
  'FAQ',
  'Blog',
  'Avis & témoignages',
];

const informations = [
  'Qui sommes-nous ?',
  'Contactez-nous',
  'Notre équipe',
  'Devenir partenaire',
  'Recrutement',
];

export default function Footer() {
  return (
    <footer>
      <section className="w-full py-24 md:py-32 text-center" style={{ background: 'linear-gradient(to bottom, #eef6e8, #FFFFFF)' }}>
        <div className="container-cf">
          <h2 className="section-title max-w-[700px] mx-auto">
            Vous méritez de faire le choix de la <span style={{ color: '#72b249' }}>réussite</span>
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link to="/formations" className="btn-primary">Commencer gratuitement</Link>
            <span className="text-sm" style={{ color: 'var(--cf-gray-light)' }}>14 jours d&apos;essai sans engagement</span>
          </div>
        </div>
      </section>

      <section className="w-full py-20" style={{ backgroundColor: 'var(--cf-bg)' }}>
        <div className="container-cf">
          <h2 className="section-title text-center">Vous ne serez pas seuls</h2>
          <p className="section-subtitle text-center max-w-xl mx-auto mt-3 mb-12">Témoignages de nos apprenants</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Aminata S.', role: 'Étudiante en Marketing', text: '"Grâce à CampusForma, j\'ai pu obtenir ma certification en marketing digital tout en poursuivant mes études."', color: '#72b249', initials: 'AS' },
              { name: 'Moussa T.', role: 'Entrepreneur, Dakar', text: '"Les formations en gestion de projet m\'ont permis de structurer mon entreprise. Un vrai plus pour mon business."', color: '#2196F3', initials: 'MT' },
              { name: 'Fatou N.', role: 'Développeuse Web', text: '"J\'ai suivi le parcours Full Stack et trouvé un emploi 2 mois après ma certification."', color: '#7B61FF', initials: 'FN' },
              { name: 'Koffi M.', role: 'Chef de Projet, Lomé', text: '"La certification en gestion de projet m\'a ouvert les portes d\'un poste à responsabilité."', color: '#FF8F00', initials: 'KM' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-[#EEEEEE] transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-sm text-black">{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--cf-gray-light)' }}>{t.role}</div>
                  </div>
                </div>
                <p className="text-sm italic leading-relaxed" style={{ color: 'var(--cf-gray-medium)' }}>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full pt-16 pb-12 bg-white border-t" style={{ borderColor: 'var(--cf-border-light)' }}>
        <div className="container-cf">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#72b249' }}>
                  <span className="text-white font-bold text-xs">C</span>
                </div>
                <div>
                  <span className="font-heading text-lg font-bold text-black tracking-tight">Campus</span>
                  <span className="font-heading text-lg font-bold tracking-tight" style={{ color: '#72b249' }}>Forma</span>
                </div>
              </Link>
              <p className="text-sm leading-relaxed mb-6 max-w-[280px]" style={{ color: 'var(--cf-gray-light)' }}>
                CampusForma est une plateforme de formation en ligne adaptée à vos contraintes et besoins. Apprenez à votre rythme, où que vous soyez.
              </p>
              <div className="flex gap-3">
                {['linkedin', 'facebook', 'instagram', 'twitter'].map((social) => (
                  <a key={social} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-all border hover:border-[#72b249] hover:text-[#72b249]"
                    style={{ borderColor: 'var(--cf-border-light)', color: 'var(--cf-gray-light)' }}>
                    <SocialIcon name={social} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-black mb-5 tracking-wide">Nos Services</h4>
              <ul className="flex flex-col gap-3">
                {services.map((s) => <li key={s}><span className="text-sm transition-colors hover:text-[#72b249] cursor-pointer" style={{ color: 'var(--cf-gray-light)' }}>{s}</span></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-black mb-5 tracking-wide">Ressources</h4>
              <ul className="flex flex-col gap-3">
                {ressources.map((r) => <li key={r}><span className="text-sm transition-colors hover:text-[#72b249] cursor-pointer" style={{ color: 'var(--cf-gray-light)' }}>{r}</span></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-black mb-5 tracking-wide">Informations</h4>
              <ul className="flex flex-col gap-3">
                {informations.map((info) => <li key={info}><span className="text-sm transition-colors hover:text-[#72b249] cursor-pointer" style={{ color: 'var(--cf-gray-light)' }}>{info}</span></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-4 bg-white border-t" style={{ borderColor: 'var(--cf-border-light)' }}>
        <div className="container-cf flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px]" style={{ color: 'var(--cf-gray-light)' }}>© 2025 CampusForma. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-[13px]" style={{ color: 'var(--cf-gray)' }}>
            <span className="cursor-pointer hover:text-[#72b249] transition-colors">Mentions légales</span>
            <span className="text-[var(--cf-border)]">·</span>
            <span className="cursor-pointer hover:text-[#72b249] transition-colors">Politique de confidentialité</span>
            <span className="text-[var(--cf-border)]">·</span>
            <span className="cursor-pointer hover:text-[#72b249] transition-colors">CGU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    linkedin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>,
    facebook: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
    instagram: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>,
    twitter: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>,
  };
  return icons[name] || null;
}
