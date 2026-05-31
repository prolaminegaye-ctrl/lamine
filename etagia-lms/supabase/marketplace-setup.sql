-- =====================================================
-- ETAGIA Marketplace — Tables + RLS + Storage
-- À exécuter dans Supabase > SQL Editor
-- =====================================================

-- Table des documents vendus
CREATE TABLE IF NOT EXISTS marketplace_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price_xof INTEGER NOT NULL DEFAULT 0,   -- prix en FCFA
  storage_path TEXT NOT NULL,             -- chemin dans le bucket marketplace-pdfs
  preview_url TEXT,                       -- aperçu public (1ère page par ex.)
  category TEXT,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Table des achats
CREATE TABLE IF NOT EXISTS marketplace_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES marketplace_documents(id),
  status TEXT NOT NULL DEFAULT 'pending'  -- 'pending', 'completed', 'refunded'
    CHECK (status IN ('pending', 'completed', 'refunded')),
  payment_reference TEXT,                 -- référence paiement (Wave, Orange Money, etc.)
  amount_paid INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, document_id)
);

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_purchases_user ON marketplace_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_document ON marketplace_purchases(document_id);

-- =====================================================
-- Sécurité Row Level Security (RLS)
-- =====================================================

ALTER TABLE marketplace_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;

-- Les documents actifs sont visibles par tous (titre, description, prix)
CREATE POLICY "Documents publics lisibles" ON marketplace_documents
  FOR SELECT USING (is_active = TRUE);

-- Seuls les admins peuvent créer/modifier des documents
CREATE POLICY "Admins gèrent les documents" ON marketplace_documents
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Un utilisateur ne voit que ses propres achats
CREATE POLICY "Mes achats uniquement" ON marketplace_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Un utilisateur peut créer un achat pour lui-même
CREATE POLICY "Créer un achat" ON marketplace_purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Storage — Bucket sécurisé pour les PDF
-- =====================================================
-- Créer le bucket dans Supabase > Storage > New bucket
-- Nom: marketplace-pdfs
-- Public: NON (privé obligatoire)
--
-- Policy de storage : seule l'API route /api/marketplace/pdf
-- peut générer des signed URLs via la service_role key
-- (les utilisateurs n'accèdent jamais directement au bucket)
