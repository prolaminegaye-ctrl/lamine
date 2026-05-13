'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function EnrollButton({ courseId, price }: { courseId: string, price: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function enroll() {
    setLoading(true)
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { error } = await sb.from('enrollments').insert({
      user_id: user.id, course_id: courseId, progress_percent: 0
    })

    if (error) {
      setMsg(error.message)
    } else {
      setMsg('Inscription réussie !')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div>
      <button onClick={enroll} disabled={loading} className="btn-primary w-full justify-center py-3">
        {loading ? 'En cours...' : price === 0 ? 'S\'inscrire gratuitement' : `S'inscrire — ${price} FCFA`}
      </button>
      {msg && <p className="text-sm text-center mt-2" style={{ color: msg.includes('réussie') ? '#4ade80' : '#f87171' }}>{msg}</p>}
    </div>
  )
}
