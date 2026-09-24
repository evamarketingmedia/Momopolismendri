import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { locales } from "@/lib/dictionaries";

const paths = ["", "chi-siamo", "parco", "bar", "galleria", "eventi", "pacchetti-feste", "note-legali"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return paths.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${siteConfig.domain}/${locale}${slug ? `/${slug}` : ""}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: slug === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [l, `${siteConfig.domain}/${l}${slug ? `/${slug}` : ""}`]),
          ["x-default", `${siteConfig.domain}/it${slug ? `/${slug}` : ""}`],
        ]),
      },
    }))
  );
}
