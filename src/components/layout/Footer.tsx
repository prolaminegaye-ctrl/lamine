import { Link } from 'react-router-dom';

const services = [
  { label: 'Nos parcours certifiants', to: '/formations' },
  { label: 'Nos modules', to: '/formations' },
  { label: 'Bilan de compétences', to: '/bilan-vae?tab=bilan' },
  { label: 'Certification VAE', to: '/bilan-vae?tab=vae' },
  { label: 'Formations en ligne', to: '/formations' },
  { label: 'Accompagnement entreprise', to: '/entreprises' },
];

const ressources = [
  { label: 'Notre méthode', to: '/methode' },
  { label: 'Nos référents', to: '/referents' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Blog', to: '/blog' },
  { label: 'Avis & témoignages', to: '/temoignages' },
];

const informations = [
  { label: 'Qui sommes-nous ?', to: '/a-propos' },
  { label: 'Contactez-nous', to: '/contact' },
  { label: 'Notre équipe', to: '/equipe' },
  { label: 'Devenir partenaire', to: '/partenaires' },
  { label: 'Recrutement', to: '/recrutement' },
];

export default function Footer() {
  return (
    <footer>
      <section className="w-full py-16 sm:py-24 md:py-32 text-center" style={{ background: 'linear-gradient(to bottom, #eef6e8, #FFFFFF)' }}>
        <div className="container-cf">
          <h2 className="section-title max-w-[700px] mx-auto">
            Vous méritez de faire le choix de la <span style={{ color: '#72b249' }}>réussite</span>
          </h2>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link to="/formations" className="btn-primary">Commencer gratuitement</Link>
            <span className="text-sm" style={{ color: 'var(--cf-gray-light)' }}>Explorez le catalogue et choisissez votre parcours</span>
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
              <Link to="/contact" className="text-sm font-semibold hover:text-[#72b249]">Une question ? Contactez-nous →</Link>
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-black mb-5 tracking-wide">Nos Services</h4>
              <ul className="flex flex-col gap-3">
                {services.map((item) => <li key={item.label}><Link to={item.to} className="text-sm transition-colors hover:text-[#72b249]" style={{ color: 'var(--cf-gray-light)' }}>{item.label}</Link></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-black mb-5 tracking-wide">Ressources</h4>
              <ul className="flex flex-col gap-3">
                {ressources.map((item) => <li key={item.label}><Link to={item.to} className="text-sm transition-colors hover:text-[#72b249]" style={{ color: 'var(--cf-gray-light)' }}>{item.label}</Link></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-sm font-bold text-black mb-5 tracking-wide">Informations</h4>
              <ul className="flex flex-col gap-3">
                {informations.map((item) => <li key={item.label}><Link to={item.to} className="text-sm transition-colors hover:text-[#72b249]" style={{ color: 'var(--cf-gray-light)' }}>{item.label}</Link></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-4 bg-white border-t" style={{ borderColor: 'var(--cf-border-light)' }}>
        <div className="container-cf flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px]" style={{ color: 'var(--cf-gray-light)' }}>© {new Date().getFullYear()} CampusForma. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px]" style={{ color: 'var(--cf-gray)' }}>
            <Link to="/mentions-legales" className="hover:text-[#72b249] transition-colors">Mentions légales</Link>
            <span className="text-[var(--cf-border)]">·</span>
            <Link to="/confidentialite" className="hover:text-[#72b249] transition-colors">Politique de confidentialité</Link>
            <span className="text-[var(--cf-border)]">·</span>
            <Link to="/cgu" className="hover:text-[#72b249] transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
