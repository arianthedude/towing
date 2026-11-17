import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-guard";
import { getAllServices } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/format";
import { ServiceForm } from "@/components/admin/service-form";
import { Badge } from "@/components/ui/badge";

export default async function AdminServicesPage({
  params,
}: PageProps<"/[locale]/admin/services">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  await requireAdminPage(locale);

  const [dict, services] = await Promise.all([
    getDictionary(locale),
    getAllServices(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{dict.admin.servicesAdmin.title}</h1>

      <ServiceForm dict={dict} />

      <div className="space-y-6">
        {services.map((service) => (
          <div key={service.id} className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold">
                {locale === "fa" ? service.titleFa : service.titleEn}
              </h2>
              <Badge status={service.isActive ? "COMPLETED" : "CANCELLED"}>
                {service.isActive
                  ? dict.admin.servicesAdmin.active
                  : "off"}
              </Badge>
              <span className="text-xs text-zinc-500">{service.pricingType}</span>
              {service.basePrice != null && (
                <span className="text-xs text-zinc-500">
                  {formatPrice(service.basePrice, locale)}
                </span>
              )}
            </div>
            <ServiceForm service={service} dict={dict} />
          </div>
        ))}
      </div>
    </div>
  );
}
