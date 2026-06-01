import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
  const { data: enrollments } = await supabase.from('enrollments')
    .select('id, progress_percent, enrolled_at, course:courses(title)').eq('user_id', user!.id)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--ink)' }}>Mon profil</h1>
      <ProfileForm profile={profile} userEmail={user!.email!} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--ink)' }}>
          Historique d&apos;apprentissage
        </h2>
        <div className="space-y-3">
          {(enrollments || []).map((e: any) => (
            <div key={e.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--ink)' }}>{e.course?.title}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--ink-mut)' }}>
                  Inscrit le {new Date(e.enrolled_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold" style={{ color: 'var(--red)' }}>{e.progress_percent || 0}%</div>
                <div className="progress-bar w-24 mt-1">
                  <div className="progress-fill" style={{ width: `${e.progress_percent || 0}%` }} />
                </div>
              </div>
            </div>
          ))}
          {(!enrollments || enrollments.length === 0) && (
            <p style={{ color: 'var(--ink-mut)' }}>Aucun cours suivi pour l&apos;instant.</p>
          )}
        </div>
      </div>
    </div>
  )
}
