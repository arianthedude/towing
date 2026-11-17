import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getRequestStats } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { requireAdminPage } from "@/lib/admin-guard";
import { formatNumber } from "@/lib/format";

export default async function AdminDashboardPage({
  params,
}: PageProps<"/[locale]/admin">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  await requireAdminPage(locale);

  const [dict, stats] = await Promise.all([
    getDictionary(locale),
    getRequestStats(),
  ]);

  const cards = [
    { label: dict.admin.stats.total, value: stats.total },
    { label: dict.admin.stats.new, value: stats.new },
    { label: dict.admin.stats.inProgress, value: stats.inProgress },
    { label: dict.admin.stats.completed, value: stats.completed },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-zinc-900">
          {dict.admin.dashboard}
        </h1>
        <Link
          href={localizedPath(locale, "/admin/requests")}
          className="text-sm font-semibold text-amber-700 hover:underline"
        >
          {dict.admin.requests} →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="border-s-4 border-s-amber-400">
            <CardDescription>{c.label}</CardDescription>
            <CardTitle className="mt-2 text-3xl">
              {formatNumber(c.value, locale)}
            </CardTitle>
          </Card>
        ))}
      </div>
    </div>
  );
}
