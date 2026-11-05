// Vectorise le vrai logo de Golden Barber (photo de profil Instagram : monogramme « GB » dans un cercle, « GOLDEN BARBER »)
// en tracés SVG : public/logo.svg (or, complet), public/logo-noir.svg, app/icon.svg (monogramme seul), components/logo-paths.json.
//   npm run logo
// Quand le salon fournira son fichier d'origine, remplacer public/logo.svg et relancer l'extraction des tracés si besoin.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import potrace from "potrace";

const ROOT = path.resolve(import.meta.dirname, "..");
const src = path.join(ROOT, "assets/raw/golden-barber_logo.jpg");
const GOLD = "#C8A24A";

async function trace(crop) {
  // Or sur noir : on isole la zone, on inverse et on agrandit pour un tracé net
  // Or sur noir : agrandi et lissé (la texture granuleuse de l'or disparaît), puis binarisé à la main (or → noir pour potrace)
  const g = await sharp(src).extract(crop).grayscale().resize({ width: 2400 }).median(9).raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < g.data.length; i++) g.data[i] = g.data[i] > 70 ? 0 : 255;
  const buf = await sharp(g.data, { raw: g.info }).png().toBuffer();
  const svg = await new Promise((ok, ko) =>
    potrace.trace(buf, { threshold: 128, turdSize: 60, optTolerance: 0.3, color: "#000", background: "transparent" }, (e, s) => (e ? ko(e) : ok(s))),
  );
  const d = svg.match(/ d="([^"]+)"/)[1];
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * info.channels] < 128) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  const pad = 8;
  return { d, viewBox: `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}` };
}

const mark = await trace({ left: 290, top: 200, width: 445, height: 445 });
const full = await trace({ left: 200, top: 200, width: 624, height: 630 });

const file = (t, fill, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${t.viewBox}" role="img" aria-label="${label}"><path fill="${fill}" fill-rule="evenodd" d="${t.d}"/></svg>\n`;
await writeFile(path.join(ROOT, "public/logo.svg"), file(full, GOLD, "Golden Barber"));
await writeFile(path.join(ROOT, "public/logo-noir.svg"), file(full, "#0D0D0D", "Golden Barber"));
await writeFile(path.join(ROOT, "public/monogramme.svg"), file(mark, GOLD, "Golden Barber"));

// Favicon : monogramme or sur pastille noire
const [x, y, w, h] = mark.viewBox.split(" ").map(Number);
const m = w * 0.08;
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x - m} ${y - m} ${w + 2 * m} ${h + 2 * m}"><rect x="${x - m}" y="${y - m}" width="${w + 2 * m}" height="${h + 2 * m}" rx="${(w + 2 * m) * 0.2}" fill="#0D0D0D"/><path fill="${GOLD}" fill-rule="evenodd" d="${mark.d}"/></svg>\n`;
await writeFile(path.join(ROOT, "app/icon.svg"), icon);
await sharp(Buffer.from(icon), { density: 300 }).resize(180, 180).png().toFile(path.join(ROOT, "app/apple-icon.png"));

await writeFile(path.join(ROOT, "components/logo-paths.json"), JSON.stringify({ mark }) + "\n");
console.log("logo vectorisé", mark.viewBox, full.viewBox);
