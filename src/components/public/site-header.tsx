"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

export function SiteHeader({
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
  const [open, setOpen] = useState(false);
  const links = [
    { href: localizedPath(locale, "/"), label: dict.nav.home },
    { href: localizedPath(locale, "/services"), label: dict.nav.services },
    { href: localizedPath(locale, "/contact"), label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b-4 border-amber-400 bg-zinc-900 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href={localizedPath(locale, "/")} className="min-w-0">
          <p className="truncate text-base font-bold sm:text-lg">{businessName}</p>
          <p className="text-xs text-zinc-400">
            {locale === "fa"
              ? "امداد خودرو · یدک‌کش · خودروبر"
              : "Roadside · Towing · Car carrier"}
          </p>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-zinc-200 hover:text-amber-300"
            >
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher
            locale={locale}
            className="border-zinc-600 text-zinc-100 hover:bg-zinc-800"
          />
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold hover:bg-red-600"
          >
            <Phone className="h-4 w-4" />
            {dict.nav.call}
          </a>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-zinc-800 md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2 py-2 text-sm hover:bg-zinc-800"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center justify-between gap-3 pt-2">
            <LanguageSwitcher
              locale={locale}
              className="border-zinc-600 text-zinc-100 hover:bg-zinc-800"
            />
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-2 text-sm font-semibold"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
