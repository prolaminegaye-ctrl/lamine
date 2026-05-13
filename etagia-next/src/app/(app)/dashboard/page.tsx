import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: enrollments }, { data: courses }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('enrollments').select('*, course:courses(id,title,thumbnail_url,duration_minutes)')
      .eq('user_id', user!.id).order('enrolled_at', { ascending: false }).limit(6),
    supabase.from('courses').select('id,title,thumbnail_url,level,duration_minutes,instructor:profiles(full_name)')
      .eq('status', 'published').limit(4),
  ])

  const totalProgress = enrollments?.length
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress_percent || 0), 0) / enrollments.length)
    : 0

  const stats = [
    { label: 'Cours inscrits', value: enrollments?.length ?? 0, icon: BookOpen, color: '#E8794A' },
    { label: 'Progression moy.', value: `${totalProgress}%`, icon: TrendingUp, color: '#22c55e' },
    { label: 'Heures apprises', value: '12h', icon: Clock, color: '#3b82f6' },
    { label: 'Certificats', value: 0, icon: Award, color: '#a855f7' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Bonjour, {profile?.full_name || user?.email?.split('@')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="mt-1">Continuez votre apprentissage</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* My courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Mes cours</h2>
          <Link href="/catalog" className="text-sm" style={{ color: 'var(--accent)' }}>Voir le catalogue →</Link>
        </div>

        {(!enrollments || enrollments.length === 0) ? (
          <div className="card p-12 text-center">
            <BookOpen size={40} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
            <p style={{ color: 'var(--text-muted)' }}>Aucun cours en cours. Explorez le catalogue !</p>
            <Link href="/catalog" className="btn-primary mt-4 inline-flex">Parcourir les cours</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((e: any) => (
              <Link key={e.id} href={`/course/${e.course?.id}`} className="card p-4 hover:border-[var(--accent)] transition-colors block">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center text-3xl"
                  style={{ background: 'var(--surface2)' }}>
                  {e.course?.thumbnail_url ? (
                    <img src={e.course.thumbnail_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : '📚'}
                </div>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: 'var(--text)' }}>
                  {e.course?.title}
                </h3>
                <div className="progress-bar mb-1">
                  <div className="progress-fill" style={{ width: `${e.progress_percent || 0}%` }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{e.progress_percent || 0}% complété</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Discover */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Découvrir</h2>
          <Link href="/catalog" className="text-sm" style={{ color: 'var(--accent)' }}>Tout voir →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(courses || []).map((c: any) => (
            <Link key={c.id} href={`/course/${c.id}`} className="card p-4 hover:border-[var(--accent)] transition-colors block">
              <div className="w-full h-24 rounded-lg mb-3 flex items-center justify-center text-2xl"
                style={{ background: 'var(--surface2)' }}>📖</div>
              <h3 className="font-semibold text-sm line-clamp-2 mb-1" style={{ color: 'var(--text)' }}>{c.title}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {c.instructor?.full_name || 'Instructeur'} · <span className="badge badge-orange">{c.level}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
