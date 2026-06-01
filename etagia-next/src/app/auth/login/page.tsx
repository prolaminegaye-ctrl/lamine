'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--paper)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: 'var(--red)' }}>
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--ink)' }}>ETAGIA</h1>
          <p style={{ color: 'var(--ink-mut)' }} className="mt-1">Plateforme LMS Africaine</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--ink)' }}>Connexion</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'var(--red-soft)', color: 'var(--red-deep)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="vous@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>
                Mot de passe
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--ink-mut)' }}>
            Pas encore de compte ?{' '}
            <Link href="/auth/register" style={{ color: 'var(--red)' }} className="font-medium hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-4 rounded-lg" style={{ background: 'var(--red-soft)', border: '1px solid rgba(229,64,42,0.25)' }}>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--red-deep)' }}>Compte démo</p>
          <p className="text-xs" style={{ color: 'var(--ink-mut)' }}>
            Créez un compte pour accéder à la plateforme. Les cours démo seront ajoutés automatiquement.
          </p>
        </div>
      </div>
    </div>
  )
}
