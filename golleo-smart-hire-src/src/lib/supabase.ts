import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  role?: 'learner' | 'teacher' | 'admin'
  country?: string
  learning_profile?: Record<string, unknown>
  streak_days?: number
  total_xp?: number
  created_at?: string
}

export type TestType = 'afri-code' | 'afri-skill' | 'ikigai' | 'personnalite' | 'projet'

export interface GolleoTestResult {
  id?: string
  user_id: string
  test_type: TestType
  results: Record<string, unknown>
  score?: number
  summary?: string
  created_at?: string
}

export interface GolleoCV {
  id?: string
  user_id: string
  template: string
  cv_data: Record<string, unknown>
  updated_at?: string
}

export interface GolleoParcours {
  id?: string
  user_id: string
  current_step: string
  completed: string[]
  score_global: number
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } }
  })
  if (data.user && !error) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      role: 'learner',
    })
  }
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ─── Profil ──────────────────────────────────────────────────────────────────

export async function getProfile(): Promise<Profile | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}

export async function updateProfile(updates: Partial<Profile>) {
  const user = await getCurrentUser()
  if (!user) return { error: new Error('Non connecté') }
  return supabase.from('profiles').update(updates).eq('id', user.id)
}

// ─── Résultats tests ─────────────────────────────────────────────────────────

export async function saveTestResult(
  testType: TestType,
  results: Record<string, unknown>,
  score?: number,
  summary?: string
) {
  const user = await getCurrentUser()
  if (!user) {
    // Fallback localStorage si non connecté
    const key = `golleo_test_${testType}`
    localStorage.setItem(key, JSON.stringify({ testType, results, score, summary, date: new Date().toISOString() }))
    return { data: null, error: null, offline: true }
  }
  return supabase.from('golleo_test_results').insert({
    user_id: user.id,
    test_type: testType,
    results,
    score,
    summary,
  })
}

export async function getTestResults(testType?: TestType) {
  const user = await getCurrentUser()
  if (!user) return { data: [], error: null }

  let query = supabase
    .from('golleo_test_results')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (testType) query = query.eq('test_type', testType)
  return query
}

// ─── CV ───────────────────────────────────────────────────────────────────────

export async function saveCV(template: string, cvData: Record<string, unknown>) {
  const user = await getCurrentUser()
  if (!user) {
    localStorage.setItem('golleo_cv', JSON.stringify({ template, cvData }))
    return { data: null, error: null, offline: true }
  }
  return supabase.from('golleo_cvs').upsert({
    user_id: user.id,
    template,
    cv_data: cvData,
  }, { onConflict: 'user_id' })
}

export async function getCV(): Promise<GolleoCV | null> {
  const user = await getCurrentUser()
  if (!user) {
    const stored = localStorage.getItem('golleo_cv')
    return stored ? JSON.parse(stored) : null
  }
  const { data } = await supabase.from('golleo_cvs').select('*').eq('user_id', user.id).single()
  return data
}

// ─── Parcours ─────────────────────────────────────────────────────────────────

export async function getParcours(): Promise<GolleoParcours | null> {
  const user = await getCurrentUser()
  if (!user) return null
  const { data } = await supabase.from('golleo_parcours').select('*').eq('user_id', user.id).single()
  return data
}

export async function updateParcours(updates: Partial<GolleoParcours>) {
  const user = await getCurrentUser()
  if (!user) return { error: new Error('Non connecté') }
  return supabase.from('golleo_parcours').upsert({
    user_id: user.id,
    ...updates,
  }, { onConflict: 'user_id' })
}
