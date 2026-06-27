import { prisma } from "@/lib/prisma";

export async function getAllTicketTypes() {
  return prisma.ticketType.findMany({
    include: {
      prices: true,
    },
  });
}

export async function getAllPrices() {
  return prisma.price.findMany();
}