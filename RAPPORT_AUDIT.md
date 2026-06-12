# Rapport d'audit & corrections — ETAGIA LMS

**Date : 12 juin 2026 · Domaine : www.etagia-academie.com**

## 1. Cartographie du projet

| Élément | Détail |
|---|---|
| Production | `www.etagia-academie.com` + `etagia-academie.com` → projet Vercel **`etagia-lms`** (team « Lamine's projects ») |
| Source de la production | Dépôt GitHub **public** `prolaminegaye-ctrl/etagia-lms`, branche `main` (intégration Vercel automatique) |
| Ce dépôt (`lamine`) | Copies de travail : `etagia-lms/` (version simplifiée), `etagia-next/` (prototype design), `etagia.html` / `index.html` (pages statiques, vraisemblablement Hostinger) — **n'alimente pas la production** |
| Base de données | Supabase `taimtpltpaxugfcmwsux` (eu-west-1), **partagée avec tous les autres projets** (Golleo, Qualiopi/SJT, CRM, veille…) |
| Projets Vercel en doublon | `etagia-lms-hxy8`, `v0-etagia-lms` (sans domaine) — à supprimer |
| Hostinger | Sert de registrar/DNS ; le site web est servi par Vercel |

## 2. Problèmes trouvés

### Critiques (sécurité)
1. **Bypass admin sans mot de passe en production** : taper `prolaminegaye@gmail.com` dans le
   formulaire de connexion donnait `/admin` sans authentification ; le « device propriétaire »
   était une simple clé `localStorage` posable par n'importe qui (commits `641bc50`, `37d4317`).
2. **Aucune protection serveur des routes** : `/admin`, `/formateur`, `/dashboard` accessibles
   en tapant l'URL ; le middleware n'ajoutait que des en-têtes.
3. **API IA publiques** : `/api/ai-tutor`, `/api/generate-course`, `/api/market-chat` sans
   authentification ni limite → crédit Anthropic consommable par n'importe qui.
4. **Autorisation par `user_metadata.statut`** : champ modifiable par l'utilisateur lui-même →
   escalade de privilèges triviale.
5. **8 politiques RLS `USING (true)`** donnant au rôle `anon` lecture + écriture + suppression
   sur `leads` (10 enregistrements de données personnelles), `bookings`, `activities`,
   `email_sequences`, `pipeline_stages`, `sources`, `articles`.

### Fonctionnels
6. **0 utilisateur, 0 profil, 0 cours en base** : l'inscription écrivait des colonnes
   inexistantes (`nom`, `prenom`, `statut`, `email`) dans `profiles` ; l'onboarding aussi.
   Tout le contenu affiché était de la démo codée en dur.
7. Le dashboard (copie `lamine`) joignait une table `categories` inexistante et lisait
   `duration_minutes` au lieu de `duration_hours`.
8. Workflow GitHub Actions redondant (branche morte, clé anon en clair, projets Vercel en doublon).

## 3. Corrections effectuées

### Base Supabase (appliquées en production, migrations versionnées)
- `lockdown_anon_write_policies` : `anon` ne peut plus que **insérer** dans `leads`/`bookings`
  (formulaires publics préservés) ; plus aucun accès anon à `activities`/`email_sequences` ;
  `pipeline_stages` en lecture seule ; écriture de `sources`/`articles` réservée aux
  authentifiés (les jobs serveur via `service_role` ne sont pas affectés).
  **Vérifié** : `anon` voit 0 lead, 0 booking ; update anonyme sans effet.
- `protect_role_escalation_and_admin_bootstrap` : trigger interdisant à un non-admin de
  modifier un rôle ; `handle_new_user` attribue `admin` au compte `prolaminegaye@gmail.com`
  à sa création, `learner` aux autres.
- **Catalogue réel** : 12 cours publiés (issus des modules PDF existants en production).

### Code de production (`production-fixes/0001-*.patch`, à pousser sur `etagia-lms`)
Voir `production-fixes/README.md` : suppression du bypass, sessions cookies, middleware de
protection par rôle, API en 401 sans session, inscription/onboarding réparés.
**Build vérifié : `next build` passe.**

### Ce dépôt (`lamine`)
- `etagia-lms/app/dashboard/page.tsx` : requêtes corrigées (`category` texte, `duration_hours`).
- `etagia-lms/proxy.ts` : en-têtes de sécurité + 401 JSON pour les API non authentifiées.
- `etagia-lms/app/api/ai-tutor/route.ts` : revérification de session + validation d'entrée
  (30 messages max, 8 000 caractères max).
- Suppression de `.github/workflows/deploy-vercel.yml` (redondant avec l'intégration Vercel,
  déployait depuis une branche morte et embarquait la clé anon).
- **Build vérifié : `next build` passe.**

## 4. Risques restants & actions manuelles

| Priorité | Action | Pourquoi |
|---|---|---|
| 🔴 Immédiat | **Pousser le patch sur `prolaminegaye-ctrl/etagia-lms`** (voir `production-fixes/README.md`) | Tant que ce n'est pas fait, `/admin` reste accessible sans mot de passe (l'interface seulement — les données sont déjà verrouillées par RLS) |
| 🔴 Immédiat | Créer votre compte avec `prolaminegaye@gmail.com` après déploiement | Il deviendra automatiquement admin |
| 🟠 Cette semaine | Vérifier les variables Vercel : `ANTHROPIC_API_KEY`, `ADMIN_SECRET` | L'AI Tutor et `/api/check-env` en dépendent |
| 🟠 Cette semaine | Passer le dépôt `etagia-lms` en **privé** sur GitHub | Il est public : code + historique visibles de tous |
| 🟠 Cette semaine | Supprimer les projets Vercel `etagia-lms-hxy8` et `v0-etagia-lms` | Doublons inutiles, surface d'attaque |
| 🟡 Ce mois | Dédier un projet Supabase à ETAGIA (ou préfixer/isoler par schéma) | La base est partagée entre toutes vos applications |
| 🟡 Ce mois | Si vos applis CRM/veille écrivent côté serveur, utiliser la clé `service_role` (jamais côté client) | Les écritures anon sur `articles`/`sources` sont désormais bloquées |
| 🟡 Ce mois | Activer la confirmation d'email + protection anti-bot (Captcha) dans Supabase Auth | Limite les inscriptions abusives |

## 5. Recommandations de maintenance

- **Un seul dépôt source de vérité** : archivez les copies obsolètes (`etagia-lms/`,
  `etagia-next/` de ce dépôt) ou synchronisez-les explicitement ; toute correction doit
  partir du dépôt `etagia-lms` connecté à Vercel.
- Ne jamais réintroduire de bypass d'authentification « pour aller vite » : utilisez le rôle
  `admin` en base (un admin peut promouvoir d'autres comptes via SQL ou une page dédiée).
- Lancer régulièrement les *Security Advisors* Supabase (toutes les alertes RLS actuelles
  sont traitées) et `npm audit` avant chaque déploiement.
- Surveiller la consommation Anthropic (l'API est désormais derrière l'authentification,
  ajouter une limitation de débit par utilisateur reste souhaitable).
