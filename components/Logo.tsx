import paths from "@/components/logo-paths.json";

/**
 * Monogramme « GB » de Golden Barber, vectorisé depuis sa photo de profil Instagram (scripts/logo.mjs).
 * Prend la couleur du texte. Pour le remplacer par le fichier d'origine : components/logo-paths.json et public/logo.svg.
 */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox={paths.mark.viewBox} className={className} aria-hidden="true" fill="currentColor">
      <path fillRule="evenodd" d={paths.mark.d} />
    </svg>
  );
}

/** Logo horizontal : monogramme + « GOLDEN BARBER » en capitales larges. */
export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 text-gold ${className}`} translate="no">
      <Monogram className="size-9 shrink-0" />
      <span className={`wordmark text-[0.8125rem] leading-none ${compact ? "max-sm:sr-only" : ""}`}>Golden Barber</span>
    </span>
  );
}

/** Rampe de gris (signature du site) : le dégradé d'une coupe, du clair au foncé. */
export function Ramp({ className = "" }: { className?: string }) {
  return (
    <span className={`ramp ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

/** Étiquette de section : rampe + numéro + nom. */
export function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[0.8125rem] text-ash light:text-stone">
      <Ramp />
      <span className="num">{n}</span>
      <span>{children}</span>
    </p>
  );
}
