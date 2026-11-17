"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { localizedPath, stripLocale, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

export function AdminNav({
  locale,
  dict,
  username,
}: {
  locale: Locale;
  dict: Dictionary;
  username: string;
}) {
  const pathname = usePathname();
  const { pathname: current } = stripLocale(pathname);

  const links = [
    { href: "/admin", label: dict.admin.dashboard },
    { href: "/admin/requests", label: dict.admin.requests },
    { href: "/admin/services", label: dict.admin.services },
    { href: "/admin/settings", label: dict.admin.settings },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-bold text-amber-400">{dict.meta.adminTitle}</p>
          <nav className="flex flex-wrap gap-1">
            {links.map((l) => {
              const href = localizedPath(locale, l.href);
              const active =
                current === l.href ||
                (l.href !== "/admin" && current.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium",
                    active
                      ? "bg-amber-400 text-zinc-900"
                      : "text-zinc-300 hover:bg-zinc-800",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">{username}</span>
          <LanguageSwitcher
            locale={locale}
            className="border-zinc-700 text-zinc-100 hover:bg-zinc-800"
          />
          <form action={logoutAction.bind(null, locale)}>
            <button
              type="submit"
              className="rounded-md bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
            >
              {dict.admin.logout}
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
