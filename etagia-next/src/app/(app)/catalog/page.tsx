'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Search, Filter, Clock, Users, Star } from 'lucide-react'

const LEVELS = ['Tous', 'beginner', 'intermediate', 'advanced']

export default function CatalogPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('Tous')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    const sb = createClient()
    let q = sb.from('courses')
      .select('id,title,description,thumbnail_url,level,price,duration_minutes,instructor:profiles(full_name),category:categories(name)')
      .eq('status', 'published')

    if (search) q = q.ilike('title', `%${search}%`)
    if (level !== 'Tous') q = q.eq('level', level)
    if (categoryId) q = q.eq('category_id', categoryId)

    const { data } = await q.limit(24)
    setCourses(data || [])
    setLoading(false)
  }, [search, level, categoryId])

  useEffect(() => {
    const sb = createClient()
    sb.from('categories').select('*').then(({ data }) => setCategories(data || []))
    fetchCourses()
  }, [fetchCourses])

  const levelLabel = { beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' } as any

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>Catalogue de cours</h1>
        <p style={{ color: 'var(--text-muted)' }}>Explorez nos formations professionnelles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-60">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input-field pl-9" placeholder="Rechercher un cours..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <select className="input-field w-auto" value={level} onChange={e => setLevel(e.target.value)}>
          {LEVELS.map(l => <option key={l} value={l}>{l === 'Tous' ? 'Tous les niveaux' : levelLabel[l]}</option>)}
        </select>

        <select className="input-field w-auto" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">Toutes catégories</option>
          {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="w-full h-36 rounded-lg mb-3" style={{ background: 'var(--surface2)' }} />
              <div className="h-4 rounded mb-2" style={{ background: 'var(--surface2)', width: '80%' }} />
              <div className="h-3 rounded" style={{ background: 'var(--surface2)', width: '60%' }} />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Aucun cours trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((c: any) => (
            <Link key={c.id} href={`/course/${c.id}`}
              className="card flex flex-col hover:border-[var(--accent)] transition-all hover:-translate-y-0.5">
              <div className="w-full h-36 rounded-t-xl flex items-center justify-center text-3xl"
                style={{ background: 'var(--surface2)' }}>
                {c.thumbnail_url
                  ? <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover rounded-t-xl" />
                  : '📚'}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex gap-2 mb-2">
                  <span className="badge badge-orange">{levelLabel[c.level] || c.level}</span>
                  {c.category && <span className="badge badge-blue">{c.category.name}</span>}
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 flex-1" style={{ color: 'var(--text)' }}>
                  {c.title}
                </h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                  {c.description}
                </p>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>{c.instructor?.full_name || 'Instructeur'}</span>
                  <span className="font-semibold" style={{ color: c.price === 0 ? '#4ade80' : 'var(--accent)' }}>
                    {c.price === 0 ? 'Gratuit' : `${c.price} FCFA`}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
