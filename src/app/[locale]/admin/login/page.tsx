import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  params,
}: PageProps<"/[locale]/admin/login">) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const session = await getSession();
  if (session) redirect(localizedPath(locale, "/admin"));

  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">
          {dict.admin.loginTitle}
        </h1>
        <div className="mt-6">
          <LoginForm locale={locale} dict={dict} />
        </div>
      </div>
    </div>
  );
}
