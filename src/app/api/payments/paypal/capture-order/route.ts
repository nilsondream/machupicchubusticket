import { NextRequest, NextResponse } from "next/server";
import { Client, Environment, LogLevel, OrdersController } from "@paypal/paypal-server-sdk";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateReservationId } from "@/lib/reservation-id";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox,
  logging: { logLevel: LogLevel.Info },
});

const ordersController = new OrdersController(client);

export async function POST(req: NextRequest) {
  try {
    const { orderId, reservationData: body } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const { result: captureResult, statusCode } = await ordersController.captureOrder({
      id: orderId,
      prefer: "return=minimal",
    });

    if (captureResult.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const session = await auth();

    const externalId = captureResult.id;
    const capture = captureResult.purchaseUnits?.[0]?.payments?.captures?.[0];
    const netAmount = capture?.amount?.value ?? body.amountPaid;

    const reservation = await prisma.reservation.create({
      data: {
        id: generateReservationId(),
        tripType: body.tripType,
        userId: session?.user?.id ?? null,
        departureDate: new Date(body.departureDate),
        returnDate: body.returnDate ? new Date(body.returnDate) : null,
        subtotal: body.subtotal,
        commissionAmount: body.commissionAmount,
        amountPaid: netAmount,
        paymentType: body.paymentAmountType,
        passengers: {
          create: body.passengers.map((p: any) => ({
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
            method: "paypal",
            amount: netAmount,
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
    console.error("PayPal capture order error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    const message = error instanceof Error ? error.message : "Failed to capture PayPal order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
