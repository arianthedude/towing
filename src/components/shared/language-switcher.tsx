"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocale, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

function switchHref(target: Locale, pathWithoutLocale: string): string {
  const path =
    pathWithoutLocale === "/" ? "" : pathWithoutLocale.replace(/\/$/, "");
  // Use explicit /fa so proxy can set the locale cookie, then redirect to unprefixed URL.
  if (target === "fa") return `/fa${path || ""}` || "/fa";
  return `/en${path || ""}` || "/en";
}

export function LanguageSwitcher({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const pathname = usePathname();
  const { pathname: pathWithoutLocale } = stripLocale(pathname);
  const other: Locale = locale === "fa" ? "en" : "fa";
  const href = switchHref(other, pathWithoutLocale);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-800 hover:bg-zinc-100",
        className,
      )}
      hrefLang={other}
      lang={other}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${other};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
      }}
    >
      {other === "fa" ? "فارسی" : "EN"}
    </Link>
  );
}
