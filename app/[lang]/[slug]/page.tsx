import type { Metadata } from "next";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import { getDict, isLocale, locales, type Dict, type Locale } from "@/lib/i18n";
import { PAGES, href, pageOf, type PageId } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { PriceList } from "@/components/Sections";
import { SectionLabel } from "@/components/Logo";
import { Ratings } from "@/components/Ratings";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => Object.values(PAGES).map((s) => ({ lang, slug: s[lang] })));
}

const titles = (d: Dict): Record<PageId, { title: string; description: string; h1: string }> => ({
  prices: { title: `${d.services.pageTitle} | 8 rue Flatters`, description: d.services.pageLead, h1: d.services.pageTitle },
  legal: { title: `${d.legal.title} | Golden Barber`, description: d.legal.editorText, h1: d.legal.title },
});

export async function generateMetadata({ params }: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const id = pageOf(lang, slug);
  if (!id) return {};
  const t = titles(getDict(lang))[id];
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: href(lang, id),
      languages: { ...Object.fromEntries(locales.map((l) => [l, href(l, id)])), "x-default": href("fr", id) },
    },
    openGraph: { title: t.title, description: t.description, url: href(lang, id), images: ["/og.jpg"] },
    robots: id === "legal" ? { index: false, follow: true } : undefined,
  };
}

export default async function Page({ params }: PageProps<"/[lang]/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const id = pageOf(lang, slug);
  if (!id) notFound();
  const d = getDict(lang);
  const t = titles(d)[id];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(lang, t.h1, href(lang, id))) }} />
      {id === "prices" ? <Prices lang={lang} d={d} h1={t.h1} /> : <Legal d={d} />}
    </>
  );
}

function Prices({ lang, d, h1 }: { lang: Locale; d: Dict; h1: string }) {
  return (
    <section className="light">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionLabel n="01">{d.services.label}</SectionLabel>
        <h1 className="display mt-5 text-4xl sm:text-5xl">{h1}</h1>
        <p className="mt-5 max-w-[52ch] text-stone">{d.services.pageLead}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a href={site.planity} target="_blank" rel="noopener" className="btn btn-ink">
            {d.nav.book}
          </a>
          <Ratings lang={lang} d={d} />
        </div>
        <div className="mt-14">
          <PriceList lang={lang} d={d} headingLevel={2} />
        </div>
      </div>
    </section>
  );
}

function Legal({ d }: { d: Dict }) {
  const l = d.legal;
  const rows: [string, string][] = [
    [l.editor, `${l.editorText} ${site.siret ? `SIRET : ${site.siret}.` : l.siret}`],
    [l.host, l.hostText],
    [l.data, l.dataText],
    [l.credits, l.creditsText],
  ];
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="display text-4xl sm:text-5xl">{l.title}</h1>
      <dl className="mt-12 grid gap-8">
        {rows.map(([k, v]) => (
          <div key={k} className="border-t hairline pt-6">
            <dt className="text-[0.8125rem] text-ash">{k}</dt>
            <dd className="mt-2 max-w-[62ch] text-bone">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
