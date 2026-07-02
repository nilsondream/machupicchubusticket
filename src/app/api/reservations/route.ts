import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tripType,
      departureDate,
      returnDate,
      passengers,
      paymentMethod,
      paymentAmountType,
      subtotal,
      commissionAmount,
      amountPaid,
      externalId,
    } = body;

    if (!tripType || !departureDate || !passengers?.length || !paymentMethod || !paymentAmountType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        tripType,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        subtotal,
        commissionAmount,
        amountPaid,
        paymentType: paymentAmountType,
        passengers: {
          create: passengers.map((p: any) => ({
            type: p.type,
            fullName: p.fullName,
            documentType: p.documentType,
            documentNumber: p.documentNumber,
            isPrimary: p.isPrimary ?? false,
          })),
        },
        payment: {
          create: {
            method: paymentMethod,
            amount: amountPaid,
            status: "completed",
            externalId,
          },
        },
      },
      include: {
        passengers: true,
        payment: true,
      },
    });

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
