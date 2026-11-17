"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { settingsSchema } from "@/lib/validation/request";

export async function saveSettingsAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) return { ok: false as const, error: "unauthorized" };

  const parsed = settingsSchema.safeParse({
    businessNameFa: formData.get("businessNameFa"),
    businessNameEn: formData.get("businessNameEn"),
    phoneNumber: formData.get("phoneNumber"),
    secondaryPhoneNumber: formData.get("secondaryPhoneNumber") || "",
    descriptionFa: formData.get("descriptionFa"),
    descriptionEn: formData.get("descriptionEn"),
    heroTitleFa: formData.get("heroTitleFa"),
    heroTitleEn: formData.get("heroTitleEn"),
    heroDescriptionFa: formData.get("heroDescriptionFa"),
    heroDescriptionEn: formData.get("heroDescriptionEn"),
    address: formData.get("address") || "",
    websiteUrl: formData.get("websiteUrl") || "",
  });

  if (!parsed.success) return { ok: false as const, error: "validation" };

  await prisma.businessSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...parsed.data, secondaryPhoneNumber: parsed.data.secondaryPhoneNumber || null, address: parsed.data.address || null, websiteUrl: parsed.data.websiteUrl || null },
    update: {
      ...parsed.data,
      secondaryPhoneNumber: parsed.data.secondaryPhoneNumber || null,
      address: parsed.data.address || null,
      websiteUrl: parsed.data.websiteUrl || null,
    },
  });

  for (const locale of ["fa", "en"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/contact`);
    revalidatePath(`/${locale}/admin/settings`);
  }
  revalidatePath("/");
  revalidatePath("/contact");

  return { ok: true as const };
}
