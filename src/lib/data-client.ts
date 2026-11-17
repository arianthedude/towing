import type { Locale } from "@/lib/i18n/config";

/** Client-safe localized field picker (no server-only import). */
export function pickLocalized<T extends Record<string, unknown>>(
  item: T,
  locale: Locale,
  faKey: keyof T,
  enKey: keyof T,
): string {
  const value = locale === "fa" ? item[faKey] : item[enKey];
  return String(value ?? "");
}
