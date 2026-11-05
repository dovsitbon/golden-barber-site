import Link from "next/link";
import site from "@/data/site.json";
import { type Dict, type Locale } from "@/lib/i18n";
import { hourLabel } from "@/lib/shop";
import { href } from "@/lib/routes";
import { Logo, Ramp } from "@/components/Logo";
import { ArrowUpRight } from "@/components/icons";
import horaires from "@/data/horaires.json";

const ext = { target: "_blank", rel: "noopener" } as const;

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const open = (horaires.week as unknown as Record<string, [string, string][] | null>)["2"]?.[0];
  const hours = open ? `${d.days[2]} – ${d.days[6]}, ${hourLabel(open[0], lang)} – ${hourLabel(open[1], lang)}` : "";
  return (
    <footer className="border-t hairline bg-ink pb-28 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 text-[0.875rem] text-ash">{d.footer.tagline}</p>
          <Ramp className="mt-6" />
        </div>
        <address className="grid content-start gap-1 text-[0.9375rem] not-italic text-bone">
          <a href={site.maps} {...ext} className="hover:text-paper">
            {site.address.street}, {site.address.postalCode} {site.address.city}
          </a>
          <span className="first-letter:uppercase">{hours}</span>
          <a href={`tel:${site.phoneIntl}`} className="num hover:text-paper">
            {site.phone}
          </a>
        </address>
        <ul className="grid content-start gap-1 text-[0.9375rem] text-bone">
          <li>
            <a href={site.planity} {...ext} className="inline-flex items-center gap-1 text-gold-hi hover:text-gold">
              {d.footer.book} <ArrowUpRight size={14} />
            </a>
          </li>
          <li>
            <a href={`https://wa.me/${site.whatsapp}`} {...ext} className="hover:text-paper">
              WhatsApp
            </a>
          </li>
          <li>
            <a href={site.instagram} {...ext} className="hover:text-paper">
              Instagram {site.instagramHandle}
            </a>
          </li>
          <li>
            <Link href={href(lang, "prices")} className="hover:text-paper">
              {d.services.all}
            </Link>
          </li>
          <li>
            <Link href={href(lang, "legal")} className="hover:text-paper">
              {d.footer.legal}
            </Link>
          </li>
        </ul>
      </div>
      <p className="mx-auto max-w-7xl border-t hairline px-4 py-5 text-[0.8125rem] text-stone sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Golden Barber · {d.footer.rights}
      </p>
    </footer>
  );
}
