import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getSiteUrl, localizedPath } from "@/lib/utils-seo";

export { getSiteUrl, localizedPath };

export function buildAlternates(locale: Locale, path: string): Metadata["alternates"] {
  const site = getSiteUrl();
  const faPath = localizedPath("fa", path);
  const enPath = localizedPath("en", path);
  return {
    canonical: `${site}${localizedPath(locale, path)}`,
    languages: {
      fa: `${site}${faPath}`,
      en: `${site}${enPath}`,
      "x-default": `${site}${faPath}`,
    },
  };
}

export function buildLocalBusinessJsonLd(settings: {
  businessNameFa: string;
  businessNameEn: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string | null;
  descriptionFa: string;
  descriptionEn: string;
  address?: string | null;
  websiteUrl?: string | null;
}, locale: Locale) {
  const site = getSiteUrl();
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;
  const description =
    locale === "fa" ? settings.descriptionFa : settings.descriptionEn;

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "AutomotiveBusiness"],
    name,
    description,
    telephone: settings.phoneNumber,
    url: settings.websiteUrl || site,
    ...(settings.address
      ? { address: { "@type": "PostalAddress", streetAddress: settings.address } }
      : {}),
    areaServed: "IR",
    availableLanguage: ["fa", "en"],
  };
}
