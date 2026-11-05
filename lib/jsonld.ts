import site from "@/data/site.json";
import horaires from "@/data/horaires.json";
import prestations from "@/data/prestations.json";
import equipe from "@/data/equipe.json";
import { getDict, type Locale } from "@/lib/i18n";
import { href } from "@/lib/routes";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const BUSINESS_ID = `${site.url}/#barbershop`;

/** Schema.org BarberShop (sous-type de HairSalon) : adresse, horaires, note Google datée, prix, Instagram et Planity. */
export function businessJsonLd(lang: Locale) {
  const d = getDict(lang);
  const week = horaires.week as unknown as Record<string, [string, string][] | null>;
  const hours = Object.entries(week).flatMap(([day, ranges]) => (ranges ?? []).map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: DAYS[Number(day)], opens, closes })));
  const g = site.ratings.google;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["BarberShop", "HairSalon"],
        "@id": BUSINESS_ID,
        name: site.name,
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: [`${site.url}/og.jpg`, `${site.url}/media/hero/low-fade-profil.jpg`],
        logo: `${site.url}/logo.svg`,
        telephone: site.phoneIntl,
        priceRange: "10 € – 60 €",
        currenciesAccepted: "EUR",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        hasMap: site.maps,
        openingHoursSpecification: hours,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: g.value,
          reviewCount: g.count,
          bestRating: 5,
          worstRating: 1,
          description: `Google, ${g.asOf}`,
        },
        sameAs: [site.instagram, site.planity],
        potentialAction: { "@type": "ReserveAction", target: site.planity, name: d.nav.book },
        employee: equipe.members.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.apprentice ? (lang === "fr" ? "Apprenti barbier" : "Apprentice barber") : lang === "fr" ? "Barbier" : "Barber" })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: d.services.title,
          url: `${site.url}${href(lang, "prices")}`,
          itemListElement: prestations.items.map((p) => ({
            "@type": "Offer",
            price: p.price,
            priceCurrency: "EUR",
            itemOffered: { "@type": "Service", name: p.name[lang], description: p.desc[lang] },
          })),
        },
      },
      { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.name, inLanguage: ["fr", "en"], publisher: { "@id": BUSINESS_ID } },
    ],
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(lang: Locale, name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${lang}` },
      { "@type": "ListItem", position: 2, name, item: `${site.url}${path}` },
    ],
  };
}
