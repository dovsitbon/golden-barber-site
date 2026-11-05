"use client";

import { useEffect, useState } from "react";

export const INTRO_KEY = "gb-intro";

/**
 * Ouverture (1,5 s max, une fois par session) : fond noir, une lame dorée trace une ligne nette d'un bord à l'autre,
 * un dégradé de gris se dessine dessous, du clair au foncé, « GOLDEN BARBER » apparaît en or, puis fondu sur le hero.
 * Tout est en CSS (globals.css) pour démarrer avant l'hydratation ; prefers-reduced-motion la saute (script du layout).
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {}
    const t = setTimeout(() => setGone(true), 1600);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro" aria-hidden="true">
      <span className="intro-blade" />
      <span className="intro-fade">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="intro-name wordmark text-base sm:text-lg" translate="no">
        Golden Barber
      </span>
      <button
        type="button"
        tabIndex={-1}
        onClick={() => {
          document.documentElement.classList.add("intro-seen");
          setGone(true);
        }}
        className="absolute right-4 bottom-4 min-h-11 px-4 text-sm text-ash transition-colors hover:text-paper"
      >
        {skipLabel}
      </button>
    </div>
  );
}
