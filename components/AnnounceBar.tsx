"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/providers";
import { Close } from "@/components/icons";
import { activeAnnouncement, parisNow } from "@/lib/shop";
import { href } from "@/lib/routes";

const KEY = "gb-annonce";

/** Bandeau d'infos pratiques (data/annonces.json), qu'on peut fermer. Mémorisé par id d'annonce. */
export function AnnounceBar() {
  const { lang, d } = useLocale();
  const [a, setA] = useState<ReturnType<typeof activeAnnouncement> | null>(null);

  useEffect(() => {
    const next = activeAnnouncement(parisNow().iso);
    let closed = false;
    try {
      closed = localStorage.getItem(KEY) === next.id;
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage, lisible seulement après hydratation
    setA(closed ? null : next);
  }, []);

  if (!a) return null;

  return (
    <div className="fade-in relative border-b hairline bg-coal text-bone">
      <p className="mx-auto max-w-7xl px-12 py-2 text-center text-[0.8125rem] leading-snug">
        <span className="text-paper">{a.text[lang]}</span>
        {" · "}
        <a href={href(lang, "home", a.anchor)} className="link-line whitespace-nowrap text-gold-hi">
          {a.link[lang]}
        </a>
      </p>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(KEY, a.id);
          } catch {}
          setA(null);
        }}
        aria-label={d.announce.close}
        className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center text-ash transition-colors hover:text-paper"
      >
        <Close size={16} />
      </button>
    </div>
  );
}
