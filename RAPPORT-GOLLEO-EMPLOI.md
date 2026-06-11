# Diagnostic & remédiation — golleo-emploi.com

*Établi le 10 juin 2026. Périmètre : production Vercel, DNS, Supabase, code source.*

---

## ✅ RÉSOLU (10/06/2026) — le site est de nouveau opérationnel

Le code source (récupéré depuis l'archive de déploiement Vercel) a été **réhabilité en application autonome déployable** et **redéployé en production**. Vérifié en ligne :

- **Frontend** : nouveau build chargé, découpé en chunks (bundle principal 1,35 Mo → 171 Ko gzip).
- **Routing SPA** : les routes profondes (`/emploi/tests/afri-code`…) s'affichent.
- **Backend** : 8 fonctions serverless `/api/*` déployées et propulsées par Claude (`claude-opus-4-8`) — `/api/dashboard/emploi` renvoie bien du JSON.
- **Sécurité** : en-têtes CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy actifs + durcissement Supabase (fonctions `SECURITY DEFINER`).

**Corrections clés** : suppression des dépendances monorepo Replit (`catalog:` / `workspace:*`) qui cassaient l'installation ; `vite.config` autonome (plus de `PORT`/`BASE_PATH` obligatoires) ; shim de `@workspace/api-client-react` pour que les pages recruteur compilent ; correction du `http://localhost:3000` codé en dur ; backend IA réécrit en fonctions Vercel ; pipeline de déploiement réparé (réglages projet Vercel + déploiement CLI via `VERCEL_TOKEN`).

Le diagnostic d'origine est conservé ci-dessous pour mémoire.

---

## ✅ V2 (11/06/2026) — espace recruteur réel, parsing CV, accueil premium

- **Espace recruteur branché sur Supabase** : tables dédiées `golleo_candidates`, `golleo_jobs`, `golleo_documents`, `golleo_softskills`, `golleo_recruiter_activities` avec **RLS par conseiller** (chaque conseiller connecté ne voit que ses données ; vérifié : zéro alerte advisor). Fonctionnels : candidats (CRUD + recherche/filtres), offres (CRUD + **matching IA offre↔candidats**), tableau de bord (statistiques réelles + activité), documents IA (génération + historique), soft-skills (évaluation IA + historique), recommandations de carrière. Entretiens IA et conseillers : stubs gracieux (« bientôt disponible »).
- **Parsing CV serveur réel** : `/api/cv/upload-analyze` extrait le texte des **PDF (pdf-parse)** et **DOCX (mammoth)** (limite 10 Mo) puis fait analyser par Claude (scores ATS/présentation/pertinence/impact + recommandations). Repli gracieux si fichier illisible.
- **Page d'accueil premium** : hiérarchie éditoriale renforcée, micro-animations framer-motion (avec respect de `prefers-reduced-motion`), focus visibles (WCAG), footer enrichi — routes inchangées.
- **4 nouvelles fonctions** `/api/recruiter/*` (career, document, softskills, job-matches) propulsées par Claude — 12 lambdas en production.
- **Correctif** : extensions `.js` requises sur les imports relatifs ESM des fonctions (cause d'un `ERR_MODULE_NOT_FOUND` → `FUNCTION_INVOCATION_FAILED`). Vérifié en prod après redéploiement : fonctions OK, zéro erreur runtime.

*Note : l'espace recruteur nécessite un utilisateur connecté (Supabase Auth) pour lire/écrire — RLS oblige. Sans connexion, le tableau de bord affiche les données de démonstration.*

---

---

## 1. Diagnostic — pourquoi le site « ne fonctionne pas »

### Ce qui fonctionne
- **DNS** : `golleo-emploi.com` → A `76.76.21.21` (Vercel), `www` → CNAME `cname.vercel-dns.com`. Redirection apex → www opérationnelle (308).
- **Hébergement** : le HTML, le JS (`/assets/index-dlQsu8J9.js`) et le CSS (Tailwind) répondent en 200. Les rewrites SPA fonctionnent (toute route renvoie `index.html`).
- **Supabase** : projet `taimtpltpaxugfcmwsux` `ACTIVE_HEALTHY`. Les tables `golleo_*` (CV, tests, parcours) ont des politiques RLS correctement restreintes par `auth.uid()`.
- Le bundle s'exécute : pas de cause d'écran blanc, pas de variable `VITE_` non substituée, pas de clé API exposée côté client.

### Cause racine n°1 — le backend `golleo-api` n'est PAS déployé
Le site en production est une **SPA statique seule**. L'application appelle ces endpoints :

`/api/ai/analyze`, `/api/bilan/analyze`, `/api/bilan/vae`, `/api/cv/generate-section`,
`/api/cv/upload-analyze`, `/api/dashboard/emploi`, `/api/dashboard/emploi/employability-score`,
`/api/jobs/analyze-offer`, `/api/pitch/coach`

Or **aucune fonction serverless n'existe en production** (zéro log runtime sur 7 jours ; `/api/dashboard/emploi` renvoie la page HTML au lieu de JSON). Conséquence : **toutes les fonctionnalités** (analyse d'offre, analyse CV, bilan, VAE, simulateur, pitch coach, tableaux de bord, tests) échouent avec « Une erreur est survenue. Vérifiez la connexion API. »

### Cause racine n°2 — `http://localhost:3000` codé en dur
Dans le bundle de production : `const mxe="http://localhost:3000"` puis `` fetch(`${mxe}/api/ai/analyze`, …) ``.
Chez un visiteur, cet appel vise sa propre machine → échec systématique + blocage mixed-content (HTTPS → HTTP).
**Correctif** : remplacer cette constante par une base relative `""` (comme les autres bases d'URL du bundle) ou par la variable d'env du backend.

### Cause racine n°3 — la chaîne de déploiement Git est cassée (prod figée au 6 juin)
- Projet Vercel `golleo-smart-hire` : *Install Command* = `cd golleo-api && npm install` → `sh: cd: golleo-api: No such file or directory` → **tous les déploiements Git en ERROR**. La prod actuelle vient d'un `vercel deploy --prebuilt` manuel du 6 juin (27 fichiers statiques, sans API).
- Projet Vercel `emploi-ai` (même code) : `npm install` échoue sur `npm error Unsupported URL Type "catalog:"` → le dépôt est un **workspace pnpm** ; Vercel doit utiliser pnpm (via `corepack`/`packageManager` dans `package.json`), pas npm.

---

## 2. Plan de remédiation (ordre d'exécution)

### Étape A — Rendre le site opérationnel
1. **Dashboard Vercel → projet `golleo-smart-hire` → Settings → Build & Development** :
   - *Root Directory* : pointer sur le dossier de l'app web du monorepo (ex. `apps/web` ou équivalent) ;
   - *Install Command* : laisser vide (auto) ou `pnpm install` ; supprimer `cd golleo-api && npm install` ;
   - *Framework Preset* : Vite. S'assurer que `packageManager: "pnpm@x"` figure dans le `package.json` racine pour que Vercel choisisse pnpm (sinon `catalog:` casse npm).
2. **Déployer `golleo-api`** : soit en fonctions serverless `api/` dans le même projet Vercel (recommandé : zéro CORS, URLs relatives déjà en place), soit en projet Vercel séparé + `rewrites` `/api/* → https://golleo-api.../api/*` dans `vercel.json`.
3. **Corriger le bug localhost** dans le code source (`http://localhost:3000` → base relative ou `import.meta.env.VITE_API_URL ?? ""`), rebuild, redéployer.
4. **Configurer les variables d'env** du backend dans Vercel (clé du fournisseur IA, URL/clé Supabase service-role si utilisée) — jamais dans le code.
5. Vérifier en prod : `curl https://www.golleo-emploi.com/api/dashboard/emploi` doit renvoyer du JSON, pas du HTML.

### Étape B — Sécurité
- ✅ **Fait (10/06/2026, migration `security_harden_functions`)** : `search_path` immuable sur `handle_new_user` et `update_updated_at` ; `EXECUTE` révoqué pour `PUBLIC`/`anon`/`authenticated` sur les fonctions `SECURITY DEFINER` `handle_new_user` et `rls_auto_enable`.
- ⚠️ **Restant (à arbitrer, concerne les autres apps du même projet Supabase)** : politiques RLS `USING (true)` pour `anon` sur `leads`, `bookings`, `activities`, `email_sequences`, `pipeline_stages`, `sources` (écriture), `articles` (insert/update). N'importe qui possédant la clé anon publique peut lire/écrire/supprimer ces données (10 leads réels exposés). À restreindre dès que les apps concernées (CRM/veille) auront une authentification.
- Recommandé : séparer les projets Supabase par application (GolléO partage actuellement sa base avec le LMS, le CRM et la veille Qualiopi), en-têtes de sécurité HTTP (CSP, X-Frame-Options, Referrer-Policy) via `vercel.json`, rate-limiting sur les endpoints IA.

### Étape C — Qualité premium (UI/UX/technique)
1. **Routing** : remplacer la navigation par `window.location.href` (rechargement complet à chaque clic) par React Router → navigation instantanée, état préservé, transitions.
2. **Code-splitting** : bundle unique de 1,35 Mo → découper par route (`React.lazy`) pour un premier chargement < 200 Ko.
3. **UX des erreurs** : remplacer « Vérifiez la connexion API » par des états vides/élégants avec action de retry ; ajouter des squelettes de chargement.
4. **Cohérence navigation** : fil d'Ariane sur les espaces `/emploi/*` et `/entrepreneur/*`, menu actif persistant, retour systématique au tableau de bord.
5. **PWA + SEO** : manifest, sitemap.xml, robots.txt, balises OG par page, images optimisées (`srcset`).
6. **Observabilité** : brancher Sentry (le compte MCP est déjà connecté) pour capter les erreurs réelles des visiteurs.

---

## 3. Blocage d'accès

Le code source vit dans **`prolaminegaye-ctrl/golleo-smart-hire`** (privé). La présente session Claude Code est limitée au dépôt `lamine` : impossible de corriger le code ou de redéployer depuis ici.

**Marche à suivre** : démarrer une nouvelle session Claude Code **sur le dépôt `golleo-smart-hire`** et demander : *« Applique le plan du fichier RAPPORT-GOLLEO-EMPLOI.md du dépôt lamine »* (ou recoller ce rapport). Les étapes A.3, B et C s'exécutent alors directement ; les étapes A.1/A.2 nécessitent aussi le dashboard Vercel.
