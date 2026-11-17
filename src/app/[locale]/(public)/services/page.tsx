import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceCards } from "@/components/public/service-cards";
import { getActiveServices, getBusinessSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const settings = await getBusinessSettings();
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;

  return {
    title: `${dict.meta.servicesTitle} | ${name}`,
    description: dict.meta.servicesDescription,
    alternates: buildAlternates(locale, "/services"),
  };
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
      <div className="public-page-heading"><p className="eyebrow">{dict.experience.servicesEyebrow}</p><h1>{dict.services.title}</h1><p>{dict.services.subtitle}</p></div>
      <div className="mt-2">
        <ServiceCards services={services} locale={locale} dict={dict} />
      </div>
      <p className="pricing-note">{dict.experience.pricingNote}</p>
    </div>
  );
}
