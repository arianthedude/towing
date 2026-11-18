import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeContent } from "@/components/public/home-content";
import { getActiveServices, getBusinessSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const [dict, settings] = await Promise.all([getDictionary(locale), getBusinessSettings()]);
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;

  return buildPageMetadata({
    locale,
    path: "/",
    title: dict.meta.homeTitle,
    businessName: name,
    description: dict.meta.homeDescription,
    imageAlt: dict.experience.heroAlt,
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const [dict, settings, services] = await Promise.all([
    getDictionary(locale),
    getBusinessSettings(),
    getActiveServices(),
  ]);

  return (
    <>
      <HomeContent
        locale={locale}
        dict={dict}
        settings={settings}
        services={services}
      />
    </>
  );
}
