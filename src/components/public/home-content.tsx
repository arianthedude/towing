"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Service } from "@prisma/client";
import { ArrowUpRight, Phone, MapPin, ShieldCheck, MessageCircle, MoveUpRight } from "lucide-react";
import { ServiceCards } from "@/components/public/service-cards";
import { RequestForm } from "@/components/public/request-form";
import { localizedPath, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

type Settings = {
  heroTitleFa: string; heroTitleEn: string;
  heroDescriptionFa: string; heroDescriptionEn: string;
  descriptionFa: string; descriptionEn: string; phoneNumber: string;
};

export function HomeContent({ locale, dict, settings, services }: {
  locale: Locale; dict: Dictionary; settings: Settings; services: Service[];
}) {
  const [open, setOpen] = useState(false);
  const copy = dict.experience;
  const steps = [
    { icon: MessageCircle, title: copy.step1Title, body: copy.step1Body },
    { icon: MapPin, title: copy.step2Title, body: copy.step2Body },
    { icon: ShieldCheck, title: copy.step3Title, body: copy.step3Body },
  ];
  return <>
    <section className="premium-hero">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" />{copy.eyebrow}</p>
          <h1>{locale === "fa" ? settings.heroTitleFa : settings.heroTitleEn}<span>{copy.heroAccent}</span></h1>
          <p className="hero-description">{locale === "fa" ? settings.heroDescriptionFa : settings.heroDescriptionEn}</p>
          <div className="hero-actions">
            <a href={`tel:${settings.phoneNumber}`} className="premium-button"><Phone size={18} />{dict.hero.primaryCta}</a>
            <button type="button" className="premium-button secondary" onClick={() => setOpen(true)}>{dict.hero.secondaryCta}<ArrowUpRight size={19} className="direction-arrow" /></button>
          </div>
          <p className="hero-note"><ShieldCheck size={16} />{copy.heroNote}</p>
        </div>
        <div className="hero-visual">
          <Image src="/images/towing-editorial.webp" alt={copy.heroAlt} fill sizes="(max-width: 900px) 100vw, 55vw" preload className="object-cover" />
          <div className="image-shade" />
          <div className="image-topline"><span>{copy.imageLabel}</span><MoveUpRight size={22} /></div>
          <div className="image-caption"><span className="caption-line" /><p>{copy.imageCaption}</p></div>
          <div className="hero-image-tag"><ShieldCheck size={22} /><div><strong>{copy.careTitle}</strong><span>{copy.careBody}</span></div></div>
        </div>
      </div>
    </section>
    <div className="promise-strip"><div className="site-container promise-grid">{[
      { icon: Phone, title: copy.promise1, body: copy.promise1Body },
      { icon: MapPin, title: copy.promise2, body: copy.promise2Body },
      { icon: ShieldCheck, title: copy.promise3, body: copy.promise3Body },
    ].map(({ icon: Icon, title, body }) => <div className="promise" key={title}><Icon size={23} strokeWidth={1.5} /><div><h2>{title}</h2><p>{body}</p></div></div>)}</div></div>
    <section id="services" className="site-container premium-section">
      <div className="section-heading"><div><p className="eyebrow">{copy.servicesEyebrow}</p><h2>{dict.services.title}</h2><p className="section-intro">{dict.services.subtitle}</p></div><Link className="text-link" href={localizedPath(locale, "/services")}>{copy.allServices}<ArrowUpRight size={18} className="direction-arrow" /></Link></div>
      <ServiceCards services={services} locale={locale} dict={dict} />
      <p className="pricing-note">{copy.pricingNote}</p>
    </section>
    <section className="journey-section"><div className="site-container premium-section">
      <div className="section-heading"><div><p className="eyebrow">{copy.processEyebrow}</p><h2>{copy.processTitle}</h2></div><p className="section-intro max-w-sm">{copy.processBody}</p></div>
      <div className="steps-grid">{steps.map(({ icon: Icon, title, body }, i) => <article className="journey-step" key={title}><div className="step-top"><Icon size={25} strokeWidth={1.5} /><span>{String(i + 1).padStart(2, "0")}</span></div><h3>{title}</h3><p>{body}</p></article>)}</div>
    </div></section>
    <section className="site-container premium-section about-grid">
      <div className="about-visual"><Image src="/images/roadside-detail.webp" alt={copy.detailAlt} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" /><span>{copy.detailCaption}</span></div>
      <div className="about-copy"><p className="eyebrow">{dict.about.title}</p><h2>{copy.aboutTitle}</h2><p>{copy.aboutBody}</p><p className="business-description">{locale === "fa" ? settings.descriptionFa : settings.descriptionEn}</p><Link className="text-link" href={localizedPath(locale, "/contact")}>{copy.talkToUs}<ArrowUpRight size={18} className="direction-arrow" /></Link></div>
    </section>
    <section className="site-container contact-banner"><div><p className="eyebrow">{copy.contactEyebrow}</p><h2>{copy.contactTitle}</h2><p>{copy.contactBody}</p></div><a href={`tel:${settings.phoneNumber}`} className="premium-button"><Phone size={20} /><span dir="ltr">{settings.phoneNumber}</span><ArrowUpRight size={20} /></a></section>
    {open && <RequestForm locale={locale} dict={dict} services={services} phone={settings.phoneNumber} open={open} onOpenChange={setOpen} />}
  </>;
}
