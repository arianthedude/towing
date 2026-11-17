import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeContent } from "@/components/public/home-content";
import { getActiveServices, getBusinessSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildAlternates, buildLocalBusinessJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const settings = await getBusinessSettings();
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;
  const description =
    locale === "fa" ? settings.descriptionFa : settings.descriptionEn;

  return {
    title: `${name} | ${dict.meta.homeTitle}`,
    description: description || dict.meta.homeDescription,
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      title: `${name} | ${dict.meta.homeTitle}`,
      description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | ${dict.meta.homeTitle}`,
      description,
    },
  };
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

  const jsonLd = buildLocalBusinessJsonLd(settings, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent
        locale={locale}
        dict={dict}
        settings={settings}
        services={services}
      />
    </>
  );
}
