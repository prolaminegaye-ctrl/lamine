import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const documentId = searchParams.get('documentId')

  if (!documentId) {
    return NextResponse.json({ error: 'documentId manquant' }, { status: 400 })
  }

  const supabase = await createClient()

  // Vérifier que l'utilisateur est connecté
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Non autorisé — connectez-vous' }, { status: 401 })
  }

  // Vérifier que l'utilisateur a acheté ce document
  const { data: purchase, error: purchaseError } = await supabase
    .from('marketplace_purchases')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('document_id', documentId)
    .eq('status', 'completed')
    .maybeSingle()

  if (purchaseError || !purchase) {
    return NextResponse.json(
      { error: 'Accès refusé — vous devez acheter ce document' },
      { status: 403 }
    )
  }

  // Récupérer les métadonnées du document
  const { data: document } = await supabase
    .from('marketplace_documents')
    .select('storage_path, title')
    .eq('id', documentId)
    .single()

  if (!document) {
    return NextResponse.json({ error: 'Document introuvable' }, { status: 404 })
  }

  // Générer une URL signée temporaire (valide 60 secondes)
  const { data: signedUrl, error: urlError } = await supabase
    .storage
    .from('marketplace-pdfs')
    .createSignedUrl(document.storage_path, 60)

  if (urlError || !signedUrl) {
    return NextResponse.json({ error: 'Impossible de générer le lien' }, { status: 500 })
  }

  // Rediriger vers l'URL signée (le PDF s'ouvre directement)
  return NextResponse.redirect(signedUrl.signedUrl)
}
