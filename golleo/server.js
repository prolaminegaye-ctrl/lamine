require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Anthropic = require('@anthropic-ai/sdk')

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ── INTERVIEW FEEDBACK ────────────────────────────────────────────────────────
app.post('/api/interview/feedback', async (req, res) => {
  const { question, answer, mode, jobTitle } = req.body
  if (!answer || answer.trim() === '(Pas de réponse)') {
    return res.json({ score: 0, p: 0, s: 0, i: 0, f: 0, feedback: '', tip: '' })
  }
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Tu es un expert RH qui évalue des réponses d'entretien. Évalue cette réponse en JSON strict.

Poste visé: ${jobTitle}
Mode: ${mode}
Question: "${question}"
Réponse candidate: "${answer}"

Réponds UNIQUEMENT avec ce JSON (pas de markdown, pas d'explication) :
{"p":85,"s":70,"i":60,"f":80,"g":74,"tip":"Conseil court et actionnable en 1 phrase."}

p=pertinence (0-100), s=structure (0-100), i=impact chiffré (0-100), f=fluidité (0-100), g=moyenne, tip=conseil.`
      }]
    })
    const raw = msg.content[0].text.trim()
    const json = JSON.parse(raw.replace(/```json?|```/g, '').trim())
    res.json(json)
  } catch (e) {
    console.error('feedback error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── CV GENERATION ─────────────────────────────────────────────────────────────
app.post('/api/cv/generate', async (req, res) => {
  const { type, currentValue, jobTitle, experience } = req.body
  const prompts = {
    title: `Génère un titre professionnel percutant pour un ${jobTitle}. Réponds UNIQUEMENT avec le titre, sans guillemets ni ponctuation.`,
    summary: `Écris un résumé professionnel de 3 phrases maximum pour un ${jobTitle} avec cette expérience : "${currentValue}". Résumé orienté résultats, impactant, avec chiffres si possible. Réponds UNIQUEMENT avec le texte du résumé.`,
    skills: `Liste 5 compétences techniques supplémentaires pertinentes pour un ${jobTitle}, en plus de : "${currentValue}". Réponds UNIQUEMENT avec les compétences séparées par des virgules, sans explication.`
  }
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompts[type] || prompts.summary }]
    })
    res.json({ generated: msg.content[0].text.trim() })
  } catch (e) {
    console.error('cv generate error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── JOB ANALYSIS ─────────────────────────────────────────────────────────────
app.post('/api/jobs/analyze', async (req, res) => {
  const { jobText, cvProfile } = req.body
  if (!jobText || jobText.trim().length < 30) {
    return res.status(400).json({ error: 'Offre trop courte' })
  }
  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Analyse cette offre d'emploi et compare avec le profil CV. Réponds UNIQUEMENT en JSON strict.

OFFRE:
${jobText}

PROFIL CV:
${cvProfile || 'Non fourni'}

Réponds avec ce JSON (pas de markdown) :
{
  "score": 78,
  "keywords": [{"word":"Product Management","present":true},{"word":"Agile","present":false}],
  "skills": [{"name":"Product Management","status":"present"},{"name":"SQL","status":"missing"}],
  "recommendations": ["Ajoutez X à votre CV","Préparez exemple STAR pour Y"],
  "letter": "Lettre de motivation en 3 paragraphes...",
  "email": "Email candidature court...",
  "pitch": "Pitch 30 secondes..."
}
score entre 40 et 95. keywords: 8-12 mots-clés de l'offre. skills: 5-6 compétences. recommendations: 4 conseils. letter/email/pitch en français.`
      }]
    })
    const raw = msg.content[0].text.trim().replace(/```json?|```/g, '').trim()
    res.json(JSON.parse(raw))
  } catch (e) {
    console.error('job analyze error:', e.message)
    res.status(500).json({ error: e.message })
  }
})

// ── HEALTH ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true }))

app.listen(3001, () => console.log('API server running on :3001'))
