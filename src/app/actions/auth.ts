"use server";

import { redirect } from "next/navigation";
import { loginAdmin, destroySession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/request";
import { localizedPath, type Locale } from "@/lib/i18n/config";

export type LoginResult = { ok: false; error: string } | null;

export async function loginAction(
  locale: Locale,
  _prev: LoginResult,
  formData: FormData,
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const result = await loginAdmin(parsed.data.username, parsed.data.password);
  if (!result.ok) {
    return { ok: false, error: "invalid" };
  }

  redirect(localizedPath(locale, "/admin"));
}

export async function logoutAction(locale: Locale) {
  await destroySession();
  redirect(localizedPath(locale, "/admin/login"));
}
