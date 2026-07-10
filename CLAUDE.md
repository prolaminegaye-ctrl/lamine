# CampusForma — Guide pour agents IA et développeurs

Plateforme de formations en ligne (SaaS). SPA React reliée à Supabase, déployée sur Vercel.

## Stack technique

- **Frontend** : React 19 + TypeScript 5.9, Vite 7, Tailwind CSS 3, react-router-dom 7, TanStack Query 5, framer-motion.
- **Backend** : aucun serveur applicatif dans ce repo. Tout le backend est Supabase :
  - Auth (email + mot de passe, magic link en secours) ;
  - Postgres avec RLS strict, tables préfixées `campusforma_` ;
  - fonctions RPC `security definer` (`campusforma_create_order`, `campusforma_submit_lead`, `campusforma_submit_contact`, `campusforma_subscribe_newsletter`).
- **Déploiement** : Vercel (framework Vite, sortie `dist/public`, rewrites SPA dans `vercel.json`).
- **Migrations** : `supabase/migrations/*.sql`, forward-only (pas de down-migrations).

## Commandes

```bash
npm ci             # installation reproductible
npm run check      # typecheck (tsc -b)
npm run lint       # eslint
npm run build      # build de production (vite)
npm audit --omit=dev   # audit des dépendances runtime
npm run dev        # serveur de dev (port 3000)
```

Il n'existe **aucun test automatisé** pour le moment (ni unitaire, ni e2e). Les contrôles CI sont : check + lint + build + audit.

## Structure

- `src/pages/` — pages routées (Home, Formations, FormationDetail, Paiement, Login, Contact, BilanVae, Blog…).
- `src/context/` — `AuthContext` (Supabase Auth), `CartContext` (panier localStorage).
- `src/lib/supabase.ts` — client Supabase (URL + clé *publishable*, valeurs publiques par conception, surchargées par `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`).
- `src/data/` — contenu éditorial statique et catalogue de secours.
- `supabase/migrations/` — schéma, RLS, fonctions RPC.
- `.github/agents/` — architecture des agents autonomes (voir `.github/agents/README.md`).

## Zones sensibles — NE PAS TOUCHER sans validation humaine explicite

- `src/pages/Paiement.tsx` et la fonction SQL `campusforma_create_order` (**paiements**) ;
- `src/context/AuthContext.tsx`, `src/pages/Login.tsx` (**authentification**) ;
- toute policy RLS, tout `grant`/`revoke`, toute fonction `security definer` (**sécurité base de données**) ;
- les tables contenant des données personnelles : `campusforma_leads`, `campusforma_contacts`, `campusforma_newsletter_subscribers`, `campusforma_orders` (**jamais de SELECT sur les données réelles, jamais d'export**).

## Règles absolues (applicables à tout agent IA opérant sur ce repo)

1. Aucun push direct sur la branche principale — toujours une branche dédiée + pull request.
2. Aucune suppression de données (fichiers de données, lignes en base, tables, buckets).
3. Aucune modification destructive de la base : pas de `DROP`, `TRUNCATE`, `DELETE`, `ALTER ... DROP COLUMN` dans les migrations proposées.
4. Aucune désactivation des règles de sécurité (RLS, policies, `grant`/`revoke`, headers, validations).
5. Aucun accès aux données personnelles des utilisateurs (lecture comprise).
6. Aucun secret écrit dans le code, les logs, les issues ou les PR. La clé *publishable* Supabase est publique par conception ; toute autre clé est un secret.
7. Aucune modification de la logique de paiement.
8. Aucune modification majeure de l'authentification (changement de flux, de provider, de session).
9. Aucune fusion si `npm run check`, `npm run lint` ou `npm run build` échoue.
10. Aucune correction automatique si la cause racine n'est pas démontrée (reproduction ou preuve dans les logs) — dans ce cas, documenter et demander une décision humaine (label `agent:needs-human`).
11. Toute modification doit être réversible (revert Git propre) et documentée (issue + PR + journal).

## Arrêt d'urgence des agents

Créer la variable de repository `AGENTS_ENABLED` avec la valeur `false`
(GitHub → Settings → Secrets and variables → Actions → Variables).
Tous les workflows d'agents vérifient cette variable et s'arrêtent immédiatement.
Détails : `.github/agents/README.md`.
