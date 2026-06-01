'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, BookOpen, Users, TrendingUp, Trash2 } from 'lucide-react'

export default function AdminPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState({ courses: 0, users: 0, enrollments: 0 })
  const [tab, setTab] = useState<'courses' | 'users' | 'add'>('courses')
  const [form, setForm] = useState({ title: '', description: '', level: 'beginner', price: '0', content_type: 'text', language: 'fr' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const sb = createClient()
    Promise.all([
      sb.from('courses').select('*, instructor:profiles(full_name)').order('created_at', { ascending: false }),
      sb.from('profiles').select('*').order('created_at', { ascending: false }),
      sb.from('enrollments').select('id', { count: 'exact', head: true }),
    ]).then(([{ data: c }, { data: u }, { count: e }]) => {
      setCourses(c || [])
      setUsers(u || [])
      setStats({ courses: c?.length || 0, users: u?.length || 0, enrollments: e || 0 })
    })
  }, [])

  async function addCourse(e: React.FormEvent) {
    e.preventDefault()
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    const { error, data } = await sb.from('courses').insert({
      ...form, price: Number(form.price), instructor_id: user!.id, status: 'published'
    }).select().single()
    if (error) { setMsg(error.message); return }
    // Add a default module + lesson
    const { data: mod } = await sb.from('modules').insert({ course_id: data.id, title: 'Module 1', order_index: 0 }).select().single()
    if (mod) {
      await sb.from('lessons').insert({
        module_id: mod.id, title: 'Leçon 1', content_type: form.content_type,
        order_index: 0, is_free_preview: true
      })
    }
    setCourses(prev => [data, ...prev])
    setStats(s => ({ ...s, courses: s.courses + 1 }))
    setMsg('Cours créé avec succès !')
    setTab('courses')
  }

  async function deleteCourse(id: string) {
    if (!confirm('Supprimer ce cours ?')) return
    const sb = createClient()
    await sb.from('courses').delete().eq('id', id)
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  const levelLabel: any = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--ink)' }}>Administration</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Cours publiés', value: stats.courses, icon: BookOpen, color: 'var(--red)', bg: 'var(--red-soft)' },
          { label: 'Utilisateurs', value: stats.users, icon: Users, color: 'var(--sage)', bg: 'var(--sage-soft)' },
          { label: 'Inscriptions', value: stats.enrollments, icon: TrendingUp, color: 'var(--green)', bg: 'var(--green-soft)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--ink-mut)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['courses', 'users', 'add'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setMsg('') }}
            className={tab === t ? 'btn-primary' : 'btn-outline'}>
            {t === 'courses' ? 'Cours' : t === 'users' ? 'Utilisateurs' : '+ Ajouter un cours'}
          </button>
        ))}
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-lg text-sm"
          style={{ background: msg.includes('!') ? 'var(--green-soft)' : 'var(--red-soft)',
            color: msg.includes('!') ? 'var(--green)' : 'var(--red-deep)' }}>
          {msg}
        </div>
      )}

      {/* Courses table */}
      {tab === 'courses' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--card-2)' }}>
                {['Titre', 'Niveau', 'Prix', 'Statut', 'Instructeur', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: 'var(--ink-mut)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courses.map((c: any) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{c.title}</td>
                  <td className="px-4 py-3"><span className="badge badge-red">{levelLabel[c.level] || c.level}</span></td>
                  <td className="px-4 py-3" style={{ color: c.price === 0 ? 'var(--green)' : 'var(--red)' }}>
                    {c.price === 0 ? 'Gratuit' : `${c.price} FCFA`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.status === 'published' ? 'badge-green' : 'badge-gray'}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-mut)' }}>{c.instructor?.full_name || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteCourse(c.id)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--ink-mut)' }}>Aucun cours</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Users table */}
      {tab === 'users' && (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', background: 'var(--card-2)' }}>
                {['Nom', 'Email', 'Rôle', 'Inscrit le'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: 'var(--ink-mut)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--ink)' }}>{u.full_name || '—'}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-mut)' }}>{u.email}</td>
                  <td className="px-4 py-3"><span className="badge badge-red">{u.role}</span></td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-mut)' }}>
                    {new Date(u.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add course form */}
      {tab === 'add' && (
        <div className="card p-6 max-w-xl">
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--ink)' }}>Créer un nouveau cours</h2>
          <form onSubmit={addCourse} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Titre</label>
              <input className="input-field" required value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Titre du cours" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Description</label>
              <textarea className="input-field" rows={3} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Niveau</label>
                <select className="input-field" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Prix (FCFA)</label>
                <input className="input-field" type="number" min="0" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink-mut)' }}>Type de contenu</label>
              <select className="input-field" value={form.content_type} onChange={e => setForm(f => ({ ...f, content_type: e.target.value }))}>
                <option value="text">Texte</option>
                <option value="video">Vidéo</option>
                <option value="pdf">PDF</option>
                <option value="scorm">SCORM 1.2</option>
                <option value="h5p">H5P</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3">
              <Plus size={16} /> Créer le cours
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
