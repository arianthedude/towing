import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone } from "lucide-react";
import { getBusinessSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const [dict, settings] = await Promise.all([getDictionary(locale), getBusinessSettings()]);
  const name = locale === "fa" ? settings.businessNameFa : settings.businessNameEn;

  return buildPageMetadata({
    locale,
    path: "/contact",
    title: dict.meta.contactTitle,
    businessName: name,
    description: dict.meta.contactDescription,
    imageAlt: dict.experience.heroAlt,
  });
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
    <div className="site-container">
      <JsonLd data={buildBreadcrumbJsonLd(locale, "/contact", dict.nav.home, dict.nav.contact)} />
      <div className="public-page-heading"><p className="eyebrow">{dict.contact.title}</p><h1>{dict.meta.contactTitle}</h1><p>{dict.contact.subtitle}</p></div>

      <div className="contact-page-grid"><div className="contact-page-card">
        <div>
          <p className="text-sm font-medium text-zinc-500">{dict.contact.phone}</p>
          <a
            href={`tel:${settings.phoneNumber}`}
            className="mt-1 inline-flex items-center gap-2 text-xl font-bold text-zinc-900"
          >
            <Phone className="h-5 w-5 text-amber-700" />
            <span dir="ltr">{settings.phoneNumber}</span>
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
        <a href={`tel:${settings.phoneNumber}`} className="premium-button"><Phone size={18} />{dict.contact.callNow}</a>
        <p className="mt-5 text-sm leading-7 text-zinc-500">{dict.experience.heroNote}</p>
      </div><div className="about-visual h-full min-h-80"><Image src="/images/towing-editorial.webp" alt={dict.experience.heroAlt} fill sizes="(max-width: 600px) 100vw, 50vw" className="object-cover" /><span>{dict.experience.imageLabel}</span></div></div>
    </div>
  );
}
