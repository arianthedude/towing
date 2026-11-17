import { format as formatJalali } from "date-fns-jalali";
import { format as formatGregorian } from "date-fns";
import type { Locale } from "@/lib/i18n/config";
import type { PricingType } from "@prisma/client";

const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => persianDigits[Number(d)]!);
}

export function formatNumber(value: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(
    locale === "fa" ? "fa-IR" : "en-US",
  ).format(value);
  return locale === "fa" ? toPersianDigits(formatted) : formatted;
}

export function formatPrice(amount: number | null | undefined, locale: Locale): string {
  if (amount == null) return "—";
  const formatted = formatNumber(amount, locale);
  return locale === "fa" ? `${formatted} تومان` : `${formatted} Toman`;
}

export function formatDateTime(date: Date, locale: Locale): string {
  if (locale === "fa") {
    return toPersianDigits(formatJalali(date, "yyyy/MM/dd HH:mm"));
  }
  return formatGregorian(date, "yyyy-MM-dd HH:mm");
}

export function formatPricingLabel(
  pricingType: PricingType,
  basePrice: number | null,
  pricePerKilometer: number | null,
  locale: Locale,
  labels: {
    fixed: string;
    perKm: string;
    negotiable: string;
    base: string;
    perKilometer: string;
  },
): string {
  if (pricingType === "NEGOTIABLE") return labels.negotiable;
  if (pricingType === "FIXED") {
    return `${formatPrice(basePrice, locale)} · ${labels.fixed}`;
  }
  return `${labels.base} ${formatPrice(basePrice, locale)} + ${formatPrice(pricePerKilometer, locale)} ${labels.perKilometer}`;
}
