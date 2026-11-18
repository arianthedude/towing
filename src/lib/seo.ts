import type { Metadata } from "next";
import type { BusinessSettings, Service } from "@prisma/client";
import type { Locale } from "@/lib/i18n/config";
import { getSiteUrl, localizedPath } from "@/lib/utils-seo";

export { getSiteUrl, localizedPath };

export function buildPageMetadata({ locale, path, title, description, businessName, imageAlt }: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  businessName: string;
  imageAlt: string;
}): Metadata {
  const site = getSiteUrl();
  const pageTitle = `${title} | ${businessName}`;
  const image = {
    url: `${site}/images/towing-editorial.webp`,
    width: 1536,
    height: 1024,
    alt: imageAlt,
  };
  return {
    metadataBase: new URL(site),
    title: pageTitle,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: "website",
      title: pageTitle,
      description,
      siteName: businessName,
      url: `${site}${localizedPath(locale, path)}`,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      alternateLocale: locale === "fa" ? "en_US" : "fa_IR",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

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

export function buildLocalBusinessJsonLd(settings: BusinessSettings, locale: Locale) {
  const site = getSiteUrl();
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;
  const description =
    locale === "fa" ? settings.descriptionFa : settings.descriptionEn;

  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `${site}/#business`,
    name,
    description,
    telephone: settings.phoneNumber,
    url: `${site}${localizedPath(locale, "/")}`,
    image: `${site}/images/towing-editorial.webp`,
    areaServed: {
      "@type": "City",
      name: "Tehran",
      containedInPlace: { "@type": "Country", name: "Iran" },
    },
    ...(settings.address
      ? { address: { "@type": "PostalAddress", streetAddress: settings.address, addressLocality: "Tehran", addressCountry: "IR" } }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(locale: Locale, path: string, homeLabel: string, pageLabel: string) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: `${site}${localizedPath(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: pageLabel, item: `${site}${localizedPath(locale, path)}` },
    ],
  };
}

export function buildServicesJsonLd(services: Service[], locale: Locale, name: string) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name,
    url: `${site}${localizedPath(locale, "/services")}`,
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: locale === "fa" ? service.titleFa : service.titleEn,
        description: locale === "fa" ? service.descriptionFa : service.descriptionEn,
        provider: { "@id": `${site}/#business` },
      },
    })),
  };
}

export function serializeJsonLd(data: unknown): string {
  // Business copy is editable in admin; prevent it from ending the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
