import { NextRequest, NextResponse } from "next/server";
import { Client, Environment, LogLevel, OrdersController } from "@paypal/paypal-server-sdk";
import { prisma } from "@/lib/prisma";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox,
  logging: { logLevel: LogLevel.Info },
});

const ordersController = new OrdersController(client);

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { orderId } = await req.json();

    if (!id || !orderId) {
      return NextResponse.json({ error: "Missing reservation ID or order ID" }, { status: 400 });
    }

    const { result: captureResult } = await ordersController.captureOrder({
      id: orderId,
      prefer: "return=minimal",
    });

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const existing = await prisma.reservation.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    if (existing.paymentType !== "half") {
      return NextResponse.json({ error: "Reservation is not a half-payment reservation" }, { status: 400 });
    }

    const subtotal = Number(existing.subtotal);
    const commission = Number(existing.commissionAmount);
    const total = subtotal + commission;

    const reservation = await prisma.reservation.update({
      where: { id },
      data: {
        amountPaid: total,
        paymentType: "total",
        payment: {
          update: {
            amount: total,
            status: "completed",
            externalId: captureResult.id,
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
    console.error("Error completing payment:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json({ error: "Failed to complete payment" }, { status: 500 });
  }
}
