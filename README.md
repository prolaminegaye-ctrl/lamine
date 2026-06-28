# CampusForma

Plateforme de formations en ligne React reliée à Supabase.

## Fonctionnalités actives

- catalogue de 27 formations chargé depuis Supabase ;
- inscription et connexion par Supabase Auth ;
- panier persistant dans le navigateur ;
- commandes enregistrées en base, avec total recalculé côté serveur ;
- demandes Bilan de compétences / VAE enregistrées en base ;
- inscription newsletter enregistrée en base ;
- politiques RLS et droits minimaux sur toutes les tables CampusForma.

## Développement local

```bash
npm install
npm run dev
```

Les valeurs Supabase publiques intégrées au client peuvent être remplacées avec :

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

## Contrôles

```bash
npm run check
npm run lint
npm run build
npm audit --omit=dev
```

## Base de données

Les migrations versionnées se trouvent dans `supabase/migrations`. Toutes les tables sont préfixées `campusforma_` afin d'isoler l'application des autres projets présents dans la même instance Supabase.

Les moyens de paiement mobile créent une commande `pending`. La confirmation financière reste à relier aux API marchandes Wave, Orange Money ou Free Money dès que les identifiants commerçant sont disponibles.
