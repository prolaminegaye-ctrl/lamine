# Correctifs de production ETAGIA LMS

Le site **www.etagia-academie.com** est déployé depuis le dépôt GitHub
`prolaminegaye-ctrl/etagia-lms` (branche `main`, intégration Vercel automatique).
Ce dossier contient le correctif de sécurité à appliquer à ce dépôt.

## Contenu du patch `0001-security-*.patch`

- **Suppression du bypass admin sans mot de passe** (`app/page.tsx`) :
  l'accès `/admin` via email seul ou clé `localStorage` est supprimé.
- **Sessions en cookies** (`lib/supabase/client.ts`, `lib/supabase/server.ts`) :
  la session Supabase devient vérifiable côté serveur.
- **Middleware de protection** (`middleware.ts`) :
  - `/admin` réservé au rôle `admin`, `/formateur` aux formateurs/admins ;
  - toutes les pages privées redirigent vers la connexion sans session ;
  - `/api/ai-tutor`, `/api/generate-course`, `/api/market-chat`, `/api/bbb`
    renvoient 401 sans session (protège le crédit Anthropic).
- **Rôle lu depuis `public.profiles`** (sécurisé par trigger en base), plus
  jamais depuis `user_metadata` (modifiable par l'utilisateur).
- **Inscription réparée** : l'upsert écrivait des colonnes inexistantes
  (`nom`, `prenom`, `statut`, `email`) — c'est pourquoi la table `profiles`
  restait vide. Le profil est créé par le trigger `handle_new_user`.
- **Onboarding réparé** : les réponses vont dans `profiles.learning_profile`
  (jsonb) au lieu de colonnes inexistantes.

## Application (2 minutes)

```bash
git clone https://github.com/prolaminegaye-ctrl/etagia-lms
cd etagia-lms
git am ../lamine/production-fixes/0001-security-suppression-bypass-admin-protection-serveur.patch
git push origin main   # Vercel déploie automatiquement en production
```

Alternative : ajoutez le dépôt `etagia-lms` à une session Claude Code
(« Add repository ») et demandez d'appliquer le patch et de pousser.

## Après le déploiement

1. Créez votre compte sur le site avec **prolaminegaye@gmail.com** :
   le trigger `handle_new_user` lui attribue automatiquement le rôle `admin`.
2. Vérifiez les variables d'environnement Vercel (projet `etagia-lms`) :
   `ANTHROPIC_API_KEY`, `ADMIN_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (+ `BBB_URL`/`BBB_SECRET` si live activé).
3. Testez : inscription → email de confirmation → connexion → `/dashboard`,
   puis `/admin` avec votre compte (et vérifiez qu'un compte apprenant est
   bien redirigé hors de `/admin`).

> ⚠️ Tant que ce patch n'est pas poussé, la page `/admin` de production reste
> accessible sans mot de passe. Les données sont déjà protégées au niveau de
> la base (RLS corrigée le 12/06/2026), mais l'interface reste exposée.
