import type { Service } from "@prisma/client";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { formatPricingLabel } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { pickLocalized } from "@/lib/data-client";

export function ServiceCards({
  services,
  locale,
  dict,
}: {
  services: Service[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (services.length === 0) {
    return <p className="text-zinc-600">{dict.services.empty}</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => {
        const title = pickLocalized(service, locale, "titleFa", "titleEn");
        const description = pickLocalized(
          service,
          locale,
          "descriptionFa",
          "descriptionEn",
        );
        const pricing = formatPricingLabel(
          service.pricingType,
          service.basePrice,
          service.pricePerKilometer,
          locale,
          dict.services.pricing,
        );

        return (
          <Card
            key={service.id}
            className="border-s-4 border-s-amber-400 transition hover:shadow-md"
          >
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
            <p className="mt-3 text-sm font-semibold text-zinc-800">{pricing}</p>
          </Card>
        );
      })}
    </div>
  );
}
