import Link from "next/link";
import { Truck, ArrowUpRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export function SiteFooter({ locale, dict, businessName, phone }: {
  locale: Locale; dict: Dictionary; businessName: string; phone: string;
}) {
  return <footer className="premium-footer"><div className="site-container">
    <div className="footer-grid"><div><div className="brand-lockup"><span className="brand-symbol"><Truck size={25} /></span><p>{businessName}</p></div><p className="footer-description">{dict.experience.footerText}</p></div>
      <div><h2>{dict.footer.quickLinks}</h2><nav><Link href={localizedPath(locale, "/")}>{dict.nav.home}</Link><Link href={localizedPath(locale, "/services")}>{dict.nav.services}</Link><Link href={localizedPath(locale, "/contact")}>{dict.nav.contact}</Link></nav></div>
      <div><h2>{dict.contact.phone}</h2><a href={`tel:${phone}`} className="footer-phone"><span dir="ltr">{phone}</span><ArrowUpRight size={22} /></a><LanguageSwitcher locale={locale} className="border-white/20 text-zinc-200 hover:bg-white/10" /></div>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} {businessName}. {dict.footer.rights}</p><span>{dict.experience.brandLine}</span></div>
  </div></footer>;
}
