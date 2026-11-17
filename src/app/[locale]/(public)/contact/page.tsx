import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { getBusinessSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const settings = await getBusinessSettings();
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;

  return {
    title: `${dict.meta.contactTitle} | ${name}`,
    description: dict.meta.contactDescription,
    alternates: buildAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const [dict, settings] = await Promise.all([
    getDictionary(locale),
    getBusinessSettings(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">{dict.contact.title}</h1>
      <p className="mt-2 text-zinc-600">{dict.contact.subtitle}</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium text-zinc-500">{dict.contact.phone}</p>
          <a
            href={`tel:${settings.phoneNumber}`}
            className="mt-1 inline-flex items-center gap-2 text-xl font-bold text-zinc-900"
          >
            <Phone className="h-5 w-5 text-red-700" />
            {settings.phoneNumber}
          </a>
        </div>
        {settings.secondaryPhoneNumber && (
          <div>
            <p className="text-sm font-medium text-zinc-500">
              {dict.contact.secondaryPhone}
            </p>
            <a
              href={`tel:${settings.secondaryPhoneNumber}`}
              className="mt-1 text-lg font-semibold text-zinc-900"
            >
              {settings.secondaryPhoneNumber}
            </a>
          </div>
        )}
        {settings.address && (
          <div>
            <p className="text-sm font-medium text-zinc-500">
              {dict.contact.address}
            </p>
            <p className="mt-1 text-zinc-800">{settings.address}</p>
          </div>
        )}
      </div>
    </div>
  );
}
