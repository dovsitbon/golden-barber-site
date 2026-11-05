import type { MetadataRoute } from "next";
import site from "@/data/site.json";
import { locales } from "@/lib/locales";
import { href, type PageId } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const ids: (PageId | "home")[] = ["home", "prices"];
  return ids.flatMap((id) =>
    locales.map((lang) => ({
      url: `${site.url}${href(lang, id)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: id === "home" ? 1 : 0.9,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}${href(l, id)}`])) },
    })),
  );
}
