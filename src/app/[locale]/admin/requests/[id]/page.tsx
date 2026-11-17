import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-guard";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { formatDateTime } from "@/lib/format";
import { pickLocalized } from "@/lib/data-client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RequestDetailForm } from "@/components/admin/request-detail-form";
import { StaticLocationMap } from "@/components/admin/static-map";

export default async function AdminRequestDetailPage({
  params,
}: PageProps<"/[locale]/admin/requests/[id]">) {
  const { locale: localeParam, id } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  await requireAdminPage(locale);

  const [dict, request] = await Promise.all([
    getDictionary(locale),
    prisma.request.findUnique({
      where: { id },
      include: { service: true },
    }),
  ]);

  if (!request) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h1 className="text-xl font-bold">{request.customerName}</h1>
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="text-zinc-500">{dict.admin.table.phone}: </span>
            <a
              href={`tel:${request.phoneNumber}`}
              className="font-semibold text-amber-800"
            >
              {request.phoneNumber}
            </a>
          </p>
          <p>
            <span className="text-zinc-500">{dict.admin.table.service}: </span>
            {pickLocalized(request.service, locale, "titleFa", "titleEn")}
          </p>
          <p>
            <span className="text-zinc-500">{dict.admin.table.vehicle}: </span>
            {dict.vehicles[
              request.vehicleType as keyof typeof dict.vehicles
            ] || request.vehicleType}
          </p>
          <p>
            <span className="text-zinc-500">{dict.admin.table.address}: </span>
            {request.address}
          </p>
          {request.note && (
            <p>
              <span className="text-zinc-500">{dict.admin.table.note}: </span>
              {request.note}
            </p>
          )}
          <p>
            <span className="text-zinc-500">{dict.admin.table.date}: </span>
            {formatDateTime(request.createdAt, locale)}
          </p>
          <Badge status={request.status}>{dict.status[request.status]}</Badge>
        </div>
      </Card>

      <Card>
        <RequestDetailForm
          id={request.id}
          status={request.status}
          adminNote={request.adminNote}
          dict={dict}
          locale={locale}
        />
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-3 font-bold">{dict.admin.table.location}</h2>
        {request.latitude != null && request.longitude != null ? (
          <StaticLocationMap lat={request.latitude} lng={request.longitude} />
        ) : (
          <p className="text-sm text-zinc-500">{dict.admin.table.noLocation}</p>
        )}
      </Card>
    </div>
  );
}
