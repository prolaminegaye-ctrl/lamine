import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/content/PageHero';
import { blogPosts } from '@/data/siteContent';

export default function Blog() {
  return (
    <main>
      <PageHero eyebrow="Blog" title="Des repères pour construire votre parcours" intro="Conseils pratiques sur la formation en ligne, la VAE et l'évolution professionnelle." />
      <section className="py-16 sm:py-20 bg-white">
        <div className="container-cf max-w-[1100px] grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <article key={post.slug} className="rounded-2xl border p-6 sm:p-8 flex flex-col shadow-sm">
              <p className="text-sm font-semibold" style={{ color: 'var(--cf-green)' }}>Conseils CampusForma</p>
              <h2 className="font-heading text-xl font-bold mt-3">{post.title}</h2>
              <p className="mt-3 leading-relaxed flex-1" style={{ color: 'var(--cf-gray-medium)' }}>{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-semibold mt-6 hover:text-[#72b249]">Lire l’article <ArrowRight size={17} /></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
