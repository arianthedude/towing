import "server-only";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/config";
import type { RequestStatus } from "@prisma/client";

export async function getBusinessSettings() {
  const settings = await prisma.businessSettings.findUnique({ where: { id: 1 } });
  if (!settings) {
    throw new Error("Business settings not seeded. Run: npm run db:seed");
  }
  return settings;
}

export async function getActiveServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAllServices() {
  return prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
}

export function pickLocalized<T extends Record<string, unknown>>(
  item: T,
  locale: Locale,
  faKey: keyof T,
  enKey: keyof T,
): string {
  const value = locale === "fa" ? item[faKey] : item[enKey];
  return String(value ?? "");
}

export async function getRequestStats() {
  const [total, neu, inProgress, completed] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { status: "NEW" } }),
    prisma.request.count({ where: { status: "IN_PROGRESS" } }),
    prisma.request.count({ where: { status: "COMPLETED" } }),
  ]);
  return { total, new: neu, inProgress, completed };
}

export async function searchRequests(opts: {
  q?: string;
  status?: RequestStatus | "ALL";
  sort?: "asc" | "desc";
}) {
  const where = {
    AND: [
      opts.status && opts.status !== "ALL" ? { status: opts.status } : {},
      opts.q
        ? {
            OR: [
              { customerName: { contains: opts.q } },
              { phoneNumber: { contains: opts.q } },
            ],
          }
        : {},
    ],
  };

  return prisma.request.findMany({
    where,
    include: { service: true },
    orderBy: { createdAt: opts.sort === "asc" ? "asc" : "desc" },
  });
}
