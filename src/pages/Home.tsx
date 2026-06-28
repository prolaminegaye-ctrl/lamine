import { Link } from 'react-router-dom';
import { CheckCircle, Star, UserPlus, Search, PlayCircle, BadgeCheck, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCourses } from '@/hooks/useCourses';
import ScrollReveal from '@/components/ui/ScrollReveal';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Accordion from '@/components/ui/FaqAccordion';

const stats = [
  { value: 150, suffix: '+', label: 'Formations disponibles' },
  { value: 52000, suffix: '+', label: 'Apprenants formés' },
  { value: 85, suffix: '+', label: 'Référents experts' },
  { value: 98, suffix: '%', label: 'Taux de satisfaction' },
];

const instructors = [
  { avatar: '/avatars/formateur-1.jpg', name: 'Dr. Amadou Diallo', title: 'Expert en Data Science & IA', bio: '15 ans d\'expérience en recherche et industrie. Ancien chercheur à l\'INRIA.', specialties: ['Machine Learning', 'Python', 'Big Data'], rating: 4.9 },
  { avatar: '/avatars/formateur-2.jpg', name: 'Fatou Ndiaye', title: 'Consultante Marketing Digital', bio: '10 ans d\'expérience en marketing digital en Afrique de l\'Ouest. Certifiée Google et Meta.', specialties: ['SEO/SEA', 'Réseaux Sociaux', 'Analytics'], rating: 4.8 },
  { avatar: '/avatars/formateur-3.jpg', name: 'Jean-Pierre Mensah', title: 'Développeur Senior & Formateur', bio: 'Développeur full-stack avec 12 ans d\'expérience. Contributeur open source.', specialties: ['JavaScript', 'React', 'Node.js'], rating: 4.9 },
];

const testimonials = [
  { initials: 'AS', name: 'Aminata S.', role: 'Développeuse Web, Abidjan', quote: 'Grâce à la formation Full Stack, j\'ai pu changer de carrière en 6 mois. Le contenu est incroyablement bien structuré.', color: '#72b249' },
  { initials: 'KM', name: 'Koffi M.', role: 'Chef de Projet, Lomé', quote: 'La certification en gestion de projet m\'a ouvert les portes d\'un poste à responsabilité. CampusForma, c\'est de la formation de qualité internationale.', color: '#2196F3' },
];

const methodSteps = [
  { number: '1', title: 'Inscrivez-vous', description: 'Créez votre compte gratuitement en quelques secondes et accédez à notre catalogue complet.', icon: UserPlus },
  { number: '2', title: 'Choisissez votre formation', description: 'Parcourez nos +150 formations et sélectionnez celle qui correspond à vos objectifs.', icon: Search },
  { number: '3', title: 'Apprenez à votre rythme', description: 'Suivez les cours vidéo, faites les exercices pratiques et interagissez avec vos référents.', icon: PlayCircle },
  { number: '4', title: 'Obtenez votre certification', description: 'Passez l\'examen final et recevez votre certificat reconnu par les employeurs.', icon: BadgeCheck },
];

const partners = ['Université Cheikh Anta Diop', 'INPTIC', 'Simplon.co', 'Orange Digital Center', 'Wave', 'ONFP Sénégal'];

const faqItems = [
  { question: 'Comment fonctionne CampusForma ?', answer: 'CampusForma est une plateforme de formation en ligne qui vous permet d\'accéder à plus de 150 formations certifiantes. Créez un compte gratuit, choisissez votre formation et apprenez à votre rythme depuis n\'importe quel appareil.' },
  { question: 'Les formations sont-elles vraiment certifiantes ?', answer: 'Oui ! Toutes nos formations délivrent un certificat de complétion reconnu par nos partenaires institutionnels et les employeurs en Afrique et à l\'international.' },
  { question: 'Puis-je payer avec Wave ou Orange Money ?', answer: 'Oui. Vous pouvez enregistrer une commande avec Wave, Orange Money ou Free Money. Les instructions de validation sont ensuite envoyées au numéro indiqué.' },
  { question: 'Puis-je suivre les formations sur mobile ?', answer: 'Oui, notre plateforme est 100% responsive. Vous pouvez suivre vos formations sur ordinateur, tablette ou smartphone.' },
  { question: 'Y a-t-il un support si j\'ai des difficultés ?', answer: 'Bien sûr. Notre équipe de support est disponible par chat, email et téléphone. Vous pouvez aussi poser vos questions directement aux référents.' },
  { question: 'Comment accède-t-on aux formations après achat ?', answer: 'Une fois votre paiement validé, vous recevez immédiatement un accès à votre espace d\'apprentissage personnel où vous retrouverez toutes vos formations.' },
];

