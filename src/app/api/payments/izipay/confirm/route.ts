import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateReservationId } from "@/lib/reservation-id";

const HMAC_KEY = process.env.IZIPAY_HMAC_KEY!;

function verifySignature(krAnswer: string, krHash: string): boolean {
  if (!HMAC_KEY) return true;
  const expected = crypto
    .createHmac("sha256", HMAC_KEY)
    .update(krAnswer)
    .digest("base64");
  return expected === krHash;
}

export async function POST(req: NextRequest) {
  try {
    const { krAnswer, krHash, reservationData } = await req.json();

    if (!krAnswer || !krHash) {
      return NextResponse.json({ error: "Missing payment result" }, { status: 400 });
    }

    const signatureValid = verifySignature(krAnswer, krHash);
    if (!signatureValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const answer = JSON.parse(krAnswer);

    const orderStatus =
      answer?.orderDetails?.status ||
      answer?.orderStatus ||
      answer?.transaction?.status;

    if (orderStatus !== "PAID" && orderStatus !== "SUCCESS") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const externalId = answer?.transaction?.uuid || answer?.orderDetails?.orderId || null;
    const rawAmount = answer?.orderDetails?.amount;
    const netAmount = rawAmount ? Number(rawAmount) / 100 : reservationData.amountPaid;

    const session = await auth();

    const reservation = await prisma.reservation.create({
      data: {
        id: generateReservationId(),
        tripType: reservationData.tripType,
        userId: session?.user?.id ?? null,
        departureDate: new Date(reservationData.departureDate),
        returnDate: reservationData.returnDate ? new Date(reservationData.returnDate) : null,
        subtotal: reservationData.subtotal,
        commissionAmount: reservationData.commissionAmount,
        amountPaid: netAmount,
        paymentType: reservationData.paymentAmountType,
        passengers: {
          create: reservationData.passengers.map((p: { type: string; fullName: string; email?: string; phone?: string; notes?: string; documentType: string; documentNumber: string; isPrimary?: boolean }) => ({
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
            method: "card",
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
    console.error("IziPay confirm error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    const message = error instanceof Error ? error.message : "Failed to confirm payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
