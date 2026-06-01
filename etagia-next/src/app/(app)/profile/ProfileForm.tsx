'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProfileForm({ profile, userEmail }: { profile: any, userEmail: string }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [msg, setMsg] = useState('')

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const sb = createClient()
    const { error } = await sb.from('profiles').update({ full_name: fullName, bio }).eq('id', profile.id)
    setMsg(error ? error.message : 'Profil mis à jour !')
    if (!error) router.refresh()
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ background: 'var(--red)' }}>
          {fullName?.[0] || userEmail[0].toUpperCase()}
        </div>
        <div>
          <div className="font-semibold" style={{ color: 'var(--ink)' }}>{fullName || 'Votre nom'}</div>
          <div className="text-sm" style={{ color: 'var(--ink-mut)' }}>{userEmail}</div>
          <div className="badge badge-red mt-1">{profile?.role || 'student'}</div>
        </div>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm"
          style={{ background: msg.includes('!') ? 'var(--green-soft)' : 'var(--red-soft)',
            color: msg.includes('!') ? 'var(--green)' : 'var(--red-deep)' }}>
          {msg}
        </div>
      )}

      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Nom complet</label>
          <input className="input-field" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Votre nom complet" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Email</label>
          <input className="input-field" value={userEmail} disabled style={{ opacity: 0.6 }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Bio</label>
          <textarea className="input-field" rows={3} value={bio} onChange={e => setBio(e.target.value)}
            placeholder="Parlez de vous..." />
        </div>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </form>
    </div>
  )
}
