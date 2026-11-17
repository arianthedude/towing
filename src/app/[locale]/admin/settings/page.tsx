import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-guard";
import { getBusinessSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card } from "@/components/ui/card";

export default async function AdminSettingsPage({
  params,
}: PageProps<"/[locale]/admin/settings">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  await requireAdminPage(locale);

  const [dict, settings] = await Promise.all([
    getDictionary(locale),
    getBusinessSettings(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">
        {dict.admin.settingsAdmin.title}
      </h1>
      <Card>
        <SettingsForm settings={settings} dict={dict} />
      </Card>
    </div>
  );
}
