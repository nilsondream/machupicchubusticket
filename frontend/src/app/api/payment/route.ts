import { NextRequest, NextResponse } from "next/server";
import { getBusPrices } from "@/services/ticket.service";
import { getBusTickets } from "@/services/ticket.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booking } = body;

    if (!booking || !booking.passengerDetails?.length) {
      return NextResponse.json(
        { error: "Datos de reserva incompletos" },
        { status: 400 }
      );
    }

    // Obtener precios reales desde la base de datos
    const tickets = await getBusTickets();
    const selectedTicket = tickets.find(
      (t: any) => t.id === booking.travelType || t.id === booking.ticketTypeId
    );

    if (!selectedTicket) {
      return NextResponse.json(
        { error: "Tipo de ticket no encontrado" },
        { status: 400 }
      );
    }

    // Calcular precio por cada pasajero según su tipo (adult/child) y nacionalidad
    let subtotal = 0;
    const ticketCounts = booking.ticketCounts || { ADULT: 1, CHILD: 0 };
    
    booking.passengerDetails.forEach((passenger: any) => {
      const passengerType = passenger.ticketType?.toLowerCase() || "adult";
      const nationality = passenger.nationality || 
        (passenger.documentType === "dni" || passenger.documentType === "ce" ? "national" : "foreign");
      
      const price =
        passengerType === "child"
          ? selectedTicket.prices.child[nationality as keyof typeof selectedTicket.prices.child]
          : selectedTicket.prices.adult[nationality as keyof typeof selectedTicket.prices.adult];
      
      subtotal += Number(price || 0);
    });

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Simular procesamiento de pago exitoso
    // En producción aquí se integraría con Izipay, PayPal, etc.
    const paymentResult = {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      amount: total,
      currency: "PEN",
      status: "completed",
      details: {
        subtotal,
        tax,
        total,
        passengerCount: booking.passengerDetails.length,
        travelType: booking.travelType,
        departureDate: booking.departureDate,
      },
    };

    return NextResponse.json(paymentResult);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}