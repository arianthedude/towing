import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getBusinessSettings } from "@/lib/data";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { StickyCallButton } from "@/components/public/sticky-call";
import { notFound } from "next/navigation";

/** Business settings & services come from SQLite and change in admin. */
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = await getDictionary(locale);
  const settings = await getBusinessSettings();
  const businessName =
    locale === "fa" ? settings.businessNameFa : settings.businessNameEn;

  return (
    <div className="public-shell flex min-h-full flex-1 flex-col">
      <SiteHeader
        locale={locale}
        dict={dict}
        businessName={businessName}
        phone={settings.phoneNumber}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        locale={locale}
        dict={dict}
        businessName={businessName}
        phone={settings.phoneNumber}
      />
      <StickyCallButton phone={settings.phoneNumber} label={dict.nav.call} />
    </div>
  );
}
