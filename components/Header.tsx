"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { Logo } from "@/components/Logo";
import { Close, Instagram, Menu, Phone } from "@/components/icons";
import { locales } from "@/lib/locales";
import { href, switchPath } from "@/lib/routes";

function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, d } = useLocale();
  const pathname = usePathname();
  return (
    <nav aria-label={d.nav.language} className={`flex items-center gap-1 text-[0.8125rem] ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-stone" aria-hidden="true">·</span>}
          <Link
            href={switchPath(pathname, l)}
            hrefLang={l}
            aria-current={l === lang ? "true" : undefined}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000;samesite=lax`;
            }}
            className={`grid min-h-10 min-w-8 place-items-center uppercase transition-colors ${l === lang ? "text-paper" : "text-ash hover:text-paper"}`}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}

export function BookButton({ className = "", label }: { className?: string; label?: string }) {
  const { d } = useLocale();
  return (
    <a href={site.planity} target="_blank" rel="noopener" className={`btn btn-gold ${className}`}>
      {label ?? d.nav.book}
    </a>
  );
}

/** Header : liens à gauche, logo au centre, langue, Instagram et « Réserver » à droite. Le bouton reste visible au défilement. */
export function Header() {
  const { lang, d } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { label: d.nav.services, to: href(lang, "home", "prestations") },
    { label: d.nav.team, to: href(lang, "home", "equipe") },
    { label: d.nav.work, to: href(lang, "home", "realisations") },
    { label: d.nav.info, to: href(lang, "home", "infos") },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ferme le menu à chaque navigation
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b hairline bg-ink/92 backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-ink">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <nav aria-label="Navigation" className="hidden items-center gap-7 text-[0.875rem] lg:flex">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-bone transition-colors hover:text-paper">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-ms-2 grid size-11 place-items-center text-paper lg:hidden"
        >
          <Menu size={22} />
          <span className="sr-only">{d.nav.menu}</span>
        </button>

        <Link href={href(lang, "home")} aria-label={`Golden Barber, ${d.nav.home}`} className="justify-self-center">
          <Logo compact />
        </Link>

        <div className="flex items-center justify-end gap-2 sm:gap-4">
          <LangSwitch className="hidden sm:flex" />
          <a href={site.instagram} target="_blank" rel="noopener" aria-label={d.nav.instagram} className="hidden size-10 place-items-center text-bone transition-colors hover:text-paper sm:grid">
            <Instagram />
          </a>
          <BookButton className="btn-sm" />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={d.nav.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b hairline px-4">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center" autoFocus>
                <Close size={22} />
                <span className="sr-only">{d.nav.close}</span>
              </button>
            </div>
            <nav aria-label="Navigation" className="flex flex-1 flex-col px-6 pt-6">
              {links.map((l, i) => (
                <motion.a
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  className="display border-b hairline py-5 text-3xl"
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="mt-8 flex items-center justify-between">
                <LangSwitch />
                <a href={site.instagram} target="_blank" rel="noopener" className="flex min-h-11 items-center gap-2 text-bone">
                  <Instagram /> {site.instagramHandle}
                </a>
              </div>
            </nav>
            <div className="grid grid-cols-2 gap-3 border-t hairline p-4">
              <a href={`tel:${site.phoneIntl}`} className="btn btn-line">
                <Phone size={16} /> {d.mobileBar.call}
              </a>
              <BookButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Mobile : barre fixée en bas de l'écran, « Réserver » toujours à portée de pouce. */
export function MobileBookBar() {
  const { d } = useLocale();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] gap-2 border-t hairline bg-ink/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <a href={`tel:${site.phoneIntl}`} className="btn btn-line px-4" aria-label={d.mobileBar.call}>
        <Phone size={18} />
      </a>
      <BookButton label={`${d.mobileBar.book} · Planity`} />
    </div>
  );
}
