import "server-only";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export async function requireAdminPage(locale: Locale) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect(localizedPath(locale, "/admin/login"));
  }
  return admin;
}
