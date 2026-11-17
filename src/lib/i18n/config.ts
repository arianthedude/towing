export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fa";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "fa" ? "rtl" : "ltr";
}

/** Build a localized path. Persian (default) has no prefix. */
export function localizedPath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return normalized === "/" ? "/" : normalized;
  }
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

/** Strip locale prefix from pathname and return { locale, pathname }. */
export function stripLocale(pathname: string): {
  locale: Locale;
  pathname: string;
} {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (isLocale(maybeLocale)) {
    const rest = "/" + segments.slice(2).join("/");
    return {
      locale: maybeLocale,
      pathname: rest === "/" ? "/" : rest.replace(/\/$/, "") || "/",
    };
  }
  return { locale: defaultLocale, pathname: pathname || "/" };
}
