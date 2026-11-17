"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X, Truck, ArrowUpRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export function SiteHeader({ locale, dict, businessName, phone }: {
  locale: Locale; dict: Dictionary; businessName: string; phone: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [
    { href: localizedPath(locale, "/"), label: dict.nav.home },
    { href: localizedPath(locale, "/services"), label: dict.nav.services },
    { href: localizedPath(locale, "/contact"), label: dict.nav.contact },
  ];
  return <header className="premium-header">
    <div className="site-container header-inner">
      <Link href={localizedPath(locale, "/")} className="brand-lockup"><span className="brand-symbol"><Truck size={25} strokeWidth={1.6} /></span><div><p>{businessName}</p><span>{dict.experience.brandLine}</span></div></Link>
      <nav className="desktop-nav" aria-label={dict.nav.home}>{links.map(l => <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>{l.label}</Link>)}</nav>
      <div className="desktop-header-actions"><LanguageSwitcher locale={locale} /><a href={`tel:${phone}`} className="premium-button header-call"><Phone size={16} />{dict.nav.call}<ArrowUpRight size={16} /></a></div>
      <button type="button" className="menu-toggle" aria-label={open ? dict.experience.closeMenu : dict.experience.menu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-navigation" aria-label={dict.experience.menu}>{links.map(l => <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} onClick={() => setOpen(false)}>{l.label}</Link>)}<div><LanguageSwitcher locale={locale} /><a href={`tel:${phone}`} dir="ltr">{phone}</a></div></nav>}
  </header>;
}
