"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import data from "@/data/realisations.json";
import equipe from "@/data/equipe.json";
import site from "@/data/site.json";
import { useLocale } from "@/components/providers";
import { ArrowUpRight, ChevronLeft, ChevronRight, Close } from "@/components/icons";
import { fill } from "@/lib/i18n";
import { img } from "@/lib/media";

type Tag = keyof typeof import("@/locales/fr.json")["work"]["filters"];

/** Réalisations : filtres (seulement ceux qui ont des photos), prénom du barber sous chaque photo, lightbox au clavier. */
export function Gallery() {
  const { lang, d } = useLocale();
  const [filter, setFilter] = useState<Tag | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const filters = (data.filters as Tag[]).filter((f) => data.items.some((it) => it.tags.includes(f)));
  const items = useMemo(() => data.items.filter((it) => filter === "all" || it.tags.includes(filter)), [filter]);
  const byLine = (id: string | null) => {
    const m = equipe.members.find((x) => x.id === id);
    return m ? fill(d.work.by, { name: m.name }) : d.work.byTeam;
  };

  const go = useCallback((dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length)), [items.length]);
  const close = useCallback(() => {
    setOpen(null);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, go, close]);

  const current = open !== null ? items[open] : null;

  return (
    <>
      <div role="group" aria-label={d.work.label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {(["all", ...filters] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`min-h-10 shrink-0 rounded-[2px] border px-4 text-[0.875rem] transition-colors ${filter === f ? "border-gold bg-gold text-ink" : "hairline text-bone hover:border-bone hover:text-paper"}`}
          >
            {f === "all" ? d.work.all : d.work.filters[f]}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
        <AnimatePresence initial={false}>
          {items.map((it, i) => {
            const im = img(it.src);
            return (
              <motion.li key={it.src} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    lastFocus.current = e.currentTarget;
                    setOpen(i);
                  }}
                  className="group block w-full text-start"
                  aria-label={`${d.work.open} : ${it.alt[lang]}`}
                >
                  <span className="relative block aspect-[4/5] overflow-hidden bg-char">
                    <Image
                      src={im.src}
                      width={im.width}
                      height={im.height}
                      alt={it.alt[lang]}
                      sizes="(min-width: 1024px) 400px, 50vw"
                      quality={70}
                      className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                    />
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-2 text-[0.8125rem]">
                    <span className="text-paper">{byLine(it.barber)}</span>
                    <span className="text-ash">{it.tags.map((t) => d.work.filters[t as Tag]).join(" · ")}</span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <a href={site.instagram} target="_blank" rel="noopener" className="link-line mt-10 inline-flex items-center gap-2 text-[0.9375rem] text-gold-hi">
        {d.work.more} <ArrowUpRight size={16} />
      </a>

      {typeof document !== "undefined" && createPortal(
      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt[lang]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink"
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-4 text-[0.875rem] text-bone">
              <span className="num">
                {open + 1} / {items.length}
              </span>
              <button ref={closeRef} type="button" onClick={close} className="grid size-11 place-items-center text-paper">
                <Close size={22} />
                <span className="sr-only">{d.work.close}</span>
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
              <motion.div key={current.src} initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="relative h-full max-h-[calc(100dvh-10rem)] w-full max-w-[min(90vw,calc((100dvh-10rem)*0.8))]">
                <Image src={current.src} alt={current.alt[lang]} fill sizes="90vw" quality={80} className="object-contain" />
              </motion.div>
              <button type="button" onClick={() => go(-1)} className="absolute left-2 grid size-12 place-items-center text-paper sm:left-6">
                <ChevronLeft size={26} />
                <span className="sr-only">{d.work.prev}</span>
              </button>
              <button type="button" onClick={() => go(1)} className="absolute right-2 grid size-12 place-items-center text-paper sm:right-6">
                <ChevronRight size={26} />
                <span className="sr-only">{d.work.next}</span>
              </button>
            </div>
            <p className="shrink-0 px-4 py-5 text-center text-[0.875rem] text-bone">
              <span className="text-paper">{byLine(current.barber)}</span> · {current.alt[lang]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      , document.body)}
    </>
  );
}
