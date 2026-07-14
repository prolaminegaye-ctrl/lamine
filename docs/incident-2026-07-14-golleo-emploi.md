# Incident — www.golleo-emploi.com sert le mauvais site (diagnostic du 14/07/2026)

## Symptôme

Le domaine https://www.golleo-emploi.com/ « ne fonctionne plus » : il n'affiche
plus la plateforme GolléO. Il sert actuellement **le site Qualiodit**
(« Qualiodit — Coffre documentaire & IA Qualiopi »), vérifié le 14/07/2026 à
19h31 UTC sur l'alias de production `golleo-smart-hire.vercel.app`.

## Cause racine (démontrée)

Le domaine `www.golleo-emploi.com` est rattaché au projet Vercel
**`golleo-smart-hire`** (`prj_iZja6BQ3UrMIeacqpmwiBDt7RhoO`, équipe
`lamine-s-projects1`). Or ce projet Vercel est **connecté au mauvais dépôt
GitHub** : `prolaminegaye-ctrl/qualiodit` au lieu de
`prolaminegaye-ctrl/golleo-smart-hire`.

Preuves (métadonnées des déploiements Vercel) :

| Date (UTC) | Déploiement | Dépôt source | Contenu |
|---|---|---|---|
| 2026-07-05 21:40 | `dpl_GCfoWiqribtN1kZPzCwnqrnBesGg` (commit `0775f00`, « fix: crash 'initials is not defined' ») | `golleo-smart-hire` | **Dernier déploiement GolléO correct** |
| 2026-07-10 18:06 | `dpl_7buidvGX9Bfek1vGFGWywGDaDaK4` (merge PR #1 « agents infra ») | `qualiodit` ⚠️ | Premier écrasement de la production GolléO |
| 2026-07-11 06:46 | `dpl_8o6oARnNk7mt5JMcqsBKn5pBmmhf` (merge PR #4) | `qualiodit` ⚠️ | Production actuelle (site Qualiodit) |

Le même push du 11/07 à 06:46 a créé **deux** déploiements simultanés :
`dpl_8o6o…` sur le projet `golleo-smart-hire` et `dpl_6rLNs4Sj…` sur le projet
`qualiodit`. Le dépôt `qualiodit` est donc bien connecté aux **deux** projets
Vercel en même temps. Tant que cette connexion n'est pas corrigée, chaque push
sur `qualiodit/main` ré-écrasera la production de GolléO.

Le site GolléO lui-même n'est pas cassé : l'ancien déploiement du 05-06/07
(`golleo-smart-hire-7kjunva7w-lamine-s-projects1.vercel.app`) sert toujours
correctement « GolléO — Plateforme d'Insertion Professionnelle ».

L'origine probable du croisement : lors de la mise en place de l'infrastructure
d'agents sur le dépôt `qualiodit` (10-11/07), ce dépôt a été connecté au projet
Vercel `golleo-smart-hire` en plus du projet `qualiodit`.

## Remise en ligne (2 actions dans le dashboard Vercel)

Ordre recommandé :

1. **Restaurer le site** — Vercel → équipe *Lamine's projects* → projet
   **golleo-smart-hire** → onglet *Deployments* → retrouver le déploiement du
   **6 juillet 2026** (commit `0775f00`, « fix: crash 'initials is not
   defined' », dépôt `golleo-smart-hire`) → menu `⋯` → **Redeploy** (cocher la
   cible *Production*). Le domaine `www.golleo-emploi.com` resservira GolléO
   immédiatement.
2. **Corriger la cause racine** — projet **golleo-smart-hire** → *Settings* →
   *Git* → **Disconnect** du dépôt `prolaminegaye-ctrl/qualiodit`, puis
   **Connect** au dépôt `prolaminegaye-ctrl/golleo-smart-hire` (branche de
   production : `main`). Sans cette étape, le prochain push sur `qualiodit`
   écrasera de nouveau le site.

Vérification : le projet Vercel `qualiodit` (domaines `qualiodit.fr` /
`www.qualiodit.fr`) reste correctement connecté au dépôt `qualiodit` — rien à
changer de ce côté.

Alternative sans dashboard : le dépôt `golleo-smart-hire` contient un workflow
`.github/workflows/golleo-deploy.yml` (déploiement production via Vercel CLI,
déclenchement manuel, secret `VERCEL_TOKEN` requis). Ce dépôt n'étant pas dans
le périmètre de la session de diagnostic, son déclenchement nécessite une
autorisation explicite. Ce chemin ne corrige de toute façon pas la connexion
Git croisée (étape 2 ci-dessus, dashboard uniquement).

## Périmètre de ce dépôt (`lamine`)

Aucun code de ce dépôt n'est en cause : l'incident est entièrement côté
configuration Vercel du projet `golleo-smart-hire`. Ce rapport est ajouté ici
(dépôt de la session de diagnostic) au titre de la règle 10 du CLAUDE.md :
cause racine démontrée, correction nécessitant une action humaine dans le
dashboard Vercel.
