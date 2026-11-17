"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createRequestSchema } from "@/lib/validation/request";
import { rateLimit } from "@/lib/rate-limit";
import { requireAdmin } from "@/lib/auth";
import { updateRequestSchema } from "@/lib/validation/request";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitRequest(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    "unknown";

  const limited = rateLimit(`request:${ip}`, 5, 60_000);
  if (!limited.success) {
    return { ok: false, error: "rate_limit" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = createRequestSchema.safeParse({
    ...raw,
    latitude: raw.latitude === "" ? null : raw.latitude,
    longitude: raw.longitude === "" ? null : raw.longitude,
    note: raw.note || "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  // Honeypot
  if (data.website) {
    return { ok: true };
  }

  const service = await prisma.service.findFirst({
    where: { id: data.serviceId, isActive: true },
  });
  if (!service) {
    return { ok: false, error: "validation" };
  }

  // Soft duplicate guard: same phone + service within 2 minutes
  const recent = await prisma.request.findFirst({
    where: {
      phoneNumber: data.phoneNumber,
      serviceId: data.serviceId,
      createdAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
    },
  });
  if (recent) {
    return { ok: true, id: recent.id };
  }

  const request = await prisma.request.create({
    data: {
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      address: data.address,
      note: data.note || null,
      vehicleType: data.vehicleType,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      serviceId: data.serviceId,
      locale: data.locale,
      status: "NEW",
    },
  });

  revalidatePath("/fa/admin");
  revalidatePath("/en/admin");
  revalidatePath("/fa/admin/requests");
  revalidatePath("/en/admin/requests");

  return { ok: true, id: request.id };
}

export async function updateRequestAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "unauthorized" };

  const parsed = updateRequestSchema.safeParse({
    status: formData.get("status"),
    adminNote: formData.get("adminNote") || "",
  });
  if (!parsed.success) return { ok: false, error: "validation" };

  await prisma.request.update({
    where: { id },
    data: {
      status: parsed.data.status,
      adminNote: parsed.data.adminNote || null,
    },
  });

  revalidatePath("/fa/admin");
  revalidatePath("/en/admin");
  revalidatePath(`/fa/admin/requests/${id}`);
  revalidatePath(`/en/admin/requests/${id}`);
  return { ok: true };
}

export async function deleteRequestAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "unauthorized" };

  await prisma.request.delete({ where: { id } });
  revalidatePath("/fa/admin");
  revalidatePath("/en/admin");
  revalidatePath("/fa/admin/requests");
  revalidatePath("/en/admin/requests");
  return { ok: true };
}
