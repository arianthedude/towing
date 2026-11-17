import Link from "next/link";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export function SiteFooter({
  locale,
  dict,
  businessName,
  phone,
}: {
  locale: Locale;
  dict: Dictionary;
  businessName: string;
  phone: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-100">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-bold text-zinc-900">{businessName}</p>
          <a href={`tel:${phone}`} className="mt-2 block text-sm text-zinc-700">
            {phone}
          </a>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-800">
            {dict.footer.quickLinks}
          </p>
          <div className="flex flex-col gap-1 text-sm">
            <Link href={localizedPath(locale, "/")} className="hover:text-amber-700">
              {dict.nav.home}
            </Link>
            <Link
              href={localizedPath(locale, "/services")}
              className="hover:text-amber-700"
            >
              {dict.nav.services}
            </Link>
            <Link
              href={localizedPath(locale, "/contact")}
              className="hover:text-amber-700"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <LanguageSwitcher locale={locale} />
          <p className="text-xs text-zinc-500">
            © {year} {businessName}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
