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
    { label: 'Cours inscrits', value: enrollments?.length ?? 0, icon: BookOpen, color: 'var(--red)', bg: 'var(--red-soft)' },
    { label: 'Progression moy.', value: `${totalProgress}%`, icon: TrendingUp, color: 'var(--green)', bg: 'var(--green-soft)' },
    { label: 'Heures apprises', value: '12h', icon: Clock, color: 'var(--gold)', bg: 'var(--gold-soft)' },
    { label: 'Certificats', value: 0, icon: Award, color: 'var(--sage)', bg: 'var(--sage-soft)' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>
          Bonjour, {profile?.full_name || user?.email?.split('@')[0]} 👋
        </h1>
        <p style={{ color: 'var(--ink-mut)' }} className="mt-1">Continuez votre apprentissage</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: 'var(--ink-mut)' }}>{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* My courses */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Mes cours</h2>
          <Link href="/catalog" className="text-sm" style={{ color: 'var(--red)' }}>Voir le catalogue →</Link>
        </div>

        {(!enrollments || enrollments.length === 0) ? (
          <div className="card p-12 text-center">
            <BookOpen size={40} style={{ color: 'var(--ink-mut)' }} className="mx-auto mb-3" />
            <p style={{ color: 'var(--ink-mut)' }}>Aucun cours en cours. Explorez le catalogue !</p>
            <Link href="/catalog" className="btn-primary mt-4 inline-flex">Parcourir les cours</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((e: any) => (
              <Link key={e.id} href={`/course/${e.course?.id}`} className="card p-4 hover:border-[var(--red)] transition-colors block">
                <div className="w-full h-32 rounded-lg mb-3 flex items-center justify-center text-3xl"
                  style={{ background: 'var(--card-2)' }}>
                  {e.course?.thumbnail_url ? (
                    <img src={e.course.thumbnail_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : '📚'}
                </div>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: 'var(--ink)' }}>
                  {e.course?.title}
                </h3>
                <div className="progress-bar mb-1">
                  <div className="progress-fill" style={{ width: `${e.progress_percent || 0}%` }} />
                </div>
                <p className="text-xs" style={{ color: 'var(--ink-mut)' }}>{e.progress_percent || 0}% complété</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Discover */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--ink)' }}>Découvrir</h2>
          <Link href="/catalog" className="text-sm" style={{ color: 'var(--red)' }}>Tout voir →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(courses || []).map((c: any) => (
            <Link key={c.id} href={`/course/${c.id}`} className="card p-4 hover:border-[var(--red)] transition-colors block">
              <div className="w-full h-24 rounded-lg mb-3 flex items-center justify-center text-2xl"
                style={{ background: 'var(--card-2)' }}>📖</div>
              <h3 className="font-semibold text-sm line-clamp-2 mb-1" style={{ color: 'var(--ink)' }}>{c.title}</h3>
              <p className="text-xs" style={{ color: 'var(--ink-mut)' }}>
                {c.instructor?.full_name || 'Instructeur'} · <span className="badge badge-red">{c.level}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
