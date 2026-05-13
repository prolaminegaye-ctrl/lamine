import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, Clock, Users, Award, ChevronRight, Play } from 'lucide-react'
import EnrollButton from './EnrollButton'

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: course }, { data: enrollment }] = await Promise.all([
    supabase.from('courses')
      .select('*, instructor:profiles(full_name, bio, avatar_url), category:categories(name), modules(id,title,order_index,lessons(id,title,content_type,duration_minutes,order_index,is_free_preview))')
      .eq('id', id).single(),
    supabase.from('enrollments').select('id,progress_percent').eq('user_id', user!.id).eq('course_id', id).single(),
  ])

  if (!course) notFound()

  const modules = (course.modules || []).sort((a: any, b: any) => a.order_index - b.order_index)
  const totalLessons = modules.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0)
  const firstLesson = modules[0]?.lessons?.sort((a: any, b: any) => a.order_index - b.order_index)[0]

  const typeIcon = { video: '▶', pdf: '📄', scorm: '🎓', h5p: '🎮', text: '📝', quiz: '❓' } as any

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link href="/catalog" className="hover:underline">Catalogue</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text)' }}>{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Thumbnail */}
          <div className="w-full h-56 rounded-xl mb-6 flex items-center justify-center text-5xl"
            style={{ background: 'var(--surface2)' }}>
            {course.thumbnail_url
              ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover rounded-xl" />
              : '📚'}
          </div>

          <div className="flex gap-2 mb-3">
            <span className="badge badge-orange">{course.level}</span>
            {course.category && <span className="badge badge-blue">{course.category.name}</span>}
          </div>

          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>{course.title}</h1>
          <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{course.description}</p>

          {/* Instructor */}
          {course.instructor && (
            <div className="card p-4 flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: 'var(--accent)', color: 'white' }}>
                {course.instructor.full_name?.[0] || 'I'}
              </div>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text)' }}>{course.instructor.full_name}</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Instructeur</div>
              </div>
            </div>
          )}

          {/* Modules */}
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
            Programme ({totalLessons} leçons)
          </h2>
          <div className="space-y-3">
            {modules.map((mod: any) => (
              <div key={mod.id} className="card overflow-hidden">
                <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <h3 className="font-medium" style={{ color: 'var(--text)' }}>{mod.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {mod.lessons?.length || 0} leçon(s)
                  </p>
                </div>
                <div>
                  {(mod.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index).map((lesson: any) => (
                    <div key={lesson.id} className="flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom: '1px solid var(--border)' }}>
                      <span className="text-base">{typeIcon[lesson.content_type] || '📝'}</span>
                      <span className="flex-1 text-sm" style={{ color: 'var(--text)' }}>{lesson.title}</span>
                      {lesson.duration_minutes && (
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{lesson.duration_minutes}min</span>
                      )}
                      {(enrollment || lesson.is_free_preview) && (
                        <Link href={`/lesson/${lesson.id}`}
                          className="text-xs px-2 py-1 rounded" style={{ background: 'var(--accent)', color: 'white' }}>
                          Voir
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar CTA */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <div className="text-3xl font-bold mb-1" style={{ color: course.price === 0 ? '#4ade80' : 'var(--accent)' }}>
              {course.price === 0 ? 'Gratuit' : `${course.price} FCFA`}
            </div>

            <div className="space-y-2 my-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-2"><BookOpen size={14} /> {totalLessons} leçons</div>
              {course.duration_minutes && (
                <div className="flex items-center gap-2"><Clock size={14} /> {Math.round(course.duration_minutes / 60)}h de contenu</div>
              )}
              <div className="flex items-center gap-2"><Award size={14} /> Certificat inclus</div>
            </div>

            {enrollment ? (
              <div className="space-y-3">
                <div className="p-3 rounded-lg text-center text-sm" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                  ✓ Inscrit — {enrollment.progress_percent || 0}% complété
                </div>
                {firstLesson && (
                  <Link href={`/lesson/${firstLesson.id}`} className="btn-primary w-full justify-center py-3">
                    <Play size={16} /> Continuer
                  </Link>
                )}
              </div>
            ) : (
              <EnrollButton courseId={id} price={course.price} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
