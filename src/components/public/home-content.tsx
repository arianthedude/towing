"use client";

import { useState } from "react";
import type { Service } from "@prisma/client";
import { Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCards } from "@/components/public/service-cards";
import { RequestForm } from "@/components/public/request-form";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

type Settings = {
  heroTitleFa: string;
  heroTitleEn: string;
  heroDescriptionFa: string;
  heroDescriptionEn: string;
  descriptionFa: string;
  descriptionEn: string;
  phoneNumber: string;
};

export function HomeContent({
  locale,
  dict,
  settings,
  services,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: Settings;
  services: Service[];
}) {
  const [open, setOpen] = useState(false);
  const heroTitle =
    locale === "fa" ? settings.heroTitleFa : settings.heroTitleEn;
  const heroDescription =
    locale === "fa" ? settings.heroDescriptionFa : settings.heroDescriptionEn;
  const about =
    locale === "fa" ? settings.descriptionFa : settings.descriptionEn;

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero.svg"
            alt={locale === "fa" ? "امداد خودرو در جاده" : "Roadside assistance"}
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/70 to-zinc-900/40" />
        </div>
        <div className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-end px-4 pb-12 pt-24">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-200 sm:text-lg">
            {heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`tel:${settings.phoneNumber}`}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-red-700 px-6 text-lg font-bold text-white hover:bg-red-600"
            >
              <Phone className="h-5 w-5" />
              {dict.hero.primaryCta}
            </a>
            <Button
              type="button"
              size="xl"
              className="gap-2"
              onClick={() => setOpen(true)}
            >
              <FileText className="h-5 w-5" />
              {dict.hero.secondaryCta}
            </Button>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold text-zinc-900">{dict.services.title}</h2>
        <p className="mt-2 text-zinc-600">{dict.services.subtitle}</p>
        <div className="mt-6">
          <ServiceCards services={services} locale={locale} dict={dict} />
        </div>
      </section>

      <section className="bg-zinc-100">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-bold text-zinc-900">{dict.about.title}</h2>
          <p className="mt-2 text-zinc-600">{dict.about.subtitle}</p>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-800">
            {about}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-bold text-zinc-900">{dict.contact.title}</h2>
        <p className="mt-2 text-zinc-600">{dict.contact.subtitle}</p>
        <a
          href={`tel:${settings.phoneNumber}`}
          className="mt-6 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-red-700 px-6 text-lg font-bold text-white hover:bg-red-600"
        >
          <Phone className="h-5 w-5" />
          {dict.contact.callNow}: {settings.phoneNumber}
        </a>
      </section>

      <RequestForm
        locale={locale}
        dict={dict}
        services={services}
        phone={settings.phoneNumber}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
