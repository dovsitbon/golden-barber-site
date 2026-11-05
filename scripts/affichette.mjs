// Affichette A5 imprimable (PDF) avec QR code vers le site, pour la présentation au salon.
//   npm run affichette   →   public/affichette-golden-barber-a5.pdf
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const site = JSON.parse(await readFile(path.join(ROOT, "data/site.json"), "utf8"));
const url = `${site.url}/fr`;

const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const INK = hex("#0D0D0D");
const GOLD = hex("#C8A24A");
const PAPER = hex("#F4F1EA");
const ASH = hex("#9A958C");
const LINE = hex("#2E2C29");

const pdf = await PDFDocument.create();
pdf.setTitle("Golden Barber : affichette A5");
pdf.setAuthor("Golden Barber");
const W = 419.53;
const H = 595.28;
const page = pdf.addPage([W, H]);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const sans = await pdf.embedFont(StandardFonts.Helvetica);

page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: INK });

// Photo du haut : le low fade, en bandeau
const photoH = 188;
const photo = await sharp(path.join(ROOT, "public/media/hero/low-fade-profil.jpg")).resize(1260, Math.round((1260 * photoH) / W), { fit: "cover", position: "centre" }).jpeg({ quality: 88 }).toBuffer();
page.drawImage(await pdf.embedJpg(photo), { x: 0, y: H - photoH, width: W, height: photoH });
page.drawRectangle({ x: 0, y: H - photoH - 1, width: W, height: 1, color: GOLD });

// Logo (tracé du vrai logo), rendu en PNG : pdf-lib ignore la règle evenodd des tracés SVG
const logoPng = await sharp(path.join(ROOT, "public/logo.svg")).resize({ width: 900 }).png().toBuffer();
const logoImg = await pdf.embedPng(logoPng);
const logoW = 84;
const logoH = (logoImg.height / logoImg.width) * logoW;
let y = H - photoH - 22 - logoH;
page.drawImage(logoImg, { x: (W - logoW) / 2, y, width: logoW, height: logoH });

const center = (text, font, size, yy, color = PAPER, spacing = 0) => {
  const w = font.widthOfTextAtSize(text, size) + spacing * (text.length - 1);
  if (!spacing) return page.drawText(text, { x: (W - w) / 2, y: yy, size, font, color });
  let x = (W - w) / 2;
  for (const ch of text) {
    page.drawText(ch, { x, y: yy, size, font, color });
    x += font.widthOfTextAtSize(ch, size) + spacing;
  }
};

y -= 30;
center("Réservez votre coupe en ligne", bold, 18, y);
y -= 17;
center("Prix, équipe, réalisations : tout est sur le site", sans, 10, y, ASH);

// QR code (or sur noir : contraste suffisant pour les lecteurs ; marge claire pour la lecture)
const qrPng = await QRCode.toBuffer(url, { margin: 2, width: 600, color: { dark: "#0D0D0D", light: "#F4F1EA" }, errorCorrectionLevel: "M" });
const qrS = 104;
y -= 16 + qrS;
page.drawImage(await pdf.embedPng(qrPng), { x: (W - qrS) / 2, y, width: qrS, height: qrS });
y -= 16;
center(url.replace(/^https?:\/\//, ""), sans, 8.5, y, GOLD);

y -= 18;
page.drawLine({ start: { x: 60, y }, end: { x: W - 60, y }, thickness: 0.5, color: LINE });
y -= 17;
center("Coupe 25 €  ·  Coupe + barbe 30 €  ·  Enfant 20 €", sans, 9, y);
y -= 14;
center("Abonnement : 4 prestations dans le mois, 3 payées", sans, 9, y, GOLD);
y -= 14;
center(`${site.address.street}, ${site.address.postalCode} ${site.address.city}  ·  ${site.phone}`, sans, 8.5, y, ASH);
y -= 12;
center("Du mardi au samedi, 10 h – 20 h  ·  @goldenbarber_80", sans, 8.5, y, ASH);

await writeFile(path.join(ROOT, "public/affichette-golden-barber-a5.pdf"), await pdf.save());
console.log("affichette prête :", url, "bas de page à y =", Math.round(y));
