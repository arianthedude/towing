import { PrismaClient, PricingType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    slug: "towing",
    titleFa: "یدک‌کش",
    titleEn: "Tow Truck",
    descriptionFa: "حمل و جابه‌جایی خودرو با یدک‌کش",
    descriptionEn: "Vehicle towing and transport",
    pricingType: PricingType.PER_KILOMETER,
    basePrice: 1_600_000,
    pricePerKilometer: 60_000,
    sortOrder: 1,
  },
  {
    slug: "car-carrier",
    titleFa: "خودروبر",
    titleEn: "Car Carrier",
    descriptionFa: "حمل خودرو با خودروبر",
    descriptionEn: "Flatbed car carrier transport",
    pricingType: PricingType.PER_KILOMETER,
    basePrice: 3_200_000,
    pricePerKilometer: 120_000,
    sortOrder: 2,
  },
  {
    slug: "battery-jump",
    titleFa: "باتری‌به‌باتری",
    titleEn: "Battery Jump Start",
    descriptionFa: "راه‌اندازی خودرو با باتری کمکی",
    descriptionEn: "Jump start for dead batteries",
    pricingType: PricingType.FIXED,
    basePrice: 1_000_000,
    pricePerKilometer: null,
    sortOrder: 3,
  },
  {
    slug: "tire-repair",
    titleFa: "پنچرگیری",
    titleEn: "Tire Repair",
    descriptionFa: "تعمیر یا تعویض لاستیک در محل",
    descriptionEn: "On-site tire puncture repair",
    pricingType: PricingType.FIXED,
    basePrice: 1_000_000,
    pricePerKilometer: null,
    sortOrder: 4,
  },
  {
    slug: "fuel-delivery",
    titleFa: "بنزین سیار",
    titleEn: "Emergency Fuel Delivery",
    descriptionFa: "تحویل بنزین اضطراری (۵ تا ۱۰ لیتر)",
    descriptionEn: "Emergency fuel delivery (5–10 liters)",
    pricingType: PricingType.FIXED,
    basePrice: 1_000_000,
    pricePerKilometer: null,
    sortOrder: 5,
  },
  {
    slug: "mobile-mechanic",
    titleFa: "مکانیک سیار",
    titleEn: "Mobile Mechanic",
    descriptionFa: "بررسی و تعمیر در محل",
    descriptionEn: "On-site inspection and repair",
    pricingType: PricingType.NEGOTIABLE,
    basePrice: null,
    pricePerKilometer: null,
    sortOrder: 6,
  },
] as const;

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      create: { ...service, isActive: true },
      update: {
        titleFa: service.titleFa,
        titleEn: service.titleEn,
        descriptionFa: service.descriptionFa,
        descriptionEn: service.descriptionEn,
        pricingType: service.pricingType,
        basePrice: service.basePrice,
        pricePerKilometer: service.pricePerKilometer,
        sortOrder: service.sortOrder,
      },
    });
  }

  await prisma.businessSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      businessNameFa: "یدک‌کشی علی و سیاوش بدون سهیل",
      businessNameEn: "Ali & Siavash Towing",
      phoneNumber: "09128184585",
      secondaryPhoneNumber: null,
      descriptionFa:
        "امداد خودرو، یدک‌کش و خودروبر — سریع، مطمئن و حرفه‌ای در خدمت شما.",
      descriptionEn:
        "Roadside assistance, tow truck and car carrier — fast, reliable and professional.",
      heroTitleFa: "امداد خودرو و یدک‌کشی سریع",
      heroTitleEn: "Fast Towing & Roadside Assistance",
      heroDescriptionFa:
        "در هر ساعت از شبانه‌روز با یک تماس یا ثبت درخواست آنلاین، کنار شما هستیم.",
      heroDescriptionEn:
        "Call us or submit an online request anytime — we are ready to help.",
      address: null,
      websiteUrl: null,
    },
    update: {},
  });

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { username },
    create: { username, passwordHash },
    update: { passwordHash },
  });

  console.log("Seed completed.");
  console.log(`Admin username: ${username}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
