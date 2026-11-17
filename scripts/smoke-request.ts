import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const service = await prisma.service.findFirst({ where: { isActive: true } });
  if (!service) throw new Error("no service");

  const created = await prisma.request.create({
    data: {
      customerName: "Smoke Test",
      phoneNumber: "09121234567",
      address: "Tehran test address",
      vehicleType: "passenger_car",
      serviceId: service.id,
      locale: "fa",
      status: "NEW",
      latitude: 35.6892,
      longitude: 51.389,
    },
  });

  const count = await prisma.request.count();
  console.log("created", created.id, "total", count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
