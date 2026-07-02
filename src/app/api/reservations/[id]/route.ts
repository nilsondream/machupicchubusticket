import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        passengers: true,
        payment: true,
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
    }

    const existing = await prisma.reservation.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    if (body.passengers) {
      const existingPassengers = await prisma.passenger.findMany({
        where: { reservationId: id },
      });

      for (const updated of body.passengers) {
        const existingPassenger = existingPassengers.find((p) => p.id === updated.id);
        if (existingPassenger) {
          await prisma.passenger.update({
            where: { id: updated.id },
            data: {
              fullName: updated.fullName ?? existingPassenger.fullName,
              email: updated.email !== undefined ? (updated.email || null) : existingPassenger.email,
              phone: updated.phone !== undefined ? (updated.phone || null) : existingPassenger.phone,
              notes: updated.notes !== undefined ? (updated.notes || null) : existingPassenger.notes,
              documentType: updated.documentType ?? existingPassenger.documentType,
              documentNumber: updated.documentNumber ?? existingPassenger.documentNumber,
            },
          });
        }
      }
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: { passengers: true, payment: true },
    });

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
