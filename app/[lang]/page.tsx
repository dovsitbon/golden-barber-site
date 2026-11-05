import Image from "next/image";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import faq from "@/data/faq.json";
import salon from "@/data/salon.json";
import { getDict, isLocale } from "@/lib/i18n";
import { img } from "@/lib/media";
import { faqJsonLd } from "@/lib/jsonld";
import { Ratings } from "@/components/Ratings";
import { OpenStatus } from "@/components/OpenStatus";
import { SectionLabel } from "@/components/Logo";
import { HoursTable, PriceList, TeamGrid } from "@/components/Sections";
import { Gallery } from "@/components/Gallery";
import { QuestionForm } from "@/components/QuestionForm";
import { Reveal } from "@/components/Reveal";
import { ArrowUpRight, MapPin, Phone, Plus } from "@/components/icons";

const ext = { target: "_blank", rel: "noopener" } as const;
const wrap = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);
  const hero = img("/media/hero/low-fade-profil.jpg");
  const salonPhoto = salon.photos[0];
  const salonImg = img(salonPhoto.src);
  const faqItems = faq.items.map((f) => ({ q: f.q[lang], a: f.a[lang] }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }} />

      {/* ——— Hero : texte à gauche sur le noir, la coupe à droite (plein cadre sur mobile) ——— */}
      <section className="relative isolate overflow-hidden lg:grid lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1fr_1.05fr]">
        <div className="absolute inset-0 -z-10 lg:relative lg:order-2">
          <Image
            src={hero.src}
            width={hero.width}
            height={hero.height}
            alt={d.hero.imgAlt}
            priority
            fetchPriority="high"
            quality={80}
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="size-full object-cover object-[62%_18%] lg:object-[60%_30%] lg:absolute lg:inset-0"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(13_13_13/0)_0%,rgb(13_13_13/0.1)_38%,rgb(13_13_13/0.92)_66%)] lg:hidden" />
        </div>

        <div className="flex min-h-[calc(100svh-64px)] flex-col justify-end px-4 pt-24 pb-8 sm:px-6 lg:order-1 lg:min-h-0 lg:justify-center lg:px-8 lg:py-20 xl:ps-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <h1>
            <span className="eyebrow flex items-center gap-3 text-gold-hi">
              <span className="rule-gold w-8" aria-hidden="true" />
              {d.hero.eyebrow}
            </span>
            <span className="display mt-4 block max-w-[13ch] text-[2.5rem] sm:mt-5 sm:text-6xl xl:text-[5.25rem]">{d.hero.title}</span>
          </h1>
          <p className="mt-6 hidden max-w-[44ch] text-[1.0625rem] text-bone sm:block">{d.hero.lead}</p>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
            <a href={site.planity} {...ext} className="btn btn-gold sm:min-w-40">
              {d.hero.book}
            </a>
            <a href="#prestations" className="btn btn-line sm:min-w-40">
              {d.hero.prices}
            </a>
          </div>
          <div className="mt-6 grid gap-3 border-t hairline pt-5 sm:mt-8 sm:pt-6">
            <Ratings lang={lang} d={d} />
            <OpenStatus className="text-[0.875rem] text-bone" />
          </div>
        </div>
      </section>

      {/* ——— Prestations et prix ——— */}
      <section id="prestations" className="light">
        <div className={`${wrap} grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28`}>
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel n="01">{d.services.label}</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-5xl">{d.services.title}</h2>
            <p className="mt-5 max-w-[40ch] text-stone">{d.services.lead}</p>
            <a href={site.planity} {...ext} className="btn btn-ink mt-8">
              {d.nav.book}
            </a>
          </Reveal>
          <Reveal>
            <PriceList lang={lang} d={d} />
          </Reveal>
        </div>
      </section>

      {/* ——— L'équipe ——— */}
      <section id="equipe" className="py-20 lg:py-28">
        <div className={wrap}>
          <Reveal className="max-w-2xl">
            <SectionLabel n="02">{d.team.label}</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-5xl">{d.team.title}</h2>
            <p className="mt-5 text-bone">{d.team.lead}</p>
          </Reveal>
          <Reveal className="mt-12">
            <TeamGrid lang={lang} d={d} />
          </Reveal>
        </div>
      </section>

      {/* ——— Réalisations ——— */}
      <section id="realisations" className="border-t hairline py-20 lg:py-28">
        <div className={wrap}>
          <Reveal className="mb-10 max-w-2xl">
            <SectionLabel n="03">{d.work.label}</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-5xl">{d.work.title}</h2>
            <p className="mt-5 text-bone">{d.work.lead}</p>
          </Reveal>
          <Gallery />
        </div>
      </section>

      {/* ——— L'abonnement ——— */}
      <section id="abonnement" className="bg-char">
        <div className={`${wrap} grid gap-10 py-20 lg:grid-cols-2 lg:items-end lg:gap-20 lg:py-24`}>
          <Reveal>
            <SectionLabel n="04">{d.membership.label}</SectionLabel>
            <h2 className="display mt-5 max-w-[14ch] text-4xl sm:text-5xl">
              <span className="text-gold">4</span> {d.membership.title.replace(/^4 /, "")}
            </h2>
            <p className="mt-5 max-w-[46ch] text-bone">{d.membership.body}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <ol className="grid gap-0">
              {d.membership.steps.map((s, i) => (
                <li key={s} className="flex items-baseline gap-5 border-b hairline py-4">
                  <span className="num font-[family-name:var(--font-display)] text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.0625rem] text-paper">{s}</span>
                </li>
              ))}
            </ol>
            <a href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(d.whatsapp.hello + " " + d.membership.title)}`} {...ext} className="btn btn-line mt-8">
              {d.membership.cta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Le salon : photo + texte + un bouton ——— */}
      <section id="salon" className="py-20 lg:py-28">
        <div className={`${wrap} grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20`}>
          <Reveal>
            <div className="relative aspect-[3/2] overflow-hidden bg-char">
              <Image src={salonImg.src} width={salonImg.width} height={salonImg.height} alt={salonPhoto.alt[lang]} sizes="(min-width: 1024px) 640px, 100vw" quality={75} className="size-full object-cover object-top" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionLabel n="05">{d.salon.label}</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-5xl">{d.salon.title}</h2>
            <p className="mt-5 max-w-[46ch] text-bone">{d.salon.body}</p>
            <a href="#infos" className="btn btn-line mt-8">
              {d.salon.cta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Infos pratiques ——— */}
      <section id="infos" className="border-t hairline py-20 lg:py-28">
        <div className={wrap}>
          <Reveal className="max-w-2xl">
            <SectionLabel n="06">{d.info.label}</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-5xl">{d.info.title}</h2>
          </Reveal>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr_1.2fr] lg:gap-10">
            <Reveal className="grid content-start gap-8">
              <div>
                <h3 className="text-[0.8125rem] text-ash">{d.info.address}</h3>
                <p className="mt-2 text-lg text-paper">
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </p>
                <a href={site.maps} {...ext} className="link-line mt-3 inline-flex items-center gap-2 text-[0.9375rem] text-gold-hi">
                  <MapPin size={16} /> {d.info.directions}
                </a>
              </div>
              <div>
                <h3 className="text-[0.8125rem] text-ash">{d.info.phone}</h3>
                <a href={`tel:${site.phoneIntl}`} className="num mt-2 inline-flex items-center gap-2 text-lg text-paper hover:text-gold-hi">
                  <Phone size={16} /> {site.phone}
                </a>
              </div>
              <div>
                <h3 className="text-[0.8125rem] text-ash">{d.info.access}</h3>
                <p className="mt-2 max-w-[38ch] text-[0.9375rem] text-bone">{d.info.accessText}</p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h3 className="text-[0.8125rem] text-ash">{d.info.hours}</h3>
              <OpenStatus className="mt-2 text-[0.9375rem] text-paper" />
              <div className="mt-2">
                <HoursTable lang={lang} d={d} />
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="relative aspect-[4/3] overflow-hidden border hairline bg-char lg:aspect-auto lg:h-full lg:min-h-80">
                <iframe
                  title={d.info.mapTitle}
                  src={`https://maps.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=17&hl=${lang}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 size-full grayscale invert-[0.92] hue-rotate-180"
                />
              </div>
            </Reveal>
          </div>

          {/* Une question ? */}
          <Reveal className="mt-20 grid gap-10 border-t hairline pt-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <h3 className="display text-3xl">{d.question.title}</h3>
              <p className="mt-3 text-bone">{d.question.lead}</p>
            </div>
            <QuestionForm />
          </Reveal>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section id="faq" className="light">
        <div className={`${wrap} grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-28`}>
          <Reveal>
            <SectionLabel n="07">{d.faq.label}</SectionLabel>
            <h2 className="display mt-5 text-4xl sm:text-5xl">{d.faq.title}</h2>
          </Reveal>
          <Reveal>
            <div className="border-t hairline">
              {faqItems.map((f) => (
                <details key={f.q} className="group border-b hairline">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.0625rem] font-medium">
                    {f.q}
                    <Plus className="faq-plus shrink-0 text-stone transition-transform duration-200" />
                  </summary>
                  <p className="max-w-[60ch] pb-6 text-stone">{f.a}</p>
                </details>
              ))}
            </div>
            <a href={site.planity} {...ext} className="btn btn-ink mt-10">
              {d.nav.book} <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
