import type { MetadataRoute } from "next";
import { getSiteUrl, localizedPath } from "@/lib/utils-seo";
import type { Locale } from "@/lib/i18n/config";

const paths = ["/", "/services", "/contact"];

// Resolve the deployment origin at runtime, including in standalone Docker builds.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const locales: Locale[] = ["fa", "en"];
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of locales) {
      entries.push({
        url: `${site}${localizedPath(locale, path)}`,
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.7,
        alternates: {
          languages: {
            fa: `${site}${localizedPath("fa", path)}`,
            en: `${site}${localizedPath("en", path)}`,
            "x-default": `${site}${localizedPath("fa", path)}`,
          },
        },
      });
    }
  }

  return entries;
}
