import { NextRequest, NextResponse } from "next/server";
import { Client, Environment, LogLevel, OrdersController, CheckoutPaymentIntent } from "@paypal/paypal-server-sdk";

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
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const { result, statusCode } = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: amount.toFixed(2),
            },
            description: "Machu Picchu Bus Ticket",
          },
        ],
      },
      prefer: "return=minimal",
    });

    return NextResponse.json({ orderId: result.id, status: result.status });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
  }
}
