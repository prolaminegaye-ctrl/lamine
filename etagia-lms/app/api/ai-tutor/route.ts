import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MAX_MESSAGES = 30
const MAX_CONTENT_LENGTH = 8000

export async function POST(req: NextRequest) {
  // Défense en profondeur : le proxy bloque déjà les requêtes anonymes,
  // mais la route revérifie la session avant de consommer du crédit API.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
  }

  const { messages } = await req.json()
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES
    || messages.some((m: { content?: unknown }) => typeof m?.content !== 'string' || m.content.length > MAX_CONTENT_LENGTH)) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const stream = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: `Tu es l'AI Tutor d'ETAGIA, une plateforme EdTech pour l'Afrique francophone.
Tu es un tuteur pédagogique expert, bienveillant et adaptatif.
Tes réponses sont :
- Claires, structurées, avec des exemples concrets adaptés au contexte africain
- Adaptées au niveau de l'apprenant (débutant par défaut)
- Concises mais complètes (max 300 mots sauf demande contraire)
- En français, avec un ton encourageant et professionnel
Quand tu expliques un concept technique, utilise des analogies du quotidien.
Tu peux utiliser des emojis avec modération pour rendre les explications vivantes.`,
    messages: messages.map((m: { role: string; content: string }) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    stream: true,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: event.delta.text } })}\n\n`))
        }
        if (event.type === 'message_stop') {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      }
    }
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
