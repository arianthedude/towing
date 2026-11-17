import type { Service } from "@prisma/client";
import { Truck, Car, BatteryCharging, CircleDot, Fuel, Wrench } from "lucide-react";
import { formatPricingLabel } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pickLocalized } from "@/lib/data-client";

const serviceIcons = { towing: Truck, "car-carrier": Car, "battery-jump": BatteryCharging, "tire-repair": CircleDot, "fuel-delivery": Fuel, "mobile-mechanic": Wrench };

export function ServiceCards({ services, locale, dict }: { services: Service[]; locale: Locale; dict: Dictionary }) {
  if (!services.length) return <p className="text-zinc-600">{dict.services.empty}</p>;
  return <div className="services-grid">{services.map((service, index) => {
    const Icon = serviceIcons[service.slug as keyof typeof serviceIcons] ?? Wrench;
    return <article key={service.id} className="premium-service-card">
      <div className="service-card-top"><span className="service-icon"><Icon size={26} strokeWidth={1.5} /></span><span className="service-number">{String(index + 1).padStart(2, "0")}</span></div>
      <h3>{pickLocalized(service, locale, "titleFa", "titleEn")}</h3>
      <p>{pickLocalized(service, locale, "descriptionFa", "descriptionEn")}</p>
      <div className="service-price">{formatPricingLabel(service.pricingType, service.basePrice, service.pricePerKilometer, locale, dict.services.pricing)}</div>
    </article>;
  })}</div>;
}
