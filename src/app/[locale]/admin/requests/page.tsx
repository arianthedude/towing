import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-guard";
import { searchRequests } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { formatDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { RequestStatus } from "@prisma/client";
import { pickLocalized } from "@/lib/data-client";

export default async function AdminRequestsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/admin/requests">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  await requireAdminPage(locale);

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const status = (typeof sp.status === "string" ? sp.status : "ALL") as
    | RequestStatus
    | "ALL";
  const sort = sp.sort === "asc" ? "asc" : "desc";

  const [dict, requests] = await Promise.all([
    getDictionary(locale),
    searchRequests({ q, status, sort }),
  ]);

  const statuses: Array<RequestStatus | "ALL"> = [
    "ALL",
    "NEW",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{dict.admin.requests}</h1>

      <form className="mb-6 flex flex-col gap-3 sm:flex-row" method="get">
        <Input
          name="q"
          defaultValue={q}
          placeholder={dict.admin.table.search}
          className="sm:max-w-xs"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-lg border-2 border-zinc-300 bg-white px-3 text-sm"
          aria-label={dict.admin.table.filterStatus}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? dict.admin.table.all : dict.status[s]}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="h-11 rounded-lg border-2 border-zinc-300 bg-white px-3 text-sm"
        >
          <option value="desc">↓</option>
          <option value="asc">↑</option>
        </select>
        <button
          type="submit"
          className="h-11 rounded-lg bg-amber-400 px-4 text-sm font-semibold text-zinc-900"
        >
          OK
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-start">
            <tr>
              <th className="px-4 py-3 font-semibold">{dict.admin.table.customer}</th>
              <th className="px-4 py-3 font-semibold">{dict.admin.table.phone}</th>
              <th className="px-4 py-3 font-semibold">{dict.admin.table.service}</th>
              <th className="px-4 py-3 font-semibold">{dict.admin.table.vehicle}</th>
              <th className="px-4 py-3 font-semibold">{dict.admin.table.date}</th>
              <th className="px-4 py-3 font-semibold">{dict.admin.table.status}</th>
              <th className="px-4 py-3 font-semibold">{dict.admin.table.actions}</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  {dict.admin.table.empty}
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-t border-zinc-100">
                  <td className="px-4 py-3 font-medium">{r.customerName}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${r.phoneNumber}`}
                      className="text-amber-800 hover:underline"
                    >
                      {r.phoneNumber}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {pickLocalized(r.service, locale, "titleFa", "titleEn")}
                  </td>
                  <td className="px-4 py-3">
                    {dict.vehicles[r.vehicleType as keyof typeof dict.vehicles] ||
                      r.vehicleType}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(r.createdAt, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={r.status}>{dict.status[r.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={localizedPath(locale, `/admin/requests/${r.id}`)}
                      className="font-semibold text-zinc-900 hover:underline"
                    >
                      {dict.admin.table.view}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
