# Landing page — ouvrages Payhip

Reconstruction de la landing page produite dans la session Cowork « Ebook publication on Payhip »
(charte : fond marine, doré, Playfair Display + Inter ; deux ouvrages à 19,90 €).

Les fichiers finaux de la session Cowork (avec les vrais liens Payhip et la couverture
`cover-ia-sous-controle.jpg`) sont restés sur la machine locale ; cette version est prête
à l'emploi à trois substitutions près.

## À remplacer avant mise en ligne (Ctrl+F dans `index.html`)

| Jeton | Valeur attendue | Occurrences |
|---|---|---|
| `PAYHIP_LIVRE_1` | code du lien Payhip du premier ouvrage | 2 |
| `PAYHIP_LIVRE_2` | code du lien Payhip de « L'IA sous contrôle » | 2 |
| `TITRE_LIVRE_1` | titre exact du premier ouvrage | 6 |

## Mise en ligne (Netlify)

Déposer à la racine du site (drag & drop dans l'espace Netlify) :

1. `index.html` (ce dossier, une fois les jetons remplacés) ;
2. `cover-ia-sous-controle.jpg` (couverture du nouveau livre, produite dans la session Cowork) ;
3. `cover-front.png` est déjà présent sur le site — rien à faire.

Si les images sont absentes, la page affiche automatiquement une couverture de
substitution stylisée (titre sur fond marine/doré) : rien ne casse.