export default function Home() {
  const { addItem } = useCart();
  const { data: courses = [], isLoading } = useCourses();
  const featuredCourses = courses.slice(0, 6);

  return (
    <main>
      {/* HERO */}
      <section className="relative lg:min-h-screen w-full overflow-hidden pt-[72px]">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(114,178,73,0.06), rgba(114,178,73,0))' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2372b249' fill-opacity='1'%3E%3Cpath d='M20 20h10v10H20zM40 40h10v10H40zM60 60h10v10H60zM80 80h10v10H80zM100 100h10v10h-10zM120 120h10v10h-10zM140 140h10v10h-10zM160 160h10v10h-10zM180 180h10v10h-10z'/%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="container-cf relative z-10 py-12 sm:py-16 md:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div>
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: '#eef6e8' }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#72b249' }} />
                  <span className="text-sm font-semibold" style={{ color: '#72b249' }}>+ de 150 formations certifiantes</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.12] text-black">
                  Progressez, <span style={{ color: '#72b249' }}>certifiez-vous</span>, construisez votre avenir en Afrique
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-lg mt-6 max-w-[500px]" style={{ color: 'var(--cf-gray-medium)' }}>
                  +3000h de formations en ligne sur les thématiques les plus demandées. Certifiez-vous où que vous soyez avec CampusForma.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-4 mt-10">
                  <Link to="/formations" className="btn-primary w-full sm:w-auto">
                    <ArrowRight size={18} />
                    Explorer les formations
                  </Link>
                  <Link to="/login" className="btn-secondary w-full sm:w-auto">
                    Créer mon compte
                  </Link>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
                  {['Formations certifiantes', 'Accès illimité', 'Référents experts', '100% en ligne'].map((item) => (
                    <span key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--cf-gray)' }}>
                      <CheckCircle size={16} style={{ color: '#72b249' }} /> {item}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.2} direction="left" className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src="/hero-main.jpg" alt="Étudiant CampusForma" className="w-full h-auto object-cover" />
              </div>
              <ScrollReveal delay={0.6} direction="scale">
                <div className="absolute -bottom-4 -right-2 md:bottom-6 md:right-4 bg-white rounded-2xl p-4 shadow-lg border border-[#EEEEEE]">
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map((s) => <Star key={s} size={14} fill="#FFC300" color="#FFC300" />)}
                    <span className="font-heading font-bold text-sm text-black">4.8/5</span>
                  </div>
                  <span className="text-xs mt-1 block" style={{ color: 'var(--cf-gray-light)' }}>Note moyenne de nos apprenants</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.7} direction="scale">
                <div className="absolute -top-2 -left-2 md:top-6 md:left-4 text-white text-sm font-semibold px-4 py-2 rounded-full" style={{ backgroundColor: '#72b249' }}>
                  +52 000 apprenants
                </div>
              </ScrollReveal>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="w-full bg-white border-y" style={{ borderColor: 'var(--cf-border-light)', padding: '48px 0' }}>
        <div className="container-cf">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-bold" style={{ color: '#72b249' }}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm mt-2" style={{ color: 'var(--cf-gray)' }}>{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="section-padding w-full" style={{ backgroundColor: 'var(--cf-bg)' }}>
        <div className="container-cf">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="section-title">Nos formations à la une</h2>
              <p className="section-subtitle max-w-xl">Découvrez nos parcours les plus populaires sur les thématiques les plus demandées par les professionnels africains.</p>
            </div>
            <Link to="/formations" className="text-sm font-medium flex items-center gap-1 transition-all hover:gap-2 shrink-0" style={{ color: '#72b249' }}>
              Voir toutes les formations <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading && <p className="text-sm text-[#777] mb-6">Chargement du catalogue en direct…</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, i) => (
              <ScrollReveal key={course.id} delay={i * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <Link to={`/formations/${course.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    {course.tag && (
                      <span className="absolute top-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full" style={{ backgroundColor: course.tag === 'Populaire' ? '#7B61FF' : course.tag === 'Best-seller' ? '#2196F3' : course.tag === 'Nouveau' ? '#00BCD4' : '#72b249' }}>
                        {course.tag}
                      </span>
                    )}
                  </Link>
                  <div className="p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#72b249' }}>{course.category}</span>
                    <Link to={`/formations/${course.id}`}>
                      <h3 className="font-heading text-base font-semibold text-black line-clamp-2 leading-tight mt-1 hover:text-[#72b249] transition-colors">{course.title}</h3>
                    </Link>
                    <p className="text-sm mt-1.5 line-clamp-2" style={{ color: 'var(--cf-gray-light)' }}>{course.description}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--cf-gray-light)' }}><PlayCircle size={12} /> {course.duration}</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#72b249' }}><CheckCircle size={12} /> Certifiant</span>
                    </div>
                    <div className="h-px w-full my-4" style={{ backgroundColor: 'var(--cf-border-light)' }} />
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-lg font-bold" style={{ color: '#72b249' }}>{course.price.toLocaleString('fr-FR')} FCFA</span>
                      <button
                        onClick={() => addItem({ id: course.id, title: course.title, price: course.price, image: course.image, instructor: course.instructor, duration: course.duration, category: course.category })}
                        className="flex items-center gap-1 text-sm font-medium px-4 py-2 min-h-11 rounded-lg transition-all duration-300 hover:shadow-md touch-manipulation"
                        style={{ color: '#72b249', backgroundColor: '#eef6e8' }}
                      >
                        <ShoppingCart size={14} /> Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTORS */}
      <section className="section-padding w-full bg-white">
        <div className="container-cf">
          <ScrollReveal>
            <h2 className="section-title text-center">Apprenez avec les meilleurs référents</h2>
            <p className="section-subtitle text-center max-w-2xl mx-auto">Des experts de terrain, des universitaires et des professionnels reconnus pour vous accompagner</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {instructors.map((instructor, i) => (
              <ScrollReveal key={i} delay={i * 0.2}>
                <div className="bg-white rounded-2xl border p-8 text-center transition-all duration-300 hover:border-[#72b249] hover:shadow-lg hover:-translate-y-1" style={{ borderColor: 'var(--cf-border)' }}>
                  <img src={instructor.avatar} alt={instructor.name} className="w-20 h-20 rounded-full mx-auto object-cover" style={{ border: '3px solid #72b249' }} loading="lazy" />
                  <h3 className="font-heading text-lg font-semibold text-black mt-4">{instructor.name}</h3>
                  <p className="text-sm font-medium mt-1" style={{ color: '#72b249' }}>{instructor.title}</p>
                  <p className="text-sm mt-3 line-clamp-3" style={{ color: 'var(--cf-gray-light)' }}>{instructor.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {instructor.specialties.map((s) => <span key={s} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#eef6e8', color: '#72b249' }}>{s}</span>)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-4"><Star size={14} fill="#FFC300" color="#FFC300" /><span className="text-sm font-medium text-black">{instructor.rating}</span></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding w-full bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle, #72b249 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        <div className="container-cf relative z-10">
          <ScrollReveal>
            <h2 className="section-title text-center">Ils nous font confiance</h2>
            <p className="section-subtitle text-center max-w-xl mx-auto">Témoignages de nos apprenants à travers l&apos;Afrique</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="rounded-3xl p-8 transition-all hover:shadow-lg" style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0" style={{ backgroundColor: t.color }}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-heading font-semibold text-black">{t.name}</div>
                      <div className="text-sm" style={{ color: '#72b249' }}>{t.role}</div>
                    </div>
                  </div>
                  <p className="text-base italic leading-relaxed" style={{ color: 'var(--cf-gray-medium)' }}>&ldquo;{t.quote}&rdquo;</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD */}
      <section id="methode" className="section-padding w-full" style={{ backgroundColor: 'var(--cf-bg)' }}>
        <div className="container-cf">
          <ScrollReveal>
            <h2 className="section-title text-center">Notre méthode d&apos;apprentissage</h2>
            <p className="section-subtitle text-center max-w-xl mx-auto">Un parcours structuré pour des résultats concrets</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14 relative">
            <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-[2px] border-t-2 border-dashed" style={{ borderColor: 'var(--cf-border)' }} />
            {methodSteps.map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <div className="text-center relative z-10">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto shadow-lg" style={{ backgroundColor: '#72b249' }}>
                    {step.number}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-black mt-5">{step.title}</h3>
                  <p className="text-sm mt-2" style={{ color: 'var(--cf-gray-light)' }}>{step.description}</p>
                  <div className="mt-4 flex justify-center" style={{ color: 'var(--cf-gray)' }}><step.icon size={28} strokeWidth={1.5} /></div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="w-full py-16 bg-white border-t" style={{ borderColor: 'var(--cf-border-light)' }}>
        <div className="container-cf">
          <ScrollReveal>
            <p className="text-center text-sm tracking-[2px] uppercase font-medium mb-8" style={{ color: 'var(--cf-gray-light)' }}>Ils nous font confiance</p>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((partner, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <span className="font-heading text-base md:text-lg font-bold transition-colors duration-300 hover:text-[#72b249] cursor-default" style={{ color: 'var(--cf-gray-light)' }}>{partner}</span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding w-full bg-white">
        <div className="container-cf max-w-[800px]">
          <ScrollReveal>
            <h2 className="section-title text-center">Questions fréquentes</h2>
            <p className="section-subtitle text-center">Trouvez les réponses à vos questions sur CampusForma</p>
          </ScrollReveal>
          <div className="mt-12">
            <ScrollReveal delay={0.2}>
              <Accordion items={faqItems} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* LMS Section */}
      <section className="w-full py-16" style={{ background: 'linear-gradient(135deg, #eef6e8 0%, #ffffff 100%)' }}>
        <div className="container-cf max-w-[800px] text-center">
          <ScrollReveal>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#72b249' }}>
              <PlayCircle size={32} className="text-white" />
            </div>
            <h2 className="section-title">Votre espace d&apos;apprentissage</h2>
            <p className="section-subtitle max-w-xl mx-auto mt-3 mb-8">
              Après votre achat, accédez immédiatement à votre espace d&apos;apprentissage personnalisé CampusForma avec toutes vos formations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Cours vidéo HD', 'Exercices pratiques', 'Certificats', 'Support 24/7'].map((item) => (
                <span key={item} className="px-4 py-2 rounded-full text-sm font-medium border" style={{ borderColor: 'var(--cf-border-light)', color: 'var(--cf-gray)' }}>{item}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
