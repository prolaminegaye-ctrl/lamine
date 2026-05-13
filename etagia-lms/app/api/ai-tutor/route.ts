import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

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
