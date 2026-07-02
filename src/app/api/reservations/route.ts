import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateReservationId } from "@/lib/reservation-id";

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const isAdmin = searchParams.get("admin") === "true"

    if (isAdmin) {
      const role = (session.user as { role?: string }).role
      if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      const reservations = await prisma.reservation.findMany({
        include: { passengers: true, payment: true, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json({ reservations })
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: session.user.id },
      include: { passengers: true, payment: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ reservations })
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
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
        id: generateReservationId(),
        tripType,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        subtotal,
        commissionAmount,
        amountPaid,
        paymentType: paymentAmountType,
        userId: session?.user?.id ?? null,
        passengers: {
          create: passengers.map((p: any) => ({
            type: p.type,
            fullName: p.fullName,
            email: p.email || null,
            phone: p.phone || null,
            notes: p.notes || null,
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
