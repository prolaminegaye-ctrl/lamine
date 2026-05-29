require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const HAS_KEY = !!(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.startsWith('sk-'))
let client = null
if (HAS_KEY) {
  const Anthropic = require('@anthropic-ai/sdk')
  client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  console.log('✅ Mode IA réelle (Anthropic)')
} else {
  console.log('⚡ Mode démo (pas de clé API — toutes les fonctionnalités restent actives)')
}

// ── DEMO DATA ─────────────────────────────────────────────────────────────────
function demoFeedback(answer, mode) {
  const words = answer.trim().split(/\s+/).filter(Boolean).length
  const p = Math.min(95, Math.max(30, 55 + Math.min(25, words / 4)))
  const s = Math.min(95, Math.max(30, words > 80 ? 80 : words > 40 ? 65 : 40))
  const i = /\d+[%€k]?|\d+ (ans|mois|personnes|équipe|clients)/i.test(answer) ? 82 : 54
  const f = Math.min(95, Math.max(30, 85 - (answer.match(/\b(euh|heu|ben|bah|donc)\b/gi) || []).length * 6))
  const g = Math.round((p + s + i + f) / 4)
  const tips = [
    'Quantifie tes résultats avec des chiffres précis pour renforcer ton impact.',
    'Structure ta réponse avec la méthode STAR : Situation, Tâche, Action, Résultat.',
    'Utilise des verbes d\'action forts : "j\'ai piloté", "j\'ai généré", "j\'ai réduit".',
    'Ajoute un chiffre ou pourcentage pour chaque réalisation citée.',
    'Conclus chaque réponse en liant ton expérience aux besoins du poste visé.'
  ]
  return { p: Math.round(p), s: Math.round(s), i: Math.round(i), f: Math.round(f), g, tip: tips[Math.floor(Math.random() * tips.length)] }
}

function demoCVGenerate(type, jobTitle, currentValue) {
  const titles = {
    'Product Manager': 'Product Manager Senior | Growth & Stratégie Produit',
    'Développeur': 'Développeur Full-Stack | React · Node.js · Cloud',
    'Data Scientist': 'Data Scientist | Machine Learning & Analytics',
    'Marketing': 'Responsable Marketing Digital | SEO · Growth · Performance',
    'default': `Expert ${jobTitle} | Innovation & Résultats`
  }
  const summaries = {
    title: titles[jobTitle] || titles.default,
    summary: `${jobTitle} avec ${currentValue || '5 ans d\'expérience'} dans des environnements exigeants. Reconnu(e) pour ma capacité à piloter des projets complexes de A à Z, générer des résultats mesurables et fédérer des équipes pluridisciplinaires. Passionné(e) par l'innovation et l'amélioration continue.`,
    skills: `Leadership, Communication, Gestion de projet, Analyse de données, Agilité, Résolution de problèmes`
  }
  return summaries[type] || summaries.summary
}

function demoJobAnalysis(jobText) {
  const words = jobText.toLowerCase()
  const skills = []
  const kw = []
  const techMap = { 'python': true, 'sql': true, 'react': true, 'node': true, 'agile': true, 'scrum': true, 'product': true, 'management': true, 'marketing': true, 'excel': true }
  Object.entries(techMap).forEach(([k]) => {
    kw.push({ word: k.charAt(0).toUpperCase() + k.slice(1), present: Math.random() > 0.4 })
    skills.push({ name: k.charAt(0).toUpperCase() + k.slice(1), status: Math.random() > 0.5 ? 'present' : 'missing' })
  })
  return {
    score: Math.floor(Math.random() * 30) + 62,
    keywords: kw.slice(0, 9),
    skills: skills.slice(0, 6),
    recommendations: [
      'Mettez en avant vos réalisations chiffrées dans votre CV.',
      'Personnalisez votre lettre de motivation avec les termes de cette offre.',
      'Préparez 2 exemples STAR en lien direct avec les missions décrites.',
      'Mentionnez explicitement les outils cités dans l\'offre si vous les maîtrisez.'
    ],
    letter: `Madame, Monsieur,\n\nPassionné(e) par les défis que présente votre annonce, je suis convaincu(e) d'apporter une réelle valeur ajoutée à votre équipe. Mon parcours m'a permis de développer les compétences clés que vous recherchez, notamment en gestion de projet et pilotage d'équipes.\n\nAu fil de mes expériences, j'ai démontré ma capacité à générer des résultats concrets et mesurables. Je suis particulièrement motivé(e) par la culture d'innovation que vous prônez et par l'impact que ce rôle peut avoir.\n\nJe serais ravi(e) de vous rencontrer pour échanger sur la façon dont mon profil correspond à vos attentes.\n\nCordialement`,
    email: `Objet : Candidature au poste — [Votre nom]\n\nBonjour,\n\nJe me permets de vous contacter suite à votre annonce. Mon profil correspond à vos critères et je serais heureux(se) d'en discuter.\n\nJe joins mon CV à cet email. Disponible pour un entretien à votre convenance.\n\nCordialement, [Votre nom]`,
    pitch: `En 30 secondes : je suis [votre métier] avec [X ans] d'expérience. Ma spécialité, c'est [votre valeur ajoutée]. Sur mon dernier poste, j'ai [résultat chiffré]. Je cherche à rejoindre une équipe ambitieuse pour [ce que vous apportez]. Votre poste m'a immédiatement intéressé(e) car [raison précise].`
  }
}

// ── INTERVIEW FEEDBACK ────────────────────────────────────────────────────────
app.post('/api/interview/feedback', async (req, res) => {
  const { question, answer, mode, jobTitle } = req.body
  if (!answer || answer.trim() === '(Pas de réponse)') {
    return res.json({ score: 0, p: 0, s: 0, i: 0, f: 0, feedback: '', tip: '' })
  }
  if (!client) return res.json(demoFeedback(answer, mode))
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
    res.json(demoFeedback(answer, mode))
  }
})

// ── CV GENERATION ─────────────────────────────────────────────────────────────
app.post('/api/cv/generate', async (req, res) => {
  const { type, currentValue, jobTitle } = req.body
  if (!client) return res.json({ generated: demoCVGenerate(type, jobTitle, currentValue) })
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
    res.json({ generated: demoCVGenerate(type, jobTitle, currentValue) })
  }
})

// ── JOB ANALYSIS ─────────────────────────────────────────────────────────────
app.post('/api/jobs/analyze', async (req, res) => {
  const { jobText, cvProfile } = req.body
  if (!jobText || jobText.trim().length < 30) {
    return res.status(400).json({ error: 'Offre trop courte' })
  }
  if (!client) return res.json(demoJobAnalysis(jobText))
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
    res.json(demoJobAnalysis(jobText))
  }
})

// ── HEALTH ────────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ ok: true, demo: !HAS_KEY }))

app.listen(3001, () => console.log('API server running on :3001'))
