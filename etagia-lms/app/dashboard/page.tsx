'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const DEMO_COURSES = [
  { id: 'd1', title: 'Data Science avec Python', progress: 72, category: 'Tech', color: 'var(--accent)', lessons: 24, completed: 17 },
  { id: 'd2', title: 'Marketing Digital Afrique', progress: 45, category: 'Business', color: 'var(--teal)', lessons: 18, completed: 8 },
  { id: 'd3', title: 'Leadership & Management', progress: 30, category: 'Soft Skills', color: 'var(--gold)', lessons: 12, completed: 4 },
]

const DEMO_RECOMMENDED = [
  { title: 'IA Générative pour pros', tag: 'Nouveau', color: 'var(--accent)' },
  { title: 'Comptabilité SME Afrique', tag: 'Populaire', color: 'var(--teal)' },
  { title: 'Pitch & Fundraising', tag: 'Tendance', color: 'var(--gold)' },
]

export default function DashboardPage() {
  const [userName, setUserName] = useState('Apprenant')
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [recommended, setRecommended] = useState<any[]>([])
  const [stats, setStats] = useState({ enrolled: 0, avgProgress: 0, score: 82, hours: 12 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return

      const [{ data: profile }, { data: enrolled }, { data: courses }] = await Promise.all([
        sb.from('profiles').select('full_name').eq('id', user.id).single(),
        sb.from('enrollments').select('*, course:courses(id,title,duration_minutes)').eq('user_id', user.id).limit(6),
        sb.from('courses').select('id,title,category:categories(name)').eq('status', 'published').limit(4),
      ])

      setUserName(profile?.full_name || user.email?.split('@')[0] || 'Apprenant')

      const myEnrollments = enrolled?.length ? enrolled : DEMO_COURSES
      const avgProgress = myEnrollments.length
        ? Math.round(myEnrollments.reduce((s: number, e: any) => s + (e.progress_percent || e.progress || 0), 0) / myEnrollments.length)
        : 0

      setEnrollments(myEnrollments)
      setStats({ enrolled: myEnrollments.length, avgProgress, score: 82, hours: 12 })
      setRecommended(courses?.length ? courses.map((c: any) => ({ title: c.title, tag: 'Disponible', color: 'var(--accent)', id: c.id })) : DEMO_RECOMMENDED)
      setLoading(false)
    })
  }, [])

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const firstName = userName.split(' ')[0]

  const kpis = [
    { label: 'Cours en cours', value: String(stats.enrolled), icon: '◈', color: 'var(--accent)', bg: 'var(--accent-muted)' },
    { label: 'Progression', value: `${stats.avgProgress}%`, icon: '◎', color: 'var(--teal)', bg: 'var(--teal-muted)' },
    { label: 'Score moyen', value: `${stats.score}/100`, icon: '✦', color: 'var(--gold)', bg: 'var(--gold-muted)' },
    { label: 'Heures cette semaine', value: `${stats.hours}h`, icon: '⏱', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  ]

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⊞</div>
        <p>Chargement...</p>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '4px' }}>Bonjour, {firstName} 👋</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{today} · 7 jours de streak 🔥</p>
          </div>
          <div style={{
            background: 'var(--accent-muted)', border: '1px solid rgba(74,127,245,0.2)',
            borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>🎯</span>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Objectif hebdo</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)' }}>15h / semaine</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '16px', padding: '1.25rem'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', background: k.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', color: k.color, marginBottom: '12px'
            }}>{k.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Courses in progress */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Continuer l&apos;apprentissage</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {enrollments.map((e: any, i: number) => {
              const colors = ['var(--accent)', 'var(--teal)', 'var(--gold)', '#A78BFA']
              const color = colors[i % colors.length]
              const title = e.course?.title || e.title
              const progress = e.progress_percent ?? e.progress ?? 0
              const lessons = e.lessons || 0
              const completed = e.completed || 0
              const category = e.course?.category?.name || e.category || ''
              const courseId = e.course?.id || e.id

              return (
                <Link key={e.id || i} href={`/cours`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '14px', padding: '1rem 1.25rem', cursor: 'pointer',
                    transition: 'border-color .15s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '3px' }}>{title}</div>
                        {category && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{category}</span>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color, fontFamily: 'var(--font-display)' }}>{progress}%</div>
                        {lessons > 0 && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{completed}/{lessons} leçons</div>}
                      </div>
                    </div>
                    <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '2px', transition: 'width .3s' }} />
                    </div>
                  </div>
                </Link>
              )
            })}
            {enrollments.length === 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📚</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>Aucun cours en cours</p>
                <Link href="/cours" style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '600' }}>Parcourir le catalogue →</Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Recommandé pour toi</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recommended.map((r: any) => (
              <div key={r.title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1rem 1.25rem', cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{r.title}</div>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', color: r.color }}>{r.tag}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Tutor CTA */}
          <div style={{
            marginTop: '1rem', background: 'linear-gradient(135deg, rgba(74,127,245,0.1) 0%, rgba(32,212,168,0.1) 100%)',
            border: '1px solid rgba(74,127,245,0.2)', borderRadius: '14px', padding: '1.25rem',
            textAlign: 'center', cursor: 'pointer'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>✦</div>
            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>AI Tutor ETAGIA</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Posez vos questions, obtenez des explications personnalisées</div>
            <Link href="/tutor" style={{
              display: 'inline-block', background: 'var(--accent)', color: '#fff',
              borderRadius: '8px', padding: '7px 16px', fontSize: '13px',
              fontWeight: '600', textDecoration: 'none', fontFamily: 'var(--font-display)'
            }}>Ouvrir le Tutor →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
