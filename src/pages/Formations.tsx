import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ShoppingCart, PlayCircle, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useCourses } from '@/hooks/useCourses';
import { supabase } from '@/lib/supabase';

const ITEMS_PER_PAGE = 9;

const levelClasses: Record<string, string> = {
  'Débutant': 'tag-level-debutant',
  'Intermédiaire': 'tag-level-intermediaire',
  'Avancé': 'tag-level-avance',
  'Tous niveaux': 'tag-level-tous',
};

export default function Formations() {
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Pertinence');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const { addItem } = useCart();
  const { data: allCourses = [], isLoading, error } = useCourses();
  const categories = ['Toutes', ...new Set(allCourses.map((course) => course.category))];

  async function subscribeNewsletter(event: React.FormEvent) {
    event.preventDefault();
    setNewsletterStatus('Inscription en cours…');
    const { error: subscribeError } = await supabase.rpc('campusforma_subscribe_newsletter', {
      subscriber_email: newsletterEmail,
    });
    if (subscribeError) {
      setNewsletterStatus("Impossible de vous inscrire pour le moment.");
      return;
    }
    setNewsletterEmail('');
    setNewsletterStatus('Votre inscription est enregistrée. Merci !');
  }

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Toutes' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'Prix croissant') return a.price - b.price;
    if (sortBy === 'Prix décroissant') return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = sortedCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <main className="pt-[72px]">
      <section className="w-full pt-16 md:pt-20 pb-10" style={{ background: 'linear-gradient(to bottom, rgba(114,178,73,0.06), rgba(114,178,73,0))' }}>
        <div className="container-cf">
          <div className="text-[13px] mb-6" style={{ color: 'var(--cf-gray-light)' }}>
            <Link to="/" className="hover:text-[#72b249] transition-colors">Accueil</Link>
            <span className="mx-2">/</span>
            <span>Formations</span>
          </div>

          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-black leading-tight">
              Catalogue de formations <span style={{ color: '#72b249' }}>E-Learning</span>
            </h1>
            <p className="text-base mt-3 max-w-[600px]" style={{ color: 'var(--cf-gray-medium)' }}>
              +3000 heures de supports pédagogiques interactifs sur les thématiques les plus sollicitées. Formez-vous aux métiers d&apos;avenir.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative mt-8 max-w-[600px]">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--cf-gray-light)' }} />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Rechercher une formation, un domaine..."
                className="w-full py-3.5 pl-12 pr-5 rounded-xl border text-base transition-all duration-300 focus:outline-none"
                style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#72b249'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(114,178,73,0.12)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--cf-border)'; e.currentTarget.style.boxShadow = 'none'; }} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap gap-2 mt-5">
              {categories.map((cat) => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-300 border ${activeCategory === cat ? 'text-white border-transparent' : 'bg-white border-[var(--cf-border)] hover:border-[#72b249]'}`}
                  style={activeCategory === cat ? { backgroundColor: '#72b249' } : { color: 'var(--cf-gray-medium)' }}>
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="w-full pb-24 bg-white">
        <div className="container-cf">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <span className="text-sm" style={{ color: 'var(--cf-gray-light)' }}>{sortedCourses.length} formations trouvées</span>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--cf-gray-light)' }}>Trier par :</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="text-sm py-2 px-3 rounded-lg border cursor-pointer"
                style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray)' }}>
                <option>Pertinence</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-[#777]">Chargement du catalogue Supabase…</div>
          ) : error ? (
            <div className="text-center py-16 text-red-600">Le catalogue est momentanément indisponible.</div>
          ) : paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map((course, i) => (
                <ScrollReveal key={course.id} delay={i * 0.08}>
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
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--cf-gray-light)' }}><CheckCircle size={12} /> {course.lessons} leçons</span>
                        <span className={`tag-level ${levelClasses[course.level]}`}>{course.level}</span>
                      </div>
                      <div className="h-px w-full my-4" style={{ backgroundColor: 'var(--cf-border-light)' }} />
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg font-bold" style={{ color: '#72b249' }}>{course.price.toLocaleString('fr-FR')} FCFA</span>
                        <button onClick={() => addItem({ id: course.id, title: course.title, price: course.price, image: course.image, instructor: course.instructor, duration: course.duration, category: course.category })}
                          className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md"
                          style={{ color: '#72b249', backgroundColor: '#eef6e8' }}>
                          <ShoppingCart size={14} /> Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: 'var(--cf-gray)' }}>Aucune formation ne correspond à votre recherche.</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('Toutes'); }} className="btn-primary mt-4">Réinitialiser les filtres</button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:border-[#72b249]'}`}
                style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-black)' }}>
                <ChevronLeft size={16} /> Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${currentPage === page ? 'text-black border' : 'text-[var(--cf-gray-light)] hover:bg-[var(--cf-bg)]'}`}
                  style={currentPage === page ? { backgroundColor: 'var(--cf-bg)', borderColor: 'var(--cf-border)' } : {}}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:border-[#72b249]'}`}
                style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-black)' }}>
                Suivant <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="w-full py-16 bg-white border-t" style={{ borderColor: 'var(--cf-border-light)' }}>
        <div className="container-cf max-w-[600px] text-center">
          <ScrollReveal>
            <h3 className="font-heading text-xl font-semibold text-black">Ne manquez aucune nouvelle formation</h3>
            <p className="text-sm mt-2" style={{ color: 'var(--cf-gray-light)' }}>Inscrivez-vous à notre newsletter et recevez les nouveaux cours et offres exclusives.</p>
            <form onSubmit={subscribeNewsletter} className="flex flex-col sm:flex-row gap-3 mt-6">
              <input type="email" required value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Votre adresse email"
                className="flex-1 py-3 px-4 rounded-lg border text-base transition-all focus:outline-none"
                style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-gray-medium)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#72b249'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(114,178,73,0.12)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--cf-border)'; e.currentTarget.style.boxShadow = 'none'; }} />
              <button className="btn-primary py-3 px-6">S&apos;inscrire</button>
            </form>
            {newsletterStatus && <p className="text-sm mt-3 text-[#4d8a2f]">{newsletterStatus}</p>}
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
