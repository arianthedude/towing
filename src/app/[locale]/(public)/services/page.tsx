import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceCards } from "@/components/public/service-cards";
import { getActiveServices, getBusinessSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata, buildBreadcrumbJsonLd, buildServicesJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const [dict, settings] = await Promise.all([getDictionary(locale), getBusinessSettings()]);
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;

  return buildPageMetadata({
    locale,
    path: "/services",
    title: dict.meta.servicesTitle,
    businessName: name,
    description: dict.meta.servicesDescription,
    imageAlt: dict.experience.heroAlt,
  });
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const [dict, services] = await Promise.all([
    getDictionary(locale),
    getActiveServices(),
  ]);

  return (
    <div className="site-container pb-20">
      <JsonLd data={buildBreadcrumbJsonLd(locale, "/services", dict.nav.home, dict.nav.services)} />
      {services.length > 0 && <JsonLd data={buildServicesJsonLd(services, locale, dict.meta.servicesTitle)} />}
      <div className="public-page-heading"><p className="eyebrow">{dict.services.title}</p><h1>{dict.meta.servicesTitle}</h1><p>{dict.services.subtitle}</p></div>
      <div className="mt-2">
        <ServiceCards services={services} locale={locale} dict={dict} />
      </div>
      <p className="pricing-note">{dict.experience.pricingNote}</p>
    </div>
  );
}
