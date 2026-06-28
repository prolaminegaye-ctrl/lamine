import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import PageHero from '@/components/content/PageHero';
import { blogPosts } from '@/data/siteContent';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <main>
      <PageHero eyebrow="Blog" title={post.title} intro={post.excerpt} />
      <article className="container-cf max-w-[760px] py-14 sm:py-20">
        {post.paragraphs.map((paragraph) => <p key={paragraph} className="text-base sm:text-lg leading-8 mb-6" style={{ color: 'var(--cf-gray-medium)' }}>{paragraph}</p>)}
        <Link to="/blog" className="inline-flex items-center gap-2 font-semibold mt-4 hover:text-[#72b249]"><ArrowLeft size={17} /> Tous les articles</Link>
      </article>
    </main>
  );
}
