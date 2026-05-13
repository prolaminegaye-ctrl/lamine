'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const sb = createClient()

    if (mode === 'login') {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await sb.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      })
      if (error) { setError(error.message); setLoading(false); return }
    }

    router.push('/dashboard')
    router.refresh()
  }

  // Quick demo login
  const demoLogin = async () => {
    setLoading(true)
    setError('')
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({
      email: 'demo@etagia.com', password: 'etagia2024'
    })
    if (error) {
      // Try creating demo account first
      const { error: signUpErr } = await sb.auth.signUp({
        email: 'demo@etagia.com', password: 'etagia2024',
        options: { data: { full_name: 'Demo Utilisateur' } }
      })
      if (signUpErr) { setError('Créez un compte pour tester'); setLoading(false); return }
      await sb.auth.signInWithPassword({ email: 'demo@etagia.com', password: 'etagia2024' })
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(74,127,245,0.14) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--teal) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#fff'
            }}>E</div>
            <span style={{ fontSize: '26px', fontWeight: '700', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>ETAGIA</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {mode === 'login' ? 'Bon retour 👋' : 'Rejoins la plateforme'}
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>
          {error && (
            <div style={{ background: 'rgba(240,90,90,0.12)', border: '1px solid rgba(240,90,90,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: '#F05A5A' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Nom complet</label>
                <input type="text" placeholder="Prénom Nom" style={inputStyle}
                  value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
            )}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="toi@exemple.com" style={inputStyle}
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" placeholder="••••••••" style={inputStyle}
                value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Connexion...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
              <span style={{ color: 'var(--accent)', fontWeight: '500' }}>{mode === 'login' ? "S'inscrire" : 'Se connecter'}</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button onClick={demoLogin} disabled={loading} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '8px 20px', fontSize: '13px',
            color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)'
          }}>
            ⚡ Accès démo rapide
          </button>
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
  width: '100%', background: 'var(--accent)', border: 'none', borderRadius: '10px',
  padding: '12px', color: '#fff', fontWeight: '600', fontSize: '15px',
  cursor: 'pointer', fontFamily: 'var(--font-display)', letterSpacing: '0.2px', transition: 'all .2s'
}
