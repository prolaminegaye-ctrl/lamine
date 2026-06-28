import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, BookOpen, Award, ShoppingCart, ArrowLeft, Star, Users } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useCourse, useCourses } from '@/hooks/useCourses';

export default function FormationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { data: course, isLoading } = useCourse(id);
  const { data: allCourses = [] } = useCourses();
  const isInCart = items.some((i) => i.id === id);

  if (isLoading) {
    return <main className="pt-[72px] min-h-screen"><div className="container-cf py-24 text-center text-[#777]">Chargement de la formation…</div></main>;
  }

  if (!course) {
    return (
      <main className="pt-[72px] min-h-screen">
        <div className="container-cf py-24 text-center">
          <h2 className="section-title mb-4">Formation non trouvée</h2>
          <button onClick={() => navigate('/formations')} className="btn-primary">Retour au catalogue</button>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      image: course.image,
      instructor: course.instructor,
      duration: course.duration,
      category: course.category,
    });
  };

  const levelClasses: Record<string, string> = {
    'Débutant': 'tag-level-debutant',
    'Intermédiaire': 'tag-level-intermediaire',
    'Avancé': 'tag-level-avance',
    'Tous niveaux': 'tag-level-tous',
  };

  const relatedCourses = allCourses.filter((c) => c.category === course.category && c.id !== course.id).slice(0, 3);

  return (
    <main className="pt-[72px]">
      <section className="w-full py-12" style={{ background: 'linear-gradient(135deg, #eef6e8 0%, #ffffff 100%)' }}>
        <div className="container-cf">
          <button onClick={() => navigate('/formations')}
            className="flex items-center gap-2 text-sm mb-6 hover:text-[#72b249] transition-colors"
            style={{ color: 'var(--cf-gray)' }}>
            <ArrowLeft size={16} /> Retour au catalogue
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src={course.image} alt={course.title} className="w-full h-auto object-cover" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#72b249' }}>{course.category}</span>
                <span className={`tag-level ${levelClasses[course.level]}`}>{course.level}</span>
                {course.certification && (
                  <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#eef6e8', color: '#72b249' }}>
                    <Award size={11} /> Certifiante
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl md:text-4xl font-bold text-black leading-tight mb-4">{course.title}</h1>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--cf-gray)' }}>{course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--cf-gray)' }}><Clock size={16} style={{ color: '#72b249' }} /> {course.duration}</span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--cf-gray)' }}><BookOpen size={16} style={{ color: '#72b249' }} /> {course.lessons} leçons</span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--cf-gray)' }}><Users size={16} style={{ color: '#72b249' }} /> +1 200 apprenants</span>
                <span className="flex items-center gap-1 text-sm"><Star size={14} fill="#FFC300" color="#FFC300" /><strong className="text-black">4.8</strong><span style={{ color: 'var(--cf-gray-light)' }}>(126 avis)</span></span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="font-heading text-3xl font-bold" style={{ color: '#72b249' }}>{course.price.toLocaleString('fr-FR')} FCFA</span>
                <button onClick={handleAddToCart} disabled={isInCart} className={`btn-primary ${isInCart ? 'opacity-70' : ''}`}>
                  {isInCart ? (<><CheckCircle size={18} /> Ajouté au panier</>) : (<><ShoppingCart size={18} /> Ajouter au panier</>)}
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: 'var(--cf-gray-light)' }}>
                <span className="flex items-center gap-1"><Award size={12} /> Certificat CampusForma</span>
                <span>·</span>
                <span className="flex items-center gap-1">Accès illimité 12 mois</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="w-full py-16 bg-white">
        <div className="container-cf max-w-[800px]">
          <ScrollReveal>
            <h2 className="section-title mb-8">Programme de la formation</h2>
            <div className="space-y-4">
              {[
                { module: 'Module 1', title: 'Introduction et fondamentaux', desc: 'Les bases essentielles pour bien démarrer' },
                { module: 'Module 2', title: 'Les concepts clés', desc: 'Approfondissement des notions fondamentales' },
                { module: 'Module 3', title: 'Mise en pratique', desc: 'Exercices et projets concrets' },
                { module: 'Module 4', title: 'Perfectionnement', desc: 'Techniques avancées et astuces expertes' },
                { module: 'Module 5', title: 'Évaluation finale', desc: 'Test de compétences et certification' },
              ].map((m, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-xl border border-[#EEEEEE] hover:border-[#72b249] hover:shadow-md transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-white" style={{ backgroundColor: '#72b249' }}>{i + 1}</div>
                  <div>
                    <span className="text-xs font-medium" style={{ color: '#72b249' }}>{m.module}</span>
                    <h4 className="font-heading font-semibold text-black">{m.title}</h4>
                    <p className="text-sm" style={{ color: 'var(--cf-gray-light)' }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {relatedCourses.length > 0 && (
        <section className="w-full py-16" style={{ backgroundColor: 'var(--cf-bg)' }}>
          <div className="container-cf">
            <ScrollReveal><h2 className="section-title mb-8">Formations similaires</h2></ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCourses.map((c, i) => (
                <ScrollReveal key={c.id} delay={i * 0.1}>
                  <button onClick={() => navigate(`/formations/${c.id}`)}
                    className="w-full text-left bg-white rounded-2xl overflow-hidden border border-[#EEEEEE] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <img src={c.image} alt={c.title} className="w-full h-40 object-cover" />
                    <div className="p-5">
                      <h4 className="font-heading font-semibold text-black mb-1">{c.title}</h4>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold" style={{ color: '#72b249' }}>{c.price.toLocaleString('fr-FR')} FCFA</span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--cf-gray-light)' }}><Clock size={12} /> {c.duration}</span>
                      </div>
                    </div>
                  </button>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
