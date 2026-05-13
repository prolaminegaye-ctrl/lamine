'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const skills = [
  { name: 'Python', level: 72, color: 'var(--accent)' },
  { name: 'Marketing Digital', level: 45, color: 'var(--teal)' },
  { name: 'Leadership', level: 58, color: 'var(--gold)' },
  { name: 'Data Analysis', level: 33, color: '#A78BFA' },
]

const badges = [
  { emoji: '🔥', name: 'Streak Master', desc: '7 jours consécutifs' },
  { emoji: '🎯', name: 'Objectif atteint', desc: '15h en une semaine' },
  { emoji: '🐍', name: 'Pythonista', desc: 'Module Python validé' },
  { emoji: '⭐', name: 'Top 10%', desc: 'Classement Data Science' },
]

export default function ProfilPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setEmail(user.email || '')
      const [{ data: p }, { data: e }] = await Promise.all([
        sb.from('profiles').select('*').eq('id', user.id).single(),
        sb.from('enrollments').select('id,progress_percent,enrolled_at,course:courses(title)').eq('user_id', user.id),
      ])
      setProfile(p)
      setFullName(p?.full_name || '')
      setBio(p?.bio || '')
      setEnrollments(e || [])
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return
    const { error } = await sb.from('profiles').update({ full_name: fullName, bio }).eq('id', user.id)
    setMsg(error ? error.message : 'Profil mis à jour ✓')
    setSaving(false)
  }

  const initials = fullName ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : (email[0] || 'U').toUpperCase()

  return (
    <div>
      <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '2rem' }}>Mon profil</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        <div>
          {/* Profile card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 auto 1rem',
              fontFamily: 'var(--font-display)'
            }}>{initials}</div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{fullName || 'Chargement...'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1rem' }}>{email}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>{enrollments.length}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cours</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--teal)' }}>🔥7</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Streak</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--gold)' }}>82</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Score</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1rem' }}>Badges obtenus</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {badges.map(b => (
                <div key={b.name} style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{b.emoji}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '2px' }}>{b.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Edit form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1.25rem' }}>Modifier le profil</h3>
            {msg && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', background: msg.includes('✓') ? 'rgba(32,212,168,0.12)' : 'rgba(240,90,90,0.12)', color: msg.includes('✓') ? 'var(--teal)' : 'var(--red)' }}>{msg}</div>
            )}
            <form onSubmit={save}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Nom complet</label>
                <input style={inputStyle} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Votre nom" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email</label>
                <input style={{ ...inputStyle, opacity: 0.6 }} value={email} disabled />
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Bio</label>
                <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Parlez de vous..." />
              </div>
              <button type="submit" disabled={saving} style={btnStyle}>{saving ? 'Enregistrement...' : 'Enregistrer les modifications'}</button>
            </form>
          </div>

          {/* Skills */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1.25rem' }}>Compétences acquises</h3>
            {skills.map(s => (
              <div key={s.name} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>{s.name}</span>
                  <span style={{ fontSize: '13px', color: s.color, fontWeight: '600' }}>{s.level}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.level}%`, background: s.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Learning history */}
          {enrollments.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '1rem' }}>Historique d&apos;apprentissage</h3>
              {enrollments.map((e: any) => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '500' }}>{e.course?.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{new Date(e.enrolled_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)' }}>{e.progress_percent || 0}%</div>
                    <div style={{ height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', width: '60px', marginTop: '4px' }}>
                      <div style={{ height: '100%', width: `${e.progress_percent || 0}%`, background: 'var(--accent)', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)',
  fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)', boxSizing: 'border-box'
}
const btnStyle: React.CSSProperties = {
  background: 'var(--accent)', border: 'none', borderRadius: '10px',
  padding: '10px 20px', color: '#fff', fontWeight: '600', fontSize: '14px',
  cursor: 'pointer', fontFamily: 'var(--font-display)'
}
