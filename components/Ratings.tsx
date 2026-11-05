import site from "@/data/site.json";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { Star } from "@/components/icons";

const fmt = (n: number, lang: Locale) => n.toLocaleString(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: 1 });

/** Note Google et Planity (data/site.json, datées). */
export function Ratings({ lang, d, className = "" }: { lang: Locale; d: Dict; className?: string }) {
  const rows = [
    { source: d.ratings.google, ...site.ratings.google },
    { source: d.ratings.planity, ...site.ratings.planity },
  ];
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem] ${className}`}>
      {rows.map((r) => (
        <li key={r.source} className="flex items-center gap-2" aria-label={fill(d.ratings.label, { value: fmt(r.value, lang), source: r.source, count: r.count })}>
          <Star className="text-gold" />
          <span className="num text-paper light:text-ink" aria-hidden="true">
            {fmt(r.value, lang)}/5
          </span>
          <span className="text-ash light:text-stone" aria-hidden="true">
            {r.source} · <span className="num">{fill(d.ratings.reviews, { count: r.count })}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
