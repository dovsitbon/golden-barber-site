// Génère CONTENU.md : tous les textes du site en français et en anglais, avec les prix, pour validation par le salon.
//   npm run contenu
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const json = async (f) => JSON.parse(await readFile(path.join(ROOT, f), "utf8"));
const [fr, en, prest, equipe, faq, real, annonces, horaires, site] = await Promise.all(
  ["locales/fr.json", "locales/en.json", "data/prestations.json", "data/equipe.json", "data/faq.json", "data/realisations.json", "data/annonces.json", "data/horaires.json", "data/site.json"].map(json),
);

const out = [];
const h = (t, n = 2) => out.push("", `${"#".repeat(n)} ${t}`, "");
const esc = (s) => String(s).replace(/\n/g, " ").replace(/\|/g, "\\|");
const pair = (label, a, b) => out.push(`| ${label} | ${esc(a)} | ${esc(b)} |`);
const table = (rows) => {
  out.push("| Élément | Français | English |", "|---|---|---|");
  for (const r of rows) pair(...r);
};

out.push("# Golden Barber : contenu du site (FR / EN)", "", `Document généré depuis le code (\`npm run contenu\`). Les textes vivent dans \`locales/fr.json\`, \`locales/en.json\` et \`data/*.json\` : corrigez-les là, puis relancez.`, "", "**À valider par le salon** : les lignes marquées ⚠️.");

h("Infos générales");
out.push(`- Adresse : ${site.address.street}, ${site.address.postalCode} ${site.address.city}`);
out.push(`- Téléphone / WhatsApp : ${site.phone} (${site.phoneIntl})`);
out.push(`- Réservation : ${site.planity}`);
out.push(`- Instagram : ${site.instagram}`);
out.push(`- Horaires : du mardi au samedi, ${horaires.week["2"][0][0]} – ${horaires.week["2"][0][1]} ; fermé dimanche et lundi`);
out.push(`- Notes affichées : Google ${site.ratings.google.value}/5 (${site.ratings.google.count} avis), Planity ${site.ratings.planity.value}/5 (${site.ratings.planity.count} avis), relevées le ${site.ratings.google.asOf}`);

h("Référencement (Google)");
table([
  ["Titre de la page", fr.meta.title, en.meta.title],
  ["Description", fr.meta.description, en.meta.description],
  ["Page tarifs : titre", fr.services.pageTitle, en.services.pageTitle],
  ["Page tarifs : description", fr.services.pageLead, en.services.pageLead],
]);

h("Bandeau du haut");
table([["Annonce par défaut", `${annonces.default.text.fr} · ${annonces.default.link.fr}`, `${annonces.default.text.en} · ${annonces.default.link.en}`]]);

h("Hero (premier écran)");
table([
  ["Petite ligne", fr.hero.eyebrow, en.hero.eyebrow],
  ["Titre", fr.hero.title, en.hero.title],
  ["Texte", fr.hero.lead, en.hero.lead],
  ["Boutons", `${fr.hero.book} / ${fr.hero.prices}`, `${en.hero.book} / ${en.hero.prices}`],
]);

h("Prestations et prix");
table([
  ["Titre", fr.services.title, en.services.title],
  ["Texte", fr.services.lead, en.services.lead],
]);
out.push("", `Prix relevés sur Planity le ${prest.asOf}.`, "", "| Prestation (FR) | Prestation (EN) | Description FR | Description EN | Durée | Prix |", "|---|---|---|---|---|---|");
for (const p of prest.items) out.push(`| ${p.name.fr} | ${p.name.en} | ${p.desc.fr} | ${p.desc.en} | ${p.minutes} min | ${p.price} € |`);
out.push("", `- FR : ${prest.extras.fr}`, `- EN : ${prest.extras.en}`);

h("L'équipe");
table([
  ["Titre", fr.team.title, en.team.title],
  ["Texte", fr.team.lead, en.team.lead],
  ["Bouton", fr.team.book, en.team.book],
]);
out.push("");
for (const m of equipe.members) out.push(`- **${m.name}**${m.apprentice ? " (apprenti)" : ""} : ${m.specialty ? `${m.specialty.fr} / ${m.specialty.en}` : "⚠️ spécialité à fournir"} ; Instagram : ${m.instagram ?? "⚠️ à fournir"} ; photo : ${m.photo ?? "⚠️ à prendre"}`);

h("Réalisations");
table([
  ["Titre", fr.work.title, en.work.title],
  ["Texte", fr.work.lead, en.work.lead],
]);
out.push("", "⚠️ Qui a fait chaque coupe ? (affiché sous la photo)", "");
for (const it of real.items) out.push(`- \`${it.src}\` : ${it.alt.fr} / ${it.alt.en} ; barber : ${it.barber ?? "⚠️ à préciser"}`);

h("Abonnement");
table([
  ["Titre", fr.membership.title, en.membership.title],
  ["Texte", fr.membership.body, en.membership.body],
  ...fr.membership.steps.map((s, i) => [`Étape ${i + 1}`, s, en.membership.steps[i]]),
]);

h("Le salon");
table([
  ["Titre", fr.salon.title, en.salon.title],
  ["Texte", fr.salon.body, en.salon.body],
]);

h("Infos pratiques");
table([
  ["Titre", fr.info.title, en.info.title],
  ["Accès", fr.info.accessText, en.info.accessText],
  ["Formulaire", `${fr.question.title} ${fr.question.lead}`, `${en.question.title} ${en.question.lead}`],
]);

h("FAQ");
out.push("| Question / réponse | Français | English |", "|---|---|---|");
faq.items.forEach((f, i) => {
  const flag = i === 1 || i === 2 ? " ⚠️" : "";
  pair(`Q${i + 1}${flag}`, f.q.fr, f.q.en);
  pair(`R${i + 1}`, f.a.fr, f.a.en);
});

h("Pied de page et mentions légales");
table([
  ["Signature", fr.footer.tagline, en.footer.tagline],
  ["Éditeur", fr.legal.editorText, en.legal.editorText],
  ["SIRET ⚠️", fr.legal.siret, en.legal.siret],
  ["Données", fr.legal.dataText, en.legal.dataText],
]);

await writeFile(path.join(ROOT, "CONTENU.md"), out.join("\n") + "\n");
console.log("CONTENU.md généré");
