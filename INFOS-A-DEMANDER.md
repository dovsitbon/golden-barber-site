# Golden Barber : infos à demander au salon

À récupérer pendant la présentation (affichette : `public/affichette-golden-barber-a5.pdf`).

## Déjà trouvé, à faire confirmer

- **Les 2 prestations manquantes** : récupérées sur Planity, **Barbe** (15 min, 15 €) et **Traçage des contours** (10 min, 10 €). Les autres prestations citées (dessin, coloration, boule à zéro, soin du visage) n'ont pas de prix sur Planity : ont-elles un tarif à afficher ?
- **Horaires** : du mardi au samedi, 10 h – 20 h. Pause midi ? Fermetures de fin d'année ? (`data/horaires.json`)
- **Abonnement « 4 prestations, 3 payées »** : toutes les prestations comptent ? Faut-il s'inscrire ?

## À demander

1. **Spécialité de chaque barber** (une ligne : « dégradés à blanc », « barbe et rasoir », « cheveux bouclés »…) pour Giovanni, Breezy, Toma, Anzo. → `data/equipe.json`
2. **Photo de chaque barber** (portrait vertical, fond du salon) et son Instagram perso. @breezy_the_barber est déjà relié à Breezy ; à qui est @hkn_barber ? → `assets/equipe/`
3. **Qui a fait quelle coupe** dans les 6 photos de la galerie (le prénom s'affiche sous chaque photo). → `data/realisations.json`
4. **Politique de retard et d'annulation** (délai pour annuler, retard toléré). Le texte de la FAQ est provisoire.
5. **Moyens de paiement** (CB, espèces, sans contact, chèques ?). Le texte de la FAQ dit seulement « au salon ».
6. **Sans rendez-vous** : acceptés ou non ? La FAQ dit « appelez avant de passer ».
7. **Photos du salon** : façade (avec l'enseigne), intérieur large, fauteuils, mur végétal, équipe ensemble. La photo actuelle du bloc « Le salon » est un recadrage basse définition d'un reel. → `assets/salon/`
8. **Photos de coupes** pour les filtres vides : barbe, cheveux longs, enfant (les filtres apparaissent tout seuls dès qu'une photo existe). → `assets/coupes/`
9. **Le logo en fichier** (SVG, AI ou PDF). Le logo actuel est vectorisé depuis la photo de profil Instagram.
10. **SIRET** et raison sociale exacte (mentions légales). → `data/site.json`
11. **Nom de domaine** souhaité (ex. goldenbarber-amiens.fr) pour remplacer l'adresse Vercel.

## Où déposer les photos

Déposer les fichiers dans `assets/hero/`, `assets/coupes/`, `assets/equipe/` ou `assets/salon/`, puis lancer `npm run media` : ils sont redimensionnés et copiés dans `public/media/`. Il reste à les référencer dans le bon fichier `data/*.json` (chemin `/media/<dossier>/<nom>.jpg`).
