import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import LessonPlayer from './LessonPlayer'

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: lesson } = await supabase.from('lessons')
    .select('*, module:modules(id, title, course_id, courses(id, title))')
    .eq('id', id).single()

  if (!lesson) notFound()

  const courseId = lesson.module?.course_id
  if (!lesson.is_free_preview) {
    const { data: enrollment } = await supabase.from('enrollments')
      .select('id').eq('user_id', user!.id).eq('course_id', courseId).single()
    if (!enrollment) redirect(`/course/${courseId}`)
  }

  const { data: progress } = await supabase.from('lesson_progress')
    .select('*').eq('user_id', user!.id).eq('lesson_id', id).single()

  // Load sibling lessons
  const { data: allLessons } = await supabase.from('lessons')
    .select('id, title, order_index, module_id, modules!inner(course_id)')
    .eq('modules.course_id', courseId)
    .order('order_index')

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3" style={{ background: 'var(--card)', borderBottom: '1px solid var(--line)' }}>
        <Link href={`/course/${courseId}`} className="btn-ghost flex items-center gap-1 text-sm">
          <ChevronLeft size={16} /> {lesson.module?.courses?.title}
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>{lesson.title}</h1>
        </div>
        <div className="text-xs" style={{ color: 'var(--ink-mut)' }}>
          {lesson.content_type.toUpperCase()}
        </div>
      </div>

      {/* Player */}
      <LessonPlayer lesson={lesson} userId={user!.id} initialProgress={progress} />
    </div>
  )
}
