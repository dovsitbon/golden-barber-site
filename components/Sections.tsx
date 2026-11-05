import Image from "next/image";
import prestations from "@/data/prestations.json";
import equipe from "@/data/equipe.json";
import site from "@/data/site.json";
import { fill, type Dict, type Locale } from "@/lib/i18n";
import { duration, hourLabel, longDate, upcomingClosures, weekRows, parisNow } from "@/lib/shop";
import { img } from "@/lib/media";
import { ArrowUpRight, Instagram } from "@/components/icons";
import { Monogram } from "@/components/Logo";

type Cat = keyof Dict["services"]["groups"];
const GROUPS: Cat[] = ["cheveux", "barbe", "apprenti"];
const ext = { target: "_blank", rel: "noopener" } as const;

/** Liste des prestations (style carte de salon) : nom, description, durée, prix, et un bouton « Réserver » par ligne. */
export function PriceList({ lang, d, headingLevel = 3 }: { lang: Locale; d: Dict; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="grid gap-12">
      {GROUPS.map((g) => (
        <div key={g}>
          <H className="flex items-center gap-3 border-b hairline pb-3 text-[0.8125rem] font-medium text-stone">{d.services.groups[g]}</H>
          <ul>
            {prestations.items
              .filter((p) => p.category === g)
              .map((p) => (
                <li key={p.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b hairline py-5 sm:grid-cols-[1fr_auto_auto] sm:gap-x-8">
                  <div className="min-w-0">
                    <p className="text-[1.0625rem] font-medium text-ink">{p.name[lang]}</p>
                    <p className="mt-1 text-[0.875rem] text-stone">
                      {p.desc[lang]} <span className="num whitespace-nowrap">· {duration(p.minutes, lang)}</span>
                    </p>
                  </div>
                  <p className="display num text-end text-2xl sm:text-[1.75rem]">{p.price} €</p>
                  <a href={site.planity} {...ext} aria-label={fill(d.services.bookAria, { name: p.name[lang] })} className="btn btn-line btn-sm col-span-2 mt-3 justify-self-start sm:col-span-1 sm:mt-0">
                    {d.services.book}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ))}
      <div className="grid gap-2 text-[0.875rem] text-stone">
        <p>{prestations.extras[lang]}</p>
        <p>{d.services.planityHint}</p>
        <p className="text-[0.8125rem]">{fill(d.services.asOf, { date: longDate(prestations.asOf, lang) })}</p>
      </div>
    </div>
  );
}

/** Une carte par barber : photo (ou monogramme en attendant), prénom, spécialité, Instagram, « Réserver avec lui ». */
export function TeamGrid({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 md:grid-cols-3 xl:grid-cols-5 lg:gap-x-5">
      {equipe.members.map((m) => {
        const photo = m.photo ? img(m.photo) : null;
        const specialty = m.specialty ? (m.specialty as Record<Locale, string>)[lang] : null;
        return (
          <li key={m.id} className="flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden bg-char">
              {photo ? (
                <Image src={photo.src} width={photo.width} height={photo.height} alt={m.name} sizes="(min-width: 1024px) 240px, 50vw" quality={70} className="size-full object-cover" />
              ) : (
                <div className="flex size-full flex-col justify-between p-4" aria-hidden="true">
                  <Monogram className="size-7 text-gold/70" />
                  <span className="display text-[2.75rem] leading-none text-paper/90 sm:text-5xl">{m.name.slice(0, 1)}</span>
                </div>
              )}
              {m.apprentice && <span className="absolute top-3 right-3 bg-ink/80 px-2 py-1 text-[0.75rem] text-gold-hi">{d.team.apprentice}</span>}
            </div>
            <div className="mt-4 flex items-start justify-between gap-2">
              <div>
                <h3 className="display text-xl" translate="no">
                  {m.name}
                </h3>
                <p className="mt-1 text-[0.8125rem] text-ash">{specialty ?? d.team.noSpecialty}</p>
              </div>
              {m.instagram && (
                <a href={m.instagram} {...ext} aria-label={fill(d.team.instagram, { name: m.name })} className="-me-2 -mt-1 grid size-10 shrink-0 place-items-center text-bone transition-colors hover:text-gold-hi">
                  <Instagram size={18} />
                </a>
              )}
            </div>
            <a href={site.planity} {...ext} aria-label={fill(d.team.bookAria, { name: m.name })} title={fill(d.team.hint, { name: m.name })} className="btn btn-line btn-sm mt-4 w-full">
              {d.team.book}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Horaires de la semaine (data/horaires.json), jour courant en évidence côté serveur au moment du rendu. */
export function HoursTable({ lang, d }: { lang: Locale; d: Dict }) {
  const closures = upcomingClosures(parisNow().iso);
  return (
    <div>
      <ul className="text-[0.9375rem]">
        {weekRows().map(({ day, ranges }) => (
          <li key={day} className={`flex justify-between gap-4 border-b hairline py-2.5 text-bone`}>
            <span className="capitalize">{d.days[day]}</span>
            <span className="num">{ranges ? ranges.map(([a, b]) => `${hourLabel(a, lang)} – ${hourLabel(b, lang)}`).join(", ") : <span className="text-ash">{d.info.closedDay}</span>}</span>
          </li>
        ))}
      </ul>
      {closures.length > 0 && (
        <p className="mt-4 text-[0.8125rem] text-ash">
          {d.info.closures} : {closures.map((c) => `${c.label[lang]} (${longDate(c.from, lang)})`).join(", ")}
        </p>
      )}
    </div>
  );
}

export function PlanityLink({ d, className = "" }: { d: Dict; className?: string }) {
  return (
    <a href={site.planity} {...ext} className={`inline-flex items-center gap-2 ${className}`}>
      {d.footer.book} <ArrowUpRight size={16} />
    </a>
  );
}
