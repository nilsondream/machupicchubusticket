import { NextRequest, NextResponse } from "next/server";

const SHOP_ID = process.env.IZIPAY_SHOP_ID!;
const PASSWORD = process.env.IZIPAY_PASSWORD!;
const API_ENDPOINT = process.env.IZIPAY_ENDPOINT || "https://api.micuentaweb.pe";
const PUBLIC_KEY = process.env.IZIPAY_PUBLIC_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, orderId, customer } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json({ error: "Missing required fields: amount, orderId" }, { status: 400 });
    }

    const auth = Buffer.from(`${SHOP_ID}:${PASSWORD}`).toString("base64");

    const body: Record<string, unknown> = {
      amount: Math.round(amount * 100),
      currency: currency || "USD",
      orderId,
    };

    if (customer?.email) {
      body.customer = { email: customer.email };
    }

    const response = await fetch(`${API_ENDPOINT}/api-payment/V4/Charge/CreatePayment`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log("IziPay raw response:", JSON.stringify(data));

    if (!response.ok || data.status !== "SUCCESS") {
      console.error("IziPay create formToken error:", JSON.stringify(data));
      return NextResponse.json(
        {
          error: data.answer?.errorMessage || data.answer?.detailedErrorMessage || "Failed to create payment",
          details: data,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      formToken: data.answer.formToken,
      publicKey: PUBLIC_KEY,
    });
  } catch (error) {
    console.error("IziPay create formToken error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
