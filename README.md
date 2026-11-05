# Golden Barber

Site vitrine et réservation de Golden Barber, barbier mixte au 8 rue Flatters, Amiens (FR/EN). Next.js 16, Tailwind 4, Motion.

- `npm run dev` / `npm run build`
- `npm run media` : photos de `assets/` vers `public/media/`
- `npm run logo` : vectorise le logo depuis `assets/raw/golden-barber_logo.jpg`
- `npm run affichette` : affichette A5 avec QR code (`public/affichette-golden-barber-a5.pdf`)
- `npm run contenu` : régénère `CONTENU.md`

Données datées dans `data/*.json` (prix, horaires, annonces, équipe, réalisations, notes). Textes dans `locales/`.
Réservation : Planity (pas de présélection possible par lien). Pas de base de données.
