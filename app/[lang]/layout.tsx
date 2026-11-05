import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import "../globals.css";
import site from "@/data/site.json";
import { getDict, isLocale, locales, ogLocale } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { Header, MobileBookBar } from "@/components/Header";
import { AnnounceBar } from "@/components/AnnounceBar";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { WhatsAppFab } from "@/components/QuestionForm";
import { businessJsonLd } from "@/lib/jsonld";

// Polices servies en local (app/fonts) : aucun appel à Google Fonts.
const archivo = localFont({
  src: [{ path: "../fonts/archivo-latin-wdth.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
const inter = localFont({
  src: [
    { path: "../fonts/inter-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/inter-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return {
    metadataBase: new URL(site.url),
    title: d.meta.title,
    description: d.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), "x-default": "/fr" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}`,
      siteName: site.name,
      title: d.meta.title,
      description: d.meta.description,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description, images: ["/og.jpg"] },
    formatDetection: { telephone: false },
    robots: { index: true, follow: true, "max-image-preview": "large" },
  };
}

export const viewport: Viewport = { themeColor: "#0d0d0d", width: "device-width", initialScale: 1, colorScheme: "dark" };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

// Avant le premier rendu : saute l'ouverture si déjà vue dans la session ou si l'utilisateur limite les animations.
const introScript = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("gb-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang} className={`${archivo.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(lang)) }} />
      </head>
      <body>
        <Providers lang={lang} d={d}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
            {d.skip}
          </a>
          <Intro skipLabel={d.intro.skip} />
          <AnnounceBar />
          <Header />
          <main id="main">{children}</main>
          <Footer lang={lang} d={d} />
          <MobileBookBar />
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
