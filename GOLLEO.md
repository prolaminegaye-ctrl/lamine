# Où se trouve le projet GolléO ?

**Source unique de vérité : le dépôt [`prolaminegaye-ctrl/golleo-smart-hire`](https://github.com/prolaminegaye-ctrl/golleo-smart-hire)** (consolidation du 05/07/2026).

C'est là que se trouvent :

- le frontend le plus avancé (design Luminal Ascent, landing page, 3 espaces, section Productivité, infra bêta) ;
- l'API `golleo-api/server.mjs` sécurisée avec persistance Supabase ;
- le pipeline de déploiement production (`.github/workflows/golleo-deploy.yml` → Vercel → www.golleo-emploi.com) ;
- le rapport de diagnostic `RAPPORT-GOLLEO-EMPLOI.md` ;
- un `README.md` complet (structure, lancement local, variables d'environnement, déploiement).

## Copie archivée dans ce dépôt

La branche `claude/relaxed-bohr-5csbuf` de ce dépôt (`lamine`) contient une copie du code GolléO (`golleo-smart-hire-src/`, version « v2 » du 11 juin 2026) et les anciens workflows de déploiement. Cette copie est **archivée** : ne plus la modifier, ne plus déployer depuis cette branche. Toutes ses fonctionnalités (espace recruteur, parsing CV, bilan, dashboards) sont couvertes et étendues dans le dépôt `golleo-smart-hire`.

## Copie locale (Mac)

Le dossier `~/Documents/Claude/Projects/Friwok/Smart-Hire-Tool` sur le Mac correspond à ce même projet. Le dépôt GitHub `golleo-smart-hire` fait référence ; synchroniser la copie locale avec `git pull` avant d'y travailler.
