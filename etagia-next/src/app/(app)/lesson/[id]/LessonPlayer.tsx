'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Circle } from 'lucide-react'

interface Props {
  lesson: any
  userId: string
  initialProgress: any
}

export default function LessonPlayer({ lesson, userId, initialProgress }: Props) {
  const [completed, setCompleted] = useState(initialProgress?.completed || false)
  const [saving, setSaving] = useState(false)
  const scormRef = useRef<HTMLIFrameElement>(null)

  // Inject SCORM 1.2 API in parent window for iframe access
  useEffect(() => {
    if (lesson.content_type !== 'scorm') return
    const sb = createClient()

    const api = {
      LMSInitialize: (_: string) => 'true',
      LMSSetValue: async (key: string, value: string) => {
        await sb.from('scorm_sessions').upsert({
          user_id: userId, lesson_id: lesson.id, [key.replace(/\./g, '_')]: value
        }, { onConflict: 'user_id,lesson_id' })
        if (key === 'cmi.core.lesson_status' && (value === 'completed' || value === 'passed')) {
          markComplete()
        }
        return 'true'
      },
      LMSGetValue: (_: string) => '',
      LMSCommit: (_: string) => 'true',
      LMSFinish: (_: string) => { markComplete(); return 'true' },
      LMSGetLastError: () => '0',
      LMSGetErrorString: (_: string) => '',
      LMSGetDiagnostic: (_: string) => '',
    };

    (window as any).API = api
    return () => { delete (window as any).API }
  }, [lesson, userId])

  // H5P xAPI listener
  useEffect(() => {
    if (lesson.content_type !== 'h5p') return
    function onMessage(e: MessageEvent) {
      if (e.data?.action === 'xAPIResult' || e.data?.statement?.verb?.id?.includes('completed')) {
        markComplete()
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [lesson])

  async function markComplete() {
    if (completed || saving) return
    setSaving(true)
    const sb = createClient()
    await sb.from('lesson_progress').upsert({
      user_id: userId, lesson_id: lesson.id, completed: true, updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,lesson_id' })
    setCompleted(true)
    setSaving(false)
  }

  async function toggleComplete() {
    const sb = createClient()
    const newVal = !completed
    await sb.from('lesson_progress').upsert({
      user_id: userId, lesson_id: lesson.id, completed: newVal, updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,lesson_id' })
    setCompleted(newVal)
  }

  return (
    <div className="flex flex-1">
      {/* Content area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4" style={{ background: 'var(--bg)' }}>
          {lesson.content_type === 'video' && lesson.content_url && (
            <div className="w-full max-w-4xl mx-auto">
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                <iframe src={lesson.content_url} className="w-full h-full" allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            </div>
          )}

          {lesson.content_type === 'h5p' && lesson.content_url && (
            <div className="w-full max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden" style={{ background: 'white' }}>
                <iframe ref={scormRef} src={lesson.content_url} className="w-full" style={{ height: '500px', border: 'none' }}
                  allowFullScreen allow="autoplay" />
              </div>
              <script src="https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js" async />
            </div>
          )}

          {lesson.content_type === 'scorm' && lesson.content_url && (
            <div className="w-full max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <iframe ref={scormRef} src={lesson.content_url} className="w-full" style={{ height: '600px', border: 'none' }} />
              </div>
            </div>
          )}

          {lesson.content_type === 'pdf' && lesson.content_url && (
            <div className="w-full max-w-4xl mx-auto">
              <iframe src={lesson.content_url} className="w-full rounded-xl" style={{ height: '80vh', border: 'none' }} />
            </div>
          )}

          {(lesson.content_type === 'text' || !lesson.content_url) && lesson.content_body && (
            <div className="max-w-3xl mx-auto card p-8">
              <div className="prose prose-invert max-w-none" style={{ color: 'var(--text)' }}
                dangerouslySetInnerHTML={{ __html: lesson.content_body }} />
            </div>
          )}

          {lesson.content_type === 'quiz' && (
            <div className="max-w-2xl mx-auto card p-8 text-center">
              <div className="text-4xl mb-4">❓</div>
              <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Quiz — {lesson.title}</h2>
              <p style={{ color: 'var(--text-muted)' }}>Questionnaire interactif</p>
              {lesson.content_body && (
                <div className="mt-4 text-left" dangerouslySetInnerHTML={{ __html: lesson.content_body }} />
              )}
            </div>
          )}
        </div>

        {/* Mark complete bar */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {lesson.duration_minutes ? `Durée estimée: ${lesson.duration_minutes} min` : ''}
          </span>
          <button onClick={toggleComplete}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${completed ? 'text-green-400' : 'btn-primary'}`}
            style={completed ? { background: 'rgba(34,197,94,0.15)' } : {}}>
            {completed ? <><CheckCircle size={16} /> Complété</> : <><Circle size={16} /> Marquer comme complété</>}
          </button>
        </div>
      </div>
    </div>
  )
}
