'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const sb = createClient()
    const { error } = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } }
    })
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'var(--red)' }}>
            <span className="text-white text-2xl font-bold">F</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--ink)' }}>ETAGIA</h1>
          <p style={{ color: 'var(--ink-mut)' }} className="mt-1">Créez votre compte</p>
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--ink)' }}>Inscription</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'var(--red-soft)', color: 'var(--red-deep)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>
                Nom complet
              </label>
              <input type="text" className="input-field" placeholder="Votre nom" value={fullName}
                onChange={e => setFullName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>
                Email
              </label>
              <input type="email" className="input-field" placeholder="vous@exemple.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>
                Mot de passe
              </label>
              <input type="password" className="input-field" placeholder="Min. 6 caractères" value={password}
                onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--ink-mut)' }}>
            Déjà un compte ?{' '}
            <Link href="/auth/login" style={{ color: 'var(--red)' }} className="font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
