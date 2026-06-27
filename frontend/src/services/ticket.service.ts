import { getAllPrices, getAllTicketTypes } from "@/repositories/ticket.repository";

export async function getBusTickets() {
  const tickets = await getAllTicketTypes();

  return tickets.map((ticket) => {
    const adultForeign =
      ticket.prices.find(
        p =>
          p.passengerType === "adult" &&
          p.nationality === "foreign"
      );

    const adultNational =
      ticket.prices.find(
        p =>
          p.passengerType === "adult" &&
          p.nationality === "national"
      );

    const childForeign =
      ticket.prices.find(
        p =>
          p.passengerType === "child" &&
          p.nationality === "foreign"
      );

    const childNational =
      ticket.prices.find(
        p =>
          p.passengerType === "child" &&
          p.nationality === "national"
      );

    return {
      id: ticket.code,
      name: ticket.name,
      popular: ticket.popular,

      prices: {
        adult: {
          foreign: Number(adultForeign?.amount ?? 0),
          national: Number(adultNational?.amount ?? 0),
        },

        child: {
          foreign: Number(childForeign?.amount ?? 0),
          national: Number(childNational?.amount ?? 0),
        },
      },
    };
  });
}

export async function getBusPrices() {
  const prices = await getAllPrices();

  // Find each specific price type once from the array
  const adultForeign = prices.find(p => p.passengerType === "adult" && p.nationality === "foreign");
  const adultNational = prices.find(p => p.passengerType === "adult" && p.nationality === "national");
  const childForeign = prices.find(p => p.passengerType === "child" && p.nationality === "foreign");
  const childNational = prices.find(p => p.passengerType === "child" && p.nationality === "national");

  // Return the single structured object
  return {
    adult: {
      foreign: Number(adultForeign?.amount ?? 0),
      national: Number(adultNational?.amount ?? 0),
    },
    child: {
      foreign: Number(childForeign?.amount ?? 0),
      national: Number(childNational?.amount ?? 0),
    },
  };
}