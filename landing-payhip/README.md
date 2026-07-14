# Landing page — ouvrages Payhip

Reconstruction de la landing page produite dans la session Cowork « Ebook publication on Payhip »
(charte : fond marine, doré, Playfair Display + Inter ; deux ouvrages à 19,90 €).

Les fichiers finaux de la session Cowork (avec les vrais liens Payhip et la couverture
`cover-ia-sous-controle.jpg`) sont restés sur la machine locale ; cette version est prête
à l'emploi à trois substitutions près.

La couverture `cover-ia-sous-controle.jpg` (présente dans ce dossier) a été extraite de la
planche de couverture officielle (`Couverture_LIA_Sous_Controle_FINAL.pdf`, face avant,
800 × 1230 px, optimisée web). Les textes de la section « L'IA sous contrôle » reprennent
la 4e de couverture et le sommaire du manuscrit.

## À remplacer avant mise en ligne (Ctrl+F dans `index.html`)

| Jeton | Valeur attendue |
|---|---|
| `PAYHIP_LIVRE_1` | code du lien Payhip du « Manuel du Formateur Augmenté » (2 occurrences) |
| `PAYHIP_LIVRE_2` | code du lien Payhip de « L'IA sous contrôle » (2 occurrences) |

Les liens s'obtiennent dans Payhip → Produits → bouton « Partager / Intégrer »
de chaque livre (format `https://payhip.com/b/XXXXX`).

## Mise en ligne (Netlify)

Déposer à la racine du site (drag & drop dans l'espace Netlify) :

1. `index.html` (une fois les jetons remplacés) ;
2. `cover-ia-sous-controle.jpg` (ce dossier) ;
3. `cover-front.png` est déjà présent sur le site — rien à faire.

Si les images sont absentes, la page affiche automatiquement une couverture de
substitution stylisée (titre sur fond marine/doré) : rien ne casse.
