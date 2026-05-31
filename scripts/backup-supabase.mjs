#!/usr/bin/env node
// Script de backup Supabase — exporte les tables importantes en JSON
// Exécuté automatiquement chaque nuit par GitHub Actions

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Variables manquantes : SUPABASE_URL et SUPABASE_SERVICE_KEY requis')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const TABLES_TO_BACKUP = [
  'profiles',
  'courses',
  'enrollments',
  'marketplace_documents',
  'marketplace_purchases',
]

async function exportTable(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn(`[SKIP] Table "${tableName}" : ${error.message}`)
    return null
  }

  console.log(`[OK] ${tableName} — ${data.length} lignes`)
  return data
}

async function main() {
  const date = new Date().toISOString().split('T')[0]
  const backupDir = join(process.cwd(), 'backups', date)

  mkdirSync(backupDir, { recursive: true })

  const summary = { date, tables: {} }

  for (const table of TABLES_TO_BACKUP) {
    const data = await exportTable(table)
    if (data !== null) {
      writeFileSync(
        join(backupDir, `${table}.json`),
        JSON.stringify(data, null, 2)
      )
      summary.tables[table] = data.length
    }
  }

  writeFileSync(join(backupDir, 'summary.json'), JSON.stringify(summary, null, 2))
  console.log(`\nBackup terminé → backups/${date}/`)
  console.log('Tables:', JSON.stringify(summary.tables, null, 2))
}

main().catch(err => {
  console.error('Erreur backup :', err)
  process.exit(1)
})
