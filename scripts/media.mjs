// Classe les photos Instagram de Golden Barber (assets/raw/) dans assets/<catégorie>/ avec des noms lisibles,
// recadrées (filigrane « GB » en bas à droite des posts 04 à 06, cadrage 4:5 des couvertures de reels),
// puis les prépare pour le web dans public/media/<catégorie>/. next/image sert ensuite AVIF/WebP à la bonne taille.
//   npm run media
//
// Photos à venir (prises au salon) : les déposer telles quelles dans assets/<catégorie>/ (hero, coupes, equipe, salon)
// et relancer : tout fichier présent dans ces dossiers est copié vers public/media (largeur max 2000 px).
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const raw = (n) => path.join(ROOT, "assets/raw", `golden-barber_${n}.jpg`);

// [source, catégorie, nom, zone gardée { left, top, width, height } (absente = image entière)]
const PICKS = [
  ["04_DUGpUGDCETW", "hero", "low-fade-profil", { left: 0, top: 0, width: 1414, height: 1660 }],
  ["04_DUGpUGDCETW", "coupes", "low-fade-mi-long", { left: 0, top: 0, width: 1414, height: 1660 }],
  ["05_DTsyr2SCOJN", "coupes", "taper-boucles-texture", { left: 0, top: 0, width: 1414, height: 1660 }],
  ["06_DRFQfkIiOJu", "coupes", "taper-nuque-texture", { left: 0, top: 0, width: 1440, height: 1660 }],
  ["01_DZNFYoXMl8yW_IXwIO9-fcK0gOlzIEO1SVuS9U0_video-cover", "coupes", "taper-afro-coloration", { left: 0, top: 140, width: 640, height: 800 }],
  ["02_DV_XNG4CJ7C_video-cover", "coupes", "low-fade-court", { left: 0, top: 120, width: 640, height: 800 }],
  ["03_DVyHVoBiALO_video-cover", "coupes", "taper-boucles-nuque", { left: 0, top: 230, width: 720, height: 900 }],
  ["03_DVyHVoBiALO_video-cover", "salon", "interieur-mur-vegetal", { left: 0, top: 0, width: 720, height: 430 }],
];

const sizes = {};
const write = async (input, cat, name, region) => {
  await mkdir(path.join(ROOT, "assets", cat), { recursive: true });
  await mkdir(path.join(ROOT, "public/media", cat), { recursive: true });
  let img = sharp(input).rotate();
  if (region) img = img.extract(region);
  const buf = await img.resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  if (region) await writeFile(path.join(ROOT, "assets", cat, `${name}.jpg`), buf);
  await writeFile(path.join(ROOT, "public/media", cat, `${name}.jpg`), buf);
  const m = await sharp(buf).metadata();
  sizes[`/media/${cat}/${name}.jpg`] = [m.width, m.height];
};

for (const [n, cat, name, region] of PICKS) await write(raw(n), cat, name, region);

// Photos ajoutées à la main dans assets/<catégorie>/ (celles du salon, de l'équipe…)
const picked = new Set(PICKS.map(([, c, n]) => `${c}/${n}`));
for (const cat of ["hero", "coupes", "equipe", "salon"]) {
  for (const f of await readdir(path.join(ROOT, "assets", cat)).catch(() => [])) {
    const name = f.replace(/\.(jpe?g|png|webp|heic)$/i, "");
    if (name === f || picked.has(`${cat}/${name}`)) continue;
    await write(path.join(ROOT, "assets", cat, f), cat, name, null);
  }
}

// Image de partage (Open Graph) 1200 × 630 : la nuque du low fade
await sharp(raw("04_DUGpUGDCETW")).extract({ left: 0, top: 420, width: 1414, height: 742 }).resize(1200, 630).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(ROOT, "public/og.jpg"));

await writeFile(path.join(ROOT, "data/media-sizes.json"), JSON.stringify(sizes, null, 2) + "\n");
console.log(Object.keys(sizes).length, "photos prêtes");
