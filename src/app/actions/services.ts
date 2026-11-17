"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { serviceSchema } from "@/lib/validation/request";

export type ServiceActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateServices() {
  for (const locale of ["fa", "en"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/services`);
    revalidatePath(`/${locale}/admin/services`);
  }
  revalidatePath("/");
  revalidatePath("/services");
}

export async function saveServiceAction(
  id: string | null,
  formData: FormData,
): Promise<ServiceActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "unauthorized" };

  const parsed = serviceSchema.safeParse({
    slug: formData.get("slug"),
    titleFa: formData.get("titleFa"),
    titleEn: formData.get("titleEn"),
    descriptionFa: formData.get("descriptionFa"),
    descriptionEn: formData.get("descriptionEn"),
    pricingType: formData.get("pricingType"),
    basePrice: formData.get("basePrice") || null,
    pricePerKilometer: formData.get("pricePerKilometer") || null,
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
    sortOrder: formData.get("sortOrder") || 0,
  });

  if (!parsed.success) return { ok: false, error: "validation" };

  const data = {
    ...parsed.data,
    basePrice:
      parsed.data.pricingType === "NEGOTIABLE"
        ? null
        : (parsed.data.basePrice ?? null),
    pricePerKilometer:
      parsed.data.pricingType === "PER_KILOMETER"
        ? (parsed.data.pricePerKilometer ?? null)
        : null,
  };

  if (id) {
    await prisma.service.update({ where: { id }, data });
  } else {
    await prisma.service.create({ data });
  }

  revalidateServices();
  return { ok: true };
}

export async function deleteServiceAction(
  id: string,
): Promise<ServiceActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "unauthorized" };

  const related = await prisma.request.count({ where: { serviceId: id } });
  if (related > 0) {
    await prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  } else {
    await prisma.service.delete({ where: { id } });
  }

  revalidateServices();
  return { ok: true };
}
