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
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">{dict.services.title}</h1>
      <p className="mt-2 text-zinc-600">{dict.services.subtitle}</p>
      <div className="mt-8">
        <ServiceCards services={services} locale={locale} dict={dict} />
      </div>
    </div>
  );
}
