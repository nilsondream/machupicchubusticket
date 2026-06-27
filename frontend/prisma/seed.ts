import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // limpiar (opcional en desarrollo)
  await prisma.price.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.product.deleteMany();

  const bus = await prisma.product.create({
    data: {
      code: "BUS-MACHUPICCHU",
      name: "Bus Machu Picchu",
      active: true,
    },
  });

  const tickets = [
    {
      code: "roundtrip",
      name: "Ida y vuelta",
      popular: true,
      prices: [
        {
          passengerType: "adult",
          nationality: "foreign",
          amount: 34,
        },
        {
          passengerType: "adult",
          nationality: "national",
          amount: 22,
        },
        {
          passengerType: "child",
          nationality: "foreign",
          amount: 18,
        },
        {
          passengerType: "child",
          nationality: "national",
          amount: 13,
        },
      ],
    },
    {
      code: "oneway-go",
      name: "Solo subida",
      popular: false,
      prices: [
        {
          passengerType: "adult",
          nationality: "foreign",
          amount: 19,
        },
        {
          passengerType: "adult",
          nationality: "national",
          amount: 14,
        },
        {
          passengerType: "child",
          nationality: "foreign",
          amount: 13,
        },
        {
          passengerType: "child",
          nationality: "national",
          amount: 13,
        },
      ],
    },
    {
      code: "oneway-return",
      name: "Solo bajada",
      popular: false,
      prices: [
        {
          passengerType: "adult",
          nationality: "foreign",
          amount: 19,
        },
        {
          passengerType: "adult",
          nationality: "national",
          amount: 14,
        },
        {
          passengerType: "child",
          nationality: "foreign",
          amount: 13,
        },
        {
          passengerType: "child",
          nationality: "national",
          amount: 13,
        },
      ],
    },
  ];

  for (const ticket of tickets) {
    await prisma.ticketType.create({
      data: {
        productId: bus.id,
        code: ticket.code,
        name: ticket.name,
        popular: ticket.popular,
        prices: {
          create: ticket.prices,
        },
      },
    });
  }
  console.log("Seed creado correctamente 🚀");
}



main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });