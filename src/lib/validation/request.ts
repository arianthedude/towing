import { z } from "zod";
import { VEHICLE_TYPES } from "@/lib/vehicles";

const iranianMobile = /^(09\d{9}|\+989\d{9}|00989\d{9})$/;

export const createRequestSchema = z.object({
  serviceId: z.string().min(1),
  vehicleType: z.enum(VEHICLE_TYPES),
  customerName: z.string().trim().min(2).max(80),
  phoneNumber: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => iranianMobile.test(v), { message: "invalid_phone" }),
  address: z.string().trim().min(5).max(400),
  note: z.string().trim().max(400).optional().or(z.literal("")),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  locale: z.enum(["fa", "en"]).default("fa"),
  website: z.string().max(0).optional(), // honeypot
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(128),
});

export const updateRequestSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  adminNote: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/),
  titleFa: z.string().trim().min(2).max(100),
  titleEn: z.string().trim().min(2).max(100),
  descriptionFa: z.string().trim().min(2).max(500),
  descriptionEn: z.string().trim().min(2).max(500),
  pricingType: z.enum(["FIXED", "PER_KILOMETER", "NEGOTIABLE"]),
  basePrice: z.coerce.number().int().nonnegative().nullable().optional(),
  pricePerKilometer: z.coerce.number().int().nonnegative().nullable().optional(),
  isActive: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const settingsSchema = z.object({
  businessNameFa: z.string().trim().min(2).max(120),
  businessNameEn: z.string().trim().min(2).max(120),
  phoneNumber: z.string().trim().min(8).max(20),
  secondaryPhoneNumber: z.string().trim().max(20).optional().or(z.literal("")),
  descriptionFa: z.string().trim().min(2).max(1000),
  descriptionEn: z.string().trim().min(2).max(1000),
  heroTitleFa: z.string().trim().min(2).max(200),
  heroTitleEn: z.string().trim().min(2).max(200),
  heroDescriptionFa: z.string().trim().min(2).max(500),
  heroDescriptionEn: z.string().trim().min(2).max(500),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  websiteUrl: z.string().trim().max(200).optional().or(z.literal("")),
});
